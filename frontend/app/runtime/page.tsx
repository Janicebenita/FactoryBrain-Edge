"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://factorybrain-edge-751411693796.asia-south1.run.app";

export default function RuntimePage() {
  const [evidence, setEvidence] =
    useState<SnapdragonEvidence | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, []);

  const inputShape = useMemo(() => {
    if (!evidence?.input_shape) return "Not available";
    return `[${evidence.input_shape.join(", ")}]`;
  }, [evidence]);

  return (
    <main className="factory-workspace text-slate-100">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[220px_minmax(0,1fr)]">

        {/* SIDEBAR */}
        <aside className="hidden border-r border-[#17303a] bg-[#071017] lg:flex lg:h-screen lg:flex-col">
          <div className="border-b border-[#17303a] px-5 py-5">
            <div className="flex items-center gap-3">
              <BrandMark />

              <div>
                <p className="text-[15px] font-semibold tracking-[0.06em] text-white">
                  FACTORYBRAIN
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-400">
                  Edge AI
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-5">
            <SidebarLink
              href="/"
              label="Overview"
              icon="◫"
            />

            <SidebarItem
              label="Assets"
              icon="◉"
            />

            <SidebarItem
              label="Diagnostics"
              icon="⌁"
            />

            <SidebarLink
              href="/runtime"
              label="Runtime Evidence"
              icon="◆"
              active
            />

            <SidebarItem
              label="Activity"
              icon="⌁"
            />

            <SidebarItem
              label="Reports"
              icon="▤"
            />
          </nav>

          <div className="space-y-3 border-t border-[#17303a] p-4">
            <SystemStatus
              label="Cloud API"
              value="Online"
              tone="green"
            />

            <SystemStatus
              label="Snapdragon"
              value="Verified"
              tone="violet"
            />

            <div className="rounded-xl border border-[#17303a] bg-[#0a161e] p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                Evidence source
              </p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                Qualcomm AI Hub
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <section className="min-w-0 bg-[#081219]">
          <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-0">

            {/* TOP BAR */}
            <header className="flex min-h-16 items-center justify-between border-b border-[#17303a] bg-[#09141b]/95 px-4 sm:px-5 lg:px-6">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                  <span>FactoryBrain</span>
                  <span>/</span>
                  <span className="text-slate-300">
                    Runtime Evidence
                  </span>
                </div>

                <h1 className="mt-0.5 text-[20px] font-semibold tracking-[-0.02em] text-white sm:text-[22px]">
                  Snapdragon Execution Evidence
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge
                  label="Cloud API"
                  value="Online"
                  tone="green"
                />

                <StatusBadge
                  label="NPU"
                  value="Verified"
                  tone="violet"
                />

                <Link
                  href="/"
                  className="rounded-lg border border-[#2a414c] bg-[#0b1820] px-3 py-2 text-[13px] font-semibold text-slate-300 hover:border-cyan-400/40 hover:text-white"
                >
                  ← Operations Console
                </Link>
              </div>
            </header>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto lg:overflow-hidden">
              <div className="grid min-h-full gap-3 p-3 sm:p-4 lg:h-full lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-4">

                {/* LOADING */}
                {loading && (
                  <LoadingState />
                )}

                {/* ERROR */}
                {!loading && error && (
                  <ErrorState
                    message={error}
                    onRetry={() =>
                      window.location.reload()
                    }
                  />
                )}

                {/* EVIDENCE */}
                {!loading && !error && evidence && (
                  <>
                    {/* HERO */}
                    <section className="relative overflow-hidden rounded-2xl border border-[#203944] bg-[#0a1821] px-5 py-4">
                      <div className="absolute right-[-80px] top-[-90px] h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
                      <div className="absolute left-[35%] top-[-110px] h-52 w-52 rounded-full bg-cyan-400/8 blur-3xl" />

                      <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-violet-400/25 bg-violet-400/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-300">
                              Snapdragon X Elite
                            </span>

                            <VerifiedPill
                              verified={
                                evidence.execution_verified
                              }
                            />
                          </div>

                          <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.025em] text-white">
                            NPU Execution Verified
                          </h2>

                          <p className="mt-1 max-w-3xl text-[13px] leading-5 text-slate-400">
                            Qualcomm AI Hub compilation and
                            profiling evidence for the FactoryBrain
                            predictive-maintenance ONNX model.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[560px]">
                          <HeroStat
                            label="Target"
                            value={
                              evidence.target ||
                              "Not available"
                            }
                          />

                          <HeroStat
                            label="Chipset"
                            value={
                              evidence.chipset ||
                              "Not available"
                            }
                          />

                          <HeroStat
                            label="Compute"
                            value={
                              evidence.compute_unit ||
                              "Not available"
                            }
                          />

                          <HeroStat
                            label="Status"
                            value={
                              evidence.status ||
                              "Unknown"
                            }
                            fluorescent
                          />
                        </div>
                      </div>
                    </section>

                    {/* LANDSCAPE BODY */}
                    <section className="grid min-h-0 gap-4 lg:grid-cols-[1.15fr_0.9fr_0.95fr]">

                      {/* EXECUTION PATH */}
                      <div className="fb-panel min-h-0 overflow-hidden p-4">
                        <SectionHeader
                          eyebrow="Verified execution path"
                          title="Model → Qualcomm → NPU"
                          accent="cyan"
                        />

                        <div className="mt-4 grid h-[calc(100%-54px)] min-h-0 grid-rows-[repeat(6,minmax(0,1fr))]">
                          <ExecutionNode
                            label="Model Artifact"
                            value={
                              evidence.model ||
                              "Not available"
                            }
                            tone="cyan"
                          />

                          <FlowConnector />

                          <ExecutionNode
                            label="Qualcomm AI Hub"
                            value={
                              evidence.profile_source ||
                              "Qualcomm AI Hub Workbench"
                            }
                            tone="cyan"
                          />

                          <FlowConnector />

                          <ExecutionNode
                            label="Execution Provider"
                            value={
                              evidence.execution_provider ||
                              "Not available"
                            }
                            tone="violet"
                          />

                          <FlowConnector />

                          <ExecutionNode
                            label="HTP Backend"
                            value={
                              evidence.htp_backend ||
                              "Not available"
                            }
                            tone="violet"
                          />

                          <FlowConnector />

                          <ExecutionNode
                            label="Target"
                            value={
                              evidence.target ||
                              "Not available"
                            }
                            tone="green"
                          />

                          <FlowConnector />

                          <ExecutionNode
                            label="Compute Unit"
                            value={
                              evidence.compute_unit ||
                              "Not available"
                            }
                            tone="green"
                            verified
                          />
                        </div>
                      </div>

                      {/* PERFORMANCE */}
                      <div className="fb-panel min-h-0 overflow-hidden p-4">
                        <SectionHeader
                          eyebrow="Profile performance"
                          title="Recorded Runtime Metrics"
                          accent="violet"
                        />

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <MetricTile
                            label="Profile Inference Time"
                            value={
                              evidence.profile_inference_time_us !==
                              undefined
                                ? `${evidence.profile_inference_time_us} µs`
                                : "N/A"
                            }
                            prominent
                          />

                          <MetricTile
                            label="Iterations"
                            value={
                              evidence.inference_iterations !==
                              undefined
                                ? String(
                                    evidence.inference_iterations
                                  )
                                : "N/A"
                            }
                          />

                          <MetricTile
                            label="Peak Memory"
                            value={
                              evidence.peak_inference_memory_mb !==
                              undefined
                                ? `${evidence.peak_inference_memory_mb} MB`
                                : "N/A"
                            }
                          />

                          <MetricTile
                            label="Runtime"
                            value={
                              evidence.runtime_version ||
                              "N/A"
                            }
                          />

                          <MetricTile
                            label="Input"
                            value={
                              evidence.input_name ||
                              "N/A"
                            }
                          />

                          <MetricTile
                            label="Shape"
                            value={inputShape}
                          />
                        </div>

                        <div className="mt-4 rounded-xl border border-[#203943] bg-[#09151c] p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Evidence meaning
                          </p>

                          <p className="mt-2 text-[13px] leading-5 text-slate-400">
                            These are recorded Qualcomm profile
                            values for the Snapdragon-targeted
                            artifact. They are intentionally
                            separate from public Cloud Run request
                            latency.
                          </p>
                        </div>
                      </div>

                      {/* TARGET DETAILS */}
                      <div className="fb-panel min-h-0 overflow-hidden p-4">
                        <SectionHeader
                          eyebrow="Target configuration"
                          title="Snapdragon X Elite CRD"
                          accent="green"
                        />

                        <div className="mt-4 space-y-1">
                          <DetailRow
                            label="Runtime"
                            value={evidence.runtime}
                          />

                          <DetailRow
                            label="Operating System"
                            value={evidence.os}
                          />

                          <DetailRow
                            label="Chipset"
                            value={evidence.chipset}
                          />

                          <DetailRow
                            label="Compute Unit"
                            value={evidence.compute_unit}
                          />

                          <DetailRow
                            label="Model"
                            value={evidence.model}
                          />

                          <DetailRow
                            label="Input Name"
                            value={evidence.input_name}
                          />

                          <DetailRow
                            label="Input Shape"
                            value={inputShape}
                          />

                          <DetailRow
                            label="Evidence Source"
                            value={evidence.profile_source}
                          />
                        </div>

                        <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/6 p-4">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#39FF88] shadow-[0_0_12px_rgba(57,255,136,0.55)]" />
                            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#39FF88]">
                              Verified execution
                            </span>
                          </div>

                          <p className="mt-2 text-[13px] leading-5 text-slate-400">
                            Qualcomm profiling records successful
                            execution through QNN and the HTP/NPU
                            path on the Snapdragon target.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* PROVENANCE STRIP */}
                    <section className="fb-panel px-4 py-3">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Compile & profile provenance
                          </p>

                          <p className="mt-1 text-[13px] text-slate-400">
                            Traceable Qualcomm AI Hub evidence chain
                          </p>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
                          <ProvenanceNode
                            label="Compile Job"
                            value={
                              evidence.compile_job_id ||
                              "N/A"
                            }
                          />

                          <Arrow />

                          <ProvenanceNode
                            label="Compiled Model"
                            value={
                              evidence.compiled_model_id ||
                              "N/A"
                            }
                          />

                          <Arrow />

                          <ProvenanceNode
                            label="Profile Job"
                            value={
                              evidence.profile_job_id ||
                              "N/A"
                            }
                          />

                          <Arrow />

                          <div className="rounded-lg border border-[#39FF88]/25 bg-[#39FF88]/8 px-3 py-2">
                            <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
                              Verification
                            </p>
                            <p className="mt-0.5 text-[12px] font-semibold text-[#39FF88]">
                              {evidence.status ||
                                "UNKNOWN"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  accent: "cyan" | "violet" | "green";
}) {
  const colors = {
    cyan: "text-cyan-300",
    violet: "text-violet-300",
    green: "text-[#39FF88]",
  };

  return (
    <div>
      <p
        className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${colors[accent]}`}
      >
        {eyebrow}
      </p>

      <h2 className="mt-1 text-[16px] font-semibold text-white">
        {title}
      </h2>
    </div>
  );
}

function ExecutionNode({
  label,
  value,
  tone,
  verified = false,
}: {
  label: string;
  value: string;
  tone: "cyan" | "violet" | "green";
  verified?: boolean;
}) {
  const tones = {
    cyan:
      "border-cyan-400/20 bg-cyan-400/5 text-cyan-200",
    violet:
      "border-violet-400/20 bg-violet-400/5 text-violet-200",
    green:
      "border-[#39FF88]/20 bg-[#39FF88]/5 text-[#39FF88]",
  };

  return (
    <div
      className={`flex min-h-12 items-center justify-between rounded-xl border px-3 ${tones[tone]}`}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
          {label}
        </p>

        <p className="mt-0.5 text-[13px] font-semibold text-slate-100">
          {value}
        </p>
      </div>

      {verified && (
        <span className="rounded-full border border-[#39FF88]/25 bg-[#39FF88]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#39FF88]">
          Verified
        </span>
      )}
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex h-4 items-center px-5">
      <div className="h-full w-px bg-gradient-to-b from-cyan-400/50 to-violet-400/30" />
    </div>
  );
}

function MetricTile({
  label,
  value,
  prominent = false,
}: {
  label: string;
  value: string;
  prominent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        prominent
          ? "border-violet-400/25 bg-violet-400/7"
          : "border-[#203640] bg-[#09161e]"
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 font-semibold ${
          prominent
            ? "text-[22px] text-violet-200"
            : "text-[15px] text-slate-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="flex min-h-9 items-center justify-between gap-4 border-b border-[#17303a] py-2">
      <span className="text-[12px] text-slate-500">
        {label}
      </span>

      <span className="max-w-[62%] text-right text-[12px] font-semibold text-slate-200">
        {value || "Not available"}
      </span>
    </div>
  );
}

function ProvenanceNode({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#223b46] bg-[#0a171f] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>

      <p className="mt-0.5 font-mono text-[12px] font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <span className="hidden text-slate-600 xl:inline">
      →
    </span>
  );
}

function HeroStat({
  label,
  value,
  fluorescent = false,
}: {
  label: string;
  value: string;
  fluorescent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[#203b46] bg-[#08151c]/90 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-[12px] font-semibold ${
          fluorescent
            ? "text-[#39FF88]"
            : "text-slate-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function VerifiedPill({
  verified,
}: {
  verified?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        verified
          ? "border-[#39FF88]/25 bg-[#39FF88]/8 text-[#39FF88]"
          : "border-amber-300/25 bg-amber-300/8 text-amber-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          verified
            ? "bg-[#39FF88]"
            : "bg-amber-300"
        }`}
      />

      {verified
        ? "Execution Verified"
        : "Verification Pending"}
    </span>
  );
}

function StatusBadge({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "violet";
}) {
  const classes =
    tone === "green"
      ? "border-emerald-400/20 bg-emerald-400/6 text-emerald-300"
      : "border-violet-400/20 bg-violet-400/6 text-violet-300";

  return (
    <div
      className={`hidden rounded-lg border px-3 py-2 text-[12px] sm:block ${classes}`}
    >
      <span className="mr-1.5 text-slate-500">
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function SystemStatus({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "violet";
}) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={
          tone === "green"
            ? "text-emerald-300"
            : "text-violet-300"
        }
      >
        {value}
      </span>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`mb-1 flex min-h-11 items-center gap-3 rounded-xl border px-3 text-[14px] font-medium ${
        active
          ? "border-violet-400/20 bg-violet-400/8 text-violet-200"
          : "border-transparent text-slate-400 hover:bg-[#0d1c25] hover:text-slate-100"
      }`}
    >
      <span className="w-5 text-center text-[14px]">
        {icon}
      </span>
      {label}
    </Link>
  );
}

function SidebarItem({
  label,
  icon,
}: {
  label: string;
  icon: string;
}) {
  return (
    <button className="mb-1 flex min-h-11 w-full items-center gap-3 rounded-xl border border-transparent px-3 text-left text-[14px] font-medium text-slate-400 hover:bg-[#0d1c25] hover:text-slate-100">
      <span className="w-5 text-center text-[14px]">
        {icon}
      </span>
      {label}
    </button>
  );
}

function BrandMark() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/8 text-cyan-300">
      <svg
        viewBox="0 0 40 40"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          d="M8 13h8l4-6 4 6h8v14h-8l-4 6-4-6H8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle
          cx="20"
          cy="20"
          r="4"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid min-h-full place-items-center">
      <div className="w-full max-w-4xl rounded-2xl border border-[#203943] bg-[#0a1821] p-6">
        <div className="animate-pulse">
          <div className="h-4 w-48 rounded bg-[#19313b]" />
          <div className="mt-4 h-8 w-80 rounded bg-[#17303a]" />

          <div className="mt-6 grid grid-cols-4 gap-3">
            <div className="h-16 rounded-xl bg-[#10232c]" />
            <div className="h-16 rounded-xl bg-[#10232c]" />
            <div className="h-16 rounded-xl bg-[#10232c]" />
            <div className="h-16 rounded-xl bg-[#10232c]" />
          </div>
        </div>

        <p className="mt-5 text-[13px] text-slate-500">
          Loading Snapdragon execution evidence…
        </p>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="grid min-h-full place-items-center">
      <div className="max-w-xl rounded-2xl border border-red-400/20 bg-red-400/6 p-6 text-center">
        <h2 className="text-[18px] font-semibold text-white">
          Evidence service unavailable
        </h2>

        <p className="mt-2 text-[13px] text-red-100/70">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-300 px-4 py-2 text-[13px] font-semibold text-red-950"
        >
          Retry
        </button>
      </div>
    </div>
  );
}