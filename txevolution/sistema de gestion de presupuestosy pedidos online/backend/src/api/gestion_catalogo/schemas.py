from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProyectoCreate(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    estado: Optional[str] = "activo"

class ProyectoUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    estado: Optional[str] = None

# --- NUEVO ESQUEMA PARA EL GET (RESPUESTA) ---
class ProyectoResponse(BaseModel):
    id: int
    titulo: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    estado: Optional[str] = None
    
    class Config:
        from_attributes = True  # Permite mapear modelos de SQLModel/ORM directamente a este esquema