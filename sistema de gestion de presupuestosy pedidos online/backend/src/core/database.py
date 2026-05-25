# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Crear el motor de conexión
engine = create_engine(settings.DATABASE_URL)

# Crear la fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para los modelos (User, Proyecto, Insumo)
Base = declarative_base()

# Dependencia para los routers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()