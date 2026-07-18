# app/apps/auth/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# =========================================================================
# 1. ESQUEMA DE REGISTRO PÚBLICO (Contrato de Entrada)
#    Define los datos exactos que el formulario de React enviará al servidor.
# =========================================================================
class UsuarioRegistro(BaseModel):
    correo_electronico: EmailStr  # Valida sintaxis de email (ej: usuario@correo.com)
    contrasena: str               # Contraseña en texto plano que digita el usuario
    full_name: str
    foto: Optional[str] = None    # URL de la imagen del perfil (opcional)


# =========================================================================
# 2. ESQUEMA DE LOGIN (Contrato de Acceso)
#    Datos estrictos requeridos para cruzar la puerta de seguridad.
# =========================================================================
class UsuarioLogin(BaseModel):
    correo_electronico: EmailStr
    contrasena: str


# =========================================================================
# 3. ESQUEMA DE ACTUALIZACIÓN DE PERFIL (Sección Privada)
#    Campos que el usuario tiene permitido modificar desde su cuenta.
# =========================================================================
class PerfilActualizar(BaseModel):
    full_name: Optional[str] = None
    foto: Optional[str] = None    # Permite cambiar la URL de su foto de perfil


# =========================================================================
# 4. ESQUEMA DE RESPUESTA DE PERFIL (Contrato de Salida / Seguridad)
#    Garantiza que el servidor NUNCA filtre la contraseña en las respuestas.
# =========================================================================
class PerfilRespuesta(BaseModel):
    id: int                       # El ID único del perfil
    usuario_id: int               # Vinculación física con la cuenta
    rol_id: int                   # Indica dinámicamente si es ADMIN (1), CLIENT (2) o VENDEDOR (3)
    correo_electronico: EmailStr
    full_name: Optional[str] = None
    foto: Optional[str] = None

    class Config:
        # Habilita a Pydantic para leer y transformar los objetos del ORM (SQLModel) de forma directa
        from_attributes = True 

