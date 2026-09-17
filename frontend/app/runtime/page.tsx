"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SnapdragonEvidence = {
  runtime?: string;
  execution_verified?: boolean;
  model?: string;
  target?: string;
  chipset?: string;
  compute_unit?: string;
  compile_job_id?: string;
  compiled_model_id?: string;
  status?: string;
};

export default function RuntimePage() {
  const [evidence, setEvidence] = useState<SnapdragonEvidence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://factorybrain-edge-751411693796.asia-south1.run.app";

  useEffect(() => {
    async function loadEvidence() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/runtime/snapdragon`
        );

        if (!response.ok) {
          throw new Error(`Evidence request failed: ${response.status}`);
        }

        const result = await response.json();
        setEvidence(result.factorybrain_edge);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error"
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvidence();
  }, [API_BASE_URL]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-8 md:p-12">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">
              FACTORYBRAIN EDGE
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Snapdragon Execution Evidence
            </h1>

            <p className="mt-3 max-w-3xl text-slate-400">
              Evidence for the FactoryBrain model artifact compiled and
              verified for a Snapdragon X Elite target. This evidence is
              presented separately from the cloud-hosted inference API.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:border-slate-500"
          >
            ← Operations Console
          </Link>
        </div>

        {loading && (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            Loading Snapdragon execution evidence...
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {evidence && (
          <>
            <section className="mt-10 grid gap-4 md:grid-cols-4">
              <StatusCard
                label="Execution Verified"
                value={evidence.execution_verified ? "YES" : "NO"}
              />
              <StatusCard
                label="Compute Unit"
                value={evidence.compute_unit || "Unknown"}
              />
              <StatusCard
                label="Target"
                value={evidence.target || "Unknown"}
              />
              <StatusCard
                label="Status"
                value={evidence.status || "Unknown"}
              />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-7">
                <p className="text-sm font-semibold text-emerald-400">
                  VERIFIED SNAPDRAGON TARGET
                </p>

                <div className="mt-6 space-y-5">
                  <EvidenceRow
                    label="Runtime"
                    value={evidence.runtime}
                  />
                  <EvidenceRow
                    label="Target Device"
                    value={evidence.target}
                  />
                  <EvidenceRow
                    label="Chipset"
                    value={evidence.chipset}
                  />
                  <EvidenceRow
                    label="Compute Unit"
                    value={evidence.compute_unit}
                  />
                  <EvidenceRow
                    label="Model"
                    value={evidence.model}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-7">
                              <p className="text-sm font-semibold text-cyan-400">
                  COMPILATION EVIDENCE
                </p>

                <div className="mt-6 space-y-5">
                  <EvidenceRow
                    label="Compile Job ID"
                    value={evidence.compile_job_id}
                  />
                  <EvidenceRow
                    label="Compiled Model ID"
                    value={evidence.compiled_model_id}
                  />
                  <EvidenceRow
                    label="Verification Status"
                    value={evidence.status}
                  />
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Execution context
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    The public FactoryBrain demo uses a cloud-hosted
                    ONNX Runtime inference API. The evidence on this page
                    records the separate Snapdragon-targeted compilation
                    and verification artifact.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-7">
              <p className="text-sm font-semibold text-slate-300">
                Evidence Summary
              </p>

              <p className="mt-3 leading-7 text-slate-400">
                FactoryBrain Edge preserves the Snapdragon target,
                chipset, compute unit, model artifact, compile job ID,
                compiled model ID, and verification status as evidence
                of the edge deployment workflow.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatusCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-emerald-400">
        {value}
      </p>
    </div>
  );
}

function EvidenceRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="font-semibold text-slate-100">
        {value || "Not available"}
      </span>
    </div>
  );
}