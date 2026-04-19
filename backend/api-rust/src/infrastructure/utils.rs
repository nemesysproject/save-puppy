use reqwest;
use crate::application::ApplicationError;

pub async fn download_image(url: &str) -> Result<Vec<u8>, ApplicationError> {
    let response = reqwest::get(url).await
        .map_err(|e| ApplicationError::InternalError(format!("Failed to download image: {}", e)))?;

    if !response.status().is_success() {
        return Err(ApplicationError::InternalError(format!("Download failed with status: {}", response.status())));
    }

    let bytes = response.bytes().await
        .map_err(|e| ApplicationError::InternalError(format!("Failed to read image bytes: {}", e)))?;

    Ok(bytes.to_vec())
}
