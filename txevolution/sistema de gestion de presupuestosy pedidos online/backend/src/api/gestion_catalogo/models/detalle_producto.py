from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .proyecto import Proyecto

class DetalleProducto(SQLModel, table=True):
    __tablename__ = "detalle_productos"  # El nombre real de tu tabla en Supabase

    id: Optional[int] = Field(default=None, primary_key=True)
    proyecto_id: int = Field(foreign_key="proyectos.id", nullable=False)
    nombre: str = Field(nullable=False)
    modelo: Optional[str] = Field(default=None)
    descripcion: Optional[str] = Field(default=None)

    # Relación de vuelta hacia el proyecto
    proyecto: Optional["Proyecto"] = Relationship(back_populates="detalles_productos")