import os
from pydantic_settings import BaseSettings
from dotenv import load_file

# Cargamos el archivo .env explícitamente
load_dotenv()

class Settings(BaseSettings):
    # Pydantic mapea y valida que las variables existan con el tipo correcto
    ENV: str = os.getenv("ENV", "development")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    ADMIN_ALLOWED_DOMAIN: str = os.getenv("ADMIN_ALLOWED_DOMAIN", "c3.com")

    class Config:
        env_file = ".env"

# Instancia global para usar en tus rutas de autenticación
settings = Settings()