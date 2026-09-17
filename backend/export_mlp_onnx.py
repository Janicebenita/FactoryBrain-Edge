import os

import onnx
import torch
import torch.nn as nn


MODEL_PATH = "models/pump_mlp.pth"
ONNX_PATH = "models/pump_mlp.onnx"


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


model = PumpMLP()

state_dict = torch.load(
    MODEL_PATH,
    map_location="cpu"
)

model.load_state_dict(state_dict)

model.eval()


dummy_input = torch.zeros(
    (1, 5),
    dtype=torch.float32
)


torch.onnx.export(
    model,
    dummy_input,
    ONNX_PATH,
    input_names=["telemetry"],
    output_names=["logits"],
    opset_version=17,

    # IMPORTANT:
    # use legacy exporter
    dynamo=False,

    do_constant_folding=True
)


onnx_model = onnx.load(ONNX_PATH)

onnx.checker.check_model(
    onnx_model
)


print(
    "FactoryBrain Edge - Legacy ONNX Export"
)

print(
    "--------------------------------------"
)

print(
    "ONNX validation: PASSED"
)

print(
    "Input shape:",
    [
        dim.dim_value
        for dim in
        onnx_model.graph.input[0]
        .type.tensor_type.shape.dim
    ]
)

print(
    f"Model size: "
    f"{os.path.getsize(ONNX_PATH) / 1024:.2f} KB"
)

print(
    "Saved:",
    ONNX_PATH
)