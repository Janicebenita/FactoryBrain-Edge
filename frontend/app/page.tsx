"use client";

import Link from "next/link";
import { useState } from "react";

type Prediction = {
  asset_id: string;
  prediction: string;
  risk_score: number;
  class_probabilities?: Record<string, number>;
  execution?: {
    provider?: string;
    model?: string;
    runtime?: string;
    model_format?: string;
  };
};

type TelemetryState = {
  temperature: number;
  vibration: number;
  pressure: number;
  rpm: number;
  motor_current: number;
};

export default function Home() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [telemetry, setTelemetry] = useState<TelemetryState>({
    temperature: 82,
    vibration: 7.4,
    pressure: 4.7,
    rpm: 2840,
    motor_current: 13.2,
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://factorybrain-edge-751411693796.asia-south1.run.app";

  function updateTelemetry(
    field: keyof TelemetryState,
    value: number
  ) {
    setTelemetry((current) => ({
      ...current,
      [field]: value,
    }));

    setPrediction(null);
    setError("");
  }

  async function runDiagnosis() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telemetry),
      });

      if (!response.ok) {
        throw new Error(`Prediction request failed: ${response.status}`);
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }

  const diagnosisLabel = prediction
    ? prediction.prediction.replaceAll("_", " ")
    : "";

  const recommendation = getRecommendation(
    prediction?.prediction
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl p-8 md:p-12">

        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">
              FACTORYBRAIN EDGE
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Industrial AI Operations Console
            </h1>

            <p className="mt-3 text-slate-400">
              Predictive maintenance, evidence intelligence,
              and Snapdragon edge AI.
            </p>
          </div>

          <Link
            href="/runtime"
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-400"
          >
            Snapdragon Runtime →
          </Link>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-4">
          <Metric label="Assets Monitored" value="18" />
          <Metric label="Healthy" value="14" />
          <Metric label="Warning" value="3" />
          <Metric label="Critical" value="1" />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Asset P101
                </p>

                <h2 className="text-2xl font-semibold">
                  Process Pump
                </h2>
              </div>

              <span className="rounded-full bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-400">
                LIVE TELEMETRY
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <TelemetryInput
                label="Temperature"
                unit="°C"
                value={telemetry.temperature}
                min={20}
                max={120}
                step={0.5}
                onChange={(value) =>
                  updateTelemetry("temperature", value)
                }
              />

              <TelemetryInput
                label="Vibration"
                unit="mm/s"
                value={telemetry.vibration}
                min={0}
                max={15}
                step={0.1}
                onChange={(value) =>
                  updateTelemetry("vibration", value)
                }
              />

              <TelemetryInput
                label="Pressure"
                unit="bar"
                value={telemetry.pressure}
                min={0}
                max={10}
                step={0.1}
                onChange={(value) =>
                  updateTelemetry("pressure", value)
                }
              />

              <TelemetryInput
                label="RPM"
                unit=""
                value={telemetry.rpm}
                min={500}
                max={4000}
                step={10}
                onChange={(value) =>
                  updateTelemetry("rpm", value)
                }
              />

              <TelemetryInput
                label="Motor Current"
                unit="A"
                value={telemetry.motor_current}
                min={0}
                max={30}
                step={0.1}
                onChange={(value) =>
                  updateTelemetry("motor_current", value)
                }
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={runDiagnosis}
                disabled={loading}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {loading ? "Running AI..." : "Run AI Diagnosis"}
              </button>

              <button
                onClick={() => {
                  setTelemetry({
                    temperature: 72.5,
                    vibration: 2.1,
                    pressure: 4.8,
                    rpm: 1450,
                    motor_current: 12.4,
                  });
                  setPrediction(null);
                }}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500"
              >
                Load Normal Sample
              </button>

              <button
                onClick={() => {
                  setTelemetry({
                    temperature: 82,
                    vibration: 7.4,
                    pressure: 4.7,
                    rpm: 2840,
                    motor_current: 13.2,
                  });
                  setPrediction(null);
                }}
                className="rounded-xl border border-amber-500/30 px-5 py-3 text-sm font-semibold text-amber-300 hover:border-amber-400"
              >
                Load Warning Sample
              </button>
            </div>

            {error && (
              <p className="mt-4 text-red-400">
                {error}
              </p>
            )}

            {prediction && (
              <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950 p-6">
                <p className="text-sm text-slate-400">
                  AI Diagnosis
                </p>

                <h3 className="mt-2 text-2xl font-bold capitalize text-amber-400">
                  {diagnosisLabel}
                </h3>

                <p className="mt-2 text-slate-300">
                  Prediction confidence:{" "}
                  {(prediction.risk_score * 100).toFixed(2)}%
                </p>

                {prediction.class_probabilities && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {Object.entries(
                      prediction.class_probabilities
                    ).map(([label, probability]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-3"
                      >
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {label.replaceAll("_", " ")}
                        </p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {(probability * 100).toFixed(2)}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
                    Recommended action
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    {recommendation}
                  </p>
                </div>

                {prediction.execution && (
                  <div className="mt-5 text-sm text-slate-400">
                    Runtime: {prediction.execution.runtime}
                    {" · "}
                    Model: {prediction.execution.model}
                    {" · "}
                    Provider: {prediction.execution.provider}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-7">
            <p className="text-sm font-semibold text-emerald-400">
              SNAPDRAGON AI STATUS
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              NPU Execution Verified
            </h2>

            <div className="mt-6 space-y-4">
              <Row label="Target" value="Snapdragon X Elite CRD" />
              <Row label="Chipset" value="SC8380XP" />
              <Row label="Compute Unit" value="NPU" />
              <Row label="Status" value="VERIFIED" />
            </div>

            <Link
              href="/runtime"
              className="mt-7 inline-block text-sm font-semibold text-cyan-400"
            >
              View execution evidence →
            </Link>
          </aside>

        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function TelemetryInput({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-semibold text-white outline-none focus:border-cyan-500"
        />

        {unit && (
          <span className="text-sm text-slate-400">
            {unit}
          </span>
        )}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="mt-3 w-full accent-cyan-400"
      />
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
      <span className="text-slate-400">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

function getRecommendation(
  prediction?: string
) {
  switch (prediction) {
    case "bearing_warning":
      return "Inspect the drive-end bearing, verify shaft alignment, and review lubrication condition before the next production cycle.";

    case "overheat":
      return "Inspect cooling airflow, lubrication condition, motor loading, and bearing friction before continued operation.";

    case "pressure_anomaly":
      return "Inspect suction and discharge pressure, check for blockage or cavitation, and verify valve position and pump flow conditions.";

    case "normal":
      return "No immediate maintenance action is indicated. Continue normal monitoring and trend telemetry over time.";

    default:
      return "Review telemetry and equipment condition before scheduling maintenance.";
  }
}