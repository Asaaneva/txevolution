__import__('dotenv').load_dotenv();import os
from src.core.config import settings
from src.api.auth.router_client import router as auth_client
from src.api.auth.router_admin import router as auth_admin
from src.api.auth.dependencies import role_admin_required
from supabase import create_client, Client
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends



# 2. INICIALIZACIÓN DE LA APP
app = FastAPI(title=settings.PROJECT_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://verbose-dollop-5gx6q7rqg7x5h797-5173.app.github.dev",
                   "https://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. REGISTRO DE ROUTERS
app.include_router(auth_admin)
app.include_router(auth_client)

# --- 🕵️‍♀️ VERIFICACIÓN DE CONFIGURACIÓN ---
print("--- VERIFICACIÓN DE CONFIGURACIÓN ---")
print(f"PROYECTO: {settings.PROJECT_NAME}")
print(f"URL DETECTADA: {settings.SUPABASE_URL}")
key_val = str(settings.SUPABASE_KEY)
key_preview = key_val[:10] if key_val and key_val != "None" else "⚠️ VACÍO o ERROR"
print(f"KEY DETECTADA: {key_preview}...")
print("-------------------------------------")

# 3. RUTAS (Endpoints)

# Health Check: Test de conexión


@app.get("/health")
def health_check():
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        # Cambié "profiles" a "perfiles" que es tu tabla corregida
        response = supabase.table("perfiles").select("id").limit(1).execute()
        return {"status": "online", "database": "connected (via API)"}
    except Exception as e:
        return {"status": "online", "database": "error", "details": str(e)}


# Rutas de Cliente
app.include_router(auth_client, prefix="/api/auth", tags=["Auth Cliente"])

# Rutas de Admin (Tu portal interno de gestión)
app.include_router(
    auth_admin,
    prefix="/portal-interno-gestion-cuero",
    tags=["Admin Privado"]
)

# 4. CONFIGURACIÓN DE SEGURIDAD OPENAPI (Swagger)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Portal Gestión Cuero",
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

# 5. EJECUCIÓN
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
