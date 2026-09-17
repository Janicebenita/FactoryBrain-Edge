from abc import ABC, abstractmethod
from typing import Dict, Any

import requests

from onnx_model_service import ONNXPredictiveMaintenanceModel


class InferenceProvider(ABC):

    @abstractmethod
    def predict(self, telemetry: Dict[str, float]) -> Dict[str, Any]:
        pass


class CloudInferenceProvider(InferenceProvider):

    def __init__(self):
        self.model = ONNXPredictiveMaintenanceModel()

    def predict(self, telemetry: Dict[str, float]) -> Dict[str, Any]:
        result = self.model.predict(telemetry)

        return {
            **result,
            "execution": {
                "provider": "cloud",
                "model": "pump_failure_model",
                "runtime": "onnxruntime",
                "model_format": "ONNX"
            }
        }

class SnapdragonInferenceProvider(InferenceProvider):

    def __init__(self, endpoint: str):
        self.endpoint = endpoint.rstrip("/")

    def predict(self, telemetry: Dict[str, float]) -> Dict[str, Any]:

        response = requests.post(
            f"{self.endpoint}/predict",
            json=telemetry,
            timeout=15
        )

        response.raise_for_status()

        return response.json()