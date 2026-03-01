"use client";

import { useMemo, useState } from "react";

type MediaVariant = {
  width: number;
  format: "avif" | "webp";
  path: string;
  url: string;
  contentType: string;
};

type MediaAsset = {
  id: string;
  fileName: string;
  originalPath: string;
  originalUrl: string;
  originalSize: number;
  createdAt: string;
  variants: MediaVariant[];
};

type MediaLibraryProps = {
  initialItems: MediaAsset[];
  contentTargets: string[];
};

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function relativeTime(input: string) {
  const date = new Date(input).getTime();
  if (!Number.isFinite(date)) return "—";
  const delta = Math.max(1, Math.floor((Date.now() - date) / 1000));
  if (delta < 60) return `${delta}s ago`;
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
  return `${Math.floor(delta / 86400)}d ago`;
}

export function MediaLibraryClient({ initialItems, contentTargets }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaAsset[]>(initialItems);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedContentTarget, setSelectedContentTarget] = useState(contentTargets[0] || "Home Hero");
  const [status, setStatus] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [items]
  );

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) {
      setStatus("Select an image file first.");
      return;
    }

    setUploading(true);
    setStatus("Uploading and optimizing...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || "Upload failed");
      }

      const asset = payload?.asset as MediaAsset;
      if (!asset?.id) {
        throw new Error("Upload completed but returned payload is invalid.");
      }

      setItems((prev) => [asset, ...prev]);
      setSelectedFile(null);
      setStatus(`Uploaded ${asset.fileName}: ${asset.variants.length} optimized variants generated.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Copied image URL to clipboard.");
    } catch {
      setStatus("Clipboard write failed in this browser context.");
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleUpload} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="media-upload" className="mb-1 block text-sm font-medium text-slate-700">
              Upload image
            </label>
            <input
              id="media-upload"
              type="file"
              accept="image/*"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              disabled={uploading}
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="self-end rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {uploading ? "Processing..." : "Upload & Optimize"}
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-[280px_1fr]">
          <div>
            <label htmlFor="content-target" className="mb-1 block text-xs font-medium text-slate-600">
              Insert target
            </label>
            <select
              id="content-target"
              value={selectedContentTarget}
              onChange={(event) => setSelectedContentTarget(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {contentTargets.map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </div>
          <p className="self-end text-xs text-slate-500">
            Upload response includes original + AVIF/WebP variants for multiple sizes. Use “Insert into Content” to pass the
            image URL into Content Manager.
          </p>
        </div>

        {status ? <p className="mt-3 text-sm text-slate-700">{status}</p> : null}
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {sortedItems.map((item) => {
          const preview = item.variants.find((variant) => variant.format === "webp" && variant.width === 320)?.url || item.originalUrl;
          const insertHref = `/admin/content?entry=${encodeURIComponent(selectedContentTarget)}&insertImage=${encodeURIComponent(item.originalUrl)}`;

          return (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <img
                src={preview}
                alt={item.fileName}
                width={320}
                height={160}
                className="h-40 w-full rounded-md border border-slate-200 object-cover"
              />

              <div className="mt-3">
                <p className="truncate text-sm font-medium text-slate-900" title={item.fileName}>
                  {item.fileName}
                </p>
                <p className="text-xs text-slate-500">
                  {formatBytes(item.originalSize)} · uploaded {relativeTime(item.createdAt)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.originalUrl)}
                  className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700"
                >
                  Copy URL
                </button>
                <a href={insertHref} className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700">
                  Insert into Content
                </a>
                <a href={item.originalUrl} target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700">
                  Open
                </a>
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-slate-600">Variants ({item.variants.length})</summary>
                <div className="mt-2 max-h-32 space-y-1 overflow-y-auto rounded-md bg-slate-50 p-2 text-xs text-slate-600">
                  {item.variants.map((variant) => (
                    <div key={variant.path} className="flex items-center justify-between gap-2">
                      <span>
                        {variant.format.toUpperCase()} · {variant.width}px
                      </span>
                      <button type="button" onClick={() => copyToClipboard(variant.url)} className="text-slate-700 underline">
                        copy
                      </button>
                    </div>
                  ))}
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </div>
  );
}
