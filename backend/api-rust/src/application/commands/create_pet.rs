use crate::domain::entities::Pet;
use crate::domain::repositories::PetRepository;
use crate::domain::events::PetCreatedEvent;
use crate::infrastructure::messaging::MessagingService;
use crate::application::{AppResult, ApplicationError};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use std::sync::Arc;

#[derive(Debug, Deserialize, Serialize, ToSchema)]
pub struct CreatePetCommand {
    pub name: String,
    pub status: String, // "LOST", "ADOPTION", "FOUND"
    pub kind_id: Uuid,
    pub gender_id: Uuid,
    pub race_id: Option<Uuid>,
    pub shelter_id: Option<Uuid>,
    pub owner_id: Option<Uuid>,
    pub image_url: Option<String>,
}

pub struct CreatePetHandler {
    pet_repo: Arc<dyn PetRepository>,
    messaging: MessagingService,
}

impl CreatePetHandler {
    pub fn new(pet_repo: Arc<dyn PetRepository>, messaging: MessagingService) -> Self {
        Self { pet_repo, messaging }
    }

    pub async fn handle(&self, cmd: CreatePetCommand) -> AppResult<Pet> {
        // Validation logic
        if cmd.name.is_empty() {
            return Err(ApplicationError::ValidationError("Pet name cannot be empty".to_string()));
        }

        let pet = Pet {
            id: Uuid::new_v4(),
            name: cmd.name,
            status: cmd.status,
            owner_email: None,
            kind_id: cmd.kind_id,
            race_id: cmd.race_id,
            gender_id: cmd.gender_id,
            shelter_id: cmd.shelter_id,
            owner_id: cmd.owner_id,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        };

        // 1. Write Side: Persist to Postgres
        let saved_pet = self.pet_repo.save(pet).await?;

        // 2. Publish Event: Snyc to MongoDB / Notifications
        let event = PetCreatedEvent {
            pet_id: saved_pet.id,
            name: saved_pet.name.clone(),
            status: saved_pet.status.clone(),
            kind_id: saved_pet.kind_id,
            image_url: cmd.image_url,
            created_at: saved_pet.created_at,
        };

        if let Err(e) = self.messaging.publish("pet.events", "pet.created", &event).await {
            tracing::error!("Failed to publish PetCreatedEvent: {}", e);
            // In a strict consistency environment, we might rollback here.
            // For now, we just log the error.
        }

        Ok(saved_pet)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::repositories::MockPetRepository;
    use crate::infrastructure::messaging::create_rabbitmq_pool;

    #[tokio::test]
    async fn test_create_pet_success() {
        let mut mock_repo = MockPetRepository::new();
        
        // Setup expectations
        mock_repo.expect_save()
            .times(1)
            .returning(|pet| Ok(pet));

        let repo = Arc::new(mock_repo);
        
        // We need a rabbit pool for MessagingService, but in tests 
        // we might want to mock MessagingService too. 
        // For now, let's assume we use a real pool that might fail to connect 
        // (the handler logs but doesn't fail on publish error).
        let rabbit_pool = create_rabbitmq_pool().await;
        let messaging = MessagingService::new(rabbit_pool);
        
        let handler = CreatePetHandler::new(repo, messaging);

        let cmd = CreatePetCommand {
            name: "Rex".to_string(),
            status: "LOST".to_string(),
            kind_id: Uuid::new_v4(),
            gender_id: Uuid::new_v4(),
            race_id: None,
            shelter_id: None,
            owner_id: None,
            image_url: None,
        };

        let result = handler.handle(cmd).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap().name, "Rex");
    }

    #[tokio::test]
    async fn test_create_pet_validation_error() {
        let mock_repo = MockPetRepository::new();
        let repo = Arc::new(mock_repo);
        let rabbit_pool = create_rabbitmq_pool().await;
        let messaging = MessagingService::new(rabbit_pool);
        
        let handler = CreatePetHandler::new(repo, messaging);

        let cmd = CreatePetCommand {
            name: "".to_string(), // Empty name should fail
            status: "LOST".to_string(),
            kind_id: Uuid::new_v4(),
            gender_id: Uuid::new_v4(),
            race_id: None,
            shelter_id: None,
            owner_id: None,
            image_url: None,
        };

        let result = handler.handle(cmd).await;
        assert!(result.is_err());
        match result.err().unwrap() {
            ApplicationError::ValidationError(msg) => assert_eq!(msg, "Pet name cannot be empty"),
            _ => panic!("Expected ValidationError"),
        }
    }
}
