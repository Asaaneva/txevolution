from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .proyecto import Proyecto

class CategoriaAtributo(SQLModel, table=True):
    __tablename__ = "categorias_atributos"

    id: Optional[int] = Field(default=None, primary_key=True)
    proyecto_id: int = Field(foreign_key="proyectos.id", nullable=False)
    clasificacion_articulo: Optional[str] = Field(default=None)
    genero: Optional[str] = Field(default=None)

    proyecto: Optional["Proyecto"] = Relationship(back_populates="categorias_atributos")