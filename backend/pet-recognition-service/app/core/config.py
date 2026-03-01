from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Pet Recognition Service"
    API_V1_STR: str = "/api/v1"
    
    # In a real app, these would be in .env
    # URL base del API principal
    MAIN_API_URL: str = "http://localhost:3000/api"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
