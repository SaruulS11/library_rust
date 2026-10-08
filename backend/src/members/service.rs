use sqlx::PgPool;

use super::model::{Member, MemberInput};
use super::repository;

pub enum MemberWriteError {
    InvalidInput(&'static str),
    DuplicateCode,
    Database(sqlx::Error),
}

pub async fn create(
    pool: &PgPool,
    mut input: MemberInput,
) -> Result<Member, MemberWriteError> {
    input.member_code = input.member_code.trim().to_string();
    input.full_name = input.full_name.trim().to_string();

    if input.member_code.is_empty() {
        return Err(MemberWriteError::InvalidInput(
            "Member code is required",
        ));
    }

    if input.full_name.is_empty() {
        return Err(MemberWriteError::InvalidInput(
            "Full name is required",
        ));
    }

    match repository::create(pool, &input).await {
        Ok(member) => Ok(member),
        Err(error) => {
            if let Some(database_error) = error.as_database_error() {
                if database_error.is_unique_violation() {
                    return Err(MemberWriteError::DuplicateCode);
                }
            }

            Err(MemberWriteError::Database(error))
        }
    }
}