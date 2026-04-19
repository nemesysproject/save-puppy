use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use uuid::Uuid;
use chrono::{DateTime, Utc};

// --- ENUMS ---

#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, PartialEq)]
#[sqlx(type_name = "varchar")]
pub enum UserRole {
    ADMIN,
    ADOPTER,
    SHELTER,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, PartialEq)]
#[sqlx(type_name = "varchar")]
pub enum AuthProvider {
    LOCAL,
    GOOGLE,
    FACEBOOK,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, PartialEq, ToSchema)]
#[sqlx(type_name = "varchar")]
pub enum PetStatus {
    LOST,
    ADOPTION,
    FOUND,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, PartialEq)]
#[sqlx(type_name = "varchar")]
pub enum MediaType {
    IMAGE,
    VIDEO,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type, Clone, PartialEq)]
#[sqlx(type_name = "varchar")]
pub enum AdoptionStatus {
    PENDING,
    APPROVED,
    REJECTED,
}

// --- ENTITIES ---

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub password: Option<String>,
    pub role: String, // Stored as string in DB for now to match current schema
    pub provider: String,
    pub provider_id: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone, ToSchema)]
pub struct Pet {
    pub id: Uuid,
    pub name: String,
    pub status: String,
    pub owner_email: Option<String>,
    pub kind_id: Uuid,
    pub race_id: Option<Uuid>,
    pub gender_id: Uuid,
    pub shelter_id: Option<Uuid>,
    pub owner_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Media {
    pub id: Uuid,
    pub url: String,
    pub storage_key: Option<String>,
    pub provider: Option<String>,
    #[serde(rename = "type")]
    pub media_type: String,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub geohash: Option<String>,
    pub pet_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Shelter {
    pub id: Uuid,
    pub name: String,
    pub address: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub email: String,
    pub phone: Option<String>,
    pub website: Option<String>,
    pub capacity: Option<i32>,
    pub user_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Owner {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub user_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Adoption {
    pub id: Uuid,
    pub date: DateTime<Utc>,
    pub status: String,
    pub notes: Option<String>,
    pub pet_id: Uuid,
    pub owner_id: Uuid,
    pub shelter_id: Option<Uuid>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Kind {
    pub id: Uuid,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Race {
    pub id: Uuid,
    pub name: String,
    pub kind_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, FromRow, Serialize, Deserialize, Clone)]
pub struct Gender {
    pub id: Uuid,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
