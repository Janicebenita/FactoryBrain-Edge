import joblib
import numpy as np
import onnxruntime as ort


CLASSES = [
    "normal",
    "bearing_warning",
    "overheat",
    "pressure_anomaly",
]


telemetry = np.array(
    [[82.0, 7.4, 4.7, 2840.0, 13.2]],
    dtype=np.float32
)


scaler = joblib.load(
    "models/mlp_scaler.joblib"
)

scaled = scaler.transform(
    telemetry
).astype(np.float32)


# FP32 model
fp32_session = ort.InferenceSession(
    "models/pump_mlp.onnx",
    providers=["CPUExecutionProvider"]
)

fp32_input = fp32_session.get_inputs()[0].name

fp32_logits = fp32_session.run(
    None,
    {fp32_input: scaled}
)[0]

fp32_index = int(
    np.argmax(fp32_logits, axis=1)[0]
)


# INT8 model
int8_session = ort.InferenceSession(
    "models/pump_mlp_int8.onnx",
    providers=["CPUExecutionProvider"]
)

int8_input = int8_session.get_inputs()[0].name

int8_logits = int8_session.run(
    None,
    {int8_input: scaled}
)[0]

int8_index = int(
    np.argmax(int8_logits, axis=1)[0]
)


print("FactoryBrain Edge - INT8 Verification")
print("------------------------------------")

print(
    "FP32 prediction:",
    CLASSES[fp32_index]
)

print(
    "INT8 prediction:",
    CLASSES[int8_index]
)

difference = np.max(
    np.abs(
        fp32_logits - int8_logits
    )
)

print(
    "Maximum logits difference:",
    float(difference)
)

if fp32_index == int8_index:
    print("INT8 CONSISTENCY: PASSED")
else:
    print("INT8 CONSISTENCY: FAILED")