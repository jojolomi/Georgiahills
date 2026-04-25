import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@gh/ui";
import { requireAdminSession } from "../../../lib/server/admin-auth";
import { getBookingsPage, type BookingSortDirection, type BookingSortKey } from "../../../lib/server/bookings-store";
import { BookingsTableClient } from "./BookingsTable.client";

export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortDirection?: string;
};

const ALLOWED_SORT_KEYS: BookingSortKey[] = ["createdAt", "travelDate", "fullName", "status", "amount"];

function getPage(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;
}

function getPageSize(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 10;
  return Math.min(50, Math.max(5, Math.floor(parsed)));
}

function getSortBy(value: string | undefined): BookingSortKey {
  if (value && ALLOWED_SORT_KEYS.includes(value as BookingSortKey)) {
    return value as BookingSortKey;
  }
  return "createdAt";
}

function getSortDirection(value: string | undefined): BookingSortDirection {
  return value === "asc" ? "asc" : "desc";
}

export default async function AdminBookingsPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  await requireAdminSession(["SuperAdmin", "Support"]);

  const page = getPage(searchParams?.page);
  const pageSize = getPageSize(searchParams?.pageSize);
  const sortBy = getSortBy(searchParams?.sortBy);
  const sortDirection = getSortDirection(searchParams?.sortDirection);

  const result = await getBookingsPage({
    page,
    pageSize,
    sortBy,
    sortDirection
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>
          Admin booking records with DB-backed sorting and pagination.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BookingsTableClient
          rows={result.rows}
          page={result.page}
          pageSize={result.pageSize}
          total={result.total}
          totalPages={result.totalPages}
          sortBy={result.sortBy}
          sortDirection={result.sortDirection}
        />
      </CardContent>
    </Card>
  );
}
