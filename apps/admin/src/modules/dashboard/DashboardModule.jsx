import React, { useEffect, useState, useMemo } from "react";
import { AdminApi } from "../../shared/api/adminApiClient";
import { Card, Table } from "../../shared/components/ui";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function DashboardModule() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    AdminApi.getDashboardSummary().then((res) => setData(res.data || res)).catch((e) => setError(e.message));
  }, []);

  if (error) return <Card title="Dashboard Error"><p className="muted">{error}</p></Card>;
  if (!data) return <Card title="Dashboard"><div style={{ padding: "2rem" }}>Loading Dashboard...</div></Card>;

  const totals = data.totals || data;
  const rows = Object.entries(data.integrations || {}).map(([k, v]) => [k, v?.configured ? "Configured" : "Missing", v?.healthy ? "Healthy" : "Unknown"]);
  
  const formattedSeries = (data.dailySeries || []).map(d => ({
     ...d,
     // format YYYY-MM-DD to MM-DD
     dateLabel: d.date.split('-').slice(1).join('/')
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="grid-3">
        <Card title="Total Leads (30d)">
          <div className="kpi" style={{ color: "var(--primary-color)", fontSize: "2.5rem" }}>{totals.bookings || 0}</div>
          <div className="muted" style={{ marginTop: "0.5rem" }}>across all properties</div>
        </Card>
        <Card title="English Market">
          <div className="kpi">{totals.en || 0}</div>
          <div className="muted" style={{ marginTop: "0.5rem" }}>EN Submissions</div>
        </Card>
        <Card title="Arabic Market">
          <div className="kpi">{totals.ar || 0}</div>
          <div className="muted" style={{ marginTop: "0.5rem" }}>AR Submissions</div>
        </Card>
      </div>
      
      <Card title="Lead Volume (30 Days)">
        <div style={{ width: '100%', height: 350, marginTop: "1rem" }}>
          {formattedSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="dateLabel" tick={{fontSize: 12}} tickMargin={10} axisLine={false} />
                <YAxis allowDecimals={false} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                   itemStyle={{ color: "#333", fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="bookings" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" name="Total Leads" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="muted" style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
               No daily data available.
            </div>
          )}
        </div>
      </Card>
      
      <div className="grid-2">
        <Card title="Market Split">
           <div style={{ width: '100%', height: 250 }}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[{ name: "Markets", EN: totals.en, AR: totals.ar }]} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                 <XAxis type="number" hide />
                 <YAxis type="category" dataKey="name" hide />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Legend />
                 <Bar dataKey="EN" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={40} name="English" />
                 <Bar dataKey="AR" fill="#10b981" radius={[0, 4, 4, 0]} barSize={40} name="Arabic (GCC)" />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </Card>
        
        <Card title="System Health">
          <Table columns={["Service", "Configured", "Health"]} rows={rows} />
        </Card>
      </div>
    </div>
  );
}

