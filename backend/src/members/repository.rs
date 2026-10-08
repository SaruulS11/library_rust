use sqlx::PgPool;

use super::model::{Member, MemberInput};

pub async fn list(pool: &PgPool) -> Result<Vec<Member>, sqlx::Error> {
    sqlx::query_as::<_, Member>(
        "SELECT id, member_code, full_name
         FROM members
         ORDER BY id
         LIMIT 100",
    )
    .fetch_all(pool)
    .await
}

pub async fn create(
    pool: &PgPool,
    input: &MemberInput,
) -> Result<Member, sqlx::Error> {
    sqlx::query_as::<_, Member>(
        "INSERT INTO members (member_code, full_name)
         VALUES ($1, $2)
         RETURNING id, member_code, full_name",
    )
    .bind(&input.member_code)
    .bind(&input.full_name)
    .fetch_one(pool)
    .await
}