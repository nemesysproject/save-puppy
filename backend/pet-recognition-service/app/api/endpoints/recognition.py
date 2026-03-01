from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.recognition import AnalysisResponse, PetMatch, ImageAnalysisRequest
from app.services.vision_service import vision_service
from app.services.main_api_service import main_api_service
from app.services.classifier_service import pet_classifier
from typing import List
import json

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_pet(
    filters: str = File(...), # JSON string as it's a multipart request with a file
    file: UploadFile = File(...)
):
    """
    Analiza una imagen de mascota y busca coincidencias filtrando por ubicación, especie y raza.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo no es una imagen")
        
    try:
        filter_data = json.loads(filters)
        # Validate with pydantic schema if needed or just use dict
    except Exception:
        raise HTTPException(status_code=400, detail="Filtros inválidos (debe ser JSON)")

    contents = await file.read()
    
    # 0. Validar si es una mascota y clasificar especie/raza
    classifications = pet_classifier.predict(contents)
    is_pet_detected = pet_classifier.is_pet(classifications)
    
    # 1. Obtener candidatos del API principal usando los filtros
    candidates = main_api_service.get_candidates(
        kind_id=filter_data.get("kind_id"),
        lat=filter_data.get("latitude"),
        lon=filter_data.get("longitude"),
        radius=filter_data.get("radius_km", 10.0),
        race_id=filter_data.get("race_id")
    )
    
    matches = []
    for cand in candidates:
        # En una mascosta puede haber varios Media (fotos/videos)
        for m in cand.get("media", []):
            if m.get("url"):
                cand_img = vision_service.download_image(m["url"])
                if cand_img:
                    score = vision_service.compare_images(contents, cand_img)
                    
                    if score > 0.3: # Umbral mínimo de confianza ajustable
                        matches.append({
                            "pet_id": cand["id"],
                            "confidence": score,
                            "match_type": cand.get("status", "UNKNOWN"),
                            "last_location": {"lat": m.get("latitude"), "lon": m.get("longitude")}
                        })
    
    # Ordenar por confianza y eliminar duplicados de pet_id (mantener el mejor score)
    unique_matches = {}
    for match in matches:
        pid = match["pet_id"]
        if pid not in unique_matches or match["confidence"] > unique_matches[pid]["confidence"]:
            unique_matches[pid] = match
            
    sorted_matches = sorted(unique_matches.values(), key=lambda x: x["confidence"], reverse=True)
    
    return {
        "success": True,
        "matches": sorted_matches[:10], # Top 10 matches
        "metadata": {
            "filename": file.filename,
            "candidates_count": len(candidates),
            "is_pet_detected": is_pet_detected,
            "classifications": classifications[:3] # Devolvemos los top 3 para feedback
        }
    }

@router.post("/compare", response_model=float)
async def compare_pets(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    """
    Compara dos imágenes de mascotas directamente.
    """
    contents1 = await file1.read()
    contents2 = await file2.read()
    
    score = vision_service.compare_images(contents1, contents2)
    return score
