# src/api/auth/router_admin.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.core.database import get_db
from src.api.auth.schemas import UsuarioLogin
from src.api.auth.service import AuthService
from src.api.auth.dependencies import crear_token_acceso, ExigirRol

router = APIRouter()
auth_service = AuthService()

# 👑 EL ADMIN SOLO INICIA SESIÓN
@router.post("/login", status_code=status.HTTP_200_OK)
def login_administrador(datos: UsuarioLogin, db: Session = Depends(get_db)):
    try:
        perfil = auth_service.verificar_credenciales_internas(db, datos.correo_electronico, datos.contrasena, crear_token_acceso)
        
        # 🔒 VALIDACIÓN DE ACTOR: Si un Cliente intenta meterse al login directo del Admin, rebota
        if perfil["user"]["rol"] != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso denegado: Credenciales no autorizadas para el panel de administración."
            )
        return perfil
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

# 👑 DASHBOARD PRIVADO DEL ADMIN
@router.get("/dashboard", status_code=status.HTTP_200_OK)
def ver_dashboard_admin(usuario_actual: dict = Depends(ExigirRol(["ADMIN"]))):
    return {"message": "Bienvenido al Panel de Control de Cuero, Artesano Principal."}
