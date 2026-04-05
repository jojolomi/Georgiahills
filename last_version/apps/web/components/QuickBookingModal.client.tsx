"use client";

import { useMemo, useState } from "react";

type QuickBookingModalProps = {
  isArabic: boolean;
  onClose: () => void;
  onSubmitted: () => void;
};

type FormState = {
  name: string;
  dates: string;
  pax: string;
  vehicle: string;
  phone: string;
};

const initialState: FormState = {
  name: "",
  dates: "",
  pax: "",
  vehicle: "Minivan VIP",
  phone: ""
};

export function QuickBookingModal({ isArabic, onClose, onSubmitted }: QuickBookingModalProps) {
  const [form, setForm] = useState<FormState>(initialState);

  const labels = useMemo(
    () => ({
      title: isArabic ? "حجز سريع" : "Quick Booking",
      subtitle: isArabic ? "أكمل البيانات وسيتم تحويلك مباشرة إلى واتساب." : "Fill details and continue instantly on WhatsApp.",
      name: isArabic ? "الاسم" : "Name",
      dates: isArabic ? "التواريخ" : "Dates",
      pax: isArabic ? "عدد المسافرين" : "Pax",
      vehicle: isArabic ? "نوع السيارة" : "Vehicle",
      phone: isArabic ? "رقم التواصل" : "Phone",
      submit: isArabic ? "إرسال عبر واتساب" : "Send via WhatsApp",
      close: isArabic ? "إغلاق" : "Close"
    }),
    [isArabic]
  );

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = isArabic
      ? `مرحبًا، أريد حجزًا سريعًا:\nالاسم: ${form.name}\nالتواريخ: ${form.dates}\nالمسافرون: ${form.pax}\nالسيارة: ${form.vehicle}\nرقم التواصل: ${form.phone}`
      : `Hello, I want a quick booking:\nName: ${form.name}\nDates: ${form.dates}\nPax: ${form.pax}\nVehicle: ${form.vehicle}\nPhone: ${form.phone}`;

    window.open(`https://wa.me/995579088537?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    onSubmitted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{labels.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{labels.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700">
            {labels.close}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input required value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder={labels.name} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <input required value={form.dates} onChange={(e) => updateField("dates", e.target.value)} placeholder={labels.dates} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input required value={form.pax} onChange={(e) => updateField("pax", e.target.value)} placeholder={labels.pax} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <select value={form.vehicle} onChange={(e) => updateField("vehicle", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option>Sedan Comfort</option>
              <option>Minivan VIP</option>
              <option>Mercedes S-Class</option>
            </select>
          </div>
          <input required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder={labels.phone} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />

          <button type="submit" className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
            {labels.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
