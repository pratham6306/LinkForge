import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link2, LogOut } from "lucide-react";

export default function Navbar() {
  const { userEmail, logout } = useAuth();

  return (
    <header
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(10, 46, 35, 0.03)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "72px",
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--bg-forest)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link2 size={20} color="#52A083" />
          </div>
          <span style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--primary-forest)" }}>
            LinkForge
          </span>
        </div>

        {/* User Info & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "var(--bg-muted)",
              fontSize: "13.5px",
              color: "var(--text-main)",
              fontWeight: "500",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "var(--primary-sage)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              {userEmail ? userEmail[0].toUpperCase() : "U"}
            </div>
            <span>{userEmail}</span>
          </div>

          <button
            onClick={logout}
            className="btn-secondary"
            style={{ padding: "8px 14px", fontSize: "13px" }}
            title="Log Out"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
