from fastapi import APIRouter, HTTPException, UploadFile, File, status
from typing import List, Any
from .models import ProyectoData
from .service import CatalogoService

router = APIRouter(tags=["Gestión de Catálogo y Vitrina"])


# --- 1. OBTENER TODOS LOS PROYECTOS (LISTAR) ---
@router.get("/proyectos", response_model=List[Any])
def listar_todos_los_proyectos():  # Síncrono para acoplarse al cliente síncrono de Supabase
    try:
        proyectos = CatalogoService.obtener_todos_los_proyectos()
        return proyectos
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener los proyectos: {str(e)}"
        )


# --- 2. SUBIR IMAGEN ---
@router.post("/upload-imagen")
# Mantiene async porque usa await file.read()
async def subir_imagen_a_vitrina(file: UploadFile = File(...)):
    try:
        url_publica = await CatalogoService.procesar_y_subir_imagen(file)
        return {"fotoUrl": url_publica}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error banco imágenes TXevolution: {str(e)}"
        )


# --- 3. CREAR PROYECTO (POST) ---
@router.post("/proyectos") # ◄ IMPORTANTE: Asegúrate de que NO tenga 'response_model=ProyectoData'
def guardar_o_actualizar_vitrina(proyecto: ProyectoData):
    try:
        datos_guardados = CatalogoService.consolidar_proyecto(
            proyecto.model_dump()
        )
        # Retornamos el objeto directo. FastAPI lo procesará como JSON libre
        return {
            "status": "success",
            "message": "Datos de vitrina consolidados con éxito",
            "data": datos_guardados
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error base de datos TXevolution: {str(e)}"
        )


# --- 4. ACTUALIZAR / EDITAR PROYECTO (PUT) ---
@router.put("/proyectos/{proyecto_id}") # ◄ IMPORTANTE: Asegúrate de que NO tenga 'response_model=ProyectoData'
def actualizar_proyecto_vitrina(proyecto_id: int, proyecto: ProyectoData):
    try:
        datos_actualizados = CatalogoService.actualizar_proyecto(
            proyecto_id, proyecto.model_dump()
        )
        return {
            "status": "success",
            "message": "Proyecto actualizado con éxito",
            "data": datos_actualizados
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar proyecto: {str(e)}"
        )




# --- 5. ELIMINAR PROYECTO (CAMBIADO A @router.delete PARA TU REACT) ---
# Modificado a @router.delete para que coincida exactamente con el fetch de tu React
@router.delete("/proyectos/{proyecto_id}") 
def eliminar_proyecto_vitrina(proyecto_id: int): # ◄ Usamos int y delete
    try:
        CatalogoService.eliminar_proyecto_db(proyecto_id)
        return {
            "status": "success",
            "message": "Proyecto dado de baja correctamente (Auditoría protegida)"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar la baja en TXevolution: {str(e)}"
        )
