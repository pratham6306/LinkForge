import React from "react";
import { Link2, MousePointerClick, CheckCircle2 } from "lucide-react";

export default function StatsOverview({ urls }) {
  const totalLinks = urls.length;
  const totalClicks = urls.reduce((acc, curr) => acc + (curr.click_count || 0), 0);
  
  const now = new Date();
  const activeLinks = urls.filter((u) => {
    if (!u.expires_at) return true;
    return new Date(u.expires_at) > now;
  }).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
      }}
    >
      {/* Total Links Card */}
      <div className="crisp-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Links Created
            </span>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--primary-forest)", marginTop: "6px" }}>
              {totalLinks}
            </div>
          </div>
          <div style={{ background: "var(--bg-sage)", padding: "10px", borderRadius: "10px", color: "var(--primary-sage)" }}>
            <Link2 size={24} />
          </div>
        </div>
      </div>

      {/* Total Clicks Card */}
      <div className="crisp-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Redirect Clicks
            </span>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--primary-sage)", marginTop: "6px" }}>
              {totalClicks}
            </div>
          </div>
          <div style={{ background: "var(--bg-sage)", padding: "10px", borderRadius: "10px", color: "var(--primary-sage)" }}>
            <MousePointerClick size={24} />
          </div>
        </div>
      </div>

      {/* Active Links Card */}
      <div className="crisp-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Active Short Links
            </span>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--primary-forest)", marginTop: "6px" }}>
              {activeLinks}
            </div>
          </div>
          <div style={{ background: "var(--bg-sage)", padding: "10px", borderRadius: "10px", color: "var(--primary-sage)" }}>
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
