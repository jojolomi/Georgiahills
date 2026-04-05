import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gh/ui";
import { requireAdminSession } from "../../../lib/server/admin-auth";
import { listMediaAssets } from "../../../lib/server/media-storage";
import { MediaLibraryClient } from "./MediaLibrary.client";

export const dynamic = "force-dynamic";

const CONTENT_TARGETS = ["Home Hero", "Booking Page Copy", "Destination Hub"];

export default async function AdminMediaPage() {
  await requireAdminSession(["SuperAdmin", "Editor"]);

  let initialItems: Awaited<ReturnType<typeof listMediaAssets>>["items"] = [];
  let loadError = "";

  try {
    const payload = await listMediaAssets();
    initialItems = payload.items;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load media from storage.";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
        <CardDescription>Upload originals, auto-generate optimized variants, and insert assets into content entries.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loadError ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Storage unavailable: {loadError}
          </p>
        ) : null}
        <MediaLibraryClient initialItems={initialItems} contentTargets={CONTENT_TARGETS} />
      </CardContent>
    </Card>
  );
}
