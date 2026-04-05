import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gh/ui";
import { adminLoginAction } from "./actions";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams?: {
    next?: string;
    error?: string;
  };
};

function getErrorMessage(code: string | undefined) {
  if (code === "missing_fields") return "Please enter both email and password.";
  if (code === "invalid_credentials") return "Invalid email or password.";
  if (code === "insufficient_role") return "Your account does not have admin access.";
  if (code === "auth_unavailable") return "Authentication is not configured yet. Please set Supabase environment variables.";
  return "";
}

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const nextPath = searchParams?.next?.startsWith("/") ? searchParams.next : "/admin";
  const errorMessage = getErrorMessage(searchParams?.error);

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Sign in with your admin account to access the panel.</CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
          ) : null}

          <form action={adminLoginAction} className="space-y-4">
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
                autoComplete="email"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
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
                autoComplete="current-password"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>

            <Button type="submit" className="w-full">
              Log in to Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
