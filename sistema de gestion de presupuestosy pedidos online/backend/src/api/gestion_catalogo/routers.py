from fastapi import APIRouter, HTTPException, UploadFile, File, status
from .models import ProyectoData
from .service import CatalogoService

router = APIRouter(tags=["Gestión de Catálogo y Vitrina"])

@router.post("/upload-imagen")
async def subir_imagen_a_vitrina(file: UploadFile = File(...)):
    try:
        url_publica = await CatalogoService.procesar_y_subir_imagen(file)
        return {"fotoUrl": url_publica}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en el banco de imágenes de TXevolution: {str(e)}"
        )

@router.post("/proyectos")
async def guardar_o_actualizar_vitrina(proyecto: ProyectoData):
    try:
        datos_guardados = CatalogoService.consolidar_proyecto(proyecto.model_dump())
        return {
            "status": "success", 
            "message": "Datos de vitrina consolidados", 
            "data": datos_guardados
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en la base de datos de TXevolution: {str(e)}"
        )