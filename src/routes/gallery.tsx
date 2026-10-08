import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Image Gallery — React Toolkit" },
      {
        name: "description",
        content:
          "Search and filter photos by category, preview them in a modal.",
      },
      { property: "og:title", content: "Image Gallery — React Toolkit" },
      {
        property: "og:description",
        content: "Filterable image grid with search and preview modal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GalleryPage,
});

type Category = "Nature" | "City" | "People" | "Abstract";

interface Photo {
  id: number;
  title: string;
  category: Category;
  seed: string;
}

const PHOTOS: Photo[] = [
  { id: 1, title: "Misty Ridge", category: "Nature", seed: "ridge" },
  { id: 2, title: "Neon Alley", category: "City", seed: "alley" },
  { id: 3, title: "Studio Portrait", category: "People", seed: "portrait" },
  { id: 4, title: "Chromatic Waves", category: "Abstract", seed: "waves" },
  { id: 5, title: "Forest Light", category: "Nature", seed: "forest" },
  { id: 6, title: "Skyline Dusk", category: "City", seed: "skyline" },
  { id: 7, title: "Market Vendor", category: "People", seed: "vendor" },
  { id: 8, title: "Paper Fold", category: "Abstract", seed: "fold" },
  { id: 9, title: "Ocean Horizon", category: "Nature", seed: "ocean" },
  { id: 10, title: "Old Tram", category: "City", seed: "tram" },
  { id: 11, title: "Runner", category: "People", seed: "runner" },
  { id: 12, title: "Ink Bloom", category: "Abstract", seed: "ink" },
];

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Nature",
  "City",
  "People",
  "Abstract",
];

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

function GalleryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [selected, setSelected] = useState<Photo | null>(null);

  const filtered = useMemo(
    () =>
      PHOTOS.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, category],
  );

  return (
    <PageShell
      title="Image Gallery"
      description="Search by title, filter by category, and click any photo to open a full preview."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search photos…"
            className="w-full rounded-xl border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          No photos match your search.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={img(p.seed, 400, 400)}
                  alt={p.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-6 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <p className="font-display font-semibold">{selected.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.category}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close preview"
              >
                <X className="size-4" />
              </button>
            </div>
            <img
              src={img(selected.seed, 1200, 800)}
              alt={selected.title}
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
        </div>
      )}
    </PageShell>
  );
}
