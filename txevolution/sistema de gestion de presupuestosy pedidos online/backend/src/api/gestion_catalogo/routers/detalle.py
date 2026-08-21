from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

# 🚀 CORRECCIÓN: Usar la ruta global del núcleo para la BD
from src.core.database import get_session
from ..models.detalle_producto import DetalleProducto

router = APIRouter(prefix="/api/detalles", tags=["Detalles de Productos"])

# 1. Listar todos los detalles
@router.get("/", response_model=List[DetalleProducto])
def listar_detalles(session: Session = Depends(get_session)):
    statement = select(DetalleProducto)
    return session.exec(statement).all()

# 2. Crear un detalle de producto
@router.post("/", response_model=DetalleProducto)
def crear_detalle(detalle: DetalleProducto, session: Session = Depends(get_session)):
    try:
        session.add(detalle)
        session.commit()
        session.refresh(detalle)
        return detalle
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# 3. Eliminar un detalle por su ID
@router.delete("/{detalle_id}")
def eliminar_detalle(detalle_id: int, session: Session = Depends(get_session)):
    detalle = session.get(DetalleProducto, detalle_id)
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    session.delete(detalle)
    session.commit()
    return {"message": "Detalle eliminado correctamente"}