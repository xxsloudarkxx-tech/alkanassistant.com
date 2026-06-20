import { useEffect, useState } from "react";

export function StickyTopBar() {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y < 40) setVisible(true);
      else if (y > lastY) setVisible(false);
      else setVisible(true);
      setLastY(y);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 z-[60] transition-transform duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-110%)",
        background: "linear-gradient(90deg, var(--ink) 0%, var(--blue-deep) 100%)",
        color: "#fff",
        boxShadow: "0 8px 20px -8px rgba(0,0,0,0.35)",
      }}
    >
      <a
        href="https://wa.me/12066406034?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Alkan%20Assistant."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-2 px-3 py-2 text-[12px] font-semibold"
      >
        <span className="flex items-center gap-1.5 truncate">
          <span style={{ color: "var(--gold)" }}>⚡</span>
          ¿Más info? <span style={{ color: "var(--gold)" }}>Habla con nosotros</span> por WhatsApp
        </span>
        <span
          className="shrink-0 rounded-md px-2.5 py-1 text-[11px]"
          style={{ background: "var(--gold)", color: "var(--ink)" }}
        >
          WhatsApp →
        </span>
      </a>
    </div>
  );
}
