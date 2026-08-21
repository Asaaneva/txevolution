from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.core.database import get_session
from src.api.gestion_catalogo.models.proyecto import Proyecto
from ..models.proyecto import Proyecto, ProyectoCreate
router = APIRouter(prefix="/api/proyectos", tags=["Proyectos y Catálogo"])
__all__ = ["router"]

@router.post("/", response_model=Proyecto)
def crear_proyecto(
    # 2. Cambia la anotación aquí: usa ProyectoCreate en vez de Proyecto
    proyecto_in: ProyectoCreate, 
    session: Session = Depends(get_session)
):
    # Convertimos el esquema de entrada al modelo de base de datos
    db_proyecto = Proyecto.model_validate(proyecto_in)
    
    session.add(db_proyecto)
    session.commit()
    session.refresh(db_proyecto)
    return db_proyecto

@router.get("/", response_model=List[Proyecto])
def listar_proyectos(session: Session = Depends(get_session)):
    statement = select(Proyecto)
    return session.exec(statement).all()

@router.get("/{proyecto_id}", response_model=Proyecto)
def obtener_proyecto(proyecto_id: int, session: Session = Depends(get_session)):
    proyecto = session.get(Proyecto, proyecto_id)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return proyecto