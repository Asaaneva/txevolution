from fastapi import APIRouter

# 1. Importación limpia usando el prefijo src.api de manera consistente
from src.api.auth.router_admin import router as auth_admin
from src.api.auth.router_client import router as auth_client
from src.api.gestion_catalogo.routers import router as catalogo_router

# 2. Enrutador para la API general 
api_router = APIRouter(prefix="/api")

# Incluimos el router del catálogo (que ya agrupa proyecto, categoría y detalle)
api_router.include_router(catalogo_router)

# 3. Enrutador raíz para mantener la compatibilidad absoluta con React
auth_router = APIRouter()

auth_router.include_router(
    auth_client, prefix="/api/auth", tags=["Auth Cliente"]
)
# 🚀 SIN PREFIX para que /login sea directo
auth_router.include_router(auth_admin, tags=["Admin Privado"])