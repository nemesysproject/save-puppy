use crate::application::{AppResult, ApplicationError};
use crate::recognition::engine::RecognitionEngine;
use crate::recognition::models::ComparisonResult;
use crate::infrastructure::utils::download_image;
use serde::Deserialize;
use utoipa::ToSchema;
use rayon::prelude::*;
use mongodb::bson;
use futures::StreamExt;

#[derive(Debug, Deserialize, ToSchema)]
pub struct SearchPetsByImageQuery {
    pub image_url: String,
    pub limit: Option<usize>,
}

pub struct SearchPetsByImageHandler {
    mongo_client: mongodb::Client,
}

impl SearchPetsByImageHandler {
    pub fn new(mongo_client: mongodb::Client) -> Self {
        Self { mongo_client }
    }

    pub async fn handle(&self, query: SearchPetsByImageQuery) -> AppResult<Vec<ComparisonResult>> {
        // 1. Download and extract features from target image
        let target_bytes = download_image(&query.image_url).await?;
        let engine = RecognitionEngine::new()?;
        let target_hash = engine.extract_descriptors(&target_bytes)?;

        // 2. Fetch candidates from MongoDB
        let db = self.mongo_client.database("save_puppy_db");
        let collection = db.collection::<bson::Document>("pets_search");
        
        let filter = bson::doc! { "visual_features": { "$exists": true } };
        let mut cursor = collection.find(filter, None).await
            .map_err(|e| ApplicationError::InternalError(e.to_string()))?;

        let mut candidates = Vec::new();
        while let Some(doc_result) = cursor.next().await {
            if let Ok(doc) = doc_result {
                if let (Ok(id_str), Ok(bytes)) = (doc.get_str("id"), doc.get_binary_generic("visual_features")) {
                    if let Ok(id) = uuid::Uuid::parse_str(id_str) {
                         candidates.push((id, bytes.to_vec()));
                    }
                }
            }
        }

        if candidates.is_empty() {
            return Ok(Vec::new());
        }

        // 3. Parallel Comparison using Rayon
        let results: Vec<ComparisonResult> = candidates.par_iter().filter_map(|(id, bytes)| {
             let local_engine = RecognitionEngine::new().ok()?;
             
             let score = local_engine.compare_descriptors(&target_hash, bytes).ok()?;
             
             if score > 0.6 { // threshold adapted for hashing (60% similarity)
                 Some(ComparisonResult {
                     candidate_id: *id,
                     score,
                 })
             } else {
                 None
             }
        }).collect();

        // 4. Sort and return
        let mut sorted_results = results;
        sorted_results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
        
        if let Some(limit) = query.limit {
            sorted_results.truncate(limit);
        }

        Ok(sorted_results)
    }
}
