# Admin User Creation & Roles

## Role model (apps/web)

Admin roles are validated in server auth and normalized to:

- `SuperAdmin`
- `Editor`
- `Support`

User role can be read from Supabase `app_metadata.role` or `user_metadata.role`.

## Access expectations

- `SuperAdmin`: full admin operations.
- `Editor`: content-focused admin operations.
- `Support`: support-safe admin tasks.

Route-level restrictions can require specific allowed roles.

## Create an admin user

1. Create user in Supabase Auth.
2. Set role metadata (prefer `app_metadata.role`) to one of:
   - `superadmin`
   - `editor`
   - `support`
3. Sign in via `/admin/login`.

## Existing Firebase owner flow (admin v3)

For Firebase-backed admin ownership workflow, see [ADMIN_V3_SETUP.md](../ADMIN_V3_SETUP.md), including:

```bash
npm --prefix functions run owner:provision -- <owner-email>
```

This provisions owner claims for the legacy/admin-v3 path.

## Troubleshooting

- `insufficient_role`: role is missing or invalid in metadata.
- `auth_unavailable`: Supabase env vars not configured.
- Redirect loop to login: verify session cookies and valid role.
