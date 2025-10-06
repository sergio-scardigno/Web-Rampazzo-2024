# Rampazzo Calculadoras API (Python / FastAPI)

Servicio independiente que replica las calculadoras de la web para ser consumidas por Next.js u otros sitios vía HTTP.

## Docker
Imagen pública: `sergioscardigno82/rampazzo-api-calculadora`

Ejecutar la imagen publicada:
```bash
docker run --rm -p 8001:8001 \
  -e ALLOW_ORIGINS="http://localhost:3000,http://127.0.0.1:3000" \
  sergioscardigno82/rampazzo-api-calculadora:latest
```

Etiquetas recomendadas:
- `latest`
- `v0.1.0` → `sergioscardigno82/rampazzo-api-calculadora:v0.1.0`

Reconstruir y publicar cuando modificas el código de `app/`:
```bash
# 1) Autenticarse (una sola vez por sesión)
docker login

# 2) Construir imagen desde el Dockerfile del proyecto (estando en carpeta python)
docker build -t sergioscardigno82/rampazzo-api-calculadora:latest .

# 3) (Opcional) Etiquetar con versión
docker tag sergioscardigno82/rampazzo-api-calculadora:latest \
  sergioscardigno82/rampazzo-api-calculadora:v0.1.0

# 4) Publicar a Docker Hub
docker push sergioscardigno82/rampazzo-api-calculadora:latest
docker push sergioscardigno82/rampazzo-api-calculadora:v0.1.0
```

## Requisitos
- Python 3.10+

## Instalación
```bash
cd python
python -m venv .venv
# Windows PowerShell
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
```

## Ejecutar
```bash
# Orígenes permitidos para CORS (separados por coma). Por defecto: http://localhost:3000, http://127.0.0.1:3000
$env:ALLOW_ORIGINS = "https://tudominio.com,https://otrodominio.com"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Health check:
```bash
curl http://localhost:8001/health
```

## Endpoint: POST /calculate/indemnizacion
Calcula la indemnización por despido. Fechas en formato YYYY-MM-DD.

Ejemplo:
```bash
curl -X POST http://localhost:8001/calculate/indemnizacion \
  -H "Content-Type: application/json" \
  -d '{
    "salario": 450000,
    "fechaIngreso": "2023-01-10",
    "fechaEgreso": "2024-08-18",
    "preaviso": false,
    "agravantes": {
      "certificadosArt80": true,
      "embarazoMaternidad": false
    }
  }'
```

## Consumo desde Next.js
```ts
const resp = await fetch('http://localhost:8001/calculate/indemnizacion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    salario: 450000,
    fechaIngreso: '2023-01-10',
    fechaEgreso: '2024-08-18',
    preaviso: false,
    agravantes: { certificadosArt80: true }
  })
});
const data = await resp.json();
```

## Notas
- Configura `ALLOW_ORIGINS` para CORS en producción; en dev se usan `http://localhost:3000` y `http://127.0.0.1:3000` por defecto.
- Este servicio no almacena datos ni envía emails; solo calcula y devuelve resultados.
