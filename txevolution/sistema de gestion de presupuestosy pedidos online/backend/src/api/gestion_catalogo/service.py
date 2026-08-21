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
            raise HTTPException(status_code=500, detail=f"Error al obtener proyectos: {str(e)}")

    @staticmethod
    async def procesar_y_subir_imagen(file: UploadFile) -> str:
        try:
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
        except Exception as e:
            print(f"❌ Error al procesar/subir imagen: {str(e)}")
            raise HTTPException(status_code=400, detail=f"No se pudo procesar la imagen: {str(e)}")

    @staticmethod
    def crear_proyecto(proyecto_data: dict, profile_id: str):
        """
        Crea un nuevo proyecto asegurando que la base de datos genere el ID
        y asociándolo al usuario autenticado (profile_id).
        """
        try:
            # Limpiamos por si por error viene un 'id' en el diccionario
            proyecto_data.pop("id", None)
            
            # Asignamos el ID del usuario real que viene por parámetro (ej. desde el token JWT)
            proyecto_data["profile_id"] = profile_id

            if "estado" not in proyecto_data or proyecto_data["estado"] in [True, "activo"]:
                proyecto_data["estado"] = "activo"

            response = supabase.table("proyectos").insert(proyecto_data).execute()
            
            if not response.data:
                raise Exception("No se pudo registrar el proyecto en la base de datos.")
                
            return response.data[0]
        except Exception as e:
            print(f"❌ Error en CatalogoService al crear: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error al crear el proyecto: {str(e)}")

    @staticmethod
    def actualizar_proyecto(proyecto_id: int, datos_actualizados: dict, profile_id: str):
        """
        Actualiza un proyecto existente validando que pertenezca al usuario (opcional pero recomendado)
        y omitiendo campos sensibles como el id en el cuerpo.
        """
        try:
            # Filtramos nulos y eliminamos el 'id' si por error venía en el body
            datos_filtrados = {k: v for k, v in datos_actualizados.items() if v is not None}
            datos_filtrados.pop("id", None)

            # Manejo amigable de booleanos si el frontend manda True/False para el estado
            if "estado" in datos_filtrados:
                if datos_filtrados["estado"] is True:
                    datos_filtrados["estado"] = "activo"
                elif datos_filtrados["estado"] is False:
                    datos_filtrados["estado"] = "inactivo"

            # Opcional: Aseguramos la propiedad del registro actualizando también el profile_id si corresponde
            datos_filtrados["profile_id"] = profile_id

            response = (
                supabase.table("proyectos")
                .update(datos_filtrados)
                .eq("id", proyecto_id)
                .execute()
            )
            
            if not response.data:
                raise HTTPException(status_code=404, detail=f"No se encontró el registro con ID {proyecto_id} para modificar.")
                
            return response.data[0]
        except HTTPException as he:
            raise he
        except Exception as e:
            print(f"❌ Error en CatalogoService al actualizar: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error en Supabase (Actualizar): {str(e)}")

    @staticmethod
    def eliminar_proyecto_db(proyecto_id: int):
        try:
            response = (
                supabase.table("proyectos")
                .update({"estado": "inactivo"})
                .eq("id", int(proyecto_id))
                .execute()
            )
            
            if not response.data:
                raise HTTPException(status_code=404, detail=f"No se encontró el proyecto con ID {proyecto_id}.")
                
            return {"status": "success", "message": "Proyecto dado de baja en el catálogo"}
        except HTTPException as he:
            raise he
        except Exception as e:
            print(f"❌ Error crítico en CatalogoService al eliminar: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error al procesar el borrado lógico: {str(e)}")

    @staticmethod
    def eliminar_foto_storage(nombre_archivo_storage: str):
        try:
            supabase.storage.from_(BUCKET_NAME).remove([nombre_archivo_storage])
        except Exception as e:
            print(f"❌ Error al eliminar archivo en el Storage: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error al eliminar imagen del storage: {str(e)}")