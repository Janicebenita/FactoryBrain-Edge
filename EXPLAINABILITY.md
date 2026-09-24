# FactoryBrain Edge Explainability

## Decision and Reasoning Process

The agent's decision begins with five pump telemetry inputs: temperature, vibration, pressure, RPM, and motor current. It submits the values to the FactoryBrain inference service, interprets the ONNX model's predicted condition, confidence, and class probabilities, and uses that reasoning to present a suitable maintenance recommendation.

The diagnosis is based on the combined telemetry pattern rather than a single isolated reading. The agent distinguishes model evidence from operational advice and escalates uncertain, incomplete, or unusual cases for human review.

## Inputs and Data Sources Used

The primary input data used by the agent consists of the five numerical telemetry values entered for Process Pump P101. The live application sends these inputs to the FastAPI backend, where the `pump_mlp.onnx` model is executed through ONNX Runtime.

The agent may also use the returned predicted class, confidence scores, class probabilities, and repository maintenance guidance when composing its response. Snapdragon runtime information comes from the separate `snapdragon_execution.json` evidence record and is not treated as live pump telemetry.

## Outputs and Supporting Evidence

The agent outputs an equipment-health diagnosis, prediction confidence, class-probability information, and a recommended maintenance action. It explains which submitted telemetry and model results support the conclusion so that a user can review the basis of the recommendation.

The response keeps live cloud inference separate from the Qualcomm AI Hub verification path. Snapdragon X Elite job identifiers and profiling measurements are reported only as recorded evidence for the same ONNX model artifact.

## Limits, Constraints, and Known Issues

A key limitation is that FactoryBrain Edge is a demonstration system centered on one process-pump scenario and five telemetry features. Its predictions are not certified equipment-health assessments and must not replace plant alarms, protective systems, approved maintenance procedures, or professional engineering judgement.

Another constraint is that the public application performs inference through the cloud-hosted FastAPI service and does not prove that each public request runs on a Snapdragon NPU. Profiling results may vary by device, software, operating conditions, and model version, so the recorded latency and memory values are not universal performance guarantees.

## Uncertainty and Human Review

The agent communicates uncertainty through confidence and class-probability results and avoids presenting low-confidence output as certain fact. Missing inputs, unusual values, conflicting evidence, or safety-critical conditions require verification by authorized operations, maintenance, or reliability personnel.

The recommended action is advisory and should be checked against current equipment history, field observations, manufacturer guidance, and site procedures. A human decision-maker remains responsible for inspection, shutdown, repair, or return-to-service decisions.

