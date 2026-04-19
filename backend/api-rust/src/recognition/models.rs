use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ImageFeatures {
    pub pet_id: Uuid,
    pub descriptors: Vec<u8>, // ORB descriptors are bytes
    pub keypoints_count: usize,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ComparisonResult {
    pub candidate_id: Uuid,
    pub score: f64, // 0.0 to 1.0
}
