from fastapi import APIRouter, status, HTTPException
from . import schemas, service

router = APIRouter()

@router.post("/login", response_model=schemas.TokenResponse)
def login_cliente(data: schemas.LoginRequest):
    # El required_role debe ser exacto a tu tipo 'user_role' en Supabase
    return service.authenticate_user(
        email=data.email, 
        password=data.password, 
        required_role="CLIENT"
    )
@router.post("/registro", status_code=status.HTTP_201_CREATED)
async def registro_cliente(data: schemas.UserCreate):
    try:
        # 1. Registro en Auth
        auth_res = service.supabase.auth.sign_up({
            "email": data.email, 
            "password": data.password
        })

        if not auth_res.user:
            raise Exception("User already registered in Auth")

        user_id = auth_res.user.id

        # 2. INTENTO DIRECTO DE INSERCIÓN
        # En lugar de buscar primero, intentamos crear el registro.
        # Si ya existe, el 'service' debería decírnoslo.
        try:
            perfil = service.create_user_record(
                user_id=user_id,
                email=data.email,
                full_name=data.full_name,
                role="CLIENT" 
            )
            
            return {
                "status": "success",
                "message": "Registro exitoso ",
                "data": {"email": data.email}
            }
            
        except Exception as db_err:
            # Si falla aquí, es porque el perfil REALMENTE ya existía
            return {
                "status": "info",
                "message": "El usuario ya estaba registrado en la base de datos.",
                "data": {"id": user_id, "email": data.email}
            }

    except Exception as e:
        if "already registered" in str(e).lower():
             return {
                "status": "error",
                "message": "Este correo electrónico ya está en uso."
            }
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")