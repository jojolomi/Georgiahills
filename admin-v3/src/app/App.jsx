import React, { lazy, Suspense } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useOwnerAuth } from "../shared/hooks/useOwnerAuth";

const DashboardModule = lazy(() => import("../modules/dashboard/DashboardModule").then((m) => ({ default: m.DashboardModule })));
const PagesModule = lazy(() => import("../modules/pages/PagesModule").then((m) => ({ default: m.PagesModule })));
const DestinationsModule = lazy(() => import("../modules/destinations/DestinationsModule").then((m) => ({ default: m.DestinationsModule })));
const ArticlesModule = lazy(() => import("../modules/articles/ArticlesModule").then((m) => ({ default: m.ArticlesModule })));
const MediaModule = lazy(() => import("../modules/media/MediaModule").then((m) => ({ default: m.MediaModule })));
const SeoMarketsModule = lazy(() => import("../modules/seo-markets/SeoMarketsModule").then((m) => ({ default: m.SeoMarketsModule })));
const LeadsModule = lazy(() => import("../modules/leads/LeadsModule").then((m) => ({ default: m.LeadsModule })));
const ReviewQueueModule = lazy(() => import("../modules/leads/ReviewQueueModule").then((m) => ({ default: m.ReviewQueueModule })));
const PublishingModule = lazy(() => import("../modules/publishing/PublishingModule").then((m) => ({ default: m.PublishingModule })));
const IntegrationsModule = lazy(() => import("../modules/integrations/IntegrationsModule").then((m) => ({ default: m.IntegrationsModule })));
const AuditModule = lazy(() => import("../modules/audit/AuditModule").then((m) => ({ default: m.AuditModule })));

import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  FileText,
  MapPin,
  Newspaper,
  Image as ImageIcon,
  Globe2,
  Send,
  Plug,
  ActivitySquare,
  LogOut,
  Mountain
} from "lucide-react";

function LoginView({ onLogin, error }) {
  return (
    <div className="login-card card">
      <h2>Georgia Hills<br/><span style={{ fontSize: "1rem", color: "var(--muted-foreground)", fontWeight: 500 }}>Admin V3 Login</span></h2>
      <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onLogin(fd.get("email"), fd.get("password")); }}>
        <div style={{ marginBottom: "1rem" }}><input className="input" name="email" type="email" placeholder="Admin email" required /></div>
        <div style={{ marginBottom: "1.5rem" }}><input className="input" name="password" type="password" placeholder="Password" required /></div>
        <button className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }} type="submit">Sign In to Dashboard</button>
      </form>
      {error && <p className="muted" style={{ color: "var(--destructive)", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
    </div>
  );
}

function AppShell({ onLogout, email }) {
  const groups = [
    {
      title: "Overview",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> }
      ]
    },
    {
      title: "Sales & Leads",
      items: [
        { to: "/leads", label: "Sales Leads", icon: <Users size={18} /> },
        { to: "/leads/queue", label: "Review Queue", icon: <ShieldAlert size={18} /> }
      ]
    },
    {
      title: "Content & Assets",
      items: [
        { to: "/content/pages", label: "Web Pages", icon: <FileText size={18} /> },
        { to: "/content/destinations", label: "Destinations", icon: <MapPin size={18} /> },
        { to: "/content/articles", label: "Articles", icon: <Newspaper size={18} /> },
        { to: "/media", label: "Media Library", icon: <ImageIcon size={18} /> },
        { to: "/seo/markets", label: "SEO & Markets", icon: <Globe2 size={18} /> }
      ]
    },
    {
      title: "System & Config",
      items: [
        { to: "/publishing", label: "Publishing", icon: <Send size={18} /> },
        { to: "/integrations", label: "Integrations", icon: <Plug size={18} /> },
        { to: "/audit", label: "Audit Logs", icon: <ActivitySquare size={18} /> }
      ]
    }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1><Mountain size={24} /> Georgia Hills</h1>
        
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
          {groups.map((group) => (
            <div key={group.title}>
              <div className="nav-section">{group.title}</div>
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
           <div className="muted" style={{ marginBottom: "0.5rem", fontSize: "0.8rem", paddingLeft: "0.5rem", wordBreak: "break-all" }}>{email}</div>
           <button className="btn" style={{ width: "100%", justifyContent: "flex-start" }} onClick={onLogout}>
              <LogOut size={16} /> Logout
           </button>
        </div>
      </aside>
      
      <main className="main">
        <header className="topbar">
          <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>Management Console</div>
          <div className="badge">Secured</div>
        </header>
        <div className="page-container">
          <Suspense fallback={<div className="card" style={{ padding: "1.25rem" }}>Loading module...</div>}>
            <Routes>
              <Route path="/dashboard" element={<DashboardModule />} />
              <Route path="/content/pages" element={<PagesModule />} />
              <Route path="/content/destinations" element={<DestinationsModule />} />
              <Route path="/content/articles" element={<ArticlesModule />} />
              <Route path="/media" element={<MediaModule />} />
              <Route path="/seo/markets" element={<SeoMarketsModule />} />
              <Route path="/leads" element={<LeadsModule />} />
              <Route path="/leads/queue" element={<ReviewQueueModule />} />
              <Route path="/publishing" element={<PublishingModule />} />
              <Route path="/integrations" element={<IntegrationsModule />} />
              <Route path="/audit" element={<AuditModule />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export function App() {
  const { loading, user, claims, error, login, logout } = useOwnerAuth();

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!user) return <LoginView onLogin={login} error={error} />;

  if (claims?.admin !== true && claims?.role !== "admin") {
    return <div style={{ padding: "2rem" }}><h2>Access denied</h2><p className="muted">Owner admin claim required.</p><button className="btn" onClick={logout}>Logout</button></div>;
  }

  return <AppShell onLogout={logout} email={user.email || user.uid} />;
}
