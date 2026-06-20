import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Item = {
  to: "/app" | "/app/leads" | "/app/bot-panel" | "/app/settings";
  label: string;
  eyebrow: string;
  icon: string;
  exact?: boolean;
};

const ITEMS: Item[] = [
  { to: "/app",           label: "Dashboard",  eyebrow: "00",  icon: "◆", exact: true },
  { to: "/app/leads",     label: "Lead Hunter", eyebrow: "01", icon: "▣" },
  { to: "/app/bot-panel", label: "Bot Panel",   eyebrow: "02", icon: "◇" },
  { to: "/app/settings",  label: "Configuración", eyebrow: "03", icon: "⚙" },
];

export function Sidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const isActive = (item: Item) =>
    item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
      return;
    }
    toast.success("Sesión cerrada");
    navigate({ to: "/app/login" });
  }, [navigate]);

  return (
    <aside
      className="sidebar-scroll flex h-screen flex-col"
      style={{
        width: 220,
        minWidth: 220,
        background: "var(--ink)",
        color: "rgba(250,250,248,0.85)",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--gold)",
          }}
        >
          Alkan Platform
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            fontWeight: 500,
            color: "rgba(250,250,248,0.95)",
            marginTop: 4,
            letterSpacing: "-0.01em",
          }}
        >
          Console v3
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4">
        <div
          style={{
            padding: "0 12px 8px",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(250,250,248,0.4)",
          }}
        >
          Módulos
        </div>
        <ul className="flex flex-col gap-0.5">
          {ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors"
                  style={{
                    background: active ? "rgba(201,151,58,0.15)" : "transparent",
                    borderLeft: active ? "3px solid var(--gold)" : "3px solid transparent",
                    color: active ? "var(--gold-light)" : "rgba(250,250,248,0.75)",
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    fontWeight: active ? 500 : 400,
                    paddingLeft: active ? 9 : 12,
                  }}
                >
                  <span style={{ fontSize: 14, opacity: 0.7 }}>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      opacity: 0.45,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {item.eyebrow}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / user */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(250,250,248,0.4)",
            marginBottom: 4,
          }}
        >
          Sesión
        </div>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "rgba(250,250,248,0.85)",
            wordBreak: "break-all",
            marginBottom: 10,
          }}
        >
          {userEmail ?? "—"}
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left transition-colors"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--gold-light)",
            background: "transparent",
            border: "1px solid rgba(201,151,58,0.3)",
            borderRadius: 6,
            padding: "8px 10px",
          }}
        >
          → Cerrar sesión
        </button>
      </div>
    </aside>
  );
}