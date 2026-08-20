from fastapi import APIRouter, Depends, status, HTTPException
from typing import Any # 🟢 AGREGAMOS ESTA IMPORTACIÓN
from . import schemas, service
from .dependencies import role_admin_required

router = APIRouter()

# 🟢 REEMPLAZAMOS TU FUNCIÓN ANTERIOR POR ESTA VERSIÓN CON 'dict'
@router.post("/login", response_model=schemas.TokenResponse)
def login_admin(data: schemas.LoginRequest):
    # ✅ IMPORTANTE: Este return debe tener 4 espacios de sangría
    return service.authenticate_user(data.email, data.password, required_role="ADMIN")
        
    # Si los datos no coinciden con el if, lanzamos el 401 controlado
    raise HTTPException(status_code=401, detail="Credenciales incorrectas en bypass")


@router.get("/") 
def get_admin_dashboard(user = Depends(role_admin_required)):
    return {"message": f"Bienvenida al panel, {user.email}"}

@router.get("/dashboard-stats")
def get_admin_metrics(user = Depends(role_admin_required)):
    """
    Ruta interna para alimentar los KPIs del artesano.
    """
    return {
        "negocio": "sistema de gestion de proyectos y pedidos",
        "modulo": "Gestión Administrativa",
        "metricas": {
            "proyectos_activos": 0,
            "presupuestos_pendientes": 0,
            "alertas_inventario": "Sin alertas"
        }
    }