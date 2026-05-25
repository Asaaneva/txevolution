# app/core/config.py
import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Calculamos la ruta al archivo .env (subiendo desde src/core/ hasta backend/)
# Si tu estructura es backend/src/core/config.py, subimos 3 niveles:
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    # Configuración de Pydantic para leer el archivo automáticamente
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding='utf-8',
        extra='ignore' # Ignora variables extra en el .env que no usemos aquí
    )

    PROJECT_NAME: str = " Sistema de presuspuesto de proyectos y pedidos online"
    
    # Supabase (Pydantic buscará automáticamente SUPABASE_URL en el .env)
    SUPABASE_URL: str
    SUPABASE_KEY: str
    DATABASE_URL: str
    
    # Seguridad (JWT)
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Lógica de Negocio (Con valor por defecto por si no está en el .env)
    BUDGET_VALIDITY_DAYS: int = 30

# Instanciamos una sola vez
settings = Settings()

# Instancia global
settings = Settings()