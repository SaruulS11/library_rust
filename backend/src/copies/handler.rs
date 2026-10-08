use axum::{extract::State, http::StatusCode, Json};
use sqlx::PgPool;

use super::{
    model::{BookCopy, CopyInput, CopySummary},
    repository,
    service::{self, CopyWriteError},
};

pub async fn list(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<CopySummary>>, StatusCode> {
    match repository::list(&pool).await {
        Ok(copies) => Ok(Json(copies)),
        Err(error) => {
            eprintln!("Failed to list copies: {error}");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn create(
    State(pool): State<PgPool>,
    Json(input): Json<CopyInput>,
) -> Result<(StatusCode, Json<BookCopy>), (StatusCode, &'static str)> {
    match service::create(&pool, input).await {
        Ok(copy) => Ok((StatusCode::CREATED, Json(copy))),
        Err(CopyWriteError::InvalidInput(message)) => {
            Err((StatusCode::BAD_REQUEST, message))
        }
        Err(CopyWriteError::BookNotFound) => {
            Err((StatusCode::NOT_FOUND, "Book not found"))
        }
        Err(CopyWriteError::DuplicateCode) => {
            Err((
                StatusCode::CONFLICT,
                "Inventory code already exists",
            ))
        }
        Err(CopyWriteError::Database(error)) => {
            eprintln!("Failed to create copy: {error}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create copy",
            ))
        }
    }
}