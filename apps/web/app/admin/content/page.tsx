import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gh/ui";
import { requireAdminSession } from "../../../lib/server/admin-auth";
import { ContentManagerClient } from "./ContentManager.client";

export const dynamic = "force-dynamic";

const contentItems = [
  { key: "Home Hero", status: "Draft", updatedAt: "—" },
  { key: "Booking Page Copy", status: "Published", updatedAt: "—" },
  { key: "Destination Hub", status: "Published", updatedAt: "—" }
];

type AdminContentPageProps = {
  searchParams?: {
    entry?: string;
    insertImage?: string;
  };
};

export default async function AdminContentPage({ searchParams }: AdminContentPageProps) {
  await requireAdminSession(["SuperAdmin", "Editor"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Manager</CardTitle>
        <CardDescription>Manage localized page copy, and insert media assets directly from Media Library.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ContentManagerClient
          items={contentItems}
          initialEntry={searchParams?.entry}
          initialImageUrl={searchParams?.insertImage}
        />
      </CardContent>
    </Card>
  );
}
