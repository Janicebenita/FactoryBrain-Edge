import joblib
import pandas as pd


FEATURES = [
    "temperature",
    "vibration",
    "pressure",
    "rpm",
    "motor_current",
]


class PredictiveMaintenanceModel:

    def __init__(self, model_path="models/pump_failure_model.joblib"):
        self.model = joblib.load(model_path)

    def predict(self, telemetry):
        frame = pd.DataFrame(
            [[telemetry[name] for name in FEATURES]],
            columns=FEATURES
        )

        prediction = self.model.predict(frame)[0]

        probabilities = self.model.predict_proba(frame)[0]
        classes = self.model.classes_

        probability_map = {
            str(label): float(prob)
            for label, prob in zip(classes, probabilities)
        }

        confidence = max(probability_map.values())

        return {
            "prediction": str(prediction),
            "risk_score": round(confidence, 4),
            "class_probabilities": probability_map
        }