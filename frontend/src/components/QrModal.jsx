import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Download } from "lucide-react";

export default function QrModal({ url, onClose }) {
  if (!url) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(10, 46, 35, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      className="animate-fade-in"
    >
      <div
        className="crisp-card"
        style={{
          background: "#FFFFFF",
          width: "100%",
          maxWidth: "360px",
          padding: "32px",
          textAlign: "center",
          position: "relative",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "var(--text-muted)",
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary-forest)", marginBottom: "4px" }}>
          Short Link QR Code
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
          Scan to visit short URL instantly
        </p>

        {/* QR Code Container */}
        <div
          style={{
            padding: "20px",
            background: "#FFFFFF",
            border: "1px solid var(--border-color)",
            borderRadius: "16px",
            display: "inline-block",
            marginBottom: "20px",
          }}
        >
          <QRCodeSVG value={url} size={180} fgColor="#0A2E23" bgColor="#FFFFFF" level="H" />
        </div>

        <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--primary-forest)", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
          {url}
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: "100%", marginTop: "20px", padding: "10px", fontSize: "14px" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
