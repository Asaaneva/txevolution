# src/api/auth/router_client.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.core.database import get_db
from src.api.auth.schemas import UsuarioRegistro
from src.api.auth.models.perfil import UserProfile # Importamos el modelo del perfil

router = APIRouter()

# 🛒 EL CLIENTE SE REGISTRA (Sincronizado con la Arquitectura Limpia)
@router.post("/registro", status_code=status.HTTP_201_CREATED)
def registrar_cliente(datos: UsuarioRegistro, db: Session = Depends(get_db)):
    # Importación local para evitar el bucle circular de Docker
    from src.api.auth.service import AuthService
    auth_service = AuthService()
    
    try:
        # 1. 🔑 RESPONSABILIDAD DE AUTH: Registramos estrictamente las credenciales
        # Cambiamos el nombre de la función al nuevo método purificado
        nuevo_usuario = auth_service.registrar_credenciales(
            db=db, 
            correo=datos.correo_electronico, 
            contrasena_plana=datos.contrasena
        )
        
        # 2. 👤 RESPONSABILIDAD DE NEGOCIO: Creamos su perfil de forma desacoplada
        # El servicio de auth ya hizo su flush y nos dio el ID automático
        nuevo_perfil = UserProfile(
            usuario_id=nuevo_usuario.id,
            rol_id=2, # Cliente por defecto
            correo_electronico=datos.correo_electronico,
            full_name=datos.full_name,
            foto=None # La foto nace vacía, se edita después en su propio módulo
        )
        db.add(nuevo_perfil)
        db.commit() # Sellamos la operación atómica
        db.refresh(nuevo_usuario)
        
        return {"message": "Usuario y perfil creados con éxito bajo principios SRP"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

