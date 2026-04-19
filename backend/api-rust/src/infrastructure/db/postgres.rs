use sqlx::postgres::{PgPool, PgPoolOptions};
use std::env;

pub async fn create_postgres_pool() -> PgPool {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env");

    PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create Postgres connection pool")
}
