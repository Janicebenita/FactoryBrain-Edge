# FactoryBrain Edge Maintenance Agent Explainability

## Decision and Reasoning Process

The agent's decision process validates the five telemetry values, forms the model input vector, and runs the `pump_mlp.onnx` classifier through ONNX Runtime. Its reasoning presents the predicted equipment-health class, model confidence, class probabilities, relevant telemetry conditions, and an associated maintenance recommendation.

The recommendation is advisory and does not directly initiate maintenance, shutdown, or physical control. A qualified operator or maintenance professional must interpret the result alongside alarms, trends, inspection findings, operating conditions, and manufacturer requirements.

## Inputs and Data Sources Used

Input data consists of user-supplied or demonstration values for temperature, vibration, pressure, RPM, and motor current. The model artifact, inference response, class probabilities, and configured maintenance mappings provide the primary data sources for the diagnostic output.

Separate Snapdragon evidence is sourced from the recorded Qualcomm AI Hub compilation and profiling workflow for the same ONNX artifact. The evidence includes compile job `jg9z40mlp`, compiled model `mm5lrdz6q`, profile job `jgolvkn4g`, Snapdragon X Elite CRD target, SC8380XP chipset, QNNExecutionProvider, and QnnHtp.dll HTP backend.

## Outputs and Supporting Evidence

The agent outputs an equipment-health diagnosis, confidence score, class probabilities, and a recommended maintenance action. Supporting evidence includes the submitted telemetry values, ONNX model response, runtime status, deployment context, and any available model or profiling metadata.

The runtime evidence page separately reports the Snapdragon target, compute unit, execution provider, HTP backend, profile iterations, recorded inference time, peak memory, and verification status. These identifiers establish traceability for the recorded edge profiling workflow but do not imply that public application requests execute on Snapdragon hardware.

## Limits, Constraints, and Known Issues

A major limitation is that the system is a predictive-maintenance demonstration for Process Pump P101 using only five telemetry features. Its constraints exclude certified fault diagnosis, remaining-useful-life prediction, causal failure analysis, safety-instrumented control, automatic shutdown, and autonomous maintenance authorization.

The public Vercel and Google Cloud Run application performs cloud inference through ONNX Runtime rather than on a Snapdragon NPU. Recorded Qualcomm profiling values are specific to the tested artifact, configuration, target, and workflow and must not be generalized as universal latency, throughput, power, memory, or production-performance guarantees.

## Uncertainty and Human Review

Uncertainty may arise from noisy sensors, unrealistic user inputs, unseen operating regimes, missing historical context, model drift, class overlap, or differences between demonstration and field equipment. A high confidence score reflects the model's internal output distribution and does not establish that the predicted condition is physically correct.

Human review is required before inspection, maintenance, process change, or shutdown decisions. Operators should follow approved plant procedures and immediately prioritize established alarms and safety systems over the agent's recommendation.

## Safety and Responsible Use

The agent must not be connected directly to pumps, relays, interlocks, emergency shutdown systems, or other safety-critical actuators. Deployment in an industrial setting would require validated sensors, representative training data, cybersecurity controls, model monitoring, failure-mode assessment, controlled trials, and formal engineering approval.

The system should clearly distinguish measured telemetry, model inference, configured advice, cloud execution, and independently recorded Snapdragon profiling evidence. Any unavailable or unverified information must remain labelled as unknown rather than inferred as fact.
