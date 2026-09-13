import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/api";
import { Link2, Mail, Lock, ArrowRight, ShieldCheck, Zap, BarChart3, CheckCircle2 } from "lucide-react";

export default function AuthForm() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const token = await loginUser(email, password);
        login(token, email);
      } else {
        await registerUser(email, password);
        setSuccessMsg("Account created successfully! Logging you in...");
        const token = await loginUser(email, password);
        login(token, email);
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
      {/* Left Visual Editorial Panel */}
      <div
        style={{
          flex: "1.1",
          background: "var(--bg-forest)",
          color: "var(--text-on-dark)",
          padding: "60px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Decorative Pattern */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(82, 160, 131, 0.15) 0%, rgba(10, 46, 35, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 2 }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link2 size={24} color="#52A083" />
          </div>
          <span style={{ fontSize: "22px", fontWeight: "700", fontFamily: "var(--font-mono)", letterSpacing: "-0.5px" }}>
            LinkForge
          </span>
        </div>

        {/* Hero Copy */}
        <div style={{ maxWidth: "520px", zIndex: 2, margin: "60px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "30px",
              background: "rgba(82, 160, 131, 0.15)",
              border: "1px solid rgba(82, 160, 131, 0.3)",
              fontSize: "13px",
              color: "#52A083",
              fontWeight: "600",
              marginBottom: "24px",
            }}
          >
            <Zap size={14} /> Base62 Collision-Free Engine
          </div>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              lineHeight: "1.15",
              letterSpacing: "-1.5px",
              marginBottom: "20px",
              color: "#F6F4EE",
            }}
          >
            Forge Smarter Links. <br />
            <span style={{ color: "#52A083" }}>Deterministic Speed.</span>
          </h1>
          <p style={{ fontSize: "17px", color: "#A3B8B0", lineHeight: "1.6" }}>
            Transform long, complex URLs into concise, high-performing links with built-in link expiration, real-time analytics, and instant QR generation.
          </p>

          {/* Feature Badges */}
          <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ background: "rgba(255, 255, 255, 0.08)", padding: "8px", borderRadius: "8px", color: "#52A083" }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: "600" }}>Encrypted & Secure</h4>
                <p style={{ fontSize: "13px", color: "#8A9892" }}>JWT Auth & Protected Links</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ background: "rgba(255, 255, 255, 0.08)", padding: "8px", borderRadius: "8px", color: "#52A083" }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: "600" }}>Live Analytics</h4>
                <p style={{ fontSize: "13px", color: "#8A9892" }}>Track every redirect click</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quote Pill */}
        <div
          style={{
            zIndex: 2,
            padding: "16px 20px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <CheckCircle2 size={20} color="#52A083" />
          <span style={{ fontSize: "13px", color: "#C2D4CC" }}>
            Over 50 Billion possible unique Base62 short codes with zero latency retries.
          </span>
        </div>
      </div>

      {/* Right Auth Form Panel */}
      <div
        style={{
          flex: "0.9",
          background: "var(--bg-canvas)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          className="crisp-card animate-fade-in"
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "40px 36px",
            background: "#FFFFFF",
            boxShadow: "0 12px 32px rgba(10, 46, 35, 0.06)",
          }}
        >
          {/* Tab Switcher */}
          <div
            style={{
              display: "flex",
              background: "var(--bg-muted)",
              padding: "4px",
              borderRadius: "10px",
              marginBottom: "32px",
            }}
          >
            <button
              onClick={() => { setIsLogin(true); setError(""); setSuccessMsg(""); }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                background: isLogin ? "#FFFFFF" : "transparent",
                color: isLogin ? "var(--primary-forest)" : "var(--text-muted)",
                boxShadow: isLogin ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); setSuccessMsg(""); }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                background: !isLogin ? "#FFFFFF" : "transparent",
                color: !isLogin ? "var(--primary-forest)" : "var(--text-muted)",
                boxShadow: !isLogin ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              Create Account
            </button>
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary-forest)", marginBottom: "8px" }}>
            {isLogin ? "Welcome back" : "Get started with LinkForge"}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px" }}>
            {isLogin ? "Enter your credentials to access your dashboard" : "Create an account to start forging short links"}
          </p>

          {/* Feedback Messages */}
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

          {successMsg && (
            <div
              style={{
                padding: "12px 14px",
                background: "#EDF7F2",
                border: "1px solid #A3E0C6",
                borderRadius: "8px",
                color: "#0E623B",
                fontSize: "13.5px",
                marginBottom: "20px",
              }}
            >
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color="var(--text-light)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email"
                  className="crisp-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: "42px" }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="var(--text-light)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="password"
                  className="crisp-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: "42px" }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", padding: "14px", marginTop: "8px", fontSize: "15px" }}>
              {loading ? "Processing..." : isLogin ? "Sign In to Dashboard" : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
