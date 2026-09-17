import joblib
import numpy as np
import pandas as pd
import onnxruntime as ort


FEATURES = [
    "temperature",
    "vibration",
    "pressure",
    "rpm",
    "motor_current",
]


sample = {
    "temperature": 82.0,
    "vibration": 7.4,
    "pressure": 4.7,
    "rpm": 2840.0,
    "motor_current": 13.2,
}


# --------------------
# Scikit-learn model
# --------------------

sk_model = joblib.load(
    "models/pump_failure_model.joblib"
)

frame = pd.DataFrame(
    [[sample[name] for name in FEATURES]],
    columns=FEATURES
)

sk_prediction = sk_model.predict(frame)[0]


# --------------------
# ONNX model
# --------------------

session = ort.InferenceSession(
    "models/pump_failure_model.onnx",
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name

onnx_input = np.array(
    [[sample[name] for name in FEATURES]],
    dtype=np.float32
)

onnx_outputs = session.run(
    None,
    {
        input_name: onnx_input
    }
)

onnx_prediction = onnx_outputs[0][0]


print("Scikit-learn prediction:", sk_prediction)
print("ONNX prediction:", onnx_prediction)

if str(sk_prediction) == str(onnx_prediction):
    print("MODEL CONSISTENCY: PASSED")
else:
    print("MODEL CONSISTENCY: FAILED")