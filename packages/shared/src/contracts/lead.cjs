const LEAD_STATUS_VALUES = ["new", "contacted", "quoted", "won", "lost"];

const REVIEW_QUEUE_RESOLUTION_VALUES = ["approve", "reject"];

const LEAD_STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost"
};

const LEAD_STATUS_COLORS = {
  new: "var(--primary-color)",
  contacted: "#eab308",
  quoted: "#3b82f6",
  won: "#10b981",
  lost: "#ef4444"
};

module.exports = {
  LEAD_STATUS_VALUES,
  REVIEW_QUEUE_RESOLUTION_VALUES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS
};
