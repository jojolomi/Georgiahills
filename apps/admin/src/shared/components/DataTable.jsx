import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export function DataTable({ data, columns, title, actions }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="topbar">
        <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>{title}</h2>
        <div className="stack" style={{ gap: "0.5rem" }}>
          {actions}
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="input"
            style={{ width: "200px" }}
          />
        </div>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table className="table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} style={{ borderBottom: "2px solid var(--border-color)" }}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort() ? "pointer" : "default",
                      padding: "0.75rem",
                      userSelect: "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ArrowUp size={14} className="muted" />,
                        desc: <ArrowDown size={14} className="muted" />,
                      }[header.column.getIsSorted()] ?? (header.column.getCanSort() ? <ArrowUpDown size={14} opacity={0.2} /> : null)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: "2rem", textAlign: "center" }} className="muted">
                  No data found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ padding: "0.75rem" }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="muted" style={{ fontSize: "0.85rem" }}>
        Showing {table.getRowModel().rows.length} rows
      </div>
    </div>
  );
}
