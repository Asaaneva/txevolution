from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
#
class Rol(SQLModel, table=True):
    __tablename__ = "roles"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True) # 'ADMIN', 'CLIENT', 'VENDEDOR'

    # Conexión con el archivo de perfiles
    perfiles: List["UserProfile"] = Relationship(back_populates="rol")
