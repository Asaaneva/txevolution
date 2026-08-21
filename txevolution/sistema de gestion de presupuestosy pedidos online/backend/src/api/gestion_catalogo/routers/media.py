import os
from io import BytesIO
from PIL import Image
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(prefix="/api/media", tags=["Archivos"])

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def subir_y_convertir_imagen(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Formato no soportado (usa JPG, PNG o WebP)")

    try:
        contenido = await file.read()
        imagen = Image.open(BytesIO(contenido))

        if imagen.mode in ("RGBA", "P"):
            imagen = imagen.convert("RGBA")
        else:
            imagen = imagen.convert("RGB")

        # Generar nombre del archivo WebP
        nombre_base = os.path.splitext(file.filename)[0]
        nombre_webp = f"{nombre_base}.webp"
        ruta_destino = os.path.join(UPLOAD_DIR, nombre_webp)

        # Convertir y guardar en disco
        imagen.save(ruta_destino, format="WEBP", quality=80, optimize=True)

        return {
            "mensaje": "Imagen convertida y subida correctamente",
            "foto_url": f"/static/uploads/{nombre_webp}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando la imagen: {str(e)}")