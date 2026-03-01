import Link from "next/link";
import { Card, CardContent } from "@gh/ui";
import { requireAdminSession, type AdminRole } from "../../lib/server/admin-auth";
import { adminLogoutAction } from "./actions";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: React.ReactNode;
};

function allowedNav(role: AdminRole) {
  if (role === "SuperAdmin") {
    return [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/bookings", label: "Bookings" },
      { href: "/admin/content", label: "Content" },
      { href: "/admin/media", label: "Media" }
    ];
  }

  if (role === "Editor") {
    return [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/content", label: "Content" },
      { href: "/admin/media", label: "Media" }
    ];
  }

  return [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/bookings", label: "Bookings" }
  ];
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { user, role } = await requireAdminSession();
  const navItems = allowedNav(role);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-600">
              Signed in as {user.email} · <span className="font-semibold">{role}</span>
            </p>
          </div>
          <form action={adminLogoutAction}>
            <button type="submit" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
              Sign out
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Card>
          <CardContent className="space-y-2 pt-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                {item.label}
              </Link>
            ))}
          </CardContent>
        </Card>

        <section>{children}</section>
      </div>
    </main>
  );
}
