use sqlx::postgres::{PgConnectOptions, PgPoolOptions};
use sqlx::PgPool;
use std::env;
use std::error::Error;

pub async fn connect() -> Result<PgPool, Box<dyn Error>> {
    let options = PgConnectOptions::new()
        .host(&env::var("DB_HOST")?)
        .port(env::var("DB_PORT")?.parse::<u16>()?)
        .database(&env::var("DB_NAME")?)
        .username(&env::var("DB_USER")?)
        .password(&env::var("DB_PASSWORD")?);

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect_with(options)
        .await?;

    Ok(pool)
}