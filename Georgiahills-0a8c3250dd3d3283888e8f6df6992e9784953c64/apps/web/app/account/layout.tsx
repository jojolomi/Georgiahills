import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/server/supabase";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

type AccountLayoutProps = {
  children: React.ReactNode;
};

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?error=auth_unavailable&next=/account");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Customer Portal</h1>
          <p className="text-sm text-slate-600">Signed in as {user.email}</p>
        </div>

        <form action={logoutAction}>
          <button type="submit" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
            Sign out
          </button>
        </form>
      </div>

      <nav className="mb-6 flex gap-3 text-sm">
        <Link href="/account/bookings" className="rounded-md border border-slate-300 px-3 py-2 text-slate-700">
          My Bookings
        </Link>
        <Link href="/account/profile" className="rounded-md border border-slate-300 px-3 py-2 text-slate-700">
          Profile
        </Link>
      </nav>

      {children}
    </main>
  );
}
