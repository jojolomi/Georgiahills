import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { BookingWizardFormData } from "../BookingWizard.client";

type TripStepProps = {
  register: UseFormRegister<BookingWizardFormData>;
  errors: FieldErrors<BookingWizardFormData>;
};

export default function TripStep({ register, errors }: TripStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="destinationSlug" className="mb-1 block text-sm font-medium text-slate-700">
          Destination
        </label>
        <input
          id="destinationSlug"
          type="text"
          placeholder="e.g. tbilisi"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          {...register("destinationSlug")}
        />
        {errors.destinationSlug ? (
          <p className="mt-1 text-sm text-red-600">{errors.destinationSlug.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="travelDate" className="mb-1 block text-sm font-medium text-slate-700">
          Travel date
        </label>
        <input
          id="travelDate"
          type="date"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          {...register("travelDate")}
        />
        {errors.travelDate ? <p className="mt-1 text-sm text-red-600">{errors.travelDate.message}</p> : null}
      </div>

      <div>
        <label htmlFor="guests" className="mb-1 block text-sm font-medium text-slate-700">
          Number of guests
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          max={30}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          {...register("guests", { valueAsNumber: true })}
        />
        {errors.guests ? <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p> : null}
      </div>
    </div>
  );
}
