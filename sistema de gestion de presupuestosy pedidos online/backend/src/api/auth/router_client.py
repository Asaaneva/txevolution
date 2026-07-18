# src/api/auth/router_client.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.core.database import get_db
from src.api.auth.schemas import UsuarioRegistro, UsuarioLogin
from src.api.auth.service import AuthService
from src.api.auth.dependencies import crear_token_acceso

router = APIRouter()
auth_service = AuthService()

# 🛒 EL CLIENTE SE REGISTRA
@router.post("/registro", status_code=status.HTTP_201_CREATED)
def registrar_cliente(datos: UsuarioRegistro, db: Session = Depends(get_db)):
    try:
        return auth_service.registrar_nuevo_usuario(db, datos.correo_electronico, datos.contrasena, datos.full_name, datos.foto)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# 🛒 EL CLIENTE INICIA SESIÓN
@router.post("/login", status_code=status.HTTP_200_OK)
def login_cliente(datos: UsuarioLogin, db: Session = Depends(get_db)):
    try:
        # El servicio verifica internamente sus credenciales
        perfil = auth_service.verificar_credenciales_internas(db, datos.correo_electronico, datos.contrasena, crear_token_acceso)
        
        # 🔒 VALIDACIÓN DE ACTOR: Si un Admin intenta colarse por el login del cliente, lo frenamos
        if perfil["user"]["rol"] != "CLIENT":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso denegado: Este portal es exclusivo para clientes."
            )
        return perfil
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
