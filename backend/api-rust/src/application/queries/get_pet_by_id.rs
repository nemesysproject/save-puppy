use crate::domain::entities::Pet;
use crate::domain::repositories::PetRepository;
use crate::application::{AppResult, ApplicationError};
use uuid::Uuid;
use std::sync::Arc;

pub struct GetPetByIdQuery {
    pub id: Uuid,
}

pub struct GetPetByIdHandler {
    pet_repo: Arc<dyn PetRepository>,
}

impl GetPetByIdHandler {
    pub fn new(pet_repo: Arc<dyn PetRepository>) -> Self {
        Self { pet_repo }
    }

    pub async fn handle(&self, query: GetPetByIdQuery) -> AppResult<Pet> {
        match self.pet_repo.find_by_id(query.id).await? {
            Some(pet) => Ok(pet),
            None => Err(ApplicationError::NotFound(format!("Pet with id {} not found", query.id))),
        }
    }
}
