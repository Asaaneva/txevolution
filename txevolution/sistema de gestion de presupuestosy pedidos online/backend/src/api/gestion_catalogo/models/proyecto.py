from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel

# 1. BASE: Campos que recibe/devuelve la entidad (sin ID ni relaciones)
class ProyectoBase(SQLModel):
    profile_id: str = Field(nullable=False)
    nombre: str = Field(nullable=False)  
    destino: str = Field(nullable=False)
    foto_url: str = Field(nullable=False)
    subcategoria: Optional[str] = Field(default=None)
    estado: Optional[str] = Field(default=None)
    seccion: Optional[str] = Field(default=None)


# 2. ENTRADA: Esquema usado en los POST (no pide ID en Swagger)
class ProyectoCreate(ProyectoBase):
    pass


# 3. TABLA DB: Modelo mapeado en PostgreSQL/Supabase (incluye ID y relaciones)
class Proyecto(ProyectoBase, table=True):
    __tablename__ = "proyectos"

    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relaciones (usan cadenas de texto para evitar importaciones circulares)
    categorias_atributos: List["CategoriaAtributo"] = Relationship(back_populates="proyecto")
    detalles_productos: List["DetalleProducto"] = Relationship(back_populates="proyecto")