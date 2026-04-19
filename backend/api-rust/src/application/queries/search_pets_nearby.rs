use crate::application::AppResult;
use serde::Deserialize;
use utoipa::{ToSchema, IntoParams};
use std::sync::Arc;
use crate::domain::repositories::SearchRepository;
use crate::domain::entities::Pet;

#[derive(Debug, Deserialize, ToSchema, IntoParams)]
pub struct SearchPetsNearbyQuery {
    pub latitude: f64,
    pub longitude: f64,
    pub radius_km: f64,
}

pub struct SearchPetsNearbyHandler {
    search_repo: Arc<dyn SearchRepository>,
}

impl SearchPetsNearbyHandler {
    pub fn new(search_repo: Arc<dyn SearchRepository>) -> Self {
        Self { search_repo }
    }

    pub async fn handle(&self, query: SearchPetsNearbyQuery) -> AppResult<Vec<Pet>> {
        let results = self.search_repo
            .find_pets_by_location(query.latitude, query.longitude, query.radius_km)
            .await?;
            
        Ok(results)
    }
}
