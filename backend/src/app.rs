use axum::{
    routing::{get, put},
    Router,
};

use sqlx::PgPool;

use crate::{books, copies, health, members};

pub fn create_router(pool: PgPool) -> Router {
    Router::new()
        .route("/health", get(health::check))
        .route(
            "/books",
            get(books::handler::list).post(books::handler::create),
        )
        .route("/books/{id}", put(books::handler::update))
        .route(
            "/copies",
            get(copies::handler::list).post(copies::handler::create),
        )
        .route(
            "/members",
            get(members::handler::list).post(members::handler::create),
        ).with_state(pool)
}