import { useEffect, useState } from "react";
import logo from "@/assets/alkan-logo.png";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className="sticky top-0 z-50 px-6 py-3.5 border-b transition-colors"
      style={{
        background: scrolled ? "rgba(245,241,234,0.92)" : "rgba(245,241,234,0.6)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(15,31,61,0.08)",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Alkan Construction Assistance"
            className="w-11 h-11 rounded-lg object-contain bg-white"
            style={{ boxShadow: "0 0 0 1px rgba(15,31,61,0.08), 0 4px 12px rgba(42,79,130,0.12)" }}
          />
          <div className="leading-tight">
            <div className="font-bold text-[17px]" style={{ color: "var(--ink)" }}>
              Alkan<span style={{ color: "var(--blue-bright)" }}>Assistant</span>
            </div>
            <div className="font-mono-brand text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--gray-soft)" }}>
              Washington State · Servicios para contratistas
            </div>
          </div>
        </a>
        <a
          href="#estimador-ai"
          className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: "var(--ink)" }}
        >
          Pedir estimado gratis →
        </a>
      </div>
    </nav>
  );
}
