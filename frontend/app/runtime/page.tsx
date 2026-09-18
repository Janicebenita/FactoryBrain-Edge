"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SnapdragonEvidence = {
  runtime?: string;
  execution_verified?: boolean;
  model?: string;
  target?: string;
  os?: string;
  chipset?: string;
  compute_unit?: string;

  compile_job_id?: string;
  compiled_model_id?: string;
  profile_job_id?: string;

  input_name?: string;
  input_shape?: number[];

  profile_source?: string;
  execution_provider?: string;
  htp_backend?: string;

  inference_iterations?: number;
  profile_inference_time_us?: number;
  peak_inference_memory_mb?: number;

  runtime_version?: string;
  status?: string;
};

export default function RuntimePage() {
  const [evidence, setEvidence] =
    useState<SnapdragonEvidence | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://factorybrain-edge-751411693796.asia-south1.run.app";

  useEffect(() => {
    async function loadEvidence() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/runtime/snapdragon`
        );

        if (!response.ok) {
          throw new Error(
            `Evidence request failed: ${response.status}`
          );
        }

        const result = await response.json();

        setEvidence(result.factorybrain_edge);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Snapdragon evidence"
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

        {/* HEADER */}

        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">
              FACTORYBRAIN EDGE
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Snapdragon Execution Evidence
            </h1>

            <p className="mt-3 max-w-3xl text-slate-400">
              Qualcomm AI Hub compilation and profiling evidence
              for the FactoryBrain predictive-maintenance model
              targeting Snapdragon X Elite.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            ← Operations Console
          </Link>
        </header>

        {/* LOADING */}

        {loading && (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            Loading Snapdragon execution evidence...
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {/* EVIDENCE */}

        {evidence && (
          <>

            {/* STATUS CARDS */}

            <section className="mt-10 grid gap-4 md:grid-cols-4">
              <StatusCard
                label="Execution Verified"
                value={
                  evidence.execution_verified
                    ? "YES"
                    : "NO"
                }
              />

              <StatusCard
                label="Compute Unit"
                value={
                  evidence.compute_unit ||
                  "Unknown"
                }
              />

              <StatusCard
                label="Target"
                value={
                  evidence.target ||
                  "Unknown"
                }
              />

              <StatusCard
                label="Status"
                value={
                  evidence.status ||
                  "Unknown"
                }
              />
            </section>

            {/* TARGET + COMPILATION */}

            <section className="mt-8 grid gap-6 lg:grid-cols-2">

              {/* SNAPDRAGON TARGET */}

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
                    label="Operating System"
                    value={evidence.os}
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

                  <EvidenceRow
                    label="Input Name"
                    value={evidence.input_name}
                  />

                  <EvidenceRow
                    label="Input Shape"
                    value={
                      evidence.input_shape
                        ? `[${evidence.input_shape.join(
                            ", "
                          )}]`
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* COMPILATION EVIDENCE */}

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-7">
                <p className="text-sm font-semibold text-cyan-400">
                  COMPILATION EVIDENCE
                </p>

                <div className="mt-6 space-y-5">
                  <EvidenceRow
                    label="Compile Job ID"
                    value={
                      evidence.compile_job_id
                    }
                  />

                  <EvidenceRow
                    label="Compiled Model ID"
                    value={
                      evidence.compiled_model_id
                    }
                  />

                  <EvidenceRow
                    label="Profile Job ID"
                    value={
                      evidence.profile_job_id
                    }
                  />

                  <EvidenceRow
                    label="Verification Status"
                    value={evidence.status}
                  />

                  <EvidenceRow
                    label="Evidence Source"
                    value={
                      evidence.profile_source
                    }
                  />
                </div>

                <div className="mt-7 rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Execution context
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    The public FactoryBrain demo uses a
                    cloud-hosted ONNX Runtime inference API.
                    The Qualcomm evidence shown here represents
                    the separately compiled and profiled
                    Snapdragon-targeted model artifact.
                  </p>
                </div>
              </div>
            </section>

            {/* PROFILE EVIDENCE */}

            <section className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <p className="text-sm font-semibold text-violet-400">
                    QUALCOMM AI HUB PROFILE EVIDENCE
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    NPU Execution Verified
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    Profiling evidence records successful
                    execution of the FactoryBrain ONNX model
                    using Qualcomm&apos;s QNN execution provider
                    and HTP backend on the Snapdragon target.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                  {evidence.status || "UNKNOWN"}
                </span>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <ProfileMetric
                  label="Profile Job"
                  value={
                    evidence.profile_job_id
                  }
                />

                <ProfileMetric
                  label="Execution Provider"
                  value={
                    evidence.execution_provider
                  }
                />

                <ProfileMetric
                  label="HTP Backend"
                  value={
                    evidence.htp_backend
                  }
                />

                <ProfileMetric
                  label="Inference Iterations"
                  value={
                    evidence.inference_iterations !==
                    undefined
                      ? String(
                          evidence.inference_iterations
                        )
                      : undefined
                  }
                />

                <ProfileMetric
                  label="Profile Inference Time"
                  value={
                    evidence.profile_inference_time_us !==
                    undefined
                      ? `${evidence.profile_inference_time_us} µs`
                      : undefined
                  }
                />

                <ProfileMetric
                  label="Peak Inference Memory"
                  value={
                    evidence.peak_inference_memory_mb !==
                    undefined
                      ? `${evidence.peak_inference_memory_mb} MB`
                      : undefined
                  }
                />

                <ProfileMetric
                  label="Runtime Version"
                  value={
                    evidence.runtime_version
                  }
                />

                <ProfileMetric
                  label="Profile Source"
                  value={
                    evidence.profile_source
                  }
                />

                <ProfileMetric
                  label="Input Shape"
                  value={
                    evidence.input_shape
                      ? `[${evidence.input_shape.join(
                          ", "
                        )}]`
                      : undefined
                  }
                />
              </div>

              <div className="mt-7 rounded-xl border border-violet-500/20 bg-slate-950 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">
                  Verified execution path
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  FactoryBrain model → ONNX artifact →
                  Qualcomm AI Hub compilation → Snapdragon
                  X Elite target → QNN Execution Provider →
                  HTP backend → successful profiling and
                  inference.
                </p>
              </div>
            </section>

            {/* EVIDENCE SUMMARY */}

            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-7">
              <p className="text-sm font-semibold text-slate-300">
                Evidence Summary
              </p>

              <p className="mt-3 leading-7 text-slate-400">
                FactoryBrain Edge preserves the Snapdragon
                target, chipset, model artifact, compile job,
                compiled model, profile job, QNN execution
                provider, HTP backend, runtime metrics, and
                verification status as evidence of the edge
                deployment workflow.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Cloud inference and Snapdragon profiling are
                intentionally reported separately: the public
                application is served through Cloud Run, while
                the Qualcomm AI Hub profile provides evidence
                of Snapdragon-targeted edge execution.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

/* STATUS CARD */

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

/* EVIDENCE ROW */

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

      <span className="break-all font-semibold text-slate-100">
        {value || "Not available"}
      </span>
    </div>
  );
}

/* PROFILE METRIC */

function ProfileMetric({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-slate-100">
        {value || "Not available"}
      </p>
    </div>
  );
}