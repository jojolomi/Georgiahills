import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/server/supabase";
import { getBookingsByEmail } from "../../../lib/server/bookings-store";

export default async function AccountBookingsPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?error=auth_unavailable&next=/account/bookings");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?next=/account/bookings");
  }

  const bookings = await getBookingsByEmail(user.email);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">My Bookings</h2>

      {!bookings.length ? <p className="text-sm text-slate-600">No bookings found for your account yet.</p> : null}

      {bookings.length ? (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-md border border-slate-200 p-4">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-900">{booking.destinationSlug}</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{booking.status}</span>
              </div>
              <p className="text-sm text-slate-700">Travel date: {booking.travelDate}</p>
              <p className="text-sm text-slate-700">Guests: {booking.guests}</p>
              <p className="text-xs text-slate-500">Booking ID: {booking.id}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
