import os
from fastapi import FastAPI, HTTPException, status
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Inicialización del cliente
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def authenticate_user(email: str, password: str, required_role: str):
    try:
        # 1. Login en Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": email, 
            "password": password
        })
        
        user_id = auth_response.user.id

        # 2. BÚSQUEDA EN TABLA
        user_data = supabase.table("profiles").select("role").eq("id", user_id).single().execute()  
        
        user_role = user_data.data.get("role") if user_data.data else None

        print(f"--- DEBUG LOGIN ---")
        print(f"ID: {user_id}")
        print(f"ROL ENCONTRADO: {user_role}")
        print(f"ROL REQUERIDO: {required_role}")
        print(f"-------------------")

        # 3. Validación de rango
        if user_role != required_role:
            # LANZAMOS EL 403 AQUÍ
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado: Se requiere rol de {required_role}"
            )
            
        return {
            "access_token": auth_response.session.access_token,
            "token_type": "bearer",
            "role": user_role
        }

    # --- CAMBIO CLAVE AQUÍ ---
    except HTTPException as http_exc:
        # Si es una excepción que NOSOTROS lanzamos (como el 403), la dejamos pasar tal cual
        raise http_exc

    except Exception as e:
        # Si es cualquier otro error (base de datos, red, contraseña mal), devolvemos 401
        print(f"Error detallado en la terminal: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas o error de comunicación"
        )
    # Agrégalo al final de src/api/auth/service.py

def create_user_record(user_id, email, full_name, role):
    try:
        # Intentamos la inserción normal
        response = supabase.table("profiles").insert({
            "id": user_id,
            "email": email,
            "full_name": full_name,
            "role": role
        }).execute()
        
        return response.data[0] if response.data else {}

    except Exception as e:
        # REVISIÓN TÉCNICA: error de duplicado (23505)
        if "23505" in str(e):
            print(f"INFO SISTEMAC3: El perfil ya existía para {email}. Evitando colisión.")
            
            # Opcional: Consultamos el perfil que ya existe para retornar sus datos
            existente = supabase.table("profiles").select("*").eq("id", user_id).execute()
            return existente.data[0] if existente.data else {}
        
        # Si es cualquier otro error (como el 42501 de RLS), sí lo reportamos
        print(f"Error crítico en BD: {e}")
        raise e