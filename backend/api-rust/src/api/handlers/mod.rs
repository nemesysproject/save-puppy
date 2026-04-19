use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use crate::application::ApplicationError;

impl IntoResponse for ApplicationError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            ApplicationError::ValidationError(e) => (StatusCode::BAD_REQUEST, e),
            ApplicationError::NotFound(e) => (StatusCode::NOT_FOUND, e),
            ApplicationError::Unauthorized(e) => (StatusCode::UNAUTHORIZED, e),
            ApplicationError::RepositoryError(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()),
            ApplicationError::InternalError(e) => (StatusCode::INTERNAL_SERVER_ERROR, e),
        };

        let body = Json(json!({
            "error": error_message,
        }));

        (status, body).into_response()
    }
}

pub mod pet_handler;
