import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { BookingWizardFormData } from "../BookingWizard.client";

type NotesStepProps = {
  register: UseFormRegister<BookingWizardFormData>;
  errors: FieldErrors<BookingWizardFormData>;
};

export default function NotesStep({ register, errors }: NotesStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          placeholder="Tell us any preferences, dietary needs, or special requests"
          {...register("notes")}
        />
        {errors.notes ? <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p> : null}
      </div>
      <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
        Submit this form to create your booking request. Payment can be initiated in the next step of your flow.
      </p>
    </div>
  );
}
