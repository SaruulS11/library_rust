use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct LoanSummary {
    pub id: i32,
    pub copy_id: i32,
    pub member_id: i32,
    pub inventory_code: String,
    pub book_title: String,
    pub member_code: String,
    pub member_name: String,
    pub borrowed_at: DateTime<Utc>,
    pub due_at: DateTime<Utc>,
    pub returned_at: Option<DateTime<Utc>>,
}

#[derive(Deserialize)]
pub struct BorrowInput {
    pub copy_id: i32,
    pub member_id: i32,
}

#[derive(Serialize, FromRow)]
pub struct Loan {
    pub id: i32,
    pub copy_id: i32,
    pub member_id: i32,
    pub borrowed_at: DateTime<Utc>,
    pub due_at: DateTime<Utc>,
    pub returned_at: Option<DateTime<Utc>>,
}