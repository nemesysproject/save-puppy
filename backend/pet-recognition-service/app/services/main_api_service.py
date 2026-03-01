import requests
from app.core.config import settings
from typing import List, Dict

class MainApiService:
    def __init__(self):
        self.base_url = settings.MAIN_API_URL

    def get_candidates(self, kind_id: str, lat: float, lon: float, radius: float, race_id: str = None) -> List[Dict]:
        """
        Consulta al api-rest mascotas candidatas cercanas.
        """
        params = {
            "kindId": kind_id,
            "lat": lat,
            "lon": lon,
            "radius": radius
        }
        if race_id:
            params["raceId"] = race_id
            
        try:
            # Endpoint que creamos en api-rest: GET /api/pets/search/location
            url = f"{self.base_url}/pets/search/location"
            # TODO: Agregar Bearer token si el endpoint está protegido
            # headers = {"Authorization": "Bearer ..."}
            # response = requests.get(url, params=params, headers=headers)
            
            response = requests.get(url, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"API Error {response.status_code}: {response.text}")
                return []
        except Exception as e:
            print(f"Error connecting to Main API: {e}")
            return []

main_api_service = MainApiService()
