import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/server/supabase";
import { getBookingsByEmail } from "../../../lib/server/bookings-store";

export default async function AccountProfilePage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?error=auth_unavailable&next=/account/profile");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?next=/account/profile");
  }

  const bookings = await getBookingsByEmail(user.email);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Profile</h2>

      <dl className="space-y-2 text-sm text-slate-700">
        <div>
          <dt className="font-medium text-slate-900">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-900">User ID</dt>
          <dd className="break-all">{user.id}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-900">Total Bookings</dt>
          <dd>{bookings.length}</dd>
        </div>
      </dl>
    </section>
  );
}
