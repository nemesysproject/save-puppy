pub mod commands;
pub mod queries;

use crate::domain::repositories::RepositoryError;

#[derive(Debug)]
pub enum ApplicationError {
    RepositoryError(RepositoryError),
    ValidationError(String),
    NotFound(String),
    Unauthorized(String),
    InternalError(String),
}

impl std::fmt::Display for ApplicationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApplicationError::RepositoryError(e) => write!(f, "Repository error: {}", e),
            ApplicationError::ValidationError(e) => write!(f, "Validation error: {}", e),
            ApplicationError::NotFound(e) => write!(f, "Not found: {}", e),
            ApplicationError::Unauthorized(e) => write!(f, "Unauthorized: {}", e),
            ApplicationError::InternalError(e) => write!(f, "Internal error: {}", e),
        }
    }
}

impl std::error::Error for ApplicationError {}

impl From<RepositoryError> for ApplicationError {
    fn from(error: RepositoryError) -> Self {
        ApplicationError::RepositoryError(error)
    }
}

pub type AppResult<T> = Result<T, ApplicationError>;
