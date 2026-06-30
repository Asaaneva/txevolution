import os
import time
from io import BytesIO
from PIL import Image
from fastapi import UploadFile, HTTPException
from src.core.config import supabase  # Tu cliente único

BUCKET_NAME = "imagenes-productos"


class CatalogoService:

    @staticmethod
    def obtener_todos_los_proyectos():
        try:
            # 🟢 FILTRO DE CONTROL: Traemos solo los registros que NO estén inactivos
            response = (
                supabase.table("proyectos")
                .select("*")
                .eq("estado", "activo")
                .order("created_at", desc=True)
                .execute()
            )
            return response.data
        except Exception as e:
            print(f"❌ Error en CatalogoService al obtener: {str(e)}")
            raise e

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

        supabase.storage.from_(BUCKET_NAME).upload(
            path=nombre_unico_webp,
            file=buffer_webp.read(),
            file_options={"content-type": "image/webp"}
        )

        return supabase.storage.from_(BUCKET_NAME).get_public_url(nombre_unico_webp)

    @staticmethod
    def consolidar_proyecto(proyecto_dict: dict):
        if "estado" not in proyecto_dict or proyecto_dict["estado"] in [True, "activo"]:
            proyecto_dict["estado"] = "activo"
            
        # 🚀 Nuevo ID de pruebas asignado automáticamente para pasar el INSERT
        proyecto_dict["profile_id"] = "c1d8ed43-30f7-49c6-9c15-e5ce6035f310"
            
        response = supabase.table("proyectos").upsert(proyecto_dict).execute()
        return response.data

    @staticmethod
    def actualizar_proyecto(proyecto_id: int, datos_actualizados: dict):
        try:
            datos_filtrados = {k: v for k, v in datos_actualizados.items() if v is not None}
            if "id" in datos_filtrados:
                del datos_filtrados["id"]

            if "estado" in datos_filtrados:
                if datos_filtrados["estado"] is True:
                    datos_filtrados["estado"] = "activo"
                elif datos_filtrados["estado"] is False:
                    datos_filtrados["estado"] = "inactivo"

            # 🚀 Nuevo ID de pruebas asignado automáticamente para pasar el UPDATE
            datos_filtrados["profile_id"] = "c1d8ed43-30f7-49c6-9c15-e5ce6035f310"

            response = (
                supabase.table("proyectos")
                .update(datos_filtrados)
                .eq("id", proyecto_id)
                .execute()
            )
            
            if not response.data:
                raise Exception(f"No se encontró el registro con ID {proyecto_id} para modificar.")
                
            return response.data[0]
        except Exception as e:
            print(f"❌ Error en CatalogoService al actualizar: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error en Supabase (Actualizar): {str(e)}"
            )

    @staticmethod
    def eliminar_proyecto_db(proyecto_id: int):
        try:
            # 🟢 BORRADO LÓGICO SEGURO: Aprovechamos que la política 'ALL' permite updates de estado.
            # Pasamos la fila a 'inactivo' para resguardar el historial.
            response = (
                supabase.table("proyectos")
                .update({"estado": "inactivo"})
                .eq("id", int(proyecto_id))
                .execute()
            )
            return {"status": "success", "message": "Proyecto dado de baja en el catálogo"}
        except Exception as e:
            print(f"❌ Error crítico en CatalogoService al eliminar: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error en Supabase al procesar el borrado lógico: {str(e)}"
            )

    @staticmethod
    def eliminar_foto_storage(nombre_archivo_storage: str):
        try:
            supabase.storage.from_(BUCKET_NAME).remove([nombre_archivo_storage])
        except Exception as e:
            print(f"❌ Error al eliminar archivo en el Storage: {str(e)}")
            raise e