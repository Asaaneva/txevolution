from pydantic import BaseModel
from typing import Optional

class ProyectoData(BaseModel):
    profile_id: Optional[str] = None
    destino: str
    nombre: Optional[str] = None
    modelo: Optional[str] = None
    descripcion: Optional[str] = None
    foto_url: str
    tipo_articulo: Optional[str] = None
    subcategoria: Optional[str] = None
    genero: Optional[str] = None
    clasificacion_calzado: Optional[str] = None
    # 🚨 CORREGIDO: Cambia bool por str para que acepte "activo" o "inactivo"
    estado: Optional[str] = "activo"  
# 🌟 Configurado como booleano por defecto

    class Config:
        from_attributes = True
