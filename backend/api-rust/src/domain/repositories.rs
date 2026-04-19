use crate::domain::entities::{User, Pet, Media};
use uuid::Uuid;
use async_trait::async_trait;

#[derive(Debug)]
pub enum RepositoryError {
    NotFound,
    DatabaseError(String),
    AlreadyExists,
}

impl std::fmt::Display for RepositoryError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            RepositoryError::NotFound => write!(f, "Record not found"),
            RepositoryError::DatabaseError(e) => write!(f, "Database error: {}", e),
            RepositoryError::AlreadyExists => write!(f, "Record already exists"),
        }
    }
}

impl std::error::Error for RepositoryError {}

pub type RepoResult<T> = Result<T, RepositoryError>;

#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn save(&self, user: User) -> RepoResult<User>;
    async fn find_by_id(&self, id: Uuid) -> RepoResult<Option<User>>;
    async fn find_by_email(&self, email: &str) -> RepoResult<Option<User>>;
}

#[cfg_attr(test, mockall::automock)]
#[async_trait]
pub trait PetRepository: Send + Sync {
    async fn save(&self, pet: Pet) -> RepoResult<Pet>;
    async fn find_by_id(&self, id: Uuid) -> RepoResult<Option<Pet>>;
    async fn list_by_shelter(&self, shelter_id: Uuid) -> RepoResult<Vec<Pet>>;
    async fn delete(&self, id: Uuid) -> RepoResult<()>;
}

#[async_trait]
pub trait MediaRepository: Send + Sync {
    async fn save_batch(&self, media: Vec<Media>) -> RepoResult<Vec<Media>>;
    async fn list_by_pet(&self, pet_id: Uuid) -> RepoResult<Vec<Media>>;
}

#[async_trait]
pub trait ShelterRepository: Send + Sync {
    async fn save(&self, shelter: crate::domain::entities::Shelter) -> RepoResult<crate::domain::entities::Shelter>;
    async fn find_by_id(&self, id: Uuid) -> RepoResult<Option<crate::domain::entities::Shelter>>;
    async fn find_by_user_id(&self, user_id: Uuid) -> RepoResult<Option<crate::domain::entities::Shelter>>;
}

#[async_trait]
pub trait AdoptionRepository: Send + Sync {
    async fn save(&self, adoption: crate::domain::entities::Adoption) -> RepoResult<crate::domain::entities::Adoption>;
    async fn list_by_pet(&self, pet_id: Uuid) -> RepoResult<Vec<crate::domain::entities::Adoption>>;
    async fn list_by_owner(&self, owner_id: Uuid) -> RepoResult<Vec<crate::domain::entities::Adoption>>;
}

// SearchRepository for the Read Side (MongoDB)
#[cfg_attr(test, mockall::automock)]
#[async_trait]
pub trait SearchRepository: Send + Sync {
    async fn find_pets_by_location(&self, latitude: f64, longitude: f64, radius_km: f64) -> RepoResult<Vec<Pet>>;
    async fn list_all_pets(&self, limit: i64, offset: i64) -> RepoResult<Vec<Pet>>;
}
