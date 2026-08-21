from fastapi import APIRouter

from .proyecto import router as proyecto_router
from .categoria import router as categoria_router
from .detalle import router as detalle_router
from .media import router as media_router

router = APIRouter()

router.include_router(proyecto_router)
router.include_router(categoria_router)
router.include_router(detalle_router)
router.include_router(media_router)

__all__ = ["router"]