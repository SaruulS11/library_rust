use sqlx::PgPool;

use super::model::{BookCopy, CopyInput};
use super::repository;

pub enum CopyWriteError {
    InvalidInput(&'static str),
    BookNotFound,
    DuplicateCode,
    Database(sqlx::Error),
}

pub async fn create(
    pool: &PgPool,
    mut input: CopyInput,
) -> Result<BookCopy, CopyWriteError> {
    input.inventory_code = input.inventory_code.trim().to_string();

    if input.book_id < 1 {
        return Err(CopyWriteError::InvalidInput(
            "Book ID must be positive",
        ));
    }

    if input.inventory_code.is_empty() {
        return Err(CopyWriteError::InvalidInput(
            "Inventory code is required",
        ));
    }

    match repository::create(pool, &input).await {
        Ok(copy) => Ok(copy),
        Err(error) => {
            if let Some(database_error) = error.as_database_error() {
                if database_error.is_unique_violation() {
                    return Err(CopyWriteError::DuplicateCode);
                }

                if database_error.is_foreign_key_violation() {
                    return Err(CopyWriteError::BookNotFound);
                }
            }

            Err(CopyWriteError::Database(error))
        }
    }
}