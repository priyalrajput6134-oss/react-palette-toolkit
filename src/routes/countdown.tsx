import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/countdown")({
  head: () => ({
    meta: [
      { title: "Countdown Timer — React Toolkit" },
      {
        name: "description",
        content: "Set a duration and start, pause or reset a live countdown.",
      },
      { property: "og:title", content: "Countdown Timer — React Toolkit" },
      {
        property: "og:description",
        content: "Countdown timer with start, pause and reset.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CountdownPage,
});

function fmt(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function CountdownPage() {
  const [minutes, setMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const applyDuration = (mins: number) => {
    setMinutes(mins);
    setSecondsLeft(mins * 60);
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(minutes * 60);
  };

  const total = minutes * 60;
  const progress = total > 0 ? secondsLeft / total : 0;
  const finished = secondsLeft === 0;

  return (
    <PageShell
      title="Countdown Timer"
      description="Pick a duration, then start, pause or reset. The ring tracks how much time is left."
    >
      <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border bg-card p-8">
        <div className="flex gap-2">
          {[1, 5, 10, 25].map((m) => (
            <button
              key={m}
              onClick={() => applyDuration(m)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                minutes === m
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}m
            </button>
          ))}
        </div>

        <div className="relative mt-8 grid size-56 place-items-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              strokeWidth="4"
              className="stroke-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
              className="stroke-primary transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="text-center">
            <p className="font-display text-5xl font-semibold tabular-nums tracking-tight">
              {fmt(secondsLeft)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {finished ? "Done" : running ? "Running" : "Paused"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={finished}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            {running ? (
              <>
                <Pause className="size-4" /> Pause
              </>
            ) : (
              <>
                <Play className="size-4" /> Start
              </>
            )}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
        </div>
      </div>
    </PageShell>
  );
}
