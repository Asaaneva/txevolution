

from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

try:
    supabase = create_client(url, key)
    # Intentamos leer la tabla profiles que creamos
    res = supabase.table("profiles").select("*").limit(1).execute()
    print("✅ ¡CONEXIÓN EXITOSA vía API!")
except Exception as e:
    print(f"❌ Error: {e}")
