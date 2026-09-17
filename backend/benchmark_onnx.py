import time
import statistics
import os

import numpy as np
import onnxruntime as ort


MODEL_PATH = "models/pump_failure_model.onnx"

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name

sample = np.array(
    [[82.0, 7.4, 4.7, 2840.0, 13.2]],
    dtype=np.float32
)

# Warm-up
for _ in range(50):
    session.run(None, {input_name: sample})

runs = []

for _ in range(1000):
    start = time.perf_counter()

    session.run(
        None,
        {
            input_name: sample
        }
    )

    end = time.perf_counter()

    runs.append((end - start) * 1000)

runs_sorted = sorted(runs)

mean_ms = statistics.mean(runs)
median_ms = statistics.median(runs)

p95_index = int(len(runs_sorted) * 0.95) - 1
p99_index = int(len(runs_sorted) * 0.99) - 1

p95_ms = runs_sorted[p95_index]
p99_ms = runs_sorted[p99_index]

print("FactoryBrain Edge - ONNX Benchmark")
print("----------------------------------")
print(f"Model: {MODEL_PATH}")
print(f"Model size: {os.path.getsize(MODEL_PATH) / 1024:.2f} KB")
print(f"Runs: {len(runs)}")
print(f"Mean latency: {mean_ms:.4f} ms")
print(f"Median latency: {median_ms:.4f} ms")
print(f"P95 latency: {p95_ms:.4f} ms")
print(f"P99 latency: {p99_ms:.4f} ms")
print(f"Min latency: {min(runs):.4f} ms")
print(f"Max latency: {max(runs):.4f} ms")
print(f"Execution provider: {session.get_providers()}")