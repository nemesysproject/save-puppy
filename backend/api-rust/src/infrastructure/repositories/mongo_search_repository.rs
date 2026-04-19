use crate::domain::entities::Pet;
use crate::domain::repositories::{SearchRepository, RepoResult, RepositoryError};
use mongodb::{Client, bson::doc};
use futures::stream::StreamExt;
use std::env;
use async_trait::async_trait;

pub struct MongoSearchRepository {
    client: Client,
    database: String,
}

impl MongoSearchRepository {
    pub fn new(client: Client) -> Self {
        let database = env::var("MONGO_DB").unwrap_or_else(|_| "save_puppy_db".to_string());
        Self { client, database }
    }

    fn collection(&self) -> mongodb::Collection<Pet> {
        self.client.database(&self.database).collection("pets_search")
    }
}

#[async_trait]
impl SearchRepository for MongoSearchRepository {
    async fn find_pets_by_location(&self, latitude: f64, longitude: f64, radius_km: f64) -> RepoResult<Vec<Pet>> {
        // MongoDB geospatial query (requires 2dsphere index on 'location' field)
        // Note: For now we assume the 'pets_search' collection has the materialized view
        let filter = doc! {
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "$maxDistance": radius_km * 1000.0 // MongoDB uses meters
                }
            }
        };

        let mut cursor = self.collection().find(filter, None).await
            .map_err(|e| RepositoryError::DatabaseError(e.to_string()))?;

        let mut pets = Vec::new();
        while let Some(result) = cursor.next().await {
            pets.push(result.map_err(|e| RepositoryError::DatabaseError(e.to_string()))?);
        }

        Ok(pets)
    }

    async fn list_all_pets(&self, limit: i64, offset: i64) -> RepoResult<Vec<Pet>> {
        let options = mongodb::options::FindOptions::builder()
            .limit(limit)
            .skip(offset as u64)
            .build();

        let mut cursor = self.collection().find(None, options).await
            .map_err(|e| RepositoryError::DatabaseError(e.to_string()))?;

        let mut pets = Vec::new();
        while let Some(result) = cursor.next().await {
            pets.push(result.map_err(|e| RepositoryError::DatabaseError(e.to_string()))?);
        }

        Ok(pets)
    }
}
