# app/core/database.py
from sqlmodel import create_engine, SQLModel  # ⚡ Usamos el motor agnóstico de SQLModel
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings  # Importa tu clase de configuraciones puras

# =========================================================================
# ⚡ CONEXIÓN DINÁMICA: Forzamos a Python a leer tu variable de entorno real
# =========================================================================
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # 🛡️ Verifica que la conexión no se caiga
    pool_recycle=300     # Cierra canales muertos cada 5 minutos
)

# Fábrica de sesiones vinculada al motor dinámico
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base por si tus otros módulos (Proyecto, Insumo) la necesitan
Base = declarative_base()

# Dependencia impecable para inyectar en tus rutas de FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

