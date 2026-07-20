# src/api/auth/service.py
from sqlmodel import Session, select
from passlib.context import CryptContext
from src.api.auth.models.usuario import Usuario

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    
    # ---------------------------------------------------------------------
    # RESPONSABILIDAD ÚNICA: Crear estrictamente las CREDENCIALES de acceso
    # ---------------------------------------------------------------------
    def registrar_credenciales(self, db: Session, correo: str, contrasena_plana: str) -> Usuario:
        # 1. Verificación básica de seguridad
        usuario_existe = db.execute(
            select(Usuario).where(Usuario.correo_electronico == correo)
        ).scalar()

        if usuario_existe:
            raise CorreoDuplicadoException()

        # 2. Encriptación pura
        hash_seguro = pwd_context.hash(contrasena_plana)
        
        nuevo_usuario = Usuario(
            correo_electronico=correo,
            contrasena_hash=hash_seguro
        )
        db.add(nuevo_usuario)
        db.flush() # Entrega el ID generado para que otros módulos lo usen
        return nuevo_usuario

    # ---------------------------------------------------------------------
    # RESPONSABILIDAD ÚNICA: Validar identidades (Login)
    # ---------------------------------------------------------------------
    def verificar_identidad(self, db: Session, correo: str, contrasena_plana: str) -> Usuario:
        usuario_bd = db.execute(
            select(Usuario).where(Usuario.correo_electronico == correo)
        ).scalar()
        
        if not usuario_bd:
            raise UsuarioNoRegistradoException() 

        if not pwd_context.verify(contrasena_plana, usuario_bd.contrasena_hash):
            raise ContrasenaIncorrectaException() 

        return usuario_bd # Retorna el usuario autenticado

