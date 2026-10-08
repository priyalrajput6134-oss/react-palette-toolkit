import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/password")({
  head: () => ({
    meta: [
      { title: "Password Generator — React Toolkit" },
      {
        name: "description",
        content:
          "Generate secure passwords with length, numbers, symbols and case options.",
      },
      { property: "og:title", content: "Password Generator — React Toolkit" },
      {
        property: "og:description",
        content: "Tune length and character sets, then copy in one click.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PasswordPage,
});

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{};:,.<>?",
};

function generate(length: number, opts: Record<keyof typeof SETS, boolean>) {
  let pool = "";
  (Object.keys(SETS) as (keyof typeof SETS)[]).forEach((k) => {
    if (opts[k]) pool += SETS[k];
  });
  if (!pool) return "";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => pool[b % pool.length]).join("");
}

function PasswordPage() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({
    lower: true,
    upper: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regen = useCallback(() => {
    setPassword(generate(length, opts));
    setCopied(false);
  }, [length, opts]);

  useEffect(regen, [regen]);

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const activeSets = Object.values(opts).filter(Boolean).length;
  const strength =
    !password || activeSets === 0
      ? 0
      : Math.min(4, Math.floor((length / 8) * 1.5) + (activeSets >= 3 ? 1 : 0));
  const strengthLabel = ["None", "Weak", "Fair", "Good", "Strong"][strength];

  const toggle = (key: keyof typeof SETS) => {
    const next = { ...opts, [key]: !opts[key] };
    if (!Object.values(next).some(Boolean)) return; // keep at least one set
    setOpts(next);
  };

  const labels: { key: keyof typeof SETS; label: string; sample: string }[] = [
    { key: "lower", label: "Lowercase", sample: "a–z" },
    { key: "upper", label: "Uppercase", sample: "A–Z" },
    { key: "numbers", label: "Numbers", sample: "0–9" },
    { key: "symbols", label: "Symbols", sample: "!@#$" },
  ];

  return (
    <PageShell
      title="Password Generator"
      description="Choose a length and which character sets to include. Passwords are generated locally with crypto randomness."
    >
      <div className="max-w-xl rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
          <span className="flex-1 break-all font-mono text-lg">{password}</span>
          <button
            onClick={regen}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Regenerate"
          >
            <RefreshCw className="size-4" />
          </button>
          <button
            onClick={copy}
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            aria-label="Copy password"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= strength ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {strengthLabel}
          </span>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="length" className="font-medium">
              Length
            </label>
            <span className="font-mono text-primary">{length}</span>
          </div>
          <input
            id="length"
            type="range"
            min={4}
            max={48}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {labels.map(({ key, label, sample }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                opts[key]
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <span>
                {label}{" "}
                <span className="ml-1 font-mono text-xs text-muted-foreground">
                  {sample}
                </span>
              </span>
              <span
                className={`grid size-5 place-items-center rounded-md ${
                  opts[key]
                    ? "bg-primary text-primary-foreground"
                    : "border border-border"
                }`}
              >
                {opts[key] && <Check className="size-3" />}
              </span>
            </button>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
