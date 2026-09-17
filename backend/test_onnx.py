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

outputs = session.run(
    None,
    {
        input_name: sample
    }
)

print("Input name:", input_name)
print("Prediction output:", outputs[0])

if len(outputs) > 1:
    print("Probability output:", outputs[1])