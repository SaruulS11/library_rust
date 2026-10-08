use axum::{extract::State, http::StatusCode, Json};
use sqlx::PgPool;

use super::{
    model::{Member, MemberInput},
    repository,
    service::{self, MemberWriteError},
};

pub async fn list(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Member>>, StatusCode> {
    match repository::list(&pool).await {
        Ok(members) => Ok(Json(members)),
        Err(error) => {
            eprintln!("Failed to list members: {error}");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn create(
    State(pool): State<PgPool>,
    Json(input): Json<MemberInput>,
) -> Result<(StatusCode, Json<Member>), (StatusCode, &'static str)> {
    match service::create(&pool, input).await {
        Ok(member) => Ok((StatusCode::CREATED, Json(member))),
        Err(MemberWriteError::InvalidInput(message)) => {
            Err((StatusCode::BAD_REQUEST, message))
        }
        Err(MemberWriteError::DuplicateCode) => {
            Err((
                StatusCode::CONFLICT,
                "Member code already exists",
            ))
        }
        Err(MemberWriteError::Database(error)) => {
            eprintln!("Failed to create member: {error}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create member",
            ))
        }
    }
}