use sqlx::PgPool;

use super::model::{BorrowInput, Loan, LoanSummary};

pub async fn list(
    pool: &PgPool,
) -> Result<Vec<LoanSummary>, sqlx::Error> {
    sqlx::query_as::<_, LoanSummary>(
        "SELECT
             l.id,
             l.copy_id,
             l.member_id,
             c.inventory_code,
             b.title AS book_title,
             m.member_code,
             m.full_name AS member_name,
             l.borrowed_at,
             l.due_at,
             l.returned_at
         FROM loans AS l
         JOIN book_copies AS c ON c.id = l.copy_id
         JOIN books AS b ON b.id = c.book_id
         JOIN members AS m ON m.id = l.member_id
         ORDER BY l.borrowed_at DESC, l.id DESC
         LIMIT 100",
    )
    .fetch_all(pool)
    .await
}

pub async fn create(
    pool: &PgPool,
    input: &BorrowInput,
    loan_days: i32,
) -> Result<Loan, sqlx::Error> {
    sqlx::query_as::<_, Loan>(
        "INSERT INTO loans (copy_id, member_id, borrowed_at, due_at)
         VALUES ($1, $2, NOW(), NOW() + make_interval(days => $3))
         RETURNING
             id,
             copy_id,
             member_id,
             borrowed_at,
             due_at,
             returned_at",
    )
    .bind(input.copy_id)
    .bind(input.member_id)
    .bind(loan_days)
    .fetch_one(pool)
    .await
}

pub async fn return_loan(
    pool: &PgPool,
    loan_id: i32,
) -> Result<Option<Loan>, sqlx::Error> {
    sqlx::query_as::<_, Loan>(
        "UPDATE loans
         SET returned_at = NOW()
         WHERE id = $1 AND returned_at IS NULL
         RETURNING
             id,
             copy_id,
             member_id,
             borrowed_at,
             due_at,
             returned_at",
    )
    .bind(loan_id)
    .fetch_optional(pool)
    .await
}