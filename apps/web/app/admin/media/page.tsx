import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gh/ui";
import { requireAdminSession } from "../../../lib/server/admin-auth";

export const dynamic = "force-dynamic";

const mediaEntries = [
  { name: "hero-family.avif", type: "Image", size: "412 KB" },
  { name: "kazbegi-cover.avif", type: "Image", size: "356 KB" },
  { name: "brand-logo.avif", type: "Image", size: "84 KB" }
];

export default async function AdminMediaPage() {
  await requireAdminSession(["SuperAdmin", "Editor"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
        <CardDescription>Review and manage media assets used in pages and campaigns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {mediaEntries.map((item) => (
          <div key={item.name} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.type}</p>
            </div>
            <span className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700">{item.size}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
