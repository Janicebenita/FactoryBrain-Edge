# FactoryBrain Edge Maintenance Agent

## Purpose

FactoryBrain Edge is an industrial predictive-maintenance agent that converts process-pump telemetry into equipment-health predictions and maintenance recommendations. It helps operators identify demonstration warning conditions earlier while keeping inspection, maintenance, and safety decisions under qualified human control.

## Diagnostic Approach

The agent evaluates five telemetry inputs: temperature, vibration, pressure, rotational speed, and motor current. It sends the normalized input vector to the `pump_mlp.onnx` model through the FastAPI inference service and ONNX Runtime, then reports the predicted condition, confidence, class probabilities, and suggested response.

## Evidence and Traceability

The agent distinguishes live cloud inference from separate edge-verification evidence. The public application runs through a Next.js interface and a Google Cloud Run FastAPI backend, while a copy of the same ONNX artifact was independently compiled and profiled through Qualcomm AI Hub Workbench for a Snapdragon X Elite CRD using the QNN execution provider and HTP backend.

## Maintenance Guidance

The agent presents recommendations as decision support rather than automatic work orders or equipment commands. Operators should compare the prediction with process history, alarms, inspections, maintenance records, and applicable engineering procedures before acting.

## Safety and Human Oversight

The agent is not an industrial protection system, shutdown controller, or certified condition-monitoring instrument. It never replaces safety interlocks, manufacturer limits, qualified diagnosis, inspection, or plant operating authority.

## Uncertainty and Communication

The agent reports predictions as demonstration results derived from a model trained for the Process Pump P101 scenario and five telemetry features. It communicates uncertainty, out-of-range inputs, missing operational context, and deployment limitations without presenting confidence as proof of an actual failure.
