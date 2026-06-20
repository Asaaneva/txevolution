import os
import time
from io import BytesIO
from dotenv import load_dotenv

# 1. Cargar el entorno antes de importar 'settings' o inicializar Supabase
load_dotenv()

# =================================================================
# 2. LIBRERÍAS DE TERCEROS (FASTAPI, SUPABASE, PILLOW)
# =================================================================
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel
from typing import Optional
from PIL import Image  # Para la compresión a WebP
from supabase import create_client, Client

# =================================================================
# 3. MÓDULOS PROPIOS DE LA APLICACIÓN (TXevolution)
# =================================================================
from src.core.config import settings
from src.api.auth.router_client import router as auth_client
from src.api.auth.router_admin import router as auth_admin
from src.api.auth.dependencies import role_admin_required

# =================================================================
# 🔌 INICIALIZACIÓN DE LA APP Y INSTANCIA GLOBAL DE SUPABASE
# =================================================================
app = FastAPI(title=settings.PROJECT_NAME)

# 🔥 CORREGIDO: Cliente instanciado globalmente para que todos los endpoints lo usen
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 4. REGISTRO DE ROUTERS
app.include_router(auth_admin)
app.include_router(auth_client)

# 🕵️‍♀️ VERIFICACIÓN DE CONFIGURACIÓN
print("--- VERIFICACIÓN DE CONFIGURACIÓN ---")
print(f"PROYECTO: {settings.PROJECT_NAME}")
print(f"URL DETECTADA: {settings.SUPABASE_URL}")
key_val = str(settings.SUPABASE_KEY)
key_preview = key_val[:10] if key_val and key_val != "None" else "⚠️ VACÍO o ERROR"
print(f"KEY DETECTADA: {key_preview}...")
print("-------------------------------------")


# =================================================================
# 📑 ENDPOINTS / RUTAS DE LA APLICACIÓN
# =================================================================

# Health Check: Test de conexión rápida
@app.get("/health")
def health_check():
    try:
        # Usa el cliente global instanciado arriba
        response = supabase.table("perfiles").select("id").limit(1).execute()
        return {"status": "online", "database": "connected (via API)"}
    except Exception as e:
        return {"status": "online", "database": "error", "details": str(e)}

# Rutas de Autenticación y Gestión incorporadas
app.include_router(auth_client, prefix="/api/auth", tags=["Auth Cliente"])
app.include_router(
    auth_admin,
    prefix="/portal-interno-gestion-cuero",
    tags=["Admin Privado"]
)


# 📸 ENDPOINT: PROCESAR IMAGEN Y SUBIR A STORAGE (WEBP)
BUCKET_NAME = "imagenes-productos"

@app.post("/api/upload-imagen")
async def subir_imagen_a_vitrina(file: UploadFile = File(...)):
    try:
        contenido_original = await file.read()
        
        imagen_objeto = Image.open(BytesIO(contenido_original))
        buffer_webp = BytesIO()
        imagen_objeto.save(buffer_webp, format="WEBP", quality=80)
        buffer_webp.seek(0)
        
        nombre_base = os.path.splitext(file.filename)[0]
        nombre_unico_webp = f"{int(time.time())}_{nombre_base}.webp"
        
        # Sube usando de manera impecable el objeto global
        supabase.storage.from_(BUCKET_NAME).upload(
            path=nombre_unico_webp,
            file=buffer_webp.read(),
            file_options={"content-type": "image/webp"}
        )
        
        url_publica = supabase.storage.from_(BUCKET_NAME).get_public_url(nombre_unico_webp)
        return {"fotoUrl": url_publica}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el banco de imágenes: {str(e)}")


# 📑 ENDPOINT: GUARDAR DATOS DEL FORMULARIO (TABLA - RELACIÓN 1:1)
class ProyectoData(BaseModel):
    profile_id: str
    destino: str
    nombre: Optional[str] = None
    modelo: Optional[str] = None
    descripcion: Optional[str] = None
    foto_url: str
    tipo_articulo: Optional[str] = None
    subcategoria: Optional[str] = None

@app.post("/api/proyectos")
async def guardar_o_actualizar_vitrina(proyecto: ProyectoData):
    try:
        response = supabase.table("proyectos").upsert({
            "profile_id": proyecto.profile_id,
            "destino": proyecto.destino,
            "nombre": proyecto.nombre,
            "modelo": proyecto.modelo,
            "descripcion": proyecto.descripcion,
            "foto_url": proyecto.foto_url,
            "tipo_articulo": proyecto.tipo_articulo,
            "subcategoria": proyecto.subcategoria
        }).execute()
        
        return {"status": "success", "message": "Datos de vitrina consolidados", "data": response.data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {str(e)}")


# =================================================================
# 🔐 CONFIGURACIÓN DE SEGURIDAD OPENAPI (Swagger)
# =================================================================
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


# =================================================================
# 🚀 EJECUCIÓN (SIEMPRE AL FINAL ABSOLUTO DEL ARCHIVO)
# =================================================================
if __name__ == "__main__":
    import uvicorn
    # 🔥 CORREGIDO: Puerto configurado a 8080 para emparejarlo con tu React
    uvicorn.run("src.main:app", host="0.0.0.0", port=8080, reload=True)