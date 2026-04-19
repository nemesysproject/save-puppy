pub mod api;
pub mod domain;
pub mod infrastructure;
pub mod application;
pub mod recognition;

use std::sync::Arc;
use crate::api::state::AppState;
use crate::api::handlers::pet_handler;
use crate::api::openapi::ApiDoc;
use utoipa_swagger_ui::SwaggerUi;
use utoipa::OpenApi;
use axum::routing::{get, post};

pub fn create_app(state: Arc<AppState>) -> axum::Router {
    axum::Router::new()
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/health", get(health_handler))
        .route("/api/pets", post(pet_handler::create_pet))
        .route("/api/pets/search", get(pet_handler::search_pets))
        .route("/api/pets/search/image", post(pet_handler::search_by_image))
        .route("/api/pets/:id", get(pet_handler::get_pet))
        .with_state((*state).clone())
}

#[derive(serde::Serialize)]
pub struct HealthResponse {
    pub status: String,
    pub version: String,
    pub database: String,
    pub messaging: String,
}

pub async fn health_handler() -> axum::Json<HealthResponse> {
    axum::Json(HealthResponse {
        status: "ok".to_string(),
        version: "0.1.0".to_string(),
        database: "connected".to_string(),
        messaging: "connected".to_string(),
    })
}
