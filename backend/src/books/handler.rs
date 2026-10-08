use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};

use sqlx::PgPool;

use super::{
    model::{Book, BookInput},
    repository,
    service::{self, BookWriteError},
};

pub async fn list(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Book>>, StatusCode> {
    match repository::list(&pool).await {
        Ok(books) => Ok(Json(books)),
        Err(error) => {
            eprintln!("Failed to list books: {error}");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn create(
    State(pool): State<PgPool>,
    Json(input): Json<BookInput>,
) -> Result<(StatusCode, Json<Book>), (StatusCode, &'static str)> {
    match service::create(&pool, input).await {
        Ok(book) => Ok((StatusCode::CREATED, Json(book))),
        Err(BookWriteError::InvalidInput(message)) => {
            Err((StatusCode::BAD_REQUEST, message))
        }
        Err(BookWriteError::Database(error)) => {
            eprintln!("Failed to create book: {error}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create book",
            ))
        }
    }
}

pub async fn update(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
    Json(input): Json<BookInput>,
) -> Result<Json<Book>, (StatusCode, &'static str)> {
    match service::update(&pool, id, input).await {
        Ok(Some(book)) => Ok(Json(book)),
        Ok(None) => Err((StatusCode::NOT_FOUND, "Book not found")),
        Err(BookWriteError::InvalidInput(message)) => {
            Err((StatusCode::BAD_REQUEST, message))
        }
        Err(BookWriteError::Database(error)) => {
            eprintln!("Failed to update book: {error}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not update book",
            ))
        }
    }
}