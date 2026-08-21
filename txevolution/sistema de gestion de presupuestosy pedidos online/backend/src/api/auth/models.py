from typing import Optional
from sqlalchemy import Column, String, Enum
import enum
from src.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"      # El Artesano
    CLIENT = "CLIENT"    # El Solicitante

class UserProfile(Base):
    __tablename__ = "profiles" # La tabla en Supabase

    # 🚀 Agregamos la anotación de tipo `: str`, `: UserRole`, etc. en cada campo
    id: str = Column(String, primary_key=True)
    email: str = Column(String, unique=True, nullable=False)
    full_name: Optional[str] = Column(String, nullable=True)
    role: UserRole = Column(Enum(UserRole), default=UserRole.CLIENT)