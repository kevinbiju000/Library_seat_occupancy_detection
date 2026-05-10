from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Library Occupancy System"
    DATABASE_URL: str
    HEAD_MODEL_PATH: str = "runs/detect/train-*/weights/best.pt"
    MODEL_CONFIDENCE_THRESHOLD: float = 0.25
    TRAINING_STABILITY_SECONDS: int = 8
    TRAINING_STABILITY_RADIUS_PX: int = 20
    LIVE_OCCUPIED_SECONDS_REQUIRED: int = 2
    LIVE_AWAY_TRANSITION_SECONDS: int = 3
    LIVE_AVAILABLE_TIMEOUT_SECONDS: int = 60

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()