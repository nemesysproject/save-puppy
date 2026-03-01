import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np
import cv2
from PIL import Image
import io

class PetClassifier:
    def __init__(self):
        # Cargamos el modelo MobileNetV2 pre-entrenado con ImageNet
        # Este modelo es ligero y bueno para clasificación general (incluyendo perros/gatos)
        self.model = MobileNetV2(weights='imagenet')
        print("Model MobileNetV2 loaded successfully")

    def predict(self, image_bytes: bytes):
        """
        Predice qué hay en la imagen. 
        Devuelve una lista de tuplas (id, label, confidence)
        """
        try:
            # Convertir bytes a imagen PIL y luego a array
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img = img.resize((224, 224))
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            x = preprocess_input(x)

            preds = self.model.predict(x)
            # Decodificar los top 3 resultados
            results = decode_predictions(preds, top=5)[0]
            
            # Formatear resultados
            formatted_results = []
            for (imagenet_id, label, prob) in results:
                formatted_results.append({
                    "label": label,
                    "confidence": float(prob)
                })
            
            return formatted_results
        except Exception as e:
            print(f"Error in prediction: {e}")
            return []

    def is_pet(self, predictions):
        """
        Verifica si alguna de las etiquetas principales corresponde a un animal/mascota.
        """
        pet_keywords = ['dog', 'cat', 'puppy', 'kitten', 'terrier', 'retriever', 'spaniel', 'persian_cat']
        for p in predictions:
            label = p['label'].lower()
            if any(keyword in label for keyword in pet_keywords) and p['confidence'] > 0.2:
                return True
        return False

pet_classifier = PetClassifier()
