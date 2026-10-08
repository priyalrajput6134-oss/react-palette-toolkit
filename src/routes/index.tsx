import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CloudSun,
  Images,
  KanbanSquare,
  KeyRound,
  Timer,
  ChevronsUpDown,
  UploadCloud,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "React Toolkit — 7 Interactive Mini-Apps" },
      {
        name: "description",
        content:
          "Seven self-contained React mini-apps: weather dashboard, image gallery, kanban board, password generator, countdown timer, searchable dropdown and file upload.",
      },
      { property: "og:title", content: "React Toolkit — 7 Interactive Mini-Apps" },
      {
        property: "og:description",
        content:
          "Weather, gallery, kanban, password generator, countdown, dropdown and file upload — all in one toolkit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tools = [
  {
    to: "/weather",
    icon: CloudSun,
    name: "Weather Dashboard",
    desc: "Search any city for temperature, humidity and wind conditions.",
    tag: "01",
  },
  {
    to: "/gallery",
    icon: Images,
    name: "Image Gallery",
    desc: "Search and filter photos by category, preview them in a modal.",
    tag: "02",
  },
  {
    to: "/kanban",
    icon: KanbanSquare,
    name: "Kanban Board",
    desc: "Drag cards across Todo, In Progress, Review and Done columns.",
    tag: "03",
  },
  {
    to: "/password",
    icon: KeyRound,
    name: "Password Generator",
    desc: "Tune length, numbers, symbols and case — then copy in one click.",
    tag: "04",
  },
  {
    to: "/countdown",
    icon: Timer,
    name: "Countdown Timer",
    desc: "Set a duration and start, pause or reset a live countdown.",
    tag: "05",
  },
  {
    to: "/dropdown",
    icon: ChevronsUpDown,
    name: "Searchable Dropdown",
    desc: "A reusable select component with search and clear built in.",
    tag: "06",
  },
  {
    to: "/upload",
    icon: UploadCloud,
    name: "File Upload",
    desc: "Type and size validation with image previews and removal.",
    tag: "07",
  },
] as const;

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-6">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="size-4" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">
            React Toolkit
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          Seven tools · one system
        </p>
        <h1 className="mt-4 max-w-[16ch] font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
          Seven mini-apps, each a focused workspace.
        </h1>
        <p className="mt-4 max-w-[52ch] text-muted-foreground">
          A collection of interactive React components — pick a tool below to
          open it.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <tool.icon className="size-5" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {tool.tag}
                </span>
              </div>
              <h2 className="mt-5 font-display text-lg font-semibold tracking-tight">
                {tool.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="size-3" />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
