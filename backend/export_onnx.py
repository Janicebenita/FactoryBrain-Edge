import joblib
import onnx

from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType


MODEL_PATH = "models/pump_failure_model.joblib"
ONNX_PATH = "models/pump_failure_model.onnx"


model = joblib.load(MODEL_PATH)

initial_type = [
    ("float_input", FloatTensorType([None, 5]))
]

onnx_model = convert_sklearn(
    model,
    initial_types=initial_type,
    target_opset=15
)

with open(ONNX_PATH, "wb") as f:
    f.write(onnx_model.SerializeToString())


loaded_model = onnx.load(ONNX_PATH)
onnx.checker.check_model(loaded_model)

print(f"ONNX model saved to: {ONNX_PATH}")
print("ONNX model validation: PASSED")