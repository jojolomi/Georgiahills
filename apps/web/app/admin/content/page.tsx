import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gh/ui";
import { requireAdminSession } from "../../../lib/server/admin-auth";

export const dynamic = "force-dynamic";

const contentItems = [
  { key: "Home Hero", status: "Draft", updatedAt: "—" },
  { key: "Booking Page Copy", status: "Published", updatedAt: "—" },
  { key: "Destination Hub", status: "Published", updatedAt: "—" }
];

export default async function AdminContentPage() {
  await requireAdminSession(["SuperAdmin", "Editor"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Manager</CardTitle>
        <CardDescription>Manage localized page copy and publishing state.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {contentItems.map((item) => (
          <div key={item.key} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 p-3">
            <div>
              <p className="font-medium text-slate-900">{item.key}</p>
              <p className="text-xs text-slate-500">Last updated: {item.updatedAt}</p>
            </div>
            <span className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700">{item.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
