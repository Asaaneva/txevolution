# app/apps/auth/services.py
from sqlmodel import Session, select
from passlib.context import CryptContext
from src.api.auth.models.usuario import Usuario
from src.api.auth.models.perfil import UserProfile


# 🔐 PATRÓN DE ENCRIPTACIÓN: Configuramos Bcrypt para el manejo de Hashes seguros
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================================================================
# 1. EXCEPCIONES DE DOMINIO (Garantizan la separación de responsabilidades)
#    El servicio NO usa códigos HTTP. Lanza estas alertas limpias de Python.
# =========================================================================
class AuthException(Exception):
    """Excepción base para fallos lógicos del módulo de autenticación"""
    pass

class CorreoDuplicadoException(AuthException):
    """Lanzada cuando un cliente intenta registrar un email que ya existe"""
    def __init__(self, mensaje="El correo electrónico ya está registrado"):
        super().__init__(mensaje)

class UsuarioNoRegistradoException(AuthException):
    """Lanzada para mapear internamente tu criterio de error 404"""
    def __init__(self, mensaje="El correo electrónico no se encuentra registrado"):
        super().__init__(mensaje)

class ContrasenaIncorrectaException(AuthException):
    """Lanzada para mapear internamente tu criterio de error 401"""
    def __init__(self, mensaje="La contraseña ingresada es incorrecta"):
        super().__init__(mensaje)


# =========================================================================
# 2. CLASE DE SERVICIO: AUTHSERVICE (El cerebro agnóstico del Login)
# =========================================================================
class AuthService:
    
    # ---------------------------------------------------------------------
    # PATRÓN REPETITIVO 1: REGISTRO SEGURO Y AUTO-CREACIÓN DE FILA
    # ---------------------------------------------------------------------
    def registrar_nuevo_usuario(self, db: Session, correo: str, contrasena_plana: str, nombre: str, foto_url: str = None) -> Usuario:
        # A. Control de excepción preventiva: Evitamos colisiones de emails
        usuario_existe = db.exec(select(Usuario).where(Usuario.correo_electronico == correo)).first()
        if usuario_existe:
            raise CorreoDuplicadoException()

        try:
            # B. Encriptación segura de la contraseña mediante el Hash de Bcrypt
            hash_seguro = pwd_context.hash(contrasena_plana)
            
            # C. Inserción en la tabla de Autenticación (Equivalente a auth.users)
            nuevo_usuario = Usuario(
                correo_electronico=correo,
                contrasena_hash=hash_seguro
            )
            db.add(nuevo_usuario)
            db.flush() # ⚡ Genera el ID único en memoria RAM sin cerrar la transacción
            
            # D. AUTO-CREACIÓN: El servicio simula el Trigger e inserta la fila relacionada
            nuevo_perfil = UserProfile(
                usuario_id=nuevo_usuario.id,
                rol_id=2, # Restricción de negocio: Todos nacen como 'CLIENT' (id 2)
                correo_electronico=correo,
                full_name=nombre,
                foto=foto_url
            )
            db.add(nuevo_perfil)
            
            # E. Confirmamos la operación atómica en la Base de Datos
            db.commit()
            db.refresh(nuevo_usuario)
            return nuevo_usuario
            
        except Exception as e:
            db.rollback() # Si la BD falla (ej: sin conexión), limpia el disco duro y revierte todo
            raise AuthException("Fallo crítico en la persistencia del registro") from e

    # ---------------------------------------------------------------------
    # PATRÓN REPETITIVO 2: IDENTIFICACIÓN INTERNA DE ACTORES (LOGIN)
    # ---------------------------------------------------------------------
    def verificar_credenciales_internas(self, db: Session, correo: str, contrasena_plana: str) -> UserProfile:
        # A. CRITERIO 404: Buscamos al actor en la base de datos por su email
        usuario_bd = db.exec(select(Usuario).where(Usuario.correo_electronico == correo)).first()
        if not usuario_bd:
            raise UsuarioNoRegistradoException() # Avisa a las rutas que lance un 404

        # B. CRITERIO 401: Verificación criptográfica de la contraseña
        # Compara el texto plano que viene de React con el Hash guardado de forma segura
        if not pwd_context.verify(contrasena_plana, usuario_bd.contrasena_hash):
            raise ContrasenaIncorrectaException() # Avisa a las rutas que lance un 401

        # C. IDENTIFICACIÓN DEL ACTOR: Extraemos el perfil con su Rol dinámico del catálogo
        perfil_completo = usuario_bd.perfil
        
        # Retornamos el objeto completo. Las rutas leerán perfil_completo.rol.nombre
        # para saber si el actor es 'ADMIN' o 'CLIENT' y firmar el token con éxito (200)
        return perfil_completo

