use crate::application::ApplicationError;

pub struct RecognitionEngine {
    // We could keep models for rustface here if needed
}

impl RecognitionEngine {
    pub fn new() -> Result<Self, ApplicationError> {
        Ok(Self {})
    }

    /// Extracs a "visual hash" (pHash/aHash style) from an image.
    /// Returns a 64-bit hash as a vector of bytes (8 bytes).
    pub fn extract_descriptors(&self, image_bytes: &[u8]) -> Result<Vec<u8>, ApplicationError> {
        let img = image::load_from_memory(image_bytes)
            .map_err(|e| ApplicationError::InternalError(format!("Failed to decode image: {}", e)))?;

        // 1. Convert to grayscale
        let gray = img.grayscale();
        
        // 2. Resize to 8x8 (small enough for a 64-bit hash)
        let resized = gray.resize_exact(8, 8, image::imageops::FilterType::Nearest);
        
        // 3. Calculate average luminosity
        let luma_img = resized.to_luma8();
        let sum: u64 = luma_img.pixels().map(|p| p.0[0] as u64).sum();
        let avg = (sum / 64) as u8;
        
        // 4. Generate hash bits
        let mut hash = 0u64;
        for (i, p) in luma_img.pixels().enumerate() {
            if p.0[0] >= avg {
                hash |= 1 << i;
            }
        }
        
        Ok(hash.to_be_bytes().to_vec())
    }

    /// Compares two visual hashes using Hamming distance.
    /// Returns a score from 0.0 (totally different) to 1.0 (identical).
    pub fn compare_descriptors(&self, hash1: &[u8], hash2: &[u8]) -> Result<f64, ApplicationError> {
        if hash1.len() != 8 || hash2.len() != 8 {
            return Err(ApplicationError::ValidationError("Invalid hash length".to_string()));
        }

        let h1 = u64::from_be_bytes(hash1.try_into().unwrap());
        let h2 = u64::from_be_bytes(hash2.try_into().unwrap());

        // Count different bits
        let diff = (h1 ^ h2).count_ones();
        
        // 64 bits total. 0 diff = 1.0 similarity.
        let similarity = 1.0 - (diff as f64 / 64.0);
        
        Ok(similarity)
    }
}
