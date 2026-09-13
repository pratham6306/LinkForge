import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createShortUrl } from "../services/api";
import { Link2, Calendar, Copy, Check, Sparkles } from "lucide-react";

export default function UrlShortenerForm({ onUrlCreated }) {
  const { token } = useAuth();
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showExpiration, setShowExpiration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdResult, setCreatedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCreatedResult(null);
    setLoading(true);

    try {
      const data = await createShortUrl(token, originalUrl, showExpiration && expiresAt ? expiresAt : null);
      setCreatedResult(data);
      setOriginalUrl("");
      if (onUrlCreated) onUrlCreated();
    } catch (err) {
      setError(err.message || "Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdResult?.short_url) {
      navigator.clipboard.writeText(createdResult.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="crisp-card"
      style={{
        padding: "32px",
        marginBottom: "40px",
        background: "#FFFFFF",
        border: "1.5px solid var(--border-color)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Sparkles size={20} color="var(--primary-sage)" />
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary-forest)" }}>
          Create Short Link
        </h2>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 14px",
            background: "#FDF2F2",
            border: "1px solid #F8B4B4",
            borderRadius: "8px",
            color: "#9B1C1C",
            fontSize: "13.5px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Main URL Input */}
          <div style={{ flex: "1 1 400px", position: "relative" }}>
            <Link2 size={18} color="var(--text-light)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="url"
              className="crisp-input"
              placeholder="Paste a long URL (e.g. https://example.com/very-long-link)..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              style={{ paddingLeft: "46px" }}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "14px 28px", fontSize: "15px" }}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>

        {/* Optional Expiration Toggle */}
        <div style={{ marginTop: "16px" }}>
          <button
            type="button"
            onClick={() => setShowExpiration(!showExpiration)}
            style={{
              fontSize: "13px",
              color: "var(--primary-sage)",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Calendar size={15} />
            {showExpiration ? "Remove Expiration Date" : "+ Add Optional Expiration Date"}
          </button>

          {showExpiration && (
            <div style={{ marginTop: "12px", maxWidth: "300px" }} className="animate-fade-in">
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>
                Expiration Date & Time
              </label>
              <input
                type="datetime-local"
                className="crisp-input"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          )}
        </div>
      </form>

      {/* Generated Result Card */}
      {createdResult && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: "24px",
            padding: "20px 24px",
            background: "var(--bg-sage)",
            border: "1px solid #C2E0D4",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary-sage)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Short Link Generated!
            </div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary-forest)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              {createdResult.short_url}
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
              Original: {createdResult.original_url}
            </div>
          </div>

          <button onClick={handleCopy} className="btn-primary" style={{ padding: "10px 18px", fontSize: "13.5px" }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}
