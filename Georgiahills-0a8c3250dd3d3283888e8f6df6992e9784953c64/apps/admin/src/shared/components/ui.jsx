import React from "react";

export function Card({ title, children, actions }) {
  return (
    <section className="card">
      {(title || actions) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>{title}</h2>
          <div className="stack">{actions}</div>
        </div>
      )}
      {children}
    </section>
  );
}

export function Table({ columns, rows }) {
  return (
    <table className="table">
      <thead>
        <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={columns.length} className="muted">No data</td></tr>
        ) : rows.map((row, i) => <tr key={i}>{row.map((cell, c) => <td key={c}>{cell}</td>)}</tr>)}
      </tbody>
    </table>
  );
}
