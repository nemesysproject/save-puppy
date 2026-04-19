pub mod consumer;
use deadpool_lapin::{Config, Pool, Runtime};
use lapin::{options::*, types::FieldTable, BasicProperties, ExchangeKind};
use serde::Serialize;
use std::env;

pub type RabbitPool = Pool;

pub async fn create_rabbitmq_pool() -> RabbitPool {
    let rabbitmq_url = env::var("RABBITMQ_URL")
        .expect("RABBITMQ_URL must be set in .env");

    let mut cfg = Config::default();
    cfg.url = Some(rabbitmq_url);
    
    cfg.create_pool(Some(Runtime::Tokio1))
        .expect("Failed to create RabbitMQ pool")
}

pub struct MessagingService {
    pool: RabbitPool,
}

impl MessagingService {
    pub fn new(pool: RabbitPool) -> Self {
        Self { pool }
    }

    pub async fn publish<T: Serialize>(&self, exchange: &str, routing_key: &str, payload: &T) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let connection = self.pool.get().await?;
        let channel = connection.create_channel().await?;

        // Ensure exchange exists
        channel.exchange_declare(
            exchange,
            ExchangeKind::Topic,
            ExchangeDeclareOptions::default(),
            FieldTable::default(),
        ).await?;

        let body = serde_json::to_vec(payload)?;

        channel.basic_publish(
            exchange,
            routing_key,
            BasicPublishOptions::default(),
            &body,
            BasicProperties::default(),
        ).await?;

        tracing::debug!("Message published to exchange: {}, routing_key: {}", exchange, routing_key);
        Ok(())
    }
}
