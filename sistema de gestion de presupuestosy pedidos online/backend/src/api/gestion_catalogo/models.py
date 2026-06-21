from pydantic import BaseModel
from typing import Optional

class ProyectoData(BaseModel):
    profile_id: str
    destino: str
    nombre: Optional[str] = None
    modelo: Optional[str] = None
    descripcion: Optional[str] = None
    foto_url: str
    tipo_articulo: Optional[str] = None
    subcategoria: Optional[str] = None