use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct PetCreatedEvent {
    pub pet_id: Uuid,
    pub name: String,
    pub status: String,
    pub kind_id: Uuid,
    pub image_url: Option<String>,
    pub created_at: DateTime<Utc>,
}
