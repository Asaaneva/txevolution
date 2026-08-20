# src/core/config.py (o el archivo donde manejes tu configuración)
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Portal Gestión Cuero"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")

settings = Settings()

# 🚀 Instancia global única para toda la app
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)