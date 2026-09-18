"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

type IconName =
  | "overview"
  | "asset"
  | "ai"
  | "runtime"
  | "activity"
  | "reports"
  | "settings"
  | "cloud"
  | "cpu"
  | "search"
  | "pulse"
  | "temperature"
  | "gauge"
  | "pressure"
  | "rpm"
  | "current"
  | "warning"
  | "check"
  | "arrow"
  | "spark"
  | "menu";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://factorybrain-edge-751411693796.asia-south1.run.app";

const NORMAL_SAMPLE: TelemetryState = {
  temperature: 72.5,
  vibration: 2.1,
  pressure: 4.8,
  rpm: 1450,
  motor_current: 12.4,
};

const WARNING_SAMPLE: TelemetryState = {
  temperature: 82,
  vibration: 7.4,
  pressure: 4.7,
  rpm: 2840,
  motor_current: 13.2,
};

export default function Home() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [telemetry, setTelemetry] =
    useState<TelemetryState>(WARNING_SAMPLE);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const diagnosisLabel = prediction
    ? prediction.prediction.replaceAll("_", " ")
    : "Awaiting analysis";

  const recommendation = getRecommendation(
    prediction?.prediction
  );

  const currentState = useMemo(() => {
    if (prediction) {
      if (prediction.prediction === "normal") {
        return {
          label: "Healthy",
          tone: "healthy" as const,
          detail: "Model indicates normal operation",
        };
      }

      return {
        label: formatDiagnosis(prediction.prediction),
        tone: "warning" as const,
        detail: "AI inspection recommended",
      };
    }

    if (
      telemetry.vibration >= 6 ||
      telemetry.temperature >= 80
    ) {
      return {
        label: "Attention",
        tone: "warning" as const,
        detail: "Telemetry exceeds demo baseline",
      };
    }

    return {
      label: "Nominal",
      tone: "healthy" as const,
      detail: "Telemetry within demo baseline",
    };
  }, [prediction, telemetry]);

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

  function loadSample(sample: TelemetryState) {
    setTelemetry(sample);
    setPrediction(null);
    setError("");
  }

  async function runDiagnosis() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(telemetry),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Prediction request failed: ${response.status}`
        );
      }

      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach the inference service."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="factory-workspace text-[15px] text-slate-100">
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

          <nav
            aria-label="Primary navigation"
            className="flex-1 px-3 py-5"
          >
            <NavItem
              active
              icon="overview"
              label="Overview"
            />
            <NavItem icon="asset" label="Assets" />
            <NavItem icon="ai" label="Diagnostics" />

            <Link
              href="/runtime"
              className="group mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 text-[14px] font-medium text-slate-400 hover:bg-[#0d1c25] hover:text-slate-100"
              title="Snapdragon runtime evidence"
            >
              <Icon
                name="runtime"
                className="h-[18px] w-[18px]"
              />
              <span>Runtime Evidence</span>
            </Link>

            <NavItem icon="activity" label="Activity" />
            <NavItem icon="reports" label="Reports" />
            <NavItem icon="settings" label="Settings" />
          </nav>

          <div className="space-y-3 border-t border-[#17303a] p-4">
            <SystemStatus
              icon="cloud"
              label="Cloud API"
              value="Online"
              tone="healthy"
            />
            <SystemStatus
              icon="cpu"
              label="Snapdragon"
              value="Verified"
              tone="runtime"
            />

            <div className="rounded-xl border border-[#17303a] bg-[#0a161e] p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                Demo environment
              </p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                Process Pump P101
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN APPLICATION */}
        <section className="min-w-0 bg-[#081219]">
          <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-0">

            {/* TOP BAR */}
            <header className="flex min-h-16 items-center justify-between border-b border-[#17303a] bg-[#09141b]/95 px-4 sm:px-5 lg:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() =>
                    setMobileNavOpen((value) => !value)
                  }
                  className="grid h-10 w-10 place-items-center rounded-lg border border-[#213a45] bg-[#0c1b24] text-slate-300 lg:hidden"
                  aria-label="Toggle navigation"
                >
                  <Icon
                    name="menu"
                    className="h-5 w-5"
                  />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                    <span>Assets</span>
                    <span>/</span>
                    <span className="text-slate-300">
                      P101
                    </span>
                  </div>
                  <h1 className="truncate text-[20px] font-semibold tracking-[-0.02em] text-white sm:text-[22px]">
                    Process Pump
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-lg border border-[#1d3641] bg-[#0b1820] px-3 py-2 text-[13px] text-slate-400 md:flex">
                  <Icon
                    name="search"
                    className="h-4 w-4"
                  />
                  <span>Search assets</span>
                  <span className="ml-4 rounded border border-[#28434e] px-1.5 py-0.5 text-[10px] text-slate-500">
                    ⌘K
                  </span>
                </div>

                <StatusPill
                  icon="cloud"
                  label="Cloud API"
                  value="Online"
                  tone="healthy"
                />

                <Link
                  href="/runtime"
                  className="hidden items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/8 px-3 py-2 text-[13px] font-medium text-violet-300 hover:border-violet-400/40 hover:bg-violet-400/12 sm:flex"
                >
                  <Icon
                    name="cpu"
                    className="h-4 w-4"
                  />
                  NPU Verified
                </Link>
              </div>
            </header>

            {/* MOBILE NAV */}
            {mobileNavOpen && (
              <div className="border-b border-[#17303a] bg-[#071017] p-3 lg:hidden">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <MobileNav label="Overview" />
                  <MobileNav label="Assets" />
                  <MobileNav label="Diagnostics" />
                  <Link
                    href="/runtime"
                    className="rounded-lg border border-[#1b3540] bg-[#0b1a22] px-3 py-3 text-center text-sm font-medium text-slate-200"
                  >
                    Runtime
                  </Link>
                </div>
              </div>
            )}

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto lg:overflow-hidden">
              <div className="grid min-h-full gap-3 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-4 lg:p-4 xl:grid-cols-[minmax(0,1fr)_300px]">

                {/* LEFT WORKSPACE */}
                <div className="grid min-w-0 gap-3 lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:overflow-hidden">

                  {/* ASSET HERO */}
                  <section className="factory-industrial-bg relative overflow-hidden rounded-2xl border border-[#1d3540] px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                    <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <AssetVisual />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
                              Asset P101
                            </span>

                            <StateBadge
                              tone={currentState.tone}
                              label={currentState.label}
                            />
                          </div>

                          <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.025em] text-white sm:text-[24px]">
                            Process Pump
                          </h2>

                          <p className="mt-1 max-w-2xl text-[13px] leading-5 text-slate-400">
                            Industrial predictive-maintenance
                            demonstration using five telemetry
                            signals and ONNX inference.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:min-w-[250px]">
                        <HeroMeta
                          label="Current State"
                          value={currentState.label}
                        />
                        <HeroMeta
                          label="Inference"
                          value="Cloud"
                        />
                        <HeroMeta
                          label="Model"
                          value="pump_mlp"
                        />
                        <HeroMeta
                          label="Evidence"
                          value="NPU Verified"
                        />
                      </div>
                    </div>
                  </section>

                  {/* TELEMETRY */}
                  <section className="fb-panel fb-compact-pad p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon
                            name="pulse"
                            className="h-4 w-4 text-cyan-300"
                          />
                          <h2 className="text-[15px] font-semibold text-white">
                            Live Telemetry
                          </h2>
                        </div>
                        <p className="mt-1 text-[12px] text-slate-500">
                          Adjust sensor values or load a demo preset.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <PresetButton
                          onClick={() =>
                            loadSample(NORMAL_SAMPLE)
                          }
                          label="Normal"
                          tone="healthy"
                        />
                        <PresetButton
                          onClick={() =>
                            loadSample(WARNING_SAMPLE)
                          }
                          label="Warning"
                          tone="warning"
                        />
                        <button
                          onClick={() =>
                            loadSample(WARNING_SAMPLE)
                          }
                          className="min-h-9 rounded-lg border border-[#263e48] bg-[#0b1820] px-3 text-[12px] font-semibold text-slate-400 hover:border-[#35515d] hover:text-slate-200"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="fb-compact-gap mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                      <TelemetryControl
                        icon="temperature"
                        label="Temperature"
                        value={telemetry.temperature}
                        unit="°C"
                        min={20}
                        max={120}
                        step={0.5}
                        tone={
                          telemetry.temperature >= 80
                            ? "warning"
                            : "normal"
                        }
                        onChange={(value) =>
                          updateTelemetry(
                            "temperature",
                            value
                          )
                        }
                      />

                      <TelemetryControl
                        icon="gauge"
                        label="Vibration"
                        value={telemetry.vibration}
                        unit="mm/s"
                        min={0}
                        max={15}
                        step={0.1}
                        tone={
                          telemetry.vibration >= 6
                            ? "warning"
                            : "normal"
                        }
                        onChange={(value) =>
                          updateTelemetry(
                            "vibration",
                            value
                          )
                        }
                      />

                      <TelemetryControl
                        icon="pressure"
                        label="Pressure"
                        value={telemetry.pressure}
                        unit="bar"
                        min={0}
                        max={10}
                        step={0.1}
                        tone="normal"
                        onChange={(value) =>
                          updateTelemetry(
                            "pressure",
                            value
                          )
                        }
                      />

                      <TelemetryControl
                        icon="rpm"
                        label="RPM"
                        value={telemetry.rpm}
                        unit="rpm"
                        min={500}
                        max={4000}
                        step={10}
                        tone="normal"
                        onChange={(value) =>
                          updateTelemetry("rpm", value)
                        }
                      />

                      <TelemetryControl
                        icon="current"
                        label="Motor Current"
                        value={telemetry.motor_current}
                        unit="A"
                        min={0}
                        max={30}
                        step={0.1}
                        tone="normal"
                        onChange={(value) =>
                          updateTelemetry(
                            "motor_current",
                            value
                          )
                        }
                      />
                    </div>

                    <div className="mt-4 flex flex-col gap-3 border-t border-[#17303a] pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-2 text-[12px] text-slate-500">
                        <span className="fb-status-dot fb-status-online" />
                        <span>
                          API connected to Google Cloud Run
                        </span>
                      </div>

                      <button
                        onClick={runDiagnosis}
                        disabled={loading}
                        className="group flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-[14px] font-semibold text-[#041116] shadow-[0_8px_28px_rgba(25,195,216,0.18)] hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[190px]"
                      >
                        {loading ? (
                          <>
                            <LoadingMark />
                            Running diagnosis
                          </>
                        ) : (
                          <>
                            <Icon
                              name="spark"
                              className="h-4 w-4"
                            />
                            Run AI Diagnosis
                          </>
                        )}
                      </button>
                    </div>
                  </section>

                  {/* DIAGNOSIS */}
                  <section className="fb-panel min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#17303a] px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon
                            name="ai"
                            className="h-4 w-4 text-violet-300"
                          />
                          <h2 className="text-[15px] font-semibold text-white">
                            AI Diagnosis
                          </h2>
                        </div>
                        <p className="mt-0.5 text-[12px] text-slate-500">
                          Model result, confidence and recommended action
                        </p>
                      </div>

                      {prediction?.execution && (
                        <div className="hidden items-center gap-2 rounded-lg border border-[#263c47] bg-[#09151c] px-3 py-1.5 text-[11px] text-slate-400 sm:flex">
                          {prediction.execution.runtime}
                          <span className="text-slate-700">
                            •
                          </span>
                          {prediction.execution.model}
                        </div>
                      )}
                    </div>

                    <div className="h-full min-h-0 p-4">
                      {error ? (
                        <ErrorState
                          message={error}
                          onRetry={runDiagnosis}
                        />
                      ) : loading ? (
                        <DiagnosisLoading />
                      ) : prediction ? (
                        <DiagnosisResult
                          prediction={prediction}
                          diagnosisLabel={diagnosisLabel}
                          recommendation={recommendation}
                        />
                      ) : (
                        <EmptyDiagnosis
                          onRun={runDiagnosis}
                        />
                      )}
                    </div>
                  </section>
                </div>

                {/* RIGHT CONTEXT */}
                <aside className="grid gap-3 lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:overflow-hidden">
                  <AssetHealthPanel
                    currentState={currentState}
                    telemetry={telemetry}
                  />

                  <FleetPanel />

                  <SnapdragonPanel />
                </aside>
              </div>
            </div>

            {/* MOBILE BOTTOM NAV */}
            <nav
              aria-label="Mobile navigation"
              className="grid grid-cols-4 border-t border-[#17303a] bg-[#071017] lg:hidden"
            >
              <BottomNav
                icon="overview"
                label="Overview"
                active
              />
              <BottomNav icon="asset" label="Assets" />
              <BottomNav icon="ai" label="AI" />
              <Link
                href="/runtime"
                className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-400"
              >
                <Icon
                  name="runtime"
                  className="h-4 w-4"
                />
                Runtime
              </Link>
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}

function DiagnosisResult({
  prediction,
  diagnosisLabel,
  recommendation,
}: {
  prediction: Prediction;
  diagnosisLabel: string;
  recommendation: string;
}) {
  const entries = Object.entries(
    prediction.class_probabilities ?? {}
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="flex min-h-0 flex-col justify-between rounded-xl border border-[#253a44] bg-[#09151c] p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Current diagnosis
          </p>

          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h3
  className={`text-[22px] font-semibold capitalize tracking-[-0.02em] ${
    prediction.prediction === "normal"
      ? "text-[#39FF88]"
      : prediction.prediction === "bearing_warning"
      ? "text-amber-300"
      : "text-red-300"
  }`}
>
  {diagnosisLabel}
</h3>
              <p className="mt-1 text-[13px] text-slate-400">
                Asset {prediction.asset_id}
              </p>
            </div>

            <div className="text-right">
              <p className="fb-mono text-[24px] font-semibold text-white">
                {(prediction.risk_score * 100).toFixed(1)}%
              </p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                Confidence
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[12px] font-semibold text-slate-300">
              Recommended action
            </p>
            <p className="mt-1.5 text-[13px] leading-5 text-slate-400">
              {recommendation}
            </p>
          </div>
        </div>

        {prediction.execution && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#17303a] pt-3 text-[11px] text-slate-500">
            <span>
              Runtime:{" "}
              <strong className="font-medium text-slate-300">
                {prediction.execution.runtime}
              </strong>
            </span>
            <span>
              Provider:{" "}
              <strong className="font-medium text-slate-300">
                {prediction.execution.provider}
              </strong>
            </span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#253a44] bg-[#09151c] p-4">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold text-slate-300">
            Class probabilities
          </p>
          <span className="text-[11px] text-slate-600">
            Model distribution
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {entries.length > 0 ? (
            entries.map(([label, probability]) => (
              <ProbabilityBar
                key={label}
                label={label}
                probability={probability}
              />
            ))
          ) : (
            <p className="text-[13px] text-slate-500">
              Class probabilities were not returned by the API.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProbabilityBar({
  label,
  probability,
}: {
  label: string;
  probability: number;
}) {
  const value = Math.max(
    0,
    Math.min(100, probability * 100)
  );

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-[12px] capitalize text-slate-400">
          {label.replaceAll("_", " ")}
        </span>
        <span className="fb-mono text-[12px] font-semibold text-slate-200">
          {value.toFixed(1)}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#142832]">
        <div
          className="h-full rounded-full bg-cyan-400 transition-[width] duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function EmptyDiagnosis({
  onRun,
}: {
  onRun: () => void;
}) {
  return (
    <div className="flex h-full min-h-[170px] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-violet-400/20 bg-violet-400/8 text-violet-300">
          <Icon
            name="ai"
            className="h-5 w-5"
          />
        </div>

        <h3 className="mt-3 text-[16px] font-semibold text-white">
          Ready for diagnosis
        </h3>

        <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
          Review or adjust telemetry, then run FactoryBrain AI.
        </p>

        <button
          onClick={onRun}
          className="mt-4 rounded-lg border border-[#294651] bg-[#0c1d25] px-4 py-2 text-[13px] font-semibold text-cyan-300 hover:border-cyan-400/40"
        >
          Run diagnosis
        </button>
      </div>
    </div>
  );
}

function DiagnosisLoading() {
  return (
    <div className="grid h-full min-h-[170px] gap-3 sm:grid-cols-2">
      <div className="animate-pulse rounded-xl border border-[#1a313b] bg-[#0a171f] p-4">
        <div className="h-3 w-24 rounded bg-[#1b323d]" />
        <div className="mt-4 h-7 w-40 rounded bg-[#19303a]" />
        <div className="mt-3 h-3 w-full rounded bg-[#142832]" />
        <div className="mt-2 h-3 w-4/5 rounded bg-[#142832]" />
      </div>

      <div className="animate-pulse rounded-xl border border-[#1a313b] bg-[#0a171f] p-4">
        <div className="h-3 w-28 rounded bg-[#1b323d]" />
        <div className="mt-5 space-y-4">
          <div className="h-2 rounded bg-[#142832]" />
          <div className="h-2 rounded bg-[#142832]" />
          <div className="h-2 rounded bg-[#142832]" />
          <div className="h-2 rounded bg-[#142832]" />
        </div>
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
    <div className="flex h-full min-h-[170px] items-center justify-center">
      <div className="max-w-md rounded-xl border border-red-400/20 bg-red-400/6 p-5 text-center">
        <Icon
          name="warning"
          className="mx-auto h-6 w-6 text-red-300"
        />
        <h3 className="mt-3 text-[15px] font-semibold text-white">
          Inference service unavailable
        </h3>
        <p className="mt-1.5 text-[13px] leading-5 text-red-100/70">
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

function TelemetryControl({
  icon,
  label,
  value,
  unit,
  min,
  max,
  step,
  tone,
  onChange,
}: {
  icon: IconName;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  tone: "normal" | "warning";
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-[#203640] bg-[#09161e] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon
            name={icon}
            className={`h-4 w-4 ${
              tone === "warning"
                ? "text-amber-300"
                : "text-cyan-300"
            }`}
          />
          <span className="truncate text-[12px] font-medium text-slate-400">
            {label}
          </span>
        </div>

        {tone === "warning" && (
          <span className="rounded-full bg-amber-300/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-amber-300">
            High
          </span>
        )}
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <span className="fb-mono text-[21px] font-semibold tracking-[-0.04em] text-white">
            {formatTelemetryValue(value)}
          </span>
          <span className="ml-1 text-[11px] text-slate-500">
            {unit}
          </span>
        </div>

        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
          aria-label={`${label} numeric value`}
          className="w-[66px] rounded-md border border-[#29424d] bg-[#0d1e27] px-2 py-1 text-right text-[11px] font-medium text-slate-300 outline-none focus:border-cyan-400"
        />
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
        aria-label={`${label} slider`}
        className="mt-3 h-1.5 w-full cursor-pointer accent-cyan-400"
      />
    </div>
  );
}

function AssetHealthPanel({
  currentState,
  telemetry,
}: {
  currentState: {
    label: string;
    tone: "healthy" | "warning";
    detail: string;
  };
  telemetry: TelemetryState;
}) {
  const attention =
    currentState.tone === "warning";

  return (
    <section className="fb-panel fb-compact-pad p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Asset Health
          </p>
          <h2 className="mt-1 text-[18px] font-semibold text-white">
            {currentState.label}
          </h2>
        </div>

        <div
          className={`grid h-10 w-10 place-items-center rounded-xl border ${
            attention
              ? "border-amber-300/20 bg-amber-300/8 text-amber-300"
              : "border-emerald-300/20 bg-emerald-300/8 text-emerald-300"
          }`}
        >
          <Icon
            name={attention ? "warning" : "check"}
            className="h-5 w-5"
          />
        </div>
      </div>

      <p className="mt-2 text-[12px] leading-5 text-slate-500">
        {currentState.detail}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniMetric
          label="Temperature"
          value={`${telemetry.temperature} °C`}
        />
        <MiniMetric
          label="Vibration"
          value={`${telemetry.vibration} mm/s`}
        />
        <MiniMetric
          label="Pressure"
          value={`${telemetry.pressure} bar`}
        />
        <MiniMetric
          label="Motor"
          value={`${telemetry.motor_current} A`}
        />
      </div>
    </section>
  );
}

function FleetPanel() {
  return (
    <section className="fb-panel fb-compact-pad p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Demo Fleet
          </p>
          <h2 className="mt-1 text-[15px] font-semibold text-white">
            Asset Summary
          </h2>
        </div>

        <span className="fb-mono text-[22px] font-semibold text-white">
          18
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <FleetMetric
          label="Healthy"
          value="14"
          tone="healthy"
        />
        <FleetMetric
          label="Warning"
          value="3"
          tone="warning"
        />
        <FleetMetric
          label="Critical"
          value="1"
          tone="critical"
        />
      </div>
    </section>
  );
}

function SnapdragonPanel() {
  return (
    <section className="fb-panel relative min-h-0 overflow-hidden p-4">
      <div className="absolute right-[-40px] top-[-30px] h-32 w-32 rounded-full bg-violet-400/8 blur-2xl" />

      <div className="relative flex h-full min-h-[180px] flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">
              Snapdragon Evidence
            </p>
            <h2 className="mt-1.5 text-[18px] font-semibold text-white">
              NPU Execution Verified
            </h2>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-xl border border-violet-400/20 bg-violet-400/8 text-violet-300">
            <Icon
              name="cpu"
              className="h-5 w-5"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <EvidenceLine
            label="Target"
            value="Snapdragon X Elite CRD"
          />
          <EvidenceLine
            label="Chipset"
            value="SC8380XP"
          />
          <EvidenceLine
            label="Compute"
            value="NPU"
          />
          <EvidenceLine
            label="Status"
            value="VERIFIED"
          />
        </div>

        <div className="mt-auto pt-4">
          <Link
            href="/runtime"
            className="flex min-h-10 items-center justify-between rounded-lg border border-violet-400/20 bg-violet-400/6 px-3 text-[12px] font-semibold text-violet-200 hover:border-violet-400/40 hover:bg-violet-400/10"
          >
            View execution evidence
            <Icon
              name="arrow"
              className="h-4 w-4"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EvidenceLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#172d36] pb-2 text-[12px]">
      <span className="text-slate-500">
        {label}
      </span>
      <span className="text-right font-medium text-slate-300">
        {value}
      </span>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#1d333d] bg-[#0a171f] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.1em] text-slate-600">
        {label}
      </p>
      <p className="mt-1 fb-mono text-[12px] font-semibold text-slate-300">
        {value}
      </p>
    </div>
  );
}

function FleetMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "healthy" | "warning" | "critical";
}) {
  const tones = {
    healthy: "text-emerald-300",
    warning: "text-amber-300",
    critical: "text-red-300",
  };

  return (
    <div className="rounded-lg border border-[#1d333d] bg-[#0a171f] px-3 py-2 text-center">
      <p
        className={`fb-mono text-[18px] font-semibold ${tones[tone]}`}
      >
        {value}
      </p>
      <p className="text-[10px] text-slate-600">
        {label}
      </p>
    </div>
  );
}

function HeroMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-[#07131a]/70 px-3 py-2 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.11em] text-slate-600">
        {label}
      </p>
      <p className="mt-0.5 truncate text-[12px] font-medium text-slate-200">
        {value}
      </p>
    </div>
  );
}

function PresetButton({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: "healthy" | "warning";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-9 rounded-lg border px-3 text-[12px] font-semibold ${
        tone === "healthy"
          ? "border-emerald-300/20 bg-emerald-300/6 text-emerald-300 hover:border-emerald-300/40"
          : "border-amber-300/20 bg-amber-300/6 text-amber-300 hover:border-amber-300/40"
      }`}
    >
      Load {label}
    </button>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`mb-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] font-medium ${
        active
          ? "border border-cyan-400/15 bg-cyan-400/8 text-cyan-200"
          : "border border-transparent text-slate-400 hover:bg-[#0d1c25] hover:text-slate-100"
      }`}
      title={label}
    >
      <Icon
        name={icon}
        className="h-[18px] w-[18px]"
      />
      <span>{label}</span>
    </button>
  );
}

function MobileNav({
  label,
}: {
  label: string;
}) {
  return (
    <button className="rounded-lg border border-[#1b3540] bg-[#0b1a22] px-3 py-3 text-sm font-medium text-slate-200">
      {label}
    </button>
  );
}

function BottomNav({
  icon,
  label,
  active = false,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
        active ? "text-cyan-300" : "text-slate-500"
      }`}
    >
      <Icon
        name={icon}
        className="h-4 w-4"
      />
      {label}
    </button>
  );
}

function SystemStatus({
  icon,
  label,
  value,
  tone,
}: {
  icon: IconName;
  label: string;
  value: string;
  tone: "healthy" | "runtime";
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12px]">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon
          name={icon}
          className="h-4 w-4"
        />
        <span>{label}</span>
      </div>
      <span
        className={
          tone === "healthy"
            ? "text-emerald-300"
            : "text-violet-300"
        }
      >
        {value}
      </span>
    </div>
  );
}

function StatusPill({
  icon,
  label,
  value,
  tone,
}: {
  icon: IconName;
  label: string;
  value: string;
  tone: "healthy";
}) {
  return (
    <div className="hidden items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/6 px-3 py-2 text-[12px] sm:flex">
      <Icon
        name={icon}
        className="h-4 w-4 text-emerald-300"
      />
      <span className="hidden text-slate-500 xl:inline">
        {label}
      </span>
      <span className="font-medium text-emerald-300">
        {value}
      </span>
    </div>
  );
}

function StateBadge({
  tone,
  label,
}: {
  tone: "healthy" | "warning";
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        tone === "healthy"
          ? "border-emerald-300/20 bg-emerald-300/8 text-emerald-300"
          : "border-amber-300/20 bg-amber-300/8 text-amber-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "healthy"
            ? "bg-emerald-300"
            : "bg-amber-300"
        }`}
      />
      {label}
    </span>
  );
}

function AssetVisual() {
  return (
    <div className="hidden h-[74px] w-[94px] shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-[#0b1e27]/80 sm:flex">
      <svg
        viewBox="0 0 120 88"
        className="h-[58px] w-[76px]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="pumpBody"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#244653" />
            <stop offset="100%" stopColor="#0f2833" />
          </linearGradient>
        </defs>
        <rect
          x="16"
          y="56"
          width="88"
          height="8"
          rx="4"
          fill="#1d3c48"
        />
        <circle
          cx="50"
          cy="42"
          r="22"
          fill="url(#pumpBody)"
          stroke="#3a6a78"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="42"
          r="8"
          fill="#102832"
          stroke="#6eb9c7"
          strokeWidth="2"
        />
        <path
          d="M72 36 H98 V49 H75"
          fill="#173946"
          stroke="#3a6a78"
          strokeWidth="2"
        />
        <rect
          x="28"
          y="60"
          width="10"
          height="10"
          rx="2"
          fill="#1a3340"
        />
        <rect
          x="72"
          y="60"
          width="10"
          height="10"
          rx="2"
          fill="#1a3340"
        />
        <path
          d="M20 42 H9 V26 H22"
          fill="none"
          stroke="#3a6a78"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="42"
          r="2.5"
          fill="#22d3ee"
        />
      </svg>
    </div>
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

function LoadingMark() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#08313a] border-t-transparent" />
  );
}

function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    overview: (
      <>
        <rect {...common} x="3" y="3" width="7" height="7" rx="1" />
        <rect {...common} x="14" y="3" width="7" height="7" rx="1" />
        <rect {...common} x="3" y="14" width="7" height="7" rx="1" />
        <rect {...common} x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    asset: (
      <>
        <path {...common} d="M4 17h16v3H4z" />
        <circle {...common} cx="10" cy="11" r="5" />
        <path {...common} d="M15 9h5v4h-5M5 11H2V7h4" />
      </>
    ),
    ai: (
      <>
        <rect {...common} x="5" y="5" width="14" height="14" rx="3" />
        <path {...common} d="M9 10h6M9 14h6M12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
    runtime: (
      <>
        <rect {...common} x="5" y="5" width="14" height="14" rx="2" />
        <path {...common} d="M9 9h6v6H9zM12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
    activity: (
      <path {...common} d="M3 12h4l2-6 4 12 2-6h6" />
    ),
    reports: (
      <>
        <path {...common} d="M5 3h10l4 4v14H5z" />
        <path {...common} d="M15 3v5h5M8 13h8M8 17h6" />
      </>
    ),
    settings: (
      <>
        <circle {...common} cx="12" cy="12" r="3" />
        <path {...common} d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </>
    ),
    cloud: (
      <path {...common} d="M7 18h10a4 4 0 0 0 .6-7.9A6 6 0 0 0 6.2 8.5 4.5 4.5 0 0 0 7 18z" />
    ),
    cpu: (
      <>
        <rect {...common} x="6" y="6" width="12" height="12" rx="2" />
        <path {...common} d="M9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
      </>
    ),
    search: (
      <>
        <circle {...common} cx="11" cy="11" r="6" />
        <path {...common} d="m16 16 5 5" />
      </>
    ),
    pulse: (
      <path {...common} d="M3 12h4l2-5 4 10 2-5h6" />
    ),
    temperature: (
      <>
        <path {...common} d="M10 4a2 2 0 0 1 4 0v9.2a4 4 0 1 1-4 0z" />
        <path {...common} d="M12 8v7" />
      </>
    ),
    gauge: (
      <>
        <path {...common} d="M4 16a8 8 0 1 1 16 0" />
        <path {...common} d="m12 12 4-4" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </>
    ),
    pressure: (
      <>
        <circle {...common} cx="12" cy="12" r="8" />
        <path {...common} d="m12 12 3-4M7 16h10" />
      </>
    ),
    rpm: (
      <>
        <path {...common} d="M5 7a8 8 0 1 1-1 8" />
        <path {...common} d="M4 7h5V2" />
      </>
    ),
    current: (
      <path {...common} d="M13 2 6 13h5l-1 9 8-12h-5z" />
    ),
    warning: (
      <>
        <path {...common} d="M12 3 2.5 20h19z" />
        <path {...common} d="M12 9v4M12 17h.01" />
      </>
    ),
    check: (
      <>
        <circle {...common} cx="12" cy="12" r="9" />
        <path {...common} d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    arrow: (
      <path {...common} d="M5 12h14M14 7l5 5-5 5" />
    ),
    spark: (
      <path {...common} d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5zM18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8z" />
    ),
    menu: (
      <path {...common} d="M4 7h16M4 12h16M4 17h16" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function formatTelemetryValue(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

function formatDiagnosis(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
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