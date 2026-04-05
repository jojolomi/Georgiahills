import React, { useEffect, useState, useMemo } from "react";
import { AdminApi } from "../../shared/api/adminApiClient";
import { Card, Table } from "../../shared/components/ui";
import { DataTable } from "../../shared/components/DataTable";
import {
  LEAD_STATUS_VALUES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS
} from "../../../../../packages/shared/src/contracts/lead.js";

export function LeadsModule() {
  const [leads, setLeads] = useState([]);
  const [summary, setSummary] = useState({ total: 0, newCount: 0, slaBreachCount: 0 });
  const [statusFilter, setStatusFilter] = useState("all");
  const [slaOnly, setSlaOnly] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async (reset = false) => {
    setLoading(true);
    try {
      const p = reset ? null : cursor;
      const res = await AdminApi.listLeads(50, p?.lastId, p?.lastCreatedAt);
      const payload = res.data || res;
      setLeads(prev => reset ? (payload.leads || []) : [...prev, ...(payload.leads || [])]);
      setSummary(payload.summary || { total: (payload.leads || []).length, newCount: 0, slaBreachCount: 0 });
      setCursor(payload.nextCursor);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(true); }, []);

  async function update(id, status) {
    try {
      await AdminApi.updateLeadStatus(id, status);
      await load();
    } catch (e) { setMessage(e.message); }
  }

  async function addNote(id) {
    const note = String(noteDrafts[id] || "").trim();
    if (!note) {
      setMessage("Note cannot be empty.");
      return;
    }
    try {
      await AdminApi.addLeadNote(id, note);
      setNoteDrafts((prev) => ({ ...prev, [id]: "" }));
      setMessage(`Note added to lead ${id}.`);
      await load();
    } catch (e) {
      setMessage(e.message);
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const status = lead.crmStatus || lead.status || "new";
    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (slaOnly && !lead.slaBreach) return false;
    return true;
  });

  const columns = useMemo(() => [
    {
      header: "Lead ID",
      accessorKey: "id",
      cell: info => <span className="muted" style={{ fontSize: "0.85em", fontFamily: "monospace" }}>{info.getValue().slice(0, 8)}</span>
    },
    {
      header: "Date",
      accessorFn: row => row.createdAtMs || 0,
      id: "date",
      cell: info => {
        const val = info.getValue();
        if(!val) return "-";
        return new Date(val).toLocaleDateString();
      }
    },
    { header: "Name", accessorKey: "name" },
    { header: "Phone", accessorKey: "phone" },
    {
      header: "Status",
      accessorKey: "crmStatus",
      accessorFn: row => row.crmStatus || row.status || "new",
      cell: info => {
        const val = info.getValue();
        return <span className="badge" style={{ borderColor: LEAD_STATUS_COLORS[val] || "#ccc", color: LEAD_STATUS_COLORS[val] || "#333", backgroundColor: "transparent" }}>
          {val.toUpperCase()}
        </span>;
      }
    },
    {
      header: "SLA",
      accessorKey: "slaBreach",
      cell: info => info.getValue() 
         ? <span className="badge" style={{ borderColor: "#b91c1c", color: "#b91c1c", backgroundColor: "#fef2f2" }}>Overdue</span> 
         : <span className="badge" style={{ color: "var(--text-muted)", border: "none", backgroundColor: "#f3f4f6" }}>On time</span>
    },
    {
      header: "Market",
      accessorFn: row => row.attributionNormalized?.market || row.sourceLang,
      id: "market",
      cell: info => <span style={{ textTransform: "uppercase", fontSize: "0.9em", fontWeight: 600 }}>{info.getValue() || "-"}</span>
    },
    {
      header: "Actions",
      id: "actions",
      cell: info => {
         const l = info.row.original;
         return (
          <div className="stack" style={{ gap: "4px" }}>
            <button className="btn" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem" }} onClick={() => update(l.id, "contacted")}>Contact</button>
            <button className="btn btn-primary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem" }} onClick={() => update(l.id, "won")}>Won</button>
          </div>
         );
      }
    }
  ], []);

  return (
    <>
      <DataTable
        title="Sales Leads"
        data={filteredLeads}
        columns={columns}
        actions={
          <>
            <div className="stack" style={{ marginRight: "1rem" }}>
               <div style={{ textAlign: "center", padding: "0 0.5rem" }}>
                 <div className="muted" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>Total</div>
                 <strong style={{ fontSize: "1.1rem" }}>{summary.total || leads.length}</strong>
               </div>
               <div style={{ textAlign: "center", padding: "0 0.5rem", borderLeft: "1px solid var(--border-color)" }}>
                 <div className="muted" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>New</div>
                 <strong style={{ fontSize: "1.1rem", color: "var(--primary-color)" }}>{summary.newCount || 0}</strong>
               </div>
            </div>
            <select className="select" style={{ width: 140 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              {LEAD_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>{LEAD_STATUS_LABELS[status] || status}</option>
              ))}
            </select>
            <label className="stack" style={{ gap: ".35rem", cursor: "pointer" }}>
              <input type="checkbox" checked={slaOnly} onChange={(e) => setSlaOnly(e.target.checked)} />
              <span className="muted">SLA only</span>
            </label>
          </>
        }
      />
      {message && <p className="muted" style={{ marginTop: "1rem" }}>{message}</p>}
      {cursor && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button className="btn" disabled={loading} onClick={() => load(false)}>
             {loading ? 'Loading...' : 'Load More Leads'}
          </button>
        </div>
      )}
    </>
  );
}

function leadAgeLabel(minutes) {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value < 0) return "-";
  if (value < 60) return `${value}m`;
  return `${Math.floor(value / 60)}h ${value % 60}m`;
}
