# src/api/router.py
from fastapi import APIRouter
from src.api.auth.router_admin import router as auth_admin
from src.api.auth.router_client import router as auth_client
from src.api.gestion_catalogo.routers import router as catalogo_router

# 1. Enrutador para la API general (Mantiene /api/proyectos y /api/upload-imagen)
api_router = APIRouter(prefix="/api")
api_router.include_router(catalogo_router) 

# 2. Enrutador raíz para mantener la compatibilidad absoluta con React
auth_router = APIRouter()
auth_router.include_router(auth_client, prefix="/api/auth", tags=["Auth Cliente"])
auth_router.include_router(auth_admin, tags=["Admin Privado"]) # 🚀 SIN PREFIX para que /login sea directo
