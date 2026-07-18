# src/api/auth/dependencies.py
import os
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

# =========================================================================
# 🔑 LEER TU ARCHIVO .ENV (Con tus nombres exactos de variables)
# =========================================================================
SECRET_KEY = os.getenv("secret_key") # Lee tu "sistema de gestión de presupuesto"
ALGORITHM = "HS256"

# Leemos tus 30 minutos. Si os.getenv devuelve texto, lo convertimos a entero (int)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Indica a FastAPI dónde buscar el token en las cabeceras HTTP
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


# =========================================================================
# ⚡ TU FUNCIÓN DE TOKENS (La que Docker no encontraba)
# =========================================================================
def crear_token_acceso(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# =========================================================================
# 🛡️ EL GUARDIÁN BASE (Identificación del Actor)
# =========================================================================
def obtener_usuario_actual(token: str = Depends(oauth2_scheme)) -> dict:
    credenciales_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Sesión inválida o expirada. Inicie sesión nuevamente.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Descodificamos el token usando tu clave secreta del .env
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id: str = payload.get("sub")
        usuario_rol: str = payload.get("rol")
        
        if usuario_id is None or usuario_rol is None:
            raise credenciales_exception
            
        return {"id": int(usuario_id), "rol": usuario_rol}
    except jwt.PyJWTError:
        raise credenciales_exception


# =========================================================================
# 👥 EL FILTRO DE DASHBOARDS (Control de Accesos Cruzados)
# =========================================================================
class ExigirRol:
    def __init__(self, roles_permitidos: list[str]):
        self.roles_permitidos = roles_permitidos

    def __call__(self, usuario_actual: dict = Depends(obtener_usuario_actual)) -> dict:
        if usuario_actual["rol"] not in self.roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado: Tu rol de {usuario_actual['rol']} no está autorizado aquí."
            )
        return usuario_actual

