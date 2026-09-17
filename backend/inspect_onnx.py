import os
import onnx
from collections import Counter


MODEL_PATH = "models/pump_failure_model.onnx"

model = onnx.load(MODEL_PATH)

print("MODEL:", MODEL_PATH)
print("SIZE BYTES:", os.path.getsize(MODEL_PATH))
print("SIZE KB:", round(os.path.getsize(MODEL_PATH) / 1024, 2))

op_types = [node.op_type for node in model.graph.node]
counts = Counter(op_types)

print("\nONNX OPERATORS")
print("--------------")

for op, count in sorted(counts.items()):
    print(f"{op}: {count}")

print("\nTOTAL NODES:", len(model.graph.node))