use sqlx::PgPool;
use mongodb::Client;
pub use deadpool_lapin::Pool as RabbitPool;

#[derive(Clone)]
pub struct AppState {
    pub pg_pool: PgPool,
    pub mongo_client: Client,
    pub rabbit_pool: RabbitPool,
}

impl AppState {
    pub fn new(pg_pool: PgPool, mongo_client: Client, rabbit_pool: RabbitPool) -> Self {
        Self {
            pg_pool,
            mongo_client,
            rabbit_pool,
        }
    }
}
