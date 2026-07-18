from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, Relationship, SQLModel
# Importamos las clases para que Python entienda las llaves foráneas
from app.apps.auth.models.usuario import Usuario
from app.apps.auth.models.rol import Rol

class UserProfile(SQLModel, table=True):
    __tablename__ = "perfiles"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # 🔑 CLAVES FORÁNEAS (FK): Conexión agnóstica entre archivos
    usuario_id: int = Field(foreign_key="usuarios.id", unique=True, nullable=False)
    rol_id: int = Field(foreign_key="roles.id", default=2, nullable=False) 
    
    correo_electronico: str #evita restrinciones de correo con min y max
    full_name: Optional[str] = None#le dice al fastapi que este campo es obligatorio
    foto: Optional[str] = None # URL de la imagen sin límites rígidos
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    usuario: Usuario = Relationship(back_populates="perfil")
    rol: Rol = Relationship(back_populates="perfiles")
