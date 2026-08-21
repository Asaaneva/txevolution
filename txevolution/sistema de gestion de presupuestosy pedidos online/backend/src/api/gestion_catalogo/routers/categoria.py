from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from src.core.database import get_session
from ..models.categoria_atributo import CategoriaAtributo

router = APIRouter(prefix="/api/categorias", tags=["Categorías y Atributos"])

# 1. Listar todas las categorías
@router.get("/", response_model=List[CategoriaAtributo])
def listar_categorias(session: Session = Depends(get_session)):
    statement = select(CategoriaAtributo)
    return session.exec(statement).all()

# 2. Crear una categoría vinculada a un proyecto
@router.post("/", response_model=CategoriaAtributo)
def crear_categoria(categoria: CategoriaAtributo, session: Session = Depends(get_session)):
    try:
        session.add(categoria)
        session.commit()
        session.refresh(categoria)
        return categoria
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=str(e))