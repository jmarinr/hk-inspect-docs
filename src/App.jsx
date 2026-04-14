import { useState, useRef, useEffect } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  navy:      "#1B3B6B",
  navyDark:  "#0F2545",
  navyLight: "#EEF3F9",
  navyBorder:"#B8CBE0",
  red:       "#C8202D",
  redLight:  "#FEF2F2",
  bg:        "#FAFAF9",
  white:     "#FFFFFF",
  stone50:   "#FAFAF9",
  stone100:  "#F5F5F4",
  stone200:  "#E7E5E4",
  stone300:  "#D6D3D1",
  stone400:  "#A8A29E",
  stone500:  "#78716C",
  stone600:  "#57534E",
  stone700:  "#44403C",
  stone800:  "#292524",
  stone900:  "#1C1917",
  green:     "#16A34A",
  greenLight:"#F0FDF4",
  amber:     "#D97706",
  amberLight:"#FFFBEB",
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { email: "dev@hkinspect.com",   password: "hkinspect2026", name: "Developer Portal", role: "Developer"   },
  { email: "lrds@hkinspect.com",  password: "lrds2026",      name: "LRDS Integration", role: "Integration" },
  { email: "info@henkancx.com",   password: "henkaninfo",     name: "Henkan CX",        role: "Admin"       },
];

const MOCK_TOKENS = {
  dev:  "hki_live_sk_test_aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5",
  lrds: "hki_live_sk_prod_9Z8Y7X6W5V4U3T2S1R0Q9P8O7N6M5L4K3J2I1H0",
};

const BASE_URLS = {
  production: "https://api.hkinspect.com/v1",
  staging:    "https://api-staging.hkinspect.com/v1",
  dev:        "https://api-dev.hkinspect.com/v1",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function S(base, overrides = {}) {
  return Object.assign({}, base, overrides);
}

function Badge({ children, color = C.stone700, bg = C.stone100, border = C.stone300, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 10, fontWeight: 600, padding: "2px 8px",
      borderRadius: 20, border: `1px solid ${border}`,
      color, background: bg, letterSpacing: "0.2px",
      fontFamily: FONT, ...style,
    }}>{children}</span>
  );
}

const METHOD_COLORS = {
  GET:    { bg: C.navyLight,  color: C.navy,  border: C.navyBorder },
  POST:   { bg: "#FFFBEB",   color: "#92400E", border: "#FCD34D" },
  PUT:    { bg: "#F0FDF4",   color: "#14532D", border: "#86EFAC" },
  DELETE: { bg: C.redLight,  color: C.red,    border: "#FCA5A5" },
  PATCH:  { bg: "#FDF4FF",   color: "#6B21A8", border: "#D8B4FE" },
};

function MethodBadge({ m, size = 10 }) {
  const s = METHOD_COLORS[m] || METHOD_COLORS.GET;
  return (
    <span style={{
      fontSize: size, fontWeight: 700, padding: "2px 7px",
      borderRadius: 5, border: `1px solid ${s.border}`,
      background: s.bg, color: s.color, letterSpacing: "0.4px",
      flexShrink: 0, fontFamily: FONT,
    }}>{m}</span>
  );
}

function IC({ children, blue = false }) {
  return (
    <code style={{
      fontFamily: FONT, fontSize: "0.87em", fontWeight: 500,
      background: blue ? C.navyLight : C.stone100,
      color: blue ? C.navy : C.stone800,
      padding: "1px 5px", borderRadius: 4,
    }}>{children}</code>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode]           = useState("login"); // login | sso
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError("Invalid credentials. Check your email and password.");
    }
    setLoading(false);
  };

  const handleSSO = async (provider) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onLogin({ email: `sso@${provider}.com`, name: `${provider} SSO User`, role: "Developer", provider });
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.stone100,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", fontFamily: FONT, padding: 24,
    }}>
      {/* Logo area */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, background: C.navy, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" fillOpacity="0.2"/>
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.stone900, margin: 0 }}>HK Inspect</h1>
        <p style={{ fontSize: 12, color: C.stone400, marginTop: 4, fontWeight: 400 }}>Developer Portal</p>
      </div>

      {/* Card */}
      <div style={{
        background: C.white, borderRadius: 16,
        border: `1.5px solid ${C.stone200}`,
        padding: 32, width: "100%", maxWidth: 400,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.stone900, margin: "0 0 6px" }}>
          {mode === "login" ? "Sign in to your account" : "Single Sign-On"}
        </h2>
        <p style={{ fontSize: 12, color: C.stone400, margin: "0 0 24px" }}>
          {mode === "login"
            ? "Access the HK Inspect API documentation and playground."
            : "Sign in with your organization's identity provider."}
        </p>

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.stone600, display: "block", marginBottom: 5 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  width: "100%", padding: "9px 12px",
                  border: `1.5px solid ${C.stone200}`, borderRadius: 8,
                  fontSize: 13, color: C.stone900, outline: "none",
                  fontFamily: FONT, background: C.white,
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = C.navy}
                onBlur={e => e.target.style.borderColor = C.stone200}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.stone600, display: "block", marginBottom: 5 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  style={{
                    width: "100%", padding: "9px 40px 9px 12px",
                    border: `1.5px solid ${C.stone200}`, borderRadius: 8,
                    fontSize: 13, color: C.stone900, outline: "none",
                    fontFamily: FONT, background: C.white,
                  }}
                  onFocus={e => e.target.style.borderColor = C.navy}
                  onBlur={e => e.target.style.borderColor = C.stone200}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: C.stone400, fontSize: 11, fontWeight: 500, fontFamily: FONT,
                }}>{showPass ? "Hide" : "Show"}</button>
              </div>
            </div>

            {error && (
              <div style={{
                background: C.redLight, border: `1px solid #FCA5A5`,
                borderRadius: 8, padding: "9px 12px",
                fontSize: 12, color: C.red, marginBottom: 16,
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "10px 16px",
              background: loading ? C.stone300 : C.navy,
              color: C.white, border: "none", borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: FONT, letterSpacing: "0.1px",
              transition: "background 0.15s",
            }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: C.stone200 }} />
              <span style={{ fontSize: 11, color: C.stone400 }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: C.stone200 }} />
            </div>

            <button type="button" onClick={() => setMode("sso")} style={{
              width: "100%", padding: "9px 16px",
              background: C.white, color: C.stone700,
              border: `1.5px solid ${C.stone200}`, borderRadius: 8,
              fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={C.stone500} strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={C.stone500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Enterprise SSO
            </button>
          </form>
        ) : (
          <div>
            {/* Google */}
            <button onClick={() => handleSSO("Google")} disabled={loading} style={{
              width: "100%", padding: "11px 16px", marginBottom: 10,
              background: C.white, border: `1.5px solid ${C.stone200}`,
              borderRadius: 10, fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: FONT,
              display: "flex", alignItems: "center", gap: 12,
              color: C.stone800, transition: "border-color 0.15s",
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = C.stone400}
              onMouseOut={e => e.currentTarget.style.borderColor = C.stone200}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Microsoft */}
            <button onClick={() => handleSSO("Microsoft")} disabled={loading} style={{
              width: "100%", padding: "11px 16px", marginBottom: 10,
              background: C.white, border: `1.5px solid ${C.stone200}`,
              borderRadius: 10, fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: FONT,
              display: "flex", alignItems: "center", gap: 12,
              color: C.stone800, transition: "border-color 0.15s",
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = C.stone400}
              onMouseOut={e => e.currentTarget.style.borderColor = C.stone200}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
              </svg>
              Continue with Microsoft
            </button>

            {loading && (
              <p style={{ textAlign: "center", fontSize: 12, color: C.stone400, margin: "12px 0 0" }}>
                Redirecting to identity provider…
              </p>
            )}

            <button onClick={() => setMode("login")} style={{
              width: "100%", marginTop: 14, padding: "9px",
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, color: C.stone400, fontFamily: FONT,
            }}>
              ← Back to email sign in
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: C.stone400, marginTop: 20, textAlign: "center" }}>
        Henkan CX · La Regional de Seguros, S.A. · Confidential
      </p>
    </div>
  );
}

// ─── PLAYGROUND ───────────────────────────────────────────────────────────────
const PLAYGROUND_PRESETS = [
  {
    label: "Create Inspection",
    method: "POST",
    path: "/inspections",
    body: JSON.stringify({
      policyOrQuoteId: "COT-2026-0001",
      person: { fullName: "Juan Pérez", idNumber: "8-123-456", email: "juan@email.com", phone: "+50760001234" },
      vehicle: { plate: "ABC-123", vin: "1HGCM82633A123456", brand: "Toyota", model: "Corolla", year: 2022, color: "Blanco", vehicleType: "SEDAN" }
    }, null, 2),
  },
  {
    label: "Get Inspection",
    method: "GET",
    path: "/inspections/insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
    body: "",
  },
  {
    label: "Get by Policy",
    method: "GET",
    path: "/inspections/by-policy/COT-2026-0001",
    body: "",
  },
  {
    label: "Resend Link",
    method: "POST",
    path: "/inspections/insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c/resend-link",
    body: JSON.stringify({ action: "RESEND_EMAIL", note: "Customer requested resend" }, null, 2),
  },
  {
    label: "Audit Log",
    method: "GET",
    path: "/inspections/insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c/audit",
    body: "",
  },
];

const MOCK_RESPONSES = {
  "POST /inspections": { status: 200, time: 312, body: { inspectionId: "insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c", policyOrQuoteId: "COT-2026-0001", status: "LINK_SENT", inspectionLink: "https://inspect.hkinspect.com/i/eyJhbGciOiJIUzI1NiJ9.eyJpZCI6Imluc3BfN2YzYTFiMmMifQ.abc123", linkExpiresAt: "2026-04-17T15:30:00Z", emailSentAt: "2026-04-14T15:30:01Z", createdAt: "2026-04-14T15:30:00Z" } },
  "GET /inspections/insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c": { status: 200, time: 87, body: { inspectionId: "insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c", policyOrQuoteId: "COT-2026-0001", status: "DAMAGES_DETECTED", decisionSuggestion: "MANUAL_REVIEW", possibleFraud: false, severity: "MEDIA", ocrAiResult: { vinMatch: "MATCH", plateMatch: "MATCH", brandMatch: "MATCH", colorMatch: "INCONCLUSIVE", confidenceScore: 0.91, processedAt: "2026-04-14T16:05:22Z" }, damages: [{ photoType: "LEFT_SIDE", damageType: "ABOLLADURA", severity: "MEDIA", confidenceScore: 0.87, observation: "Abolladura en puerta trasera izquierda" }] } },
  "GET /inspections/by-policy/COT-2026-0001": { status: 200, time: 94, body: { items: [{ inspectionId: "insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c", status: "DAMAGES_DETECTED" }], total: 1 } },
  "POST /inspections/insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c/resend-link": { status: 200, time: 156, body: { inspectionId: "insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c", action: "RESEND_EMAIL", emailResentAt: "2026-04-14T17:22:10Z", auditEventId: "evt_9a8b7c6d" } },
  "GET /inspections/insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c/audit": { status: 200, time: 63, body: { inspectionId: "insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c", events: [{ eventId: "evt_001", eventType: "STATUS_CHANGED", newStatus: "LINK_GENERATED", actor: "system", timestamp: "2026-04-14T15:30:00Z" }, { eventId: "evt_002", eventType: "EMAIL_SENT", newStatus: "LINK_SENT", actor: "system", timestamp: "2026-04-14T15:30:01Z" }], total: 2 } },
};

function Playground({ token }) {
  const [env, setEnv]         = useState("staging");
  const [method, setMethod]   = useState("POST");
  const [path, setPath]       = useState("/inspections");
  const [body, setBody]       = useState(PLAYGROUND_PRESETS[0].body);
  const [headers, setHeaders] = useState([
    { key: "Authorization", value: `Bearer ${token}`, locked: true },
    { key: "X-Client-ID",   value: "lrds-panama",      locked: false },
    { key: "Content-Type",  value: "application/json",  locked: false },
    { key: "Idempotency-Key", value: crypto.randomUUID?.() || "550e8400-e29b-41d4-a716-446655440000", locked: false },
  ]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState("body"); // body | headers
  const [respTab, setRespTab]   = useState("body");   // body | headers

  const loadPreset = (p) => {
    setMethod(p.method);
    setPath(p.path);
    setBody(p.body);
    setResponse(null);
  };

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    const key = `${method} ${path}`;
    const mock = MOCK_RESPONSES[key] || {
      status: 404,
      time: Math.floor(50 + Math.random() * 100),
      body: { error: { code: "INSPECTION_NOT_FOUND", message: "No inspection found with the provided identifier.", requestId: `req_${Math.random().toString(36).substr(2, 9)}` } }
    };
    setResponse(mock);
    setLoading(false);
  };

  const regenerateIdempotency = () => {
    const key = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setHeaders(h => h.map(hh => hh.key === "Idempotency-Key" ? { ...hh, value: key } : hh));
  };

  const fullUrl = `${BASE_URLS[env]}${path}`;

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.stone900, margin: "0 0 6px" }}>API Playground</h2>
        <p style={{ fontSize: 13, color: C.stone500, margin: 0 }}>
          Test API calls in real-time. Your credentials are pre-loaded from your session.
        </p>
      </div>

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.stone400, alignSelf: "center", marginRight: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Presets:</span>
        {PLAYGROUND_PRESETS.map(p => (
          <button key={p.label} onClick={() => loadPreset(p)} style={{
            padding: "4px 12px", borderRadius: 20,
            border: `1px solid ${C.stone200}`,
            background: C.stone100, color: C.stone700,
            fontSize: 11, fontWeight: 500, cursor: "pointer",
            fontFamily: FONT, display: "flex", alignItems: "center", gap: 5,
          }}>
            <MethodBadge m={p.method} size={9} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Request bar */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 12,
        background: C.stone100, border: `1.5px solid ${C.stone200}`,
        borderRadius: 10, padding: 8,
      }}>
        {/* Environment */}
        <select value={env} onChange={e => setEnv(e.target.value)} style={{
          padding: "7px 10px", border: `1px solid ${C.stone200}`,
          borderRadius: 7, fontSize: 11, fontWeight: 600,
          color: C.navy, background: C.navyLight,
          cursor: "pointer", fontFamily: FONT, outline: "none",
        }}>
          <option value="production">PROD</option>
          <option value="staging">STAGING</option>
          <option value="dev">DEV</option>
        </select>

        {/* Method */}
        <select value={method} onChange={e => setMethod(e.target.value)} style={{
          padding: "7px 10px", border: `1px solid ${METHOD_COLORS[method]?.border}`,
          borderRadius: 7, fontSize: 11, fontWeight: 700,
          color: METHOD_COLORS[method]?.color, background: METHOD_COLORS[method]?.bg,
          cursor: "pointer", fontFamily: FONT, outline: "none",
        }}>
          {Object.keys(METHOD_COLORS).map(m => <option key={m}>{m}</option>)}
        </select>

        {/* Base URL (readonly) */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: "7px 10px", fontSize: 11, color: C.stone400,
          background: C.white, border: `1px solid ${C.stone200}`,
          borderRadius: 7, whiteSpace: "nowrap",
        }}>
          {BASE_URLS[env]}
        </div>

        {/* Path input */}
        <input
          value={path}
          onChange={e => setPath(e.target.value)}
          style={{
            flex: 1, padding: "7px 10px",
            border: `1px solid ${C.stone200}`, borderRadius: 7,
            fontSize: 12, color: C.stone900, fontFamily: FONT,
            outline: "none", background: C.white,
          }}
          onFocus={e => e.target.style.borderColor = C.navy}
          onBlur={e => e.target.style.borderColor = C.stone200}
        />

        {/* Send */}
        <button onClick={sendRequest} disabled={loading} style={{
          padding: "7px 18px", background: loading ? C.stone300 : C.navy,
          color: C.white, border: "none", borderRadius: 7,
          fontSize: 12, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: FONT, whiteSpace: "nowrap", letterSpacing: "0.2px",
        }}>
          {loading ? "Sending…" : "Send →"}
        </button>
      </div>

      {/* Full URL display */}
      <div style={{
        fontSize: 10, color: C.stone400, marginBottom: 16,
        fontFamily: FONT, padding: "4px 12px",
        background: C.stone100, borderRadius: 6, display: "inline-block",
      }}>
        {fullUrl}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* REQUEST PANEL */}
        <div style={{
          border: `1.5px solid ${C.stone200}`, borderRadius: 10,
          background: C.white, overflow: "hidden",
        }}>
          <div style={{
            display: "flex", borderBottom: `1px solid ${C.stone200}`,
          }}>
            {["headers", "body"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: "10px 16px", border: "none",
                background: activeTab === t ? C.navyLight : "transparent",
                color: activeTab === t ? C.navy : C.stone500,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                fontFamily: FONT, textTransform: "capitalize",
                borderBottom: activeTab === t ? `2px solid ${C.navy}` : "2px solid transparent",
              }}>{t}</button>
            ))}
          </div>

          {activeTab === "headers" && (
            <div style={{ padding: 12 }}>
              {headers.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  <input value={h.key} readOnly={h.locked}
                    onChange={e => setHeaders(hs => hs.map((hh, ii) => ii===i ? {...hh, key: e.target.value} : hh))}
                    style={{
                      flex: "0 0 140px", padding: "6px 8px",
                      border: `1px solid ${C.stone200}`, borderRadius: 6,
                      fontSize: 11, fontFamily: FONT, color: C.stone700,
                      background: h.locked ? C.stone100 : C.white,
                    }}/>
                  <input value={h.key === "Idempotency-Key" ? h.value : h.value}
                    readOnly={h.locked && h.key === "Authorization"}
                    onChange={e => setHeaders(hs => hs.map((hh, ii) => ii===i ? {...hh, value: e.target.value} : hh))}
                    style={{
                      flex: 1, padding: "6px 8px",
                      border: `1px solid ${C.stone200}`, borderRadius: 6,
                      fontSize: 11, fontFamily: FONT, color: C.stone700,
                      background: h.locked && h.key === "Authorization" ? C.stone100 : C.white,
                    }}/>
                  {h.key === "Idempotency-Key" && (
                    <button onClick={regenerateIdempotency} title="Regenerate" style={{
                      padding: "6px 8px", border: `1px solid ${C.stone200}`,
                      borderRadius: 6, background: C.stone100, cursor: "pointer",
                      fontSize: 10, color: C.stone500, fontFamily: FONT,
                    }}>↺</button>
                  )}
                </div>
              ))}
              <button onClick={() => setHeaders(h => [...h, { key: "", value: "", locked: false }])} style={{
                marginTop: 4, padding: "5px 10px", border: `1px dashed ${C.stone300}`,
                borderRadius: 6, background: "none", cursor: "pointer",
                fontSize: 11, color: C.stone400, fontFamily: FONT,
              }}>+ Add header</button>
            </div>
          )}

          {activeTab === "body" && (
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={method === "GET" ? "GET requests have no body" : "// Request body (JSON)"}
              readOnly={method === "GET"}
              style={{
                display: "block", width: "100%", minHeight: 220,
                padding: 12, border: "none", outline: "none",
                fontFamily: FONT, fontSize: 11, lineHeight: 1.7,
                color: C.stone800, background: method === "GET" ? C.stone100 : C.white,
                resize: "vertical",
              }}
            />
          )}
        </div>

        {/* RESPONSE PANEL */}
        <div style={{
          border: `1.5px solid ${C.stone200}`, borderRadius: 10,
          background: C.white, overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            borderBottom: `1px solid ${C.stone200}`, padding: "0",
          }}>
            {["body", "headers"].map(t => (
              <button key={t} onClick={() => setRespTab(t)} style={{
                padding: "10px 16px", border: "none",
                background: respTab === t ? C.navyLight : "transparent",
                color: respTab === t ? C.navy : C.stone500,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                fontFamily: FONT, textTransform: "capitalize",
                borderBottom: respTab === t ? `2px solid ${C.navy}` : "2px solid transparent",
              }}>{t}</button>
            ))}
            {response && (
              <div style={{ marginLeft: "auto", padding: "0 12px", display: "flex", gap: 8, alignItems: "center" }}>
                <Badge
                  children={`${response.status} ${response.status === 200 ? "OK" : "Not Found"}`}
                  color={response.status === 200 ? C.green : C.red}
                  bg={response.status === 200 ? C.greenLight : C.redLight}
                  border={response.status === 200 ? "#86EFAC" : "#FCA5A5"}
                />
                <span style={{ fontSize: 10, color: C.stone400 }}>{response.time}ms</span>
              </div>
            )}
          </div>

          {!response && !loading && (
            <div style={{
              height: 220, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: C.stone300,
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={C.stone300} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ fontSize: 12, marginTop: 10, fontFamily: FONT }}>Hit Send to see the response</p>
            </div>
          )}

          {loading && (
            <div style={{
              height: 220, display: "flex", alignItems: "center", justifyContent: "center",
              color: C.stone400, fontSize: 12, fontFamily: FONT,
            }}>
              Sending request…
            </div>
          )}

          {response && respTab === "body" && (
            <pre style={{
              margin: 0, padding: 12,
              fontSize: 11, lineHeight: 1.7,
              color: response.status === 200 ? C.stone800 : C.red,
              fontFamily: FONT, overflowX: "auto", minHeight: 220,
              background: C.white,
            }}>
              {JSON.stringify(response.body, null, 2)}
            </pre>
          )}

          {response && respTab === "headers" && (
            <div style={{ padding: 12, fontFamily: FONT }}>
              {[
                ["Content-Type", "application/json; charset=utf-8"],
                ["X-Request-ID", `req_${Math.random().toString(36).substr(2, 9)}`],
                ["X-RateLimit-Limit", "300"],
                ["X-RateLimit-Remaining", "299"],
                ["X-RateLimit-Reset", String(Math.floor(Date.now()/1000) + 60)],
                ["Cache-Control", "no-cache"],
                ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 10, marginBottom: 6, fontSize: 11 }}>
                  <span style={{ color: C.navy, fontWeight: 600, minWidth: 200 }}>{k}</span>
                  <span style={{ color: C.stone600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TOKEN MANAGER ────────────────────────────────────────────────────────────
function TokenManager({ user }) {
  const [tokens, setTokens]   = useState([
    { id: 1, name: "Production API Key", key: MOCK_TOKENS.lrds, env: "production", created: "2026-04-01", lastUsed: "2026-04-14", status: "active" },
    { id: 2, name: "Staging API Key",    key: MOCK_TOKENS.dev,  env: "staging",    created: "2026-04-01", lastUsed: "2026-04-13", status: "active" },
  ]);
  const [visible, setVisible] = useState({});
  const [copied, setCopied]   = useState({});
  const [creating, setCreating] = useState(false);
  const [newName, setNewName]   = useState("");

  const copyKey = (id, key) => {
    navigator.clipboard?.writeText(key);
    setCopied(c => ({ ...c, [id]: true }));
    setTimeout(() => setCopied(c => ({ ...c, [id]: false })), 2000);
  };

  const createToken = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    await new Promise(r => setTimeout(r, 800));
    const key = `hki_live_sk_new_${Math.random().toString(36).substr(2, 32)}`;
    setTokens(t => [...t, {
      id: Date.now(), name: newName, key, env: "staging",
      created: new Date().toISOString().split("T")[0],
      lastUsed: "—", status: "active",
    }]);
    setNewName("");
    setCreating(false);
  };

  const revokeToken = (id) => {
    setTokens(t => t.map(tk => tk.id === id ? { ...tk, status: "revoked" } : tk));
  };

  const mask = (key) => key.slice(0, 18) + "••••••••••••••••" + key.slice(-4);

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.stone900, margin: "0 0 6px" }}>API Tokens</h2>
        <p style={{ fontSize: 13, color: C.stone500, margin: 0 }}>
          Manage your API keys. Tokens are associated with your client ID and environment.
        </p>
      </div>

      {/* Create token */}
      <div style={{
        background: C.navyLight, border: `1.5px solid ${C.navyBorder}`,
        borderRadius: 12, padding: 16, marginBottom: 20,
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.navy, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Generate New Token
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Token name — e.g. LRDS Production Key"
            style={{
              flex: 1, padding: "8px 12px",
              border: `1.5px solid ${C.navyBorder}`, borderRadius: 8,
              fontSize: 12, fontFamily: FONT, color: C.stone900,
              outline: "none", background: C.white,
            }}
            onKeyDown={e => e.key === "Enter" && createToken()}
          />
          <button onClick={createToken} disabled={creating || !newName.trim()} style={{
            padding: "8px 16px", background: C.navy,
            color: C.white, border: "none", borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
          }}>
            {creating ? "Generating…" : "Generate Token"}
          </button>
        </div>
        <p style={{ fontSize: 10, color: C.navy, margin: "8px 0 0", opacity: 0.7 }}>
          Tokens inherit your <IC blue>X-Client-ID: lrds-panama</IC> scope. Store tokens securely — they won't be shown again after generation.
        </p>
      </div>

      {/* Token list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tokens.map(tk => (
          <div key={tk.id} style={{
            border: `1.5px solid ${tk.status === "revoked" ? C.stone200 : C.stone200}`,
            borderRadius: 12, padding: "14px 16px",
            background: tk.status === "revoked" ? C.stone100 : C.white,
            opacity: tk.status === "revoked" ? 0.6 : 1,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.stone900 }}>{tk.name}</span>
                  <Badge
                    children={tk.status === "active" ? "Active" : "Revoked"}
                    color={tk.status === "active" ? C.green : C.stone500}
                    bg={tk.status === "active" ? C.greenLight : C.stone100}
                    border={tk.status === "active" ? "#86EFAC" : C.stone300}
                  />
                  <Badge
                    children={tk.env}
                    color={tk.env === "production" ? C.red : C.amber}
                    bg={tk.env === "production" ? C.redLight : C.amberLight}
                    border={tk.env === "production" ? "#FCA5A5" : "#FCD34D"}
                  />
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 10, color: C.stone400 }}>
                  <span>Created: {tk.created}</span>
                  <span>Last used: {tk.lastUsed}</span>
                </div>
              </div>
              {tk.status === "active" && (
                <button onClick={() => revokeToken(tk.id)} style={{
                  padding: "5px 10px", border: `1px solid #FCA5A5`,
                  borderRadius: 6, background: C.redLight, color: C.red,
                  fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: FONT,
                }}>Revoke</button>
              )}
            </div>

            <div style={{
              display: "flex", gap: 6, alignItems: "center",
              background: C.stone100, borderRadius: 8, padding: "8px 10px",
            }}>
              <code style={{ flex: 1, fontSize: 11, color: C.stone700, fontFamily: FONT, letterSpacing: "0.3px" }}>
                {visible[tk.id] ? tk.key : mask(tk.key)}
              </code>
              <button onClick={() => setVisible(v => ({ ...v, [tk.id]: !v[tk.id] }))} style={{
                padding: "3px 8px", border: `1px solid ${C.stone300}`,
                borderRadius: 5, background: C.white, cursor: "pointer",
                fontSize: 10, color: C.stone500, fontFamily: FONT,
              }}>{visible[tk.id] ? "Hide" : "Show"}</button>
              <button onClick={() => copyKey(tk.id, tk.key)} disabled={tk.status === "revoked"} style={{
                padding: "3px 8px", border: `1px solid ${copied[tk.id] ? "#86EFAC" : C.stone300}`,
                borderRadius: 5, background: copied[tk.id] ? C.greenLight : C.white,
                cursor: "pointer", fontSize: 10,
                color: copied[tk.id] ? C.green : C.stone500, fontFamily: FONT,
              }}>{copied[tk.id] ? "Copied!" : "Copy"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── API DOCS (condensed) ─────────────────────────────────────────────────────
function ApiDocs({ token }) {
  const endpoints = [
    {
      method: "POST", path: "/v1/inspections",
      desc: "Crea un nuevo expediente de inspección, genera el link tokenizado (single-use, 72h) y envía el correo inicial al asegurado.",
      request: `{
  "policyOrQuoteId": "COT-2026-0001",
  "person": {
    "fullName": "Juan Pérez",
    "idNumber": "8-123-456",
    "email": "juan@email.com",
    "phone": "+50760001234"
  },
  "vehicle": {
    "plate": "ABC-123",
    "vin": "1HGCM82633A123456",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "color": "Blanco",
    "vehicleType": "SEDAN"
  }
}`,
      response: `{
  "inspectionId": "insp_7f3a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  "status": "LINK_SENT",
  "inspectionLink": "https://inspect.hkinspect.com/i/eyJ...",
  "linkExpiresAt": "2026-04-17T15:30:00Z",
  "createdAt": "2026-04-14T15:30:00Z"
}`,
      fields: [
        ["policyOrQuoteId", "string", "required", "ID de póliza o cotización en LRDS. Max 100 chars."],
        ["person.fullName",  "string", "required", "Nombre completo del asegurado"],
        ["person.idNumber",  "string", "required", "Cédula o identificación"],
        ["person.email",     "string", "required", "Correo para el link. Formato RFC 5322"],
        ["person.phone",     "string", "optional", "Teléfono E.164 — ej: +50760001234"],
        ["vehicle.plate",    "string", "required", "Placa. 2–15 chars alfanumérico"],
        ["vehicle.vin",      "string", "required", "VIN. Exactamente 17 chars"],
        ["vehicle.brand",    "string", "required", "Marca"],
        ["vehicle.model",    "string", "required", "Modelo"],
        ["vehicle.year",     "integer","required", "Año modelo. 1900 – año actual +1"],
        ["vehicle.color",    "string", "required", "Color declarado"],
        ["vehicle.vehicleType","enum", "required", "SEDAN · SUV · PICKUP · HATCHBACK · COUPE · VAN · MINIVAN · TRUCK · MOTORCYCLE · OTHER"],
      ],
    },
    {
      method: "GET", path: "/v1/inspections/{inspectionId}",
      desc: "Retorna el estado completo y el resultado OCR/IA del expediente. Usar para polling hasta que la inspección esté en estado terminal.",
      fields: [
        ["inspectionId (path)", "string", "required", "ID único retornado al crear la inspección"],
      ],
      response: `{
  "inspectionId": "insp_7f3a1b2c...",
  "status": "DAMAGES_DETECTED",
  "decisionSuggestion": "MANUAL_REVIEW",
  "possibleFraud": false,
  "severity": "MEDIA",
  "ocrAiResult": {
    "vinMatch": "MATCH",
    "plateMatch": "MATCH",
    "colorMatch": "INCONCLUSIVE",
    "confidenceScore": 0.91
  },
  "damages": [
    {
      "photoType": "LEFT_SIDE",
      "damageType": "ABOLLADURA",
      "severity": "MEDIA",
      "confidenceScore": 0.87,
      "observation": "Abolladura en puerta trasera izquierda"
    }
  ]
}`,
    },
    {
      method: "GET", path: "/v1/inspections/by-policy/{policyOrQuoteId}",
      desc: "Consulta la inspección por ID de póliza o cotización. Útil cuando LRDS no almacenó el inspectionId.",
      fields: [
        ["policyOrQuoteId (path)", "string",  "required", "ID de póliza o cotización usado al crear"],
        ["status (query)",         "enum",    "optional", "Filtrar por estado"],
        ["limit (query)",          "integer", "optional", "Máx resultados. Default 1, max 10"],
      ],
      response: `{ "items": [{ "inspectionId": "...", "status": "DAMAGES_DETECTED" }], "total": 1 }`,
    },
    {
      method: "POST", path: "/v1/inspections/{inspectionId}/resend-link",
      desc: "Reenvía el link al asegurado o retorna el link para canal alterno. Solo rol SUPERVISOR. Toda acción queda en auditoría.",
      fields: [
        ["action", "enum",   "required", "RESEND_EMAIL · GET_LINK"],
        ["note",   "string", "optional", "Nota del supervisor. Se registra en auditoría"],
      ],
      response: `{
  "inspectionId": "insp_7f3a1b2c...",
  "action": "RESEND_EMAIL",
  "emailResentAt": "2026-04-14T17:22:10Z",
  "auditEventId": "evt_9a8b7c6d"
}`,
    },
    {
      method: "GET", path: "/v1/inspections/{inspectionId}/audit",
      desc: "Bitácora completa de eventos del expediente en orden cronológico — estados, correos, aperturas, OCR/IA, revisiones manuales.",
      fields: [
        ["inspectionId (path)", "string", "required", "ID del expediente"],
      ],
      response: `{
  "events": [
    { "eventType": "STATUS_CHANGED", "newStatus": "LINK_GENERATED", "actor": "system", "timestamp": "..." },
    { "eventType": "EMAIL_SENT", "newStatus": "LINK_SENT", "actor": "system", "timestamp": "..." },
    { "eventType": "LINK_OPENED", "actor": "user", "timestamp": "..." }
  ],
  "total": 3
}`,
    },
  ];

  const [open, setOpen] = useState({ 0: true });

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `2px solid ${C.stone900}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.stone900, margin: "0 0 5px", letterSpacing: "-0.3px" }}>
              HK Inspect — API Reference
            </h2>
            <p style={{ fontSize: 12, color: C.stone400, margin: 0 }}>
              api.hkinspect.com · v1.0 · La Regional de Seguros, S.A.
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Badge children="v1.0" color={C.navy} bg={C.navyLight} border={C.navyBorder} />
            <Badge children="Confidential" />
          </div>
        </div>
      </div>

      {/* Base URLs */}
      <div style={{ marginBottom: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {Object.entries(BASE_URLS).map(([env, url]) => (
          <div key={env} style={{
            border: `1px solid ${env === "production" ? C.navyBorder : C.stone200}`,
            borderRadius: 8, padding: "10px 12px",
            background: env === "production" ? C.navyLight : C.stone100,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: env === "production" ? C.navy : C.stone400, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>
              {env}
            </div>
            <code style={{ fontSize: 10, color: env === "production" ? C.navy : C.stone600, fontFamily: FONT }}>{url}</code>
          </div>
        ))}
      </div>

      {/* Auth info */}
      <div style={{ background: C.navyLight, border: `1.5px solid ${C.navyBorder}`, borderRadius: 10, padding: "12px 16px", marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.navy, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Authentication
        </p>
        <div style={{ fontFamily: FONT, fontSize: 12, color: C.stone700, lineHeight: 1.7 }}>
          All requests require <IC blue>Authorization: Bearer {"<api_key>"}</IC> and <IC blue>X-Client-ID: lrds-panama</IC>.
          For <IC blue>POST</IC> requests, include <IC blue>Idempotency-Key: {"<uuid-v4>"}</IC> to prevent duplicate submissions.
        </div>
      </div>

      {/* Endpoints */}
      {endpoints.map((ep, i) => (
        <div key={i} style={{ marginBottom: 10, border: `1.5px solid ${open[i] ? C.stone300 : C.stone200}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Header row */}
          <button onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))} style={{
            width: "100%", padding: "14px 16px", border: "none",
            background: open[i] ? C.stone100 : C.white,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            fontFamily: FONT, textAlign: "left",
          }}>
            <MethodBadge m={ep.method} size={10} />
            <code style={{ fontSize: 13, fontWeight: 600, color: C.navy, flex: 1, fontFamily: FONT }}>{ep.path}</code>
            <span style={{ fontSize: 12, color: C.stone500, flex: 2, textAlign: "left" }}>{ep.desc}</span>
            <span style={{ fontSize: 12, color: C.stone400 }}>{open[i] ? "▲" : "▼"}</span>
          </button>

          {open[i] && (
            <div style={{ borderTop: `1px solid ${C.stone200}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {/* Left: fields */}
              <div style={{ padding: "16px", borderRight: `1px solid ${C.stone200}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.stone400, textTransform: "uppercase", letterSpacing: "0.7px", margin: "0 0 10px" }}>
                  {ep.method === "GET" ? "Parameters" : "Request schema"}
                </p>
                {ep.fields?.map(([name, type, req, desc]) => (
                  <div key={name} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.stone100}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <IC blue>{name}</IC>
                      <Badge children={type} style={{ fontSize: 9 }} />
                      <Badge
                        children={req}
                        color={req === "required" ? C.red : C.stone500}
                        bg={req === "required" ? C.redLight : C.stone100}
                        border={req === "required" ? "#FCA5A5" : C.stone200}
                        style={{ fontSize: 9 }}
                      />
                    </div>
                    <p style={{ fontSize: 11, color: C.stone500, margin: 0, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                ))}
              </div>

              {/* Right: response */}
              <div style={{ padding: "16px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.stone400, textTransform: "uppercase", letterSpacing: "0.7px", margin: "0 0 10px" }}>
                  Response example — <Badge children="200 OK" color={C.green} bg={C.greenLight} border="#86EFAC" style={{ fontSize: 9 }} />
                </p>
                <pre style={{
                  background: C.stone900, borderRadius: 8, padding: 12, margin: 0,
                  fontSize: 10, lineHeight: 1.7, color: "#E7E5E4",
                  overflowX: "auto", fontFamily: FONT,
                }}>{ep.response}</pre>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* States table */}
      <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1.5px solid ${C.stone200}` }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.stone900, marginBottom: 12 }}>Inspection States</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[
            ["LINK_GENERATED","Link generado",""],
            ["LINK_SENT","Correo enviado al asegurado",""],
            ["EMAIL_BOUNCED","Correo rebotó","warning"],
            ["LINK_OPENED","Asegurado abrió el link",""],
            ["INSPECTION_STARTED","Captura iniciada",""],
            ["INSPECTION_INCOMPLETE","Captura interrumpida","warning"],
            ["INSPECTION_COMPLETED","Fotos completas enviadas",""],
            ["OCR_AI_PROCESSING","Análisis IA en progreso",""],
            ["DAMAGES_DETECTED","Daños detectados","warning"],
            ["NO_DAMAGE_DETECTED","Sin daños detectados","success"],
            ["REQUIRES_MANUAL_REVIEW","Escalado a supervisor","warning"],
            ["POSSIBLE_FRAUD","Fraude posible detectado","error"],
            ["APPROVED","Aprobado — terminal","success"],
            ["REJECTED","Rechazado — terminal","error"],
            ["EXPIRED","Link venció — terminal",""],
            ["PROCESSING_ERROR","Error técnico","error"],
          ].map(([state, desc, type]) => (
            <div key={state} style={{
              padding: "8px 10px", borderRadius: 8,
              border: `1px solid ${type === "error" ? "#FCA5A5" : type === "success" ? "#86EFAC" : type === "warning" ? "#FCD34D" : C.stone200}`,
              background: type === "error" ? C.redLight : type === "success" ? C.greenLight : type === "warning" ? C.amberLight : C.stone100,
            }}>
              <code style={{ fontSize: 9, fontWeight: 700, color: type === "error" ? C.red : type === "success" ? C.green : type === "warning" ? C.amber : C.stone700, fontFamily: FONT, display: "block", marginBottom: 2 }}>{state}</code>
              <span style={{ fontSize: 10, color: C.stone500 }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PORTAL ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "docs",       label: "API Reference", icon: "📄" },
  { id: "playground", label: "Playground",    icon: "⚡" },
  { id: "tokens",     label: "API Tokens",    icon: "🔑" },
];

function Portal({ user, onLogout }) {
  const [active, setActive] = useState("docs");
  const token = user.provider
    ? MOCK_TOKENS.dev
    : user.email === "lrds@hkinspect.com" ? MOCK_TOKENS.lrds : MOCK_TOKENS.dev;

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: C.stone100, fontFamily: FONT,
      WebkitFontSmoothing: "antialiased",
    }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: C.white, borderRight: `1.5px solid ${C.stone200}`,
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.stone100}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: C.navy,
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.stone900 }}>HK Inspect</div>
              <div style={{ fontSize: 10, color: C.stone400 }}>Developer Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 0", flex: 1 }}>
          <div style={{ padding: "4px 18px 8px", fontSize: 9, fontWeight: 700, color: C.stone400, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Documentation
          </div>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: "100%", textAlign: "left",
              padding: "8px 18px", border: "none",
              background: active === item.id ? C.navyLight : "transparent",
              borderLeft: active === item.id ? `2.5px solid ${C.navy}` : "2.5px solid transparent",
              color: active === item.id ? C.navy : C.stone600,
              fontSize: 13, fontWeight: active === item.id ? 600 : 400,
              cursor: "pointer", fontFamily: FONT,
              display: "flex", alignItems: "center", gap: 9,
              transition: "all 0.1s",
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div style={{
          padding: "14px 16px", borderTop: `1px solid ${C.stone100}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: C.navyLight, border: `1px solid ${C.navyBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: C.navy, flexShrink: 0,
          }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.stone900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 9, color: C.stone400 }}>{user.role}</div>
          </div>
          <button onClick={onLogout} title="Sign out" style={{
            background: "none", border: "none", cursor: "pointer",
            color: C.stone400, fontSize: 16, padding: 2, flexShrink: 0,
          }}>→</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {/* Top bar */}
        <div style={{
          background: C.white, borderBottom: `1px solid ${C.stone200}`,
          padding: "12px 28px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.stone400 }}>Base URL</span>
            <Badge children="https://api.hkinspect.com/v1" color={C.navy} bg={C.navyLight} border={C.navyBorder} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge children="v1.0" color={C.stone600} />
            <Badge children="14 abr 2026" />
            {user.provider && (
              <Badge children={`SSO · ${user.provider}`} color={C.green} bg={C.greenLight} border="#86EFAC" />
            )}
          </div>
        </div>

        <div style={{ padding: "32px 40px 60px" }}>
          {active === "docs"       && <ApiDocs token={token} />}
          {active === "playground" && <Playground token={token} />}
          {active === "tokens"     && <TokenManager user={user} />}
        </div>
      </main>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <AuthPage onLogin={setUser} />;
  return <Portal user={user} onLogout={() => setUser(null)} />;
}
