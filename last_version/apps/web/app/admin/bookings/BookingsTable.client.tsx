"use client";

import { Button } from "@gh/ui";
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { BookingRecord, BookingSortDirection, BookingSortKey } from "../../../lib/server/bookings-store";

type BookingsTableClientProps = {
  rows: BookingRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: BookingSortKey;
  sortDirection: BookingSortDirection;
};

const sortableMap: Record<string, BookingSortKey> = {
  createdAt: "createdAt",
  travelDate: "travelDate",
  fullName: "fullName",
  status: "status",
  amount: "amount"
};

export function BookingsTableClient({ rows, total, page, pageSize, totalPages, sortBy, sortDirection }: BookingsTableClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns = useMemo<ColumnDef<BookingRecord>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Customer"
      },
      {
        accessorKey: "email",
        header: "Email"
      },
      {
        accessorKey: "destinationSlug",
        header: "Destination"
      },
      {
        accessorKey: "travelDate",
        header: "Travel Date"
      },
      {
        accessorKey: "status",
        header: "Status"
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = row.original.amount;
          const currency = row.original.currency || "USD";
          return amount ? `${amount} ${currency}` : "—";
        }
      },
      {
        accessorKey: "createdAt",
        header: "Created"
      }
    ],
    []
  );

  const sorting: SortingState = [{ id: sortBy, desc: sortDirection === "desc" }];
  const pagination: PaginationState = { pageIndex: page - 1, pageSize };

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      pagination
    },
    manualSorting: true,
    manualPagination: true,
    pageCount: totalPages,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const nextSort = next[0];
      if (!nextSort || !sortableMap[nextSort.id]) return;

      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("page", "1");
      params.set("sortBy", sortableMap[nextSort.id]);
      params.set("sortDirection", nextSort.desc ? "desc" : "asc");
      router.push(`${pathname}?${params.toString()}`);
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("page", String(next.pageIndex + 1));
      params.set("pageSize", String(next.pageSize));
      router.push(`${pathname}?${params.toString()}`);
    },
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th key={header.id} className="px-3 py-2 text-left font-semibold text-slate-700">
                      {canSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="text-xs text-slate-500">{isSorted === "desc" ? "↓" : isSorted === "asc" ? "↑" : "↕"}</span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-slate-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Showing page {page} of {totalPages} · {total} total bookings
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
