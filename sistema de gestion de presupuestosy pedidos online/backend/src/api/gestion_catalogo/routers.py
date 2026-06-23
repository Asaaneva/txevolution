from fastapi import APIRouter, HTTPException, UploadFile, File, status, Body
from .models import ProyectoData
from .service import CatalogoService

router = APIRouter(tags=["Gestión de Catálogo y Vitrina"])


# --- 1. SUBIR IMAGEN ---
@router.post("/upload-imagen")
async def subir_imagen_a_vitrina(file: UploadFile = File(...)):
    try:
        url_publica = await CatalogoService.procesar_y_subir_imagen(file)
        return {"fotoUrl": url_publica}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error banco imágenes TXevolution: {str(e)}"
        )


# --- 2. CREAR PROYECTO ---
@router.post("/proyectos")
async def guardar_o_actualizar_vitrina(proyecto: ProyectoData):
    try:
        datos_guardados = CatalogoService.consolidar_proyecto(
            proyecto.model_dump()
        )
        return {
            "status": "success",
            "message": "Datos de vitrina consolidados",
            "data": datos_guardados
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error base de datos TXevolution: {str(e)}"
        )


# --- 3. ACTUALIZAR / EDITAR PROYECTO ---
@router.put("/proyectos/{proyecto_id}")
async def actualizar_proyecto_vitrina(
    proyecto_id: str, proyecto: ProyectoData
):
    try:
        datos_actualizados = CatalogoService.actualizar_proyecto(
            proyecto_id, proyecto.model_dump()
        )
        return {
            "status": "success",
            "message": "Proyecto actualizado",
            "data": datos_actualizados
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar proyecto: {str(e)}"
        )


# --- 4. ELIMINAR PROYECTO Y SU FOTO ---
@router.delete("/proyectos/{proyecto_id}")
async def eliminar_proyecto_vitrina(
    proyecto_id: str, nombre_archivo_storage: str = Body(..., embed=True)
):
    try:
        CatalogoService.eliminar_foto_storage(nombre_archivo_storage)
        CatalogoService.eliminar_proyecto_db(proyecto_id)
        return {
            "status": "success",
            "message": "Proyecto e imagen eliminados"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar en TXevolution: {str(e)}"
        )
