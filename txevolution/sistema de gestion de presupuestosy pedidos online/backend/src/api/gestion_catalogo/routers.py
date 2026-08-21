from fastapi import APIRouter, HTTPException, UploadFile, File, status
from typing import List, Any

# ► Al estar todos en la misma carpeta, los puntos relativos nunca fallan:
from .models.proyecto import Proyecto
from .models.categoria_atributo import CategoriaAtributo
from .models.detalle_producto import DetalleProducto
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
@router.post("/proyectos")
# ◄ Usa el modelo Proyecto
def guardar_o_actualizar_vitrina(proyecto: Proyecto):
    try:
        datos_guardados = CatalogoService.consolidar_proyecto(
            proyecto.model_dump()
        )
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
@router.put("/proyectos/{proyecto_id}")
# ◄ Usa el modelo Proyecto
def actualizar_proyecto_vitrina(proyecto_id: int, proyecto: Proyecto):
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


# --- 5. ELIMINAR PROYECTO ---
@router.delete("/proyectos/{proyecto_id}")
def eliminar_proyecto_vitrina(proyecto_id: int):
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
