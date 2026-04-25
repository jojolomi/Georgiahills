"use client";

import { useEffect, useState } from "react";

type ContentItem = {
  key: string;
  status: string;
  updatedAt: string;
};

type ContentManagerProps = {
  items: ContentItem[];
  initialEntry?: string;
  initialImageUrl?: string;
};

export function ContentManagerClient({ items, initialEntry, initialImageUrl }: ContentManagerProps) {
  const [selectedKey, setSelectedKey] = useState(items[0]?.key || "");
  const [drafts, setDrafts] = useState<Record<string, string>>(
    Object.fromEntries(items.map((item) => [item.key, ""]))
  );
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!initialImageUrl) return;

    const target = items.find((item) => item.key === initialEntry)?.key || selectedKey;
    if (!target) return;

    setSelectedKey(target);
    setDrafts((prev) => {
      const line = `\n![Media Asset](${initialImageUrl})`;
      if ((prev[target] || "").includes(initialImageUrl)) return prev;
      return {
        ...prev,
        [target]: `${prev[target] || ""}${line}`.trim()
      };
    });
    setStatus(`Inserted image into “${target}”.`);
  }, [initialEntry, initialImageUrl, items, selectedKey]);

  const activeDraft = drafts[selectedKey] || "";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[260px_1fr]">
        <div>
          <label htmlFor="content-entry" className="mb-1 block text-sm font-medium text-slate-700">
            Content entry
          </label>
          <select
            id="content-entry"
            value={selectedKey}
            onChange={(event) => setSelectedKey(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {items.map((item) => (
              <option key={item.key} value={item.key}>
                {item.key} ({item.status})
              </option>
            ))}
          </select>
        </div>
        <div className="self-end text-xs text-slate-500">
          Use Media Library “Insert into Content” to auto-insert image URLs into the selected entry draft.
        </div>
      </div>

      {status ? <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{status}</p> : null}

      <textarea
        value={activeDraft}
        onChange={(event) => setDrafts((prev) => ({ ...prev, [selectedKey]: event.target.value }))}
        placeholder="Content draft..."
        rows={10}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-900">{item.key}</p>
              <p className="text-xs text-slate-500">Last updated: {item.updatedAt}</p>
            </div>
            <span className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
