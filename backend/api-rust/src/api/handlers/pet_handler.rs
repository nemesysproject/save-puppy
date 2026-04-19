use axum::{
    extract::{State, Path, Query},
    Json,
    response::IntoResponse,
    http::StatusCode,
};
use uuid::Uuid;
use std::sync::Arc;

use crate::api::state::AppState;
use crate::application::commands::{CreatePetCommand, CreatePetHandler};
use crate::application::queries::{GetPetByIdQuery, GetPetByIdHandler, SearchPetsNearbyQuery, SearchPetsNearbyHandler, SearchPetsByImageQuery, SearchPetsByImageHandler};
use crate::infrastructure::repositories::{PostgresPetRepository, MongoSearchRepository};
use crate::infrastructure::messaging::MessagingService;

/// Registrar una nueva mascota en el sistema
#[utoipa::path(
    post,
    path = "/api/pets",
    request_body = CreatePetCommand,
    responses(
        (status = 201, description = "Mascota creada con éxito", body = Pet),
        (status = 400, description = "Error de validación")
    ),
    tag = "pets"
)]
pub async fn create_pet(
    State(state): State<AppState>,
    Json(payload): Json<CreatePetCommand>,
) -> impl IntoResponse {
    let pet_repo = Arc::new(PostgresPetRepository::new(state.pg_pool.clone()));
    let messaging = MessagingService::new(state.rabbit_pool.clone());
    let handler = CreatePetHandler::new(pet_repo, messaging);

    match handler.handle(payload).await {
        Ok(pet) => (StatusCode::CREATED, Json(pet)).into_response(),
        Err(e) => e.into_response(),
    }
}

/// Obtener los detalles de una mascota por su ID
#[utoipa::path(
    get,
    path = "/api/pets/{id}",
    responses(
        (status = 200, description = "Detalles de la mascota", body = Pet),
        (status = 404, description = "Mascota no encontrada")
    ),
    params(
        ("id" = Uuid, Path, description = "ID único de la mascota")
    ),
    tag = "pets"
)]
pub async fn get_pet(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    let pet_repo = Arc::new(PostgresPetRepository::new(state.pg_pool.clone()));
    let handler = GetPetByIdHandler::new(pet_repo);

    let query = GetPetByIdQuery { id };
    match handler.handle(query).await {
        Ok(pet) => Json(pet).into_response(),
        Err(e) => e.into_response(),
    }
}

/// Buscar mascotas por proximidad geográfica
#[utoipa::path(
    get,
    path = "/api/pets/search",
    responses(
        (status = 200, description = "Lista de mascotas cercanas", body = [Pet]),
    ),
    params(
        SearchPetsNearbyQuery
    ),
    tag = "search"
)]
pub async fn search_pets(
    State(state): State<AppState>,
    Query(params): Query<SearchPetsNearbyQuery>,
) -> impl IntoResponse {
    let search_repo = Arc::new(MongoSearchRepository::new(state.mongo_client.clone()));
    let handler = SearchPetsNearbyHandler::new(search_repo);

    match handler.handle(params).await {
        Ok(pets) => Json(pets).into_response(),
        Err(e) => e.into_response(),
    }
}

/// Buscar mascotas por similitud visual (Imagen)
#[utoipa::path(
    post,
    path = "/api/pets/search/image",
    request_body = SearchPetsByImageQuery,
    responses(
        (status = 200, description = "Ranking de mascotas similares", body = [ComparisonResult]),
    ),
    tag = "search"
)]
pub async fn search_by_image(
    State(state): State<AppState>,
    Json(payload): Json<SearchPetsByImageQuery>,
) -> impl IntoResponse {
    let handler = SearchPetsByImageHandler::new(state.mongo_client.clone());

    match handler.handle(payload).await {
        Ok(results) => Json(results).into_response(),
        Err(e) => e.into_response(),
    }
}
