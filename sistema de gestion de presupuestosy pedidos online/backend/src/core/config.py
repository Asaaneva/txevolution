# src/core/config.py
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Portal Gestión Cuero"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    DATABASE_URL: str = os.getenv("DATABASE_URL")

settings = Settings()

# 🕵️‍♀️ DIAGNÓSTICO EN TIEMPO REAL: Verás este cuadro en la consola de Docker
print("====================================================")
print(f"DEBUG DOCKER - URL CONEXIÓN: {settings.DATABASE_URL}")
print("====================================================")

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
