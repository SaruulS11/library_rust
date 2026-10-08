mod app;
mod db;
mod health;
mod copies;
mod members;

use std::error::Error;
use tokio::net::TcpListener;
mod books;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenvy::dotenv()?;

    let pool = db::connect().await?;
    println!("Connected to PostgreSQL");

    let app = app::create_router(pool.clone());
    let listener = TcpListener::bind("127.0.0.1:3001").await?;
    println!("Library API: http://127.0.0.1:3001");

    axum::serve(listener, app).await?;

    pool.close().await;

    Ok(())
}