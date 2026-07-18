from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, Relationship, SQLModel

class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    correo_electronico: str = Field(unique=True, index=True)
    contrasena_hash: str # Almacena el hash de 60 caracteres
    creado_en: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    perfil: Optional["UserProfile"] = Relationship(back_populates="usuario")
