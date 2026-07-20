FROM python:3.10-slim

# Dependencias para compilar psycopg2 (base de datos)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt-get/lists/*

WORKDIR /app

# Copiar e instalar dependencias de golpe
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiamos todo el contenido del backend al contenedor
COPY . .

# Comando clave: Agregamos la raíz al PYTHONPATH para que las importaciones de "src" funcionen
ENV PYTHONPATH=/app

EXPOSE 8080

# Apuntamos exactamente a la ruta interna de tu archivo main.py
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]

