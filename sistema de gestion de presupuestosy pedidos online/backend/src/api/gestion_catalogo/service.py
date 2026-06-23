import os
import time
from io import BytesIO
from PIL import Image
from fastapi import UploadFile
from src.core.config import supabase  # Tu cliente único

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
        return supabase.storage.from_(BUCKET_NAME).get_public_url(
            nombre_unico_webp
        )

    @staticmethod
    def consolidar_proyecto(proyecto_dict: dict):
        response = supabase.table("proyectos").upsert(proyecto_dict).execute()
        return response.data

    @staticmethod
    def obtener_todos_los_proyectos():
        try:
            # Extrae los datos activos (Filtro de borrado lógico)
            response = (
                supabase.table("proyectos")
                .select("*")
                .eq("activo", True)
                .order("created_at", descending=True)
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"❌ Error en CatalogoService al obtener: {str(e)}")
            raise e

    # 🚀 NUEVO: Método para actualizar los datos de un proyecto
    @staticmethod
    def actualizar_proyecto(proyecto_id: str, datos_actualizados: dict):
        try:
            response = (
                supabase.table("proyectos")
                .update(datos_actualizados)
                .eq("id", proyecto_id)
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"❌ Error en CatalogoService al actualizar: {str(e)}")
            raise e

    # 🚀 NUEVO: Método para eliminar físicamente la foto del Storage
    @staticmethod
    def eliminar_foto_storage(nombre_archivo_storage: str):
        try:
            # Remueve el archivo del bucket usando su nombre único .webp
            supabase.storage.from_(BUCKET_NAME).remove(
                [nombre_archivo_storage])
        except Exception as e:
            print(f"❌ Error al eliminar archivo en el Storage: {str(e)}")
            raise e

    # 🚀 NUEVO: Método para eliminar el registro de la Base de Datos
    @staticmethod
    def eliminar_proyecto_db(proyecto_id: str):
        try:
            # Si usas borrado físico (eliminar la fila por completo):
            response = (
                supabase.table("proyectos")
                .delete()
                .eq("id", proyecto_id)
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"❌ Error en CatalogoService al eliminar DB: {str(e)}")
            raise e
