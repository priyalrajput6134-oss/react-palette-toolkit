import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, UploadCloud, X, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "File Upload — React Toolkit" },
      {
        name: "description",
        content:
          "Upload files with type and size validation, image previews and removal.",
      },
      { property: "og:title", content: "File Upload — React Toolkit" },
      {
        property: "og:description",
        content: "Validated file upload with previews and removal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UploadPage,
});

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

interface Entry {
  id: number;
  file: File;
  previewUrl: string | null;
  error: string | null;
}

let nextId = 1;

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const next: Entry[] = Array.from(files).map((file) => {
      let error: string | null = null;
      if (!ALLOWED.includes(file.type))
        error = "Unsupported type — use PNG, JPG, WebP or PDF.";
      else if (file.size > MAX_SIZE) error = "Too large — max 5 MB.";
      return {
        id: nextId++,
        file,
        previewUrl:
          !error && file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        error,
      };
    });
    setEntries((e) => [...e, ...next]);
  };

  const remove = (id: number) =>
    setEntries((e) => {
      const target = e.find((x) => x.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return e.filter((x) => x.id !== id);
    });

  return (
    <PageShell
      title="File Upload"
      description="Drop or pick files — PNG, JPG, WebP or PDF up to 5 MB. Invalid files are flagged, images get a preview."
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`grid cursor-pointer place-items-center rounded-2xl border border-dashed p-12 text-center transition-colors ${
          dragOver
            ? "border-primary/60 bg-primary/5"
            : "border-border bg-card hover:border-primary/40"
        }`}
      >
        <UploadCloud className="size-10 text-primary" />
        <p className="mt-3 text-sm font-medium">
          Drop files here or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG, WebP or PDF · max 5 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {entries.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                entry.error
                  ? "border-destructive/40 bg-destructive/5"
                  : "border-border bg-card"
              }`}
            >
              {entry.previewUrl ? (
                <img
                  src={entry.previewUrl}
                  alt={entry.file.name}
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-lg ${
                    entry.error
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {entry.error ? (
                    <AlertTriangle className="size-5" />
                  ) : (
                    <FileText className="size-5" />
                  )}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {entry.file.name}
                </p>
                <p
                  className={`text-xs ${entry.error ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {entry.error ?? `${fmtSize(entry.file.size)} · ready`}
                </p>
              </div>
              <button
                onClick={() => remove(entry.id)}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                aria-label={`Remove ${entry.file.name}`}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
