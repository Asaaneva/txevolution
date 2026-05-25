# app/apps/auth/models.py
from sqlalchemy import Column, String, Enum
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"      # El Artesano
    CLIENT = "CLIENT"    # El Solicitante

class UserProfile(Base):
    __tablename__ = "profiles" # La tabla que creamos en Supabase

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)