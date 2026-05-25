from fastapi import Depends, HTTPException, status
from .service import supabase 
from fastapi.security import APIKeyHeader

# Configuración del esquema OAuth2
oauth2_scheme = APIKeyHeader(name="Authorization", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    EL PORTERO: Valida el JWT y extrae el usuario de Supabase.
    """
    try:
        # 1. Limpiamos el token por si acaso
        clean_token = token.replace("Bearer ", "")
        
        # 2. Validamos con Supabase Auth
        user_response = supabase.auth.get_user(clean_token)
        
        # 3. Manejo robusto de la respuesta (soporta diferentes versiones de la librería)
        user = user_response.user if hasattr(user_response, 'user') else user_response
        
        if not user:
            print("DEBUG: Supabase no devolvió un usuario válido.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado o sesión expirada"
            )
            
        return user
        
    except Exception as e:
        # Esto aparecerá en tu terminal de CodeSandbox si algo falla
        print(f"ERROR EN GET_CURRENT_USER: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error de autenticación: {str(e)}"
        )

async def role_admin_required(current_user = Depends(get_current_user)):
    """
    EL FILTRO: Verifica el rol ADMIN consultando la tabla 'public.profiles'.
    """
    try:
        # Consultamos la tabla profiles usando el ID del usuario autenticado
        # Usamos .single() porque el ID es llave primaria y solo habrá uno
        result = supabase.table("profiles").select("role").eq("id", current_user.id).single().execute()
        
        profile = result.data
        
        # Verificamos si el perfil existe y si el rol es exactamente ADMIN
        if not profile or profile.get("role") != "ADMIN":
            print(f"DEBUG: Acceso denegado para el ID {current_user.id}. Rol encontrado: {profile.get('role') if profile else 'None'}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso denegado: Se requieren permisos de ADMIN (Artesano)."
            )
            
        return current_user

    except Exception as e:
        print(f"ERROR EN ROLE_ADMIN_REQUIRED: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al verificar permisos en la base de datos"
        )
    # Intenta obtener el usuario y captura el error exacto