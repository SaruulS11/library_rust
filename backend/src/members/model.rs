use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct Member {
    pub id: i32,
    pub member_code: String,
    pub full_name: String,
}

#[derive(Deserialize)]
pub struct MemberInput {
    pub member_code: String,
    pub full_name: String,
}