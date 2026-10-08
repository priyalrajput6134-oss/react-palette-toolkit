import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, GripVertical, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/kanban")({
  head: () => ({
    meta: [
      { title: "Kanban Board — React Toolkit" },
      {
        name: "description",
        content:
          "Drag cards across Todo, In Progress, Review and Done columns.",
      },
      { property: "og:title", content: "Kanban Board — React Toolkit" },
      {
        property: "og:description",
        content: "Drag-and-drop kanban with four workflow columns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KanbanPage,
});

type ColumnId = "todo" | "inprogress" | "review" | "done";

interface Card {
  id: number;
  title: string;
  column: ColumnId;
}

const COLUMNS: { id: ColumnId; label: string; dot: string }[] = [
  { id: "todo", label: "Todo", dot: "bg-chart-1" },
  { id: "inprogress", label: "In Progress", dot: "bg-chart-2" },
  { id: "review", label: "Review", dot: "bg-chart-3" },
  { id: "done", label: "Done", dot: "bg-chart-4" },
];

const INITIAL: Card[] = [
  { id: 1, title: "Design weather card layout", column: "done" },
  { id: 2, title: "Wire up gallery modal", column: "done" },
  { id: 3, title: "Add drag feedback styles", column: "inprogress" },
  { id: 4, title: "Validate file upload sizes", column: "inprogress" },
  { id: 5, title: "Review dropdown keyboard nav", column: "review" },
  { id: 6, title: "Write countdown tests", column: "todo" },
  { id: 7, title: "Polish empty states", column: "todo" },
];

let nextId = 100;

function KanbanPage() {
  const [cards, setCards] = useState<Card[]>(INITIAL);
  const [newTitle, setNewTitle] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overColumn, setOverColumn] = useState<ColumnId | null>(null);

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setCards((c) => [...c, { id: nextId++, title, column: "todo" }]);
    setNewTitle("");
  };

  const removeCard = (id: number) =>
    setCards((c) => c.filter((card) => card.id !== id));

  const dropOn = (column: ColumnId) => {
    if (draggingId == null) return;
    setCards((c) =>
      c.map((card) => (card.id === draggingId ? { ...card, column } : card)),
    );
    setDraggingId(null);
    setOverColumn(null);
  };

  return (
    <PageShell
      title="Kanban Board"
      description="Drag cards between columns to update their status. Add new cards below — they land in Todo."
    >
      <form onSubmit={addCard} className="flex max-w-md gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New card title…"
          className="flex-1 rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" /> Add
        </button>
      </form>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.column === col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverColumn(col.id);
              }}
              onDragLeave={() => setOverColumn((o) => (o === col.id ? null : o))}
              onDrop={() => dropOn(col.id)}
              className={`min-h-48 rounded-2xl border p-3 transition-colors ${
                overColumn === col.id
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card/50"
              }`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className={`size-2 rounded-full ${col.dot}`} />
                  {col.label}
                </span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {colCards.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {colCards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => setDraggingId(card.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setOverColumn(null);
                    }}
                    className={`group flex cursor-grab items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm transition-opacity active:cursor-grabbing ${
                      draggingId === card.id ? "opacity-40" : ""
                    }`}
                  >
                    <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                    <span className="flex-1">{card.title}</span>
                    <button
                      onClick={() => removeCard(card.id)}
                      className="text-muted-foreground/50 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      aria-label={`Remove ${card.title}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
                {colCards.length === 0 && (
                  <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    Drop cards here
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
