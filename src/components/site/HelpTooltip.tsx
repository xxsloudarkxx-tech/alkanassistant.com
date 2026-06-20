import { useEffect, useState } from "react";

export function HelpTooltip() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    let interacted = false;
    function onClick() { interacted = true; }
    window.addEventListener("click", onClick, { once: true });
    const t = setTimeout(() => {
      if (!interacted && !dismissed) setShow(true);
    }, 60000);
    return () => {
      clearTimeout(t);
      window.removeEventListener("click", onClick);
    };
  }, [dismissed]);

  if (!show || dismissed) return null;

  return (
    <a
      href="https://wa.me/12066406034?text=Hola%20Alkan%2C%20tengo%20dudas%20sobre%20el%20servicio."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-[55] max-w-[260px] rounded-2xl p-3.5 pr-9 text-[13px] leading-snug font-medium animate-fade-in"
      style={{
        background: "#fff",
        color: "var(--ink)",
        border: "1px solid rgba(15,31,61,0.12)",
        boxShadow: "0 18px 40px -12px rgba(15,31,61,0.35)",
      }}
    >
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setDismissed(true); }}
        aria-label="Cerrar"
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full text-[16px] leading-none"
        style={{ color: "var(--gray-soft)" }}
      >×</button>
      <div className="font-semibold mb-0.5" style={{ color: "var(--blue)" }}>¿Dudas?</div>
      Escríbeme y te explico en 5 minutos <span style={{ color: "var(--green-brand)" }}>→</span>
    </a>
  );
}
