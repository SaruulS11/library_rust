use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};

use sqlx::PgPool;

use super::{
    model::{BorrowInput, Loan, LoanSummary},
    repository,
    service::{self, BorrowError, ReturnError},
};

pub async fn list(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<LoanSummary>>, StatusCode> {
    match repository::list(&pool).await {
        Ok(loans) => Ok(Json(loans)),
        Err(error) => {
            eprintln!("Failed to list loans: {error}");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

pub async fn borrow(
    State(pool): State<PgPool>,
    Json(input): Json<BorrowInput>,
) -> Result<(StatusCode, Json<Loan>), (StatusCode, &'static str)> {
    match service::borrow(&pool, input).await {
        Ok(loan) => Ok((StatusCode::CREATED, Json(loan))),
        Err(BorrowError::InvalidInput(message)) => {
            Err((StatusCode::BAD_REQUEST, message))
        }
        Err(BorrowError::CopyUnavailable) => {
            Err((
                StatusCode::CONFLICT,
                "This copy is already borrowed",
            ))
        }
        Err(BorrowError::InvalidReference) => {
            Err((
                StatusCode::BAD_REQUEST,
                "The selected copy or member does not exist",
            ))
        }
        Err(BorrowError::Database(error)) => {
            eprintln!("Failed to borrow copy: {error}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not create loan",
            ))
        }
    }
}

pub async fn return_loan(
    State(pool): State<PgPool>,
    Path(loan_id): Path<i32>,
) -> Result<Json<Loan>, (StatusCode, &'static str)> {
    match service::return_loan(&pool, loan_id).await {
        Ok(loan) => Ok(Json(loan)),
        Err(ReturnError::InvalidInput) => {
            Err((StatusCode::BAD_REQUEST, "Loan ID must be positive"))
        }
        Err(ReturnError::NotActive) => {
            Err((
                StatusCode::NOT_FOUND,
                "No active loan found with this ID",
            ))
        }
        Err(ReturnError::Database(error)) => {
            eprintln!("Failed to return loan: {error}");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Could not return loan",
            ))
        }
    }
}