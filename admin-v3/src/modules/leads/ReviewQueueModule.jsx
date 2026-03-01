import React, { useEffect, useState } from "react";
import { AdminApi } from "../../shared/api/adminApiClient";
import { Card, Table } from "../../shared/components/ui";

export function ReviewQueueModule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cursor, setCursor] = useState(null);

  const load = async (reset = false) => {
    setLoading(true);
    try {
      const res = await AdminApi.listReviewQueue(50, reset ? null : cursor?.lastId);
      const payload = res.data || res;
      setItems(prev => reset ? (payload.items || []) : [...prev, ...(payload.items || [])]);
      setCursor(payload.nextCursor);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true);
  }, []);

  async function resolveItem(queueId, resolution, reason = null) {
    let rejectionReason = reason;
    if (resolution === 'reject' && !reason) {
      rejectionReason = window.prompt("Reason for rejection? (e.g. spam, invalid, scam)");
      if (rejectionReason === null) return; // User cancelled
    }

    try {
      await AdminApi.resolveReviewQueueItem(queueId, resolution, rejectionReason);
      setItems(prev => prev.filter(i => i.id !== queueId));
      setMessage(`Item ${resolution}d successfully.`);
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <Card title="Traffic & Anti-Spam Review Queue">
      <div style={{ marginBottom: "1rem" }}>
        <p className="muted">Review borderline submissions caught by backend anti-spam defenses. Approving them will push them to Leads.</p>
        {items.length === 0 && !loading && <span className="badge">No pending items</span>}
        {message && <div style={{ color: "green", marginBottom: 10 }}>{message}</div>}
      </div>

      {items.length > 0 && (
        <Table
          columns={["Date", "Reason / Signals", "IP/UA Info", "Score", "Preview", "Actions"]}
          rows={items.map((item) => {
            const date = item.createdAt ? new Date(item.createdAt.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleString() : "-";
            return [
              date,
              <div className="stack" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                 <strong>{item.reason}</strong>
                 <div className="stack" style={{ gap: '4px', flexWrap: 'wrap', marginTop: 4 }}>
                   {item.spamSignals?.map(s => <span key={s} className="badge" style={{ fontSize: '0.7em', padding: '2px 4px' }}>{s}</span>)}
                 </div>
              </div>,
              <div className="stack" style={{flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.85em'}}>
                 <span>Phone: {item.meta?.payload?.phone || "-"}</span>
                 <span className="muted">Lang: {item.sourceLang}</span>
              </div>,
              <span className={`badge ${item.spamRiskLevel === 'high' ? 'bg-red-100 text-red-800 border-red-200' : ''}`}>
                 {item.spamRiskScore} / 100
              </span>,
              <div style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.85em" }} title={item.notesPreview}>
                 {item.notesPreview || "-"}
              </div>,
              <div className="stack">
                <button className="btn btn-primary" onClick={() => resolveItem(item.id, "approve")} disabled={loading}>Approve (Safe)</button>
                <button className="btn btn-danger" onClick={() => resolveItem(item.id, "reject")} disabled={loading}>Reject (Spam)</button>
              </div>
            ];
          })}
        />
      )}
      
      {cursor && (
          <div style={{ marginTop: "1rem" }}>
              <button className="btn" onClick={() => load(false)} disabled={loading}>
                 {loading ? "Loading..." : "Load More"}
              </button>
          </div>
      )}
    </Card>
  );
}
