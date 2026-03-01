import requests
import cv2
import numpy as np
import io
from app.core.config import settings

class VisionService:
    def __init__(self):
        # Initialize ORB detector
        self.orb = cv2.ORB_create()

    def download_image(self, url: str):
        """Descarga una imagen de una URL pública."""
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                return response.content
            return None
        except Exception as e:
            print(f"Error downloading image {url}: {e}")
            return None

    def extract_features(self, image_bytes: bytes):
        """Extrae puntos clave y descriptores."""
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return None, None
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        keypoints, descriptors = self.orb.detectAndCompute(gray, None)
        
        return keypoints, descriptors

    def compare_images(self, img1_bytes: bytes, img2_bytes: bytes):
        """Compara dos imágenes y devuelve el nivel de similitud (0.0 a 1.0)."""
        _, desc1 = self.extract_features(img1_bytes)
        _, desc2 = self.extract_features(img2_bytes)
        
        if desc1 is None or desc2 is None:
            return 0.0
            
        # Brute-force matcher
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(desc1, desc2)
        
        if not matches:
            return 0.0
            
        # Score basado en la cantidad de "buenos" matches respecto al total de descriptores
        good_matches = [m for m in matches if m.distance < 50]
        score = len(good_matches) / max(len(desc1), len(desc2))
        
        return min(score, 1.0)

vision_service = VisionService()
