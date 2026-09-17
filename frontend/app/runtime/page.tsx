"use client";

import { useEffect, useState } from "react";

type RuntimeData = {
  factorybrain_edge: {
    runtime: string;
    execution_verified: boolean;
    model: string;
    target: string;
    chipset: string;
    compute_unit: string;
    compile_job_id: string;
    compiled_model_id: string;
    status: string;
  };
};

export default function RuntimePage() {
  const [data, setData] = useState<RuntimeData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/runtime/snapdragon")
      .then((res) => {
        if (!res.ok) throw new Error("Backend unavailable");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const runtime = data?.factorybrain_edge;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 md:p-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">
          FACTORYBRAIN EDGE
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          AI Runtime Console
        </h1>

        <p className="mt-3 text-slate-400">
          Verified Snapdragon execution evidence.
        </p>

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/40 bg-red-500/10 p-5">
            {error}
          </div>
        )}

        {!runtime && !error && (
          <p className="mt-8 text-slate-400">
            Loading runtime evidence...
          </p>
        )}

        {runtime && (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card label="Execution Verified" value={runtime.execution_verified ? "YES" : "NO"} />
            <Card label="Compute Unit" value={runtime.compute_unit} />
            <Card label="Target" value={runtime.target} />
            <Card label="Chipset" value={runtime.chipset} />
            <Card label="Model" value={runtime.model} />
            <Card label="Runtime" value={runtime.runtime} />
            <Card label="Compile Job" value={runtime.compile_job_id} />
            <Card label="Compiled Model" value={runtime.compiled_model_id} />
            <Card label="Status" value={runtime.status} />
          </div>
        )}
      </div>
    </main>
  );
}

function Card({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-emerald-400">
        {value}
      </p>
    </div>
  );
}