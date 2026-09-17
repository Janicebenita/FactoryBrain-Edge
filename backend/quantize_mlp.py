import os

from onnxruntime.quantization import (
    quantize_dynamic,
    QuantType
)


INPUT_MODEL = "models/pump_mlp.onnx"
OUTPUT_MODEL = "models/pump_mlp_int8.onnx"


quantize_dynamic(
    model_input=INPUT_MODEL,
    model_output=OUTPUT_MODEL,
    weight_type=QuantType.QInt8
)


original_size = os.path.getsize(INPUT_MODEL)
quantized_size = os.path.getsize(OUTPUT_MODEL)


print("FactoryBrain Edge - INT8 Quantization")
print("------------------------------------")

print(
    f"FP32 model: {original_size / 1024:.2f} KB"
)

print(
    f"INT8 model: {quantized_size / 1024:.2f} KB"
)

print(
    "Saved:",
    OUTPUT_MODEL
)

print("QUANTIZATION: PASSED")