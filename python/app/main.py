from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import IndemnizacionRequest, IndemnizacionResponse, DesgloseItem
from .calculations import calculate_indemnizacion
import os

app = FastAPI(title="Rampazzo Calculadoras API", version="0.1.0")

# CORS: configurable por variable de entorno ALLOW_ORIGINS (separada por comas)
_raw_origins = os.getenv("ALLOW_ORIGINS", "").strip()
if _raw_origins:
	origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]
else:
	# Valores por defecto para desarrollo local (Next.js)
	origins = [
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/health")
async def health():
	return {"status": "ok"}


@app.post("/calculate/indemnizacion", response_model=IndemnizacionResponse)
async def calculate_indemnizacion_endpoint(payload: IndemnizacionRequest):
	try:
		result = calculate_indemnizacion(
			salario=payload.salario,
			fecha_ingreso=payload.fechaIngreso,
			fecha_egreso=payload.fechaEgreso,
			preaviso=payload.preaviso,
			agravantes=payload.agravantes.model_dump() if payload.agravantes else None,
		)
		# Cast to response model (validate types)
		return IndemnizacionResponse(
			indemnizacionBasica=result["indemnizacionBasica"],
			indemnizacionAntiguedad=result["indemnizacionAntiguedad"],
			indemnizacionVacaciones=result["indemnizacionVacaciones"],
			indemnizacionSAC=result["indemnizacionSAC"],
			agravantes=result["agravantes"],
			total=result["total"],
			desglose=[DesgloseItem(**i) for i in result["desglose"]],
		)
	except Exception as exc:
		raise HTTPException(status_code=400, detail=str(exc))


# Nota: ejecutar con: uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
