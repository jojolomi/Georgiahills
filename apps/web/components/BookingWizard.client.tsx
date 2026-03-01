"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { captureClientException, ensureClientSentryInitialized } from "../lib/client/sentry";

const TravelerStep = dynamic(() => import("./booking-wizard/TravelerStep"));
const TripStep = dynamic(() => import("./booking-wizard/TripStep"));
const NotesStep = dynamic(() => import("./booking-wizard/NotesStep"));

const bookingWizardSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Phone must be at least 6 chars").max(32).optional().or(z.literal("")),
  destinationSlug: z.string().min(2, "Destination is required").max(120),
  travelDate: z.string().min(4, "Travel date is required"),
  guests: z.number().int().min(1, "At least 1 guest").max(30, "Maximum 30 guests"),
  notes: z.string().max(2000).optional().or(z.literal(""))
});

export type BookingWizardFormData = z.infer<typeof bookingWizardSchema>;

const stepConfig: Array<{ title: string; fields: Array<keyof BookingWizardFormData> }> = [
  { title: "Traveler Details", fields: ["fullName", "email", "phone"] },
  { title: "Trip Details", fields: ["destinationSlug", "travelDate", "guests"] },
  { title: "Notes & Submit", fields: ["notes"] }
];

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset
  } = useForm<BookingWizardFormData>({
    resolver: zodResolver(bookingWizardSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      destinationSlug: "",
      travelDate: "",
      guests: 1,
      notes: ""
    }
  });

  const isFinalStep = currentStep === stepConfig.length - 1;

  useEffect(() => {
    ensureClientSentryInitialized();
  }, []);

  const getGaClientId = () => {
    const key = "gh_ga4_client_id";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const generated = `gh.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(key, generated);
    return generated;
  };

  const stepComponent = useMemo(() => {
    if (currentStep === 0) {
      return <TravelerStep register={register} errors={errors} />;
    }

    if (currentStep === 1) {
      return <TripStep register={register} errors={errors} />;
    }

    return <NotesStep register={register} errors={errors} />;
  }, [currentStep, errors, register]);

  const goToNext = async () => {
    const fields = stepConfig[currentStep].fields;
    const isValid = await trigger(fields);
    if (!isValid) return;
    setCurrentStep((prev) => Math.min(prev + 1, stepConfig.length - 1));
  };

  const goToPrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: BookingWizardFormData) => {
    setSubmitState("submitting");
    setSubmitMessage("");

    try {
      const gaClientId = typeof window !== "undefined" ? getGaClientId() : undefined;

      const payload = {
        ...values,
        phone: values.phone || undefined,
        notes: values.notes || undefined
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(gaClientId ? { "x-ga-client-id": gaClientId } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Booking submission failed");
      }

      fetch("/api/analytics/ga4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clientId: gaClientId,
          eventName: "booking_created",
          params: {
            destination_slug: values.destinationSlug,
            guests: values.guests,
            travel_date: values.travelDate
          },
          debug: process.env.NODE_ENV !== "production"
        })
      }).catch((analyticsError) => {
        captureClientException(analyticsError, {
          source: "booking_wizard.ga4",
          destinationSlug: values.destinationSlug
        });
      });

      setSubmitState("success");
      setSubmitMessage(`Booking created: ${data.booking?.id || "success"}`);
      reset();
      setCurrentStep(0);
    } catch (error) {
      captureClientException(error, { source: "booking_wizard.submit" });
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : "Unknown submission error");
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm text-slate-500">Step {currentStep + 1} of {stepConfig.length}</p>
        <h2 className="text-xl font-semibold text-slate-900">{stepConfig[currentStep].title}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {stepComponent}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goToPrev}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm"
            disabled={currentStep === 0 || submitState === "submitting"}
          >
            Back
          </button>

          {!isFinalStep ? (
            <button
              type="button"
              onClick={goToNext}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white"
              disabled={submitState === "submitting"}
            >
              {submitState === "submitting" ? "Submitting..." : "Submit Booking"}
            </button>
          )}
        </div>
      </form>

      {submitMessage ? (
        <p className={`mt-4 text-sm ${submitState === "success" ? "text-emerald-700" : "text-red-600"}`}>
          {submitMessage}
        </p>
      ) : null}
    </div>
  );
}
