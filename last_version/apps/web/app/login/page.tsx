import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: {
    next?: string;
    error?: string;
  };
};

function getErrorMessage(code: string | undefined) {
  if (code === "missing_fields") return "Please enter both email and password.";
  if (code === "invalid_credentials") return "Invalid email or password.";
  if (code === "auth_unavailable") return "Authentication is not configured yet. Please set Supabase environment variables.";
  return "";
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = searchParams?.next?.startsWith("/") ? searchParams.next : "/account";
  const errorMessage = getErrorMessage(searchParams?.error);

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-3xl font-semibold text-slate-900">Customer Login</h1>
      <p className="mb-6 text-sm text-slate-600">Sign in to access your account portal.</p>

      {errorMessage ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
      ) : null}

      <form action={loginAction} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <input type="hidden" name="next" value={nextPath} />

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Log in
        </button>
      </form>
    </main>
  );
}
