from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.orm import sessionmaker
from .config import settings

# 1. Exportamos Base para los modelos que hacen 'from src.core.database import Base'
Base = SQLModel

# 2. Pool blindado de conexiones
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,          # 🔌 Limita el tamaño del pool para conexiones hogareñas
    max_overflow=0,       # 🚫 Evita conexiones secundarias infinitas en INSERTs
    pool_pre_ping=True,   # 🔄 Verifica si el canal está vivo antes de mandar datos
    pool_recycle=180      # Reutiliza y refresca conexiones muertas cada 3 minutos
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🛑 IMPORTANTE: Se eliminó 'import src.api.auth.models' de aquí para romper el ciclo de importación.

# 3. Generador de sesiones para FastAPI (usado por proyecto.py)
def get_session():
    with Session(engine) as session:
        yield session

# Alias por si algún endpoint tuyo usa get_db en lugar de get_session
get_db = get_session