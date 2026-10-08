use sqlx::PgPool;

use super::model::{Book, BookInput};

pub async fn list(pool: &PgPool) -> Result<Vec<Book>, sqlx::Error> {
    sqlx::query_as::<_, Book>(
        "SELECT id, title, author, publication_year
         FROM books
         ORDER BY id
         LIMIT 100",
    )
    .fetch_all(pool)
    .await
}

pub async fn create(
    pool: &PgPool,
    input: &BookInput,
) -> Result<Book, sqlx::Error> {
    sqlx::query_as::<_, Book>(
        "INSERT INTO books (title, author, publication_year)
         VALUES ($1, $2, $3)
         RETURNING id, title, author, publication_year",
    )
    .bind(&input.title)
    .bind(&input.author)
    .bind(input.publication_year)
    .fetch_one(pool)
    .await
}

pub async fn update(
    pool: &PgPool,
    id: i32,
    input: &BookInput,
) -> Result<Option<Book>, sqlx::Error> {
    sqlx::query_as::<_, Book>(
        "UPDATE books
         SET title = $1,
             author = $2,
             publication_year = $3
         WHERE id = $4
         RETURNING id, title, author, publication_year",
    )
    .bind(&input.title)
    .bind(&input.author)
    .bind(input.publication_year)
    .bind(id)
    .fetch_optional(pool)
    .await
}