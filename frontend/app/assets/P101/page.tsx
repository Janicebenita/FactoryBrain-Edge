import Link from "next/link";
import LiveDiagnosis from "./LiveDiagnosis";
const telemetry = [
  {
    label: "Temperature",
    value: "82 °C",
    status: "Warning",
    warning: true,
  },
  {
    label: "Vibration",
    value: "7.4 mm/s",
    status: "Warning",
    warning: true,
  },
  {
    label: "Pressure",
    value: "4.7 bar",
    status: "Normal",
    warning: false,
  },
  {
    label: "RPM",
    value: "2840",
    status: "Normal",
    warning: false,
  },
  {
    label: "Motor Current",
    value: "13.2 A",
    status: "Normal",
    warning: false,
  },
];

const evidence = [
  {
    number: "1",
    title: "Inspection Report",
    text: "Elevated vibration observed near drive-end bearing.",
  },
  {
    number: "2",
    title: "Maintenance History",
    text: "Previous bearing inspection recorded for Pump P101.",
  },
  {
    number: "3",
    title: "Equipment Manual",
    text: "High vibration may indicate bearing degradation or misalignment.",
  },
];

export default function AssetP101Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1180px] px-6 py-4">

        {/* TOP NAVIGATION */}
        <div className="flex items-end justify-between">
          <div>
            <Link
              href="/"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              ← Operations Console
            </Link>

            <p className="mt-2 text-xs font-bold tracking-[0.2em] text-cyan-400">
              FACTORYBRAIN EDGE
            </p>

            <h1 className="text-2xl font-bold">
              Asset 360 — Pump P101
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-500/15 px-4 py-2 text-xs font-bold text-amber-400">
              ● BEARING WARNING
            </span>

            <Link
              href="/runtime"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400"
            >
              Snapdragon NPU →
            </Link>
          </div>
        </div>

        {/* TELEMETRY */}
        <section className="mt-3 grid grid-cols-5 gap-2">
          {telemetry.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <p className="text-[10px] text-slate-500">
                {item.label}
              </p>

              <div className="mt-1 flex items-end justify-between">
                <p className="text-base font-bold">
                  {item.value}
                </p>

                <p
                  className={`text-[10px] font-bold ${
                    item.warning
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* MAIN THREE COLUMN VIEW */}
        <section className="mt-3 grid grid-cols-[0.85fr_1.08fr_1.12fr] gap-3">

          {/* DIGITAL TWIN */}
          <div className="flex min-h-[455px] flex-col rounded-xl border border-cyan-500/30 bg-slate-900 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-cyan-400">
                  DIGITAL TWIN
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Pump P101
                </h2>
              </div>

              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[9px] font-semibold text-cyan-400">
                LIVE ASSET
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[3px] border-cyan-500/40">
                <span className="absolute right-1 top-2 h-4 w-4 rounded-full bg-amber-400" />

                <div className="text-center">
                  <div className="text-3xl">⚙️</div>

                  <p className="mt-1 text-xs font-bold">
                    Process Pump
                  </p>

                  <p className="text-[9px] text-cyan-400">
                    P101
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <ComponentStatus label="Motor" status="Healthy" />
              <ComponentStatus label="Impeller" status="Healthy" />
              <ComponentStatus label="Bearing" status="Warning" warning />
              <ComponentStatus label="Seal" status="Healthy" />
            </div>
          </div>

          {/* LIVE PREDICTIVE MAINTENANCE */}
<LiveDiagnosis />

          {/* EVIDENCE INTELLIGENCE */}
          <div className="flex min-h-[455px] flex-col rounded-xl border border-emerald-500/30 bg-slate-900 p-4">
            <p className="text-xs font-bold text-emerald-400">
              EVIDENCE INTELLIGENCE
            </p>

            <h2 className="mt-1 text-lg font-bold">
              Why did the AI flag P101?
            </h2>

            <div className="mt-3 space-y-2">
              {evidence.map((item) => (
                <div
                  key={item.number}
                  className="flex gap-3 rounded-lg border border-slate-800 bg-slate-950 px-3 py-3"
                >
                  {/* Larger evidence number */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">
                    {item.number}
                  </div>

                  <div>
                    {/* ONLY THESE EVIDENCE FONTS ARE ENLARGED */}
                    <p className="text-sm font-bold text-emerald-400">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-300">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
              <p className="text-[9px] font-bold text-amber-400">
                ROOT CAUSE HYPOTHESIS
              </p>

              <p className="mt-1 text-xs font-semibold">
                Drive-end bearing degradation or shaft misalignment.
              </p>
            </div>

            <div className="mt-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-3 py-2">
              <p className="text-[9px] font-bold text-cyan-400">
                RECOMMENDED ACTION
              </p>

              <p className="mt-1 text-xs font-semibold">
                Inspect drive-end bearing, verify alignment, and review
                lubrication condition.
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-2 text-[9px] text-slate-500">
              <span>Snapdragon X Elite CRD</span>

              <span className="font-bold text-emerald-400">
                NPU VERIFIED
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ComponentStatus({
  label,
  status,
  warning = false,
}: {
  label: string;
  status: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-md bg-slate-950 px-3 py-2">
      <p className="text-[9px] text-slate-500">
        {label}
      </p>

      <p
        className={`text-[10px] font-bold ${
          warning ? "text-amber-400" : "text-emerald-400"
        }`}
      >
        {status}
      </p>
    </div>
  );
}