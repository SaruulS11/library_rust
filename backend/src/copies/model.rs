use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct CopySummary {
    pub id: i32,
    pub book_id: i32,
    pub inventory_code: String,
    pub title: String,
    pub author: String,
}

#[derive(Deserialize)]
pub struct CopyInput {
    pub book_id: i32,
    pub inventory_code: String,
}

#[derive(Serialize, FromRow)]
pub struct BookCopy {
    pub id: i32,
    pub book_id: i32,
    pub inventory_code: String,
}