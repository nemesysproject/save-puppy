from pydantic import BaseModel
from typing import Optional, List

class PetFilter(BaseModel):
    kind_id: str
    race_id: Optional[str] = None
    latitude: float
    longitude: float
    radius_km: float = 10.0

class ImageAnalysisRequest(BaseModel):
    image_url: Optional[str] = None
    filters: PetFilter

class PetMatch(BaseModel):
    pet_id: str
    confidence: float
    match_type: str # LOST, SHELTER, RISK
    last_location: Optional[dict] = None

class AnalysisResponse(BaseModel):
    success: bool
    matches: List[PetMatch]
    metadata: Optional[dict] = None
