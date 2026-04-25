import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { BookingWizardFormData } from "../BookingWizard.client";

type TravelerStepProps = {
  register: UseFormRegister<BookingWizardFormData>;
  errors: FieldErrors<BookingWizardFormData>;
};

export default function TravelerStep({ register, errors }: TravelerStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          {...register("fullName")}
        />
        {errors.fullName ? <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p> : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          {...register("email")}
        />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
          Phone (optional)
        </label>
        <input
          id="phone"
          type="tel"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          {...register("phone")}
        />
        {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p> : null}
      </div>
    </div>
  );
}
