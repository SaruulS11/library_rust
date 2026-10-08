use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct Book {
    pub id: i32,
    pub title: String,
    pub author: String,
    pub publication_year: Option<i32>,
}

#[derive(Deserialize)]
pub struct BookInput {
    pub title: String,
    pub author: String,
    pub publication_year: Option<i32>,
}