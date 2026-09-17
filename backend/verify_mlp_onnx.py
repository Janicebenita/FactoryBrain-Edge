import time
import statistics

import joblib
import numpy as np
import onnxruntime as ort
import torch
import torch.nn as nn


FEATURES = [
    "temperature",
    "vibration",
    "pressure",
    "rpm",
    "motor_current",
]

CLASSES = [
    "normal",
    "bearing_warning",
    "overheat",
    "pressure_anomaly",
]


class PumpMLP(nn.Module):
    def __init__(self):
        super().__init__()

        self.net = nn.Sequential(
            nn.Linear(5, 16),
            nn.ReLU(),
            nn.Linear(16, 16),
            nn.ReLU(),
            nn.Linear(16, 4)
        )

    def forward(self, x):
        return self.net(x)


# --------------------------------
# Sample P101 telemetry
# --------------------------------

telemetry = np.array(
    [[82.0, 7.4, 4.7, 2840.0, 13.2]],
    dtype=np.float32
)


# --------------------------------
# Apply same training scaler
# --------------------------------

scaler = joblib.load(
    "models/mlp_scaler.joblib"
)

scaled = scaler.transform(
    telemetry
).astype(np.float32)


# --------------------------------
# PyTorch inference
# --------------------------------

torch_model = PumpMLP()

torch_model.load_state_dict(
    torch.load(
        "models/pump_mlp.pth",
        map_location="cpu"
    )
)

torch_model.eval()

with torch.no_grad():

    torch_logits = torch_model(
        torch.tensor(scaled)
    )

    torch_prediction_index = int(
        torch.argmax(
            torch_logits,
            dim=1
        ).item()
    )

torch_prediction = CLASSES[
    torch_prediction_index
]


# --------------------------------
# ONNX inference
# --------------------------------

session = ort.InferenceSession(
    "models/pump_mlp.onnx",
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name

onnx_outputs = session.run(
    None,
    {
        input_name: scaled
    }
)

onnx_logits = onnx_outputs[0]

onnx_prediction_index = int(
    np.argmax(
        onnx_logits,
        axis=1
    )[0]
)

onnx_prediction = CLASSES[
    onnx_prediction_index
]


# --------------------------------
# Consistency
# --------------------------------

print("FactoryBrain Edge - MLP Verification")
print("------------------------------------")

print("PyTorch prediction:", torch_prediction)
print("ONNX prediction:", onnx_prediction)

max_difference = np.max(
    np.abs(
        torch_logits.numpy()
        - onnx_logits
    )
)

print(
    "Maximum logits difference:",
    float(max_difference)
)

if torch_prediction == onnx_prediction:
    print("MODEL CONSISTENCY: PASSED")
else:
    print("MODEL CONSISTENCY: FAILED")


# --------------------------------
# Warm-up
# --------------------------------

for _ in range(100):

    session.run(
        None,
        {
            input_name: scaled
        }
    )


# --------------------------------
# Benchmark
# --------------------------------

runs = []

for _ in range(5000):

    start = time.perf_counter()

    session.run(
        None,
        {
            input_name: scaled
        }
    )

    end = time.perf_counter()

    runs.append(
        (end - start) * 1000
    )


runs_sorted = sorted(runs)

mean_ms = statistics.mean(runs)
median_ms = statistics.median(runs)

p95 = runs_sorted[
    int(len(runs_sorted) * 0.95) - 1
]

p99 = runs_sorted[
    int(len(runs_sorted) * 0.99) - 1
]


print()
print("ONNX CPU BENCHMARK")
print("------------------")

print("Runs:", len(runs))

print(
    f"Mean latency: {mean_ms:.6f} ms"
)

print(
    f"Median latency: {median_ms:.6f} ms"
)

print(
    f"P95 latency: {p95:.6f} ms"
)

print(
    f"P99 latency: {p99:.6f} ms"
)

print(
    f"Min latency: {min(runs):.6f} ms"
)

print(
    f"Max latency: {max(runs):.6f} ms"
)

print(
    "Execution provider:",
    session.get_providers()
)