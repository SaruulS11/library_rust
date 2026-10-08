use sqlx::PgPool;

use super::model::{BookCopy, CopyInput, CopySummary};

pub async fn list(
    pool: &PgPool,
) -> Result<Vec<CopySummary>, sqlx::Error> {
    sqlx::query_as::<_, CopySummary>(
        "SELECT
             c.id,
             c.book_id,
             c.inventory_code,
             b.title,
             b.author
         FROM book_copies AS c
         JOIN books AS b ON b.id = c.book_id
         ORDER BY c.id
         LIMIT 100",
    )
    .fetch_all(pool)
    .await
}

pub async fn create(
    pool: &PgPool,
    input: &CopyInput,
) -> Result<BookCopy, sqlx::Error> {
    sqlx::query_as::<_, BookCopy>(
        "INSERT INTO book_copies (book_id, inventory_code)
         VALUES ($1, $2)
         RETURNING id, book_id, inventory_code",
    )
    .bind(input.book_id)
    .bind(&input.inventory_code)
    .fetch_one(pool)
    .await
}