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

export default function Home() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const telemetry = {
    temperature: 82,
    vibration: 7.4,
    pressure: 4.7,
    rpm: 2840,
    motor_current: 13.2,
  };

  async function runDiagnosis() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(telemetry),
        }
      );

      if (!response.ok) {
        throw new Error("Prediction request failed");
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
                WARNING
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Telemetry label="Temperature" value="82 °C" />
              <Telemetry label="Vibration" value="7.4 mm/s" />
              <Telemetry label="Pressure" value="4.7 bar" />
              <Telemetry label="RPM" value="2840" />
              <Telemetry label="Motor Current" value="13.2 A" />
            </div>

            <button
              onClick={runDiagnosis}
              disabled={loading}
              className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Running AI..." : "Run AI Diagnosis"}
            </button>

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

                <h3 className="mt-2 text-2xl font-bold text-amber-400">
                  {prediction.prediction}
                </h3>

                <p className="mt-2 text-slate-300">
                  Confidence:
                  {" "}
                  {(prediction.risk_score * 100).toFixed(2)}%
                </p>

                {prediction.execution && (
                  <div className="mt-4 text-sm text-slate-400">
                    Runtime: {prediction.execution.runtime}
                    {" · "}
                    Model: {prediction.execution.model}
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

function Telemetry({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold">
        {value}
      </p>
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