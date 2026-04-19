use lapin::{options::*, types::FieldTable};
use futures::StreamExt;
use crate::infrastructure::utils::download_image;
use crate::recognition::engine::RecognitionEngine;
use crate::domain::events::PetCreatedEvent;
use crate::api::state::AppState;
use std::sync::Arc;
use mongodb::bson::{doc, self, Binary, spec::BinarySubtype};

pub async fn start_event_consumers(state: Arc<AppState>) {
    let connection = state.rabbit_pool.get().await.expect("Failed to get rabbit connection for consumer");
    let channel = connection.create_channel().await.expect("Failed to create rabbit channel for consumer");

    // Declare Exchange
    channel.exchange_declare(
        "pet.events",
        lapin::ExchangeKind::Topic,
        ExchangeDeclareOptions::default(),
        FieldTable::default(),
    ).await.expect("Failed to declare exchange");

    // Declare Queue
    let queue_name = "mongo.sync.pets";
    channel.queue_declare(
        queue_name,
        QueueDeclareOptions::default(),
        FieldTable::default(),
    ).await.expect("Failed to declare queue");

    // Bind Queue to Exchange
    channel.queue_bind(
        queue_name,
        "pet.events",
        "pet.created",
        QueueBindOptions::default(),
        FieldTable::default(),
    ).await.expect("Failed to bind queue");

    // Start Consumer
    let mut consumer = channel.basic_consume(
        queue_name,
        "mongo_sync_consumer",
        BasicConsumeOptions::default(),
        FieldTable::default(),
    ).await.expect("Failed to start consumer");

    tracing::info!("Event consumer started for queue: {}", queue_name);

    // Initialize RecognitionEngine
    let engine = RecognitionEngine::new().expect("Failed to initialize RecognitionEngine in consumer");

    while let Some(delivery) = consumer.next().await {
        if let Ok(delivery) = delivery {
            let payload = &delivery.data;
            
            // Route and handle events
            if delivery.routing_key.as_str() == "pet.created" {
                if let Ok(event) = serde_json::from_slice::<PetCreatedEvent>(payload) {
                    handle_pet_created(event, state.clone(), &engine).await;
                }
            }

            delivery.ack(BasicAckOptions::default()).await.expect("Failed to ack message");
        }
    }
}

async fn handle_pet_created(event: PetCreatedEvent, state: Arc<AppState>, engine: &RecognitionEngine) {
    tracing::info!("Syncing pet to MongoDB: {}", event.pet_id);
    
    let mut visual_features: Option<Binary> = None;

    // Extract features if image_url is present
    if let Some(url) = event.image_url {
        match download_image(&url).await {
            Ok(bytes) => {
                match engine.extract_descriptors(&bytes) {
                    Ok(hash_bytes) => {
                        visual_features = Some(Binary {
                            subtype: BinarySubtype::Generic,
                            bytes: hash_bytes,
                        });
                    },
                    Err(e) => tracing::error!("Failed to extract features for pet {}: {}", event.pet_id, e),
                }
            },
            Err(e) => tracing::error!("Failed to download image for pet {}: {}", event.pet_id, e),
        }
    }

    let db = state.mongo_client.database("save_puppy_db");
    let collection = db.collection::<bson::Document>("pets_search");

    // Materialize the search view
    let mut search_doc = doc! {
        "id": event.pet_id.to_string(),
        "name": event.name,
        "status": event.status,
        "kind_id": event.kind_id.to_string(),
        "created_at": event.created_at,
    };

    if let Some(features) = visual_features {
        search_doc.insert("visual_features", features);
    }

    if let Err(e) = collection.insert_one(search_doc, None).await {
        tracing::error!("Failed to sync pet to MongoDB: {}", e);
    }
}
