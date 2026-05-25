# app/apps/auth/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# 1. ESQUEMA DE ENTRADA: Lo que el usuario envía para loguearse
# Este es el que te estaba dando el AttributeError
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# 2. ESQUEMA DE REGISTRO: Para crear nuevos usuarios
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

# 3. ESQUEMA DE SALIDA: Lo que enviamos después del login exitoso
# (El que pedía el router_admin y router_client)
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

# 4. ESQUEMA DE INFORMACIÓN: Datos del perfil del usuario
class UserResponse(BaseModel):
    id: str
    email: str
    role: str

    class Config:
        from_attributes = True