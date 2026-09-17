"use client";

import { useEffect, useState } from "react";

type Prediction = {
  prediction: string;
  risk_score: number;
  execution?: {
    provider?: string;
    model?: string;
    runtime?: string;
    model_format?: string;
  };
};

const telemetry = {
  temperature: 82,
  vibration: 7.4,
  pressure: 4.7,
  rpm: 2840,
  motor_current: 13.2,
};

export default function LiveDiagnosis() {
  const [result, setResult] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function runDiagnosis() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(telemetry),
        }
      );

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to run diagnosis"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runDiagnosis();
  }, []);

  return (
    <div className="flex min-h-[455px] flex-col rounded-xl border border-amber-500/30 bg-slate-900 p-4">

      <p className="text-xs font-bold text-amber-400">
        LIVE PREDICTIVE MAINTENANCE
      </p>

      {loading && (
        <div className="mt-6 text-sm text-slate-400">
          Running FactoryBrain AI diagnosis...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {result && (
        <>
          <h2 className="mt-2 text-xl font-bold leading-tight">
            {result.prediction === "bearing_warning"
              ? "Bearing Degradation Detected"
              : result.prediction}
          </h2>

          <p className="mt-2 text-sm leading-5 text-slate-400">
            FactoryBrain analyzed the current P101 telemetry through
            the live inference API.
          </p>

          <div className="mt-3 rounded-lg bg-slate-950 p-4">
            <p className="text-[10px] text-slate-500">
              Model Classification
            </p>

            <p className="mt-1 text-base font-bold text-amber-400">
              {result.prediction}
            </p>
          </div>

          <div className="mt-2 rounded-lg bg-slate-950 p-4">
            <p className="text-[10px] text-slate-500">
              Confidence
            </p>

            <p className="mt-1 text-base font-bold">
              {(result.risk_score * 100).toFixed(2)}%
            </p>
          </div>

          <div className="mt-2 rounded-lg bg-slate-950 p-4">
            <p className="text-[10px] text-slate-500">
              Execution
            </p>

            <p className="mt-1 text-xs font-semibold">
              Runtime: {result.execution?.runtime ?? "unknown"}
            </p>

            <p className="mt-1 text-[10px] text-cyan-300">
              Model: {result.execution?.model ?? "unknown"}
            </p>

            <p className="text-[10px] text-slate-400">
              Format: {result.execution?.model_format ?? "unknown"}
            </p>
          </div>

          <div className="mt-auto border-t border-slate-800 pt-3">
            <p className="text-xs text-slate-400">
              Recommended action
            </p>

            <p className="mt-1 text-sm font-semibold leading-5">
              Inspect drive-end bearing and verify alignment before
              the next production cycle.
            </p>
          </div>

          <button
            onClick={runDiagnosis}
            disabled={loading}
            className="mt-3 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
          >
            Re-run AI Diagnosis
          </button>
        </>
      )}
    </div>
  );
}