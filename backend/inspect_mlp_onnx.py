import os
import onnx
from collections import Counter


MODEL_PATH = "models/pump_mlp.onnx"

model = onnx.load(MODEL_PATH)

operators = [
    node.op_type
    for node in model.graph.node
]

counts = Counter(operators)

print("FactoryBrain Edge - Snapdragon Target Model")
print("-------------------------------------------")

print(f"Model: {MODEL_PATH}")
print(f"Model size: {os.path.getsize(MODEL_PATH) / 1024:.2f} KB")
print()

print("ONNX OPERATORS")
print("--------------")

for operator, count in sorted(counts.items()):
    print(f"{operator}: {count}")

print()
print("Total nodes:", len(model.graph.node))
print("Opset versions:")

for opset in model.opset_import:
    print(
        f"  domain={opset.domain or 'ai.onnx'} "
        f"version={opset.version}"
    )