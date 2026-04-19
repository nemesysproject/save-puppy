use std::net::SocketAddr;
use std::sync::Arc;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use dotenvy::dotenv;

use save_puppy_unified::api::state::AppState;
use save_puppy_unified::infrastructure::db::{create_postgres_pool, create_mongodb_client};
use save_puppy_unified::infrastructure::messaging::{create_rabbitmq_pool, consumer};
use save_puppy_unified::create_app;

#[tokio::main]
async fn main() {
    // Load environment variables
    dotenv().ok();

    // Initialize logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "save_puppy_unified=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("Starting Save Puppy Unified API monolith...");

    // Initialize Database Pools
    let pg_pool = create_postgres_pool().await;
    let mongo_client = create_mongodb_client().await;
    
    // Initialize Messaging Pool
    let rabbit_pool = create_rabbitmq_pool().await;
    
    // Create App State
    let state = Arc::new(AppState::new(pg_pool, mongo_client, rabbit_pool));

    // Spawn Background Consumer (Synchronization Worker)
    let state_for_consumer = state.clone();
    tokio::spawn(async move {
        consumer::start_event_consumers(state_for_consumer).await;
    });

    // Build our application routes
    let app = create_app(state);

    // Run it
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    tracing::info!("Listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
