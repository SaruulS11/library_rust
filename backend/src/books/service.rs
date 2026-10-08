use sqlx::PgPool;

use super::model::{Book, BookInput};
use super::repository;

pub enum BookWriteError {
    InvalidInput(&'static str),
    Database(sqlx::Error),
}

fn validate(mut input: BookInput) -> Result<BookInput, BookWriteError> {
    input.title = input.title.trim().to_string();
    input.author = input.author.trim().to_string();

    if input.title.is_empty() {
        return Err(BookWriteError::InvalidInput("Title is required"));
    }

    if input.author.is_empty() {
        return Err(BookWriteError::InvalidInput("Author is required"));
    }

    if let Some(year) = input.publication_year {
        if !(1..=9999).contains(&year) {
            return Err(BookWriteError::InvalidInput(
                "Publication year must be between 1 and 9999",
            ));
        }
    }

    Ok(input)
}

pub async fn create(
    pool: &PgPool,
    input: BookInput,
) -> Result<Book, BookWriteError> {
    let input = validate(input)?;

    repository::create(pool, &input)
        .await
        .map_err(BookWriteError::Database)
}

pub async fn update(
    pool: &PgPool,
    id: i32,
    input: BookInput,
) -> Result<Option<Book>, BookWriteError> {
    let input = validate(input)?;

    repository::update(pool, id, &input)
        .await
        .map_err(BookWriteError::Database)
}