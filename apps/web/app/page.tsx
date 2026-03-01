import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          <Sparkles className="h-4 w-4" />
          Tailwind + shadcn/ui base ready
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Georgiahills Next.js 14</h1>
        <p className="mt-2 text-slate-600">
          App Router + TypeScript scaffold is ready. This card is styled with Tailwind utility classes.
        </p>
        <button className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
          Test Tailwind Button
        </button>
      </motion.section>
    </main>
  );
}
