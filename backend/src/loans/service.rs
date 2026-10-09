use sqlx::PgPool;

use super::model::{BorrowInput, Loan};
use super::repository;

const LOAN_DAYS: i32 = 14;

pub enum BorrowError {
    InvalidInput(&'static str),
    CopyUnavailable,
    InvalidReference,
    Database(sqlx::Error),
}

pub async fn borrow(
    pool: &PgPool,
    input: BorrowInput,
) -> Result<Loan, BorrowError> {
    if input.copy_id < 1 || input.member_id < 1 {
        return Err(BorrowError::InvalidInput(
            "Copy ID and member ID must be positive",
        ));
    }

    match repository::create(pool, &input, LOAN_DAYS).await {
        Ok(loan) => Ok(loan),
        Err(error) => {
            if let Some(database_error) = error.as_database_error() {
                if database_error.is_unique_violation()
                    && database_error.constraint()
                        == Some("loans_one_active_per_copy")
                {
                    return Err(BorrowError::CopyUnavailable);
                }

                if database_error.is_foreign_key_violation() {
                    return Err(BorrowError::InvalidReference);
                }
            }

            Err(BorrowError::Database(error))
        }
    }
}

pub enum ReturnError {
    InvalidInput,
    NotActive,
    Database(sqlx::Error),
}

pub async fn return_loan(
    pool: &PgPool,
    loan_id: i32,
) -> Result<Loan, ReturnError> {
    if loan_id < 1 {
        return Err(ReturnError::InvalidInput);
    }

    match repository::return_loan(pool, loan_id).await {
        Ok(Some(loan)) => Ok(loan),
        Ok(None) => Err(ReturnError::NotActive),
        Err(error) => Err(ReturnError::Database(error)),
    }
}