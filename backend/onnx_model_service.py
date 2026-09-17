import numpy as np
import onnxruntime as ort


FEATURES = [
    "temperature",
    "vibration",
    "pressure",
    "rpm",
    "motor_current",
]


class ONNXPredictiveMaintenanceModel:

    def __init__(
        self,
        model_path="models/pump_failure_model.onnx"
    ):
        self.session = ort.InferenceSession(
            model_path,
            providers=["CPUExecutionProvider"]
        )

        self.input_name = self.session.get_inputs()[0].name

    def predict(self, telemetry):

        values = [
            telemetry[name]
            for name in FEATURES
        ]

        model_input = np.array(
            [values],
            dtype=np.float32
        )

        outputs = self.session.run(
            None,
            {
                self.input_name: model_input
            }
        )

        prediction = str(outputs[0][0])

        probability_map = {}

        if len(outputs) > 1:
            probabilities = outputs[1]

            if isinstance(probabilities, list):
                if probabilities:
                    probability_map = {
                        str(key): float(value)
                        for key, value
                        in probabilities[0].items()
                    }

        confidence = (
            max(probability_map.values())
            if probability_map
            else 0.0
        )

        return {
            "prediction": prediction,
            "risk_score": round(confidence, 4),
            "class_probabilities": probability_map
        }