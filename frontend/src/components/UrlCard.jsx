import React, { useState } from "react";
import { Copy, Check, QrCode, ExternalLink, Calendar, MousePointerClick, Clock } from "lucide-react";

export default function UrlCard({ url, onOpenQr }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url.short_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = url.expires_at && new Date(url.expires_at) < new Date();
  const createdDate = new Date(url.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="crisp-card"
      style={{
        padding: "20px 24px",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        opacity: isExpired ? 0.75 : 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        {/* Left Side: Short Link & Original Link */}
        <div style={{ flex: "1 1 300px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a
              href={url.short_url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "var(--primary-forest)",
                fontFamily: "var(--font-mono)",
                textDecoration: "none",
              }}
            >
              {url.short_url}
            </a>
            <a
              href={url.short_url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-light)" }}
              title="Visit Link"
            >
              <ExternalLink size={15} />
            </a>
          </div>

          <div
            style={{
              fontSize: "13.5px",
              color: "var(--text-muted)",
              marginTop: "4px",
              wordBreak: "break-all",
              maxHeight: "40px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {url.original_url}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => onOpenQr(url.short_url)}
            className="btn-secondary"
            style={{ padding: "8px 12px", fontSize: "13px" }}
            title="Generate QR Code"
          >
            <QrCode size={16} /> QR Code
          </button>

          <button
            onClick={handleCopy}
            className="btn-primary"
            style={{ padding: "8px 14px", fontSize: "13px" }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Footer Info & Badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          paddingTop: "12px",
          borderTop: "1px solid var(--bg-muted)",
          fontSize: "12.5px",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Clicks Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "700",
              color: "var(--primary-sage)",
              background: "var(--bg-sage)",
              padding: "4px 10px",
              borderRadius: "20px",
            }}
          >
            <MousePointerClick size={14} />
            {url.click_count || 0} Clicks
          </div>

          {/* Creation Date */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <Calendar size={14} /> Created {createdDate}
          </div>
        </div>

        {/* Expiration Status Badge */}
        <div>
          {isExpired ? (
            <span
              style={{
                background: "var(--status-expired-bg)",
                color: "var(--status-expired)",
                padding: "4px 10px",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "12px",
              }}
            >
              Expired
            </span>
          ) : url.expires_at ? (
            <span
              style={{
                background: "var(--bg-sage)",
                color: "var(--primary-sage)",
                padding: "4px 10px",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Clock size={12} /> Expires {new Date(url.expires_at).toLocaleDateString()}
            </span>
          ) : (
            <span style={{ color: "var(--text-light)", fontSize: "12px" }}>No Expiration</span>
          )}
        </div>
      </div>
    </div>
  );
}
