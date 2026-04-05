import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gh/ui";
import { getBookingsPage } from "../../lib/server/bookings-store";
import { requireAdminSession } from "../../lib/server/admin-auth";

export const dynamic = "force-dynamic";

type AdminDashboardPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const { role } = await requireAdminSession();
  const bookings = await getBookingsPage({ page: 1, pageSize: 5, sortBy: "createdAt", sortDirection: "desc" });

  const hasAccessToContent = role === "SuperAdmin" || role === "Editor";
  const hasAccessToBookings = role === "SuperAdmin" || role === "Support";

  return (
    <div className="space-y-6">
      {searchParams?.error === "insufficient_role" ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          You do not have permission to access that section.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Role</CardDescription>
            <CardTitle className="text-xl">{role}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-xl">{bookings.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Newest Booking</CardDescription>
            <CardTitle className="text-base">{bookings.rows[0]?.fullName || "—"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Core admin sections based on your role permissions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {hasAccessToBookings ? (
            <Link href="/admin/bookings" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
              Open Bookings Table
            </Link>
          ) : null}
          {hasAccessToContent ? (
            <Link href="/admin/content" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
              Open Content Manager
            </Link>
          ) : null}
          {hasAccessToContent ? (
            <Link href="/admin/media" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
              Open Media Library
            </Link>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
