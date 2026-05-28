# 1. TRUCO DE INYECCIÓN: Forzamos la carga del entorno en la primera línea.
# El formateador de CodeSandbox no puede mover esto porque está en una sola línea combinada.
__import__('dotenv').load_dotenv(); import os

# Ahora sí, el formateador puede ordenar el resto como quiera, el entorno ya está cargado
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from supabase import create_client, Client
from src.api.auth.dependencies import role_admin_required
from src.api.auth.router_admin import router as auth_admin
from src.api.auth.router_client import router as auth_client
from src.core.config import settings

# 2. INICIALIZACIÓN DE LA APP
app = FastAPI(title=settings.PROJECT_NAME)

# 3. LEER LA URL DE CODESANDBOX DESDE ENTORNO
# Recomiendo usar la variable de entorno, pero si la dejas fija, usa el código de abajo
frontend_dinamico = os.environ.get("FRONTEND_URL", "https://qzt382-5173.csb.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_dinamico,          # URL limpia (SIN el "/login" al final)
        "http://localhost:5173",    # Corregido: Localhost usa http, no https por defecto en Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        response = supabase.table("perfiles").select("id").limit(1).execute()
        return {"status": "online", "database": "connected (via API)"}
    except Exception as e:
        return {"status": "online", "database": "error", "details": str(e)}


# Rutas de Cliente
app.include_router(auth_client, prefix="/api/auth", tags=["Auth Cliente"])

# Rutas de Admin (Tu portal interno de gestión)
app.include_router(
    auth_admin,
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
