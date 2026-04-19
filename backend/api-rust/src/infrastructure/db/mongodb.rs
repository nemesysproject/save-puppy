use mongodb::{Client, options::ClientOptions};
use std::env;

pub async fn create_mongodb_client() -> Client {
    let mongo_url = env::var("MONGO_URL")
        .expect("MONGO_URL must be set in .env");

    let mut client_options = ClientOptions::parse(mongo_url)
        .await
        .expect("Failed to parse MongoDB URL");

    client_options.app_name = Some("SavePuppyRust".to_string());

    Client::with_options(client_options)
        .expect("Failed to create MongoDB client")
}
