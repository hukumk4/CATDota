import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const box = {
  minHeight: "100vh", boxSizing: "border-box", padding: 24,
  background: "#0e1420", color: "#e6ecf5",
  fontFamily: "'Segoe UI',system-ui,sans-serif", fontSize: 15, lineHeight: 1.6,
  whiteSpace: "pre-wrap", wordBreak: "break-word",
};

// Catches runtime render errors and shows the message instead of a blank screen.
class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) {
      const e = this.state.err;
      return (
        <div style={box}>
          <div style={{ color: "#f3b4ac", fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Произошла ошибка</div>
          <div style={{ color: "#e6ecf5", marginBottom: 14 }}>{String(e?.message || e)}</div>
          <div style={{ color: "#8a97ab", fontSize: 12 }}>{String(e?.stack || "")}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

const required = ["VITE_FIREBASE_API_KEY", "VITE_FIREBASE_DATABASE_URL", "VITE_FIREBASE_PROJECT_ID"];
const missing = required.filter((k) => !import.meta.env[k]);

const root = createRoot(document.getElementById("root"));
if (missing.length) {
  root.render(
    <div style={box}>
      <div style={{ color: "#e8c86a", fontWeight: 800, fontSize: 18, marginBottom: 10 }}>Не заданы переменные окружения Firebase</div>
      <div style={{ marginBottom: 12 }}>Отсутствуют: {missing.join(", ")}</div>
      <div style={{ color: "#8a97ab", fontSize: 14 }}>
        Добавьте их в Vercel → Settings → Environment Variables (окружение Production),
        затем сделайте Deployments → ⋯ → Redeploy (снимите галку Use existing Build Cache).
      </div>
    </div>
  );
} else {
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
