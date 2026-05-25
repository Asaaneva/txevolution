from core.config import settings
print(f"Proyecto: {settings.PROJECT_NAME}")
print(f"DB URL: {settings.DATABASE_URL[:15]}...") # Solo el inicio por seguridad