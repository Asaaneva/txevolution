import os
import time
from io import BytesIO
from PIL import Image
from fastapi import UploadFile
from src.core.config import supabase  # Importamos el cliente único

BUCKET_NAME = "imagenes-productos"

class CatalogoService:
    @staticmethod
    async def procesar_y_subir_imagen(file: UploadFile) -> str:
        contenido_original = await file.read()
        
        # Compresión a WebP en memoria utilizando Pillow
        imagen_objeto = Image.open(BytesIO(contenido_original))
        buffer_webp = BytesIO()
        imagen_objeto.save(buffer_webp, format="WEBP", quality=80)
        buffer_webp.seek(0)
        
        nombre_base = os.path.splitext(file.filename)[0]
        nombre_unico_webp = f"{int(time.time())}_{nombre_base}.webp"
        
        # Subida al Storage de Supabase
        supabase.storage.from_(BUCKET_NAME).upload(
            path=nombre_unico_webp,
            file=buffer_webp.read(),
            file_options={"content-type": "image/webp"}
        )
        
        # Retornamos la URL pública definitiva
        return supabase.storage.from_(BUCKET_NAME).get_public_url(nombre_unico_webp)

    @staticmethod
    def consolidar_proyecto(proyecto_dict: dict):
        response = supabase.table("proyectos").upsert(proyecto_dict).execute()
        return response.data