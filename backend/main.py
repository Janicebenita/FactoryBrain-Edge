from fastapi.middleware.cors import CORSMiddleware
from snapdragon_evidence import load_snapdragon_evidence
from fastapi import FastAPI
from pydantic import BaseModel

from provider_factory import get_inference_provider


app = FastAPI(
    title="FactoryBrain Edge API",
    version="0.2.0",
    description="Industrial AI inference API for FactoryBrain Edge"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TelemetryInput(BaseModel):
    temperature: float
    vibration: float
    pressure: float
    rpm: float
    motor_current: float


provider = get_inference_provider()


@app.get("/")
def root():
    return {
        "service": "FactoryBrain Edge API",
        "version": "0.2.0",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "provider_class": provider.__class__.__name__
    }


@app.post("/predict")
def predict(data: TelemetryInput):
    telemetry = data.model_dump()

    result = provider.predict(telemetry)

    return {
        "asset_id": "P101",
        "telemetry": telemetry,
        **result
    }

@app.get("/runtime/snapdragon")
def snapdragon_runtime():

    evidence = load_snapdragon_evidence()

    return {
        "factorybrain_edge": {
            "runtime": "Snapdragon",
            "execution_verified": evidence.get(
                "verified",
                False
            ),
            "model": evidence.get("model"),
            "target": evidence.get("target"),
            "chipset": evidence.get("chipset"),
            "compute_unit": evidence.get(
                "compute_unit"
            ),
            "compile_job_id": evidence.get(
                "compile_job_id"
            ),
            "compiled_model_id": evidence.get(
                "compiled_model_id"
            ),
            "status": evidence.get("status")
        }
    }