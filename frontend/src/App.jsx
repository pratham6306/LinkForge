import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { fetchMyUrls } from "./services/api";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import StatsOverview from "./components/StatsOverview";
import UrlShortenerForm from "./components/UrlShortenerForm";
import UrlCard from "./components/UrlCard";
import QrModal from "./components/QrModal";
import { Search, RefreshCw } from "lucide-react";

export default function App() {
  const { token, isAuthenticated } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [qrUrl, setQrUrl] = useState(null);

  const loadUrls = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchMyUrls(token);
      setUrls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUrls();
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const filteredUrls = urls.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.original_url.toLowerCase().includes(query) ||
      u.short_code.toLowerCase().includes(query) ||
      u.short_url.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-canvas)", paddingBottom: "80px" }}>
      <Navbar />

      <main className="container" style={{ marginTop: "36px" }}>
        {/* Analytics Overview Cards */}
        <StatsOverview urls={urls} />

        {/* Shortener Box */}
        <UrlShortenerForm onUrlCreated={loadUrls} />

        {/* Links List Header & Search Filter */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary-forest)" }}>
              Your Created Links
            </h3>
            <button
              onClick={loadUrls}
              style={{
                color: "var(--primary-sage)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px",
                fontWeight: "600",
              }}
              title="Refresh Links"
            >
              <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
            </button>
          </div>

          {/* Search Field */}
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search size={16} color="var(--text-light)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              className="crisp-input"
              placeholder="Search links or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "40px", padding: "10px 14px 10px 40px", fontSize: "13.5px" }}
            />
          </div>
        </div>

        {/* Links List Cards */}
        {loading && urls.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            Loading your links...
          </div>
        ) : filteredUrls.length === 0 ? (
          <div
            className="crisp-card"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              background: "#FFFFFF",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>No links found</p>
            <p style={{ fontSize: "14px", color: "var(--text-light)" }}>
              {searchQuery ? "Try a different search term" : "Paste a long URL above to create your first short link!"}
            </p>
          </div>
        ) : (
          filteredUrls.map((url) => (
            <UrlCard key={url.id} url={url} onOpenQr={(urlStr) => setQrUrl(urlStr)} />
          ))
        )}
      </main>

      {/* QR Code Viewer Modal */}
      <QrModal url={qrUrl} onClose={() => setQrUrl(null)} />
    </div>
  );
}
