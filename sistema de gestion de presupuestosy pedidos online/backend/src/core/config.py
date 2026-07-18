# src/core/config.py
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Portal Gestión Cuero"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    
    # =========================================================================
    # ⚡ LA LÍNEA FALTA: Le enseñamos a tu objeto settings a leer la URL agnóstica
    # =========================================================================
    DATABASE_URL: str = os.getenv("DATABASE_URL")

settings = Settings()

# Se mantiene tu instancia global intacta para los módulos que aún la necesiten
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
