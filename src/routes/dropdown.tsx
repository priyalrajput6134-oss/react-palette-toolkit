import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/dropdown")({
  head: () => ({
    meta: [
      { title: "Searchable Dropdown — React Toolkit" },
      {
        name: "description",
        content:
          "A reusable select component with search and clear built in.",
      },
      { property: "og:title", content: "Searchable Dropdown — React Toolkit" },
      {
        property: "og:description",
        content: "Searchable, clearable single-select component demo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DropdownPage,
});

interface Option {
  value: string;
  label: string;
}

function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select…",
}: {
  options: Option[];
  value: Option | null;
  onChange: (v: Option | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
      >
        <span className={value ? "" : "text-muted-foreground"}>
          {value ? value.label : placeholder}
        </span>
        <span className="flex items-center gap-1">
          {value && (
            <span
              role="button"
              aria-label="Clear selection"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="grid size-5 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </span>
          )}
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
          <div className="relative border-b border-border">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                No matches
              </p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                    value?.value === o.value ? "text-primary" : ""
                  }`}
                >
                  {o.label}
                  {value?.value === o.value && <Check className="size-4" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const FRAMEWORKS: Option[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
  { value: "astro", label: "Astro" },
  { value: "remix", label: "Remix" },
];

const CITIES: Option[] = [
  { value: "lisbon", label: "Lisbon" },
  { value: "madrid", label: "Madrid" },
  { value: "berlin", label: "Berlin" },
  { value: "oslo", label: "Oslo" },
  { value: "tokyo", label: "Tokyo" },
  { value: "nairobi", label: "Nairobi" },
  { value: "toronto", label: "Toronto" },
];

function DropdownPage() {
  const [framework, setFramework] = useState<Option | null>(null);
  const [city, setCity] = useState<Option | null>(CITIES[0]);

  return (
    <PageShell
      title="Searchable Dropdown"
      description="A reusable select with type-to-search and a one-click clear. Two instances below share the same component."
    >
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Framework
          </p>
          <SearchableDropdown
            options={FRAMEWORKS}
            value={framework}
            onChange={setFramework}
            placeholder="Pick a framework…"
          />
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            value: {framework ? framework.value : "null"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            City (preselected)
          </p>
          <SearchableDropdown
            options={CITIES}
            value={city}
            onChange={setCity}
            placeholder="Pick a city…"
          />
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            value: {city ? city.value : "null"}
          </p>
        </div>
      </div>
    </PageShell>
  );
}
