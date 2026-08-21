import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles

# 1. CARGAR CONFIGURACIÓN CENTRAL
from src.core.config import settings, supabase

# Carga de modelos para registrar tablas en SQLAlchemy/SQLModel (evita importación circular)
import src.api.auth.models

allow_origins = ["http://localhost:5173", "https://pdxqgg-5173.csb.app"]

# 2. INICIALIZACIÓN ÚNICA DE LA APP
app = FastAPI(title="API Catálogo Calzados C3", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 NUEVO: Crear la carpeta estática si no existe y montarla en la aplicación
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# 3. IMPORTACIÓN Y MONTAJE DE ROUTERS
from src.api.router import api_router, auth_router

app.include_router(api_router)
app.include_router(auth_router)


@app.get("/health", tags=["Infraestructura"])
def health_check():
    try:
        supabase.table("perfiles").select("id").limit(1).execute()
        return {"status": "online", "database": "connected"}
    except Exception as e:
        return {"status": "online", "database": "error", "details": str(e)}

# =================================================================
# 🔐 CONFIGURACIÓN DE SEGURIDAD OPENAPI (Swagger)
# =================================================================


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Portal Gestión Cuero - TXevolution",
        version="1.0.0",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "Authorization": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Escribe: Bearer TU_TOKEN"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            if "/login" not in method.get("summary", "").lower():
                method["security"] = [{"Authorization": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

# 🕵️‍♀️ VERIFICACIÓN DE CONFIGURACIÓN EN CONSOLA
print("--- VERIFICACIÓN DE CONFIGURACIÓN EN TIEMPO REAL ---")
print(f"PROYECTO: {settings.PROJECT_NAME}")
print(f"URL DETECTADA: {settings.SUPABASE_URL}")
print("-----------------------------------------------------")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)