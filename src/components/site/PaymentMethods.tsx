import { Reveal } from "@/components/Reveal";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

type Method = {
  key: string;
  name: string;
  badge: string;
  value: string;
  copy: string;
  link?: string;
  linkLabel?: string;
  color: string;
  note: string;
};

const METHODS: Method[] = [
  {
    key: "paypal",
    name: "PayPal",
    badge: "Pago automático · Solo EE.UU.",
    value: "paypal.me/slouk1",
    copy: "https://paypal.me/slouk1",
    link: "https://paypal.me/slouk1",
    linkLabel: "Pagar con PayPal (US)",
    color: "#003087",
    note: "Solo cuentas PayPal de Estados Unidos. Envía como 'Amigos y familia' para evitar fees. Los leads se desbloquean apenas se confirma la transacción.",
  },
];

const PRICES = [
  { qty: "1 lead", price: "$25", per: "$25 c/u" },
  { qty: "Pack 5 leads", price: "$110", per: "$22 c/u · ahorra $15" },
  { qty: "Pack 10 leads", price: "$200", per: "$20 c/u · ahorra $50" },
];

export function PaymentMethods() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyValue = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const waConfirm = (method: string) =>
    `Hola Alkan, ya pagué por ${method}. Aquí está el comprobante: [adjunta foto] · Lead(s) que quiero desbloquear: ___`;

  return (
    <section id="pagos" className="px-6 py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div
              className="inline-block text-[11px] uppercase tracking-[0.18em] font-semibold mb-4 px-3 py-1 rounded-full"
              style={{
                color: "var(--blue)",
                background: "color-mix(in oklab, var(--blue) 10%, transparent)",
              }}
            >
              Métodos de pago
            </div>
            <h2
              className="font-display text-4xl md:text-5xl leading-[1.05]"
              style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
            >
              Paga automático con <em style={{ color: "var(--blue)", fontStyle: "italic" }}>PayPal</em>
            </h2>
            <p className="mt-5 text-[15px] max-w-[620px] mx-auto" style={{ color: "var(--ink-soft)" }}>
              Sin checkout complicado. Eliges los leads, pagas con PayPal en un clic y el bot te
              entrega los contactos automáticamente apenas se confirma la transacción.
            </p>
          </div>
        </Reveal>

        {/* Precios */}
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            {PRICES.map((p, i) => (
              <div
                key={p.qty}
                className="rounded-xl p-5 text-center"
                style={{
                  background: i === 1 ? "var(--ink)" : "#fff",
                  color: i === 1 ? "#fff" : "var(--ink)",
                  border: "1px solid rgba(15,31,61,0.08)",
                  boxShadow: i === 1 ? "0 18px 40px -16px rgba(15,31,61,0.4)" : "0 6px 18px -10px rgba(15,31,61,0.1)",
                }}
              >
                <div
                  className="text-[11px] uppercase tracking-wider font-semibold mb-2"
                  style={{ color: i === 1 ? "var(--gold)" : "var(--blue)" }}
                >
                  {p.qty}
                </div>
                <div className="font-display text-4xl">{p.price}</div>
                <div className="text-[12px] mt-1 opacity-80">{p.per}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Métodos */}
        <div className="grid gap-4 max-w-[460px] mx-auto">
          {METHODS.map((m) => (
            <Reveal key={m.key}>
              <div
                className="rounded-2xl p-6 h-full flex flex-col"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(15,31,61,0.08)",
                  boxShadow: "0 10px 30px -16px rgba(15,31,61,0.15)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-[14px]"
                    style={{ background: m.color }}
                  >
                    {m.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[16px]" style={{ color: "var(--ink)" }}>
                      {m.name}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider" style={{ color: m.color }}>
                      {m.badge}
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-lg p-3 mb-3 flex items-center justify-between gap-2"
                  style={{ background: "rgba(15,31,61,0.04)" }}
                >
                  <span className="font-mono-brand text-[13px] truncate" style={{ color: "var(--ink)" }}>
                    {m.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyValue(m.key, m.copy)}
                    className="shrink-0 text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 transition"
                    style={{
                      background: copied === m.key ? "#1a8e54" : "var(--ink)",
                      color: "#fff",
                    }}
                  >
                    {copied === m.key ? <Check size={12} /> : <Copy size={12} />}
                    {copied === m.key ? "Copiado" : "Copiar"}
                  </button>
                </div>

                <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "var(--ink-soft)" }}>
                  {m.note}
                </p>

                <div className="mt-auto space-y-2">
                  {m.link && (
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-[13px] font-semibold px-3 py-2.5 rounded-lg transition hover:opacity-90"
                      style={{ background: m.color, color: "#fff" }}
                    >
                      {m.linkLabel} →
                    </a>
                  )}
                  <a
                    href={`https://wa.me/12066406034?text=${encodeURIComponent(waConfirm(m.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[13px] font-semibold px-3 py-2.5 rounded-lg transition hover:opacity-90"
                    style={{
                      background: "#25D366",
                      color: "#fff",
                    }}
                  >
                    💬 Enviar comprobante
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Cómo funciona */}
        <Reveal>
          <div
            className="mt-10 rounded-2xl p-6 md:p-8"
            style={{
              background: "color-mix(in oklab, var(--blue) 6%, transparent)",
              border: "1px solid color-mix(in oklab, var(--blue) 15%, transparent)",
            }}
          >
            <div
              className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-3"
              style={{ color: "var(--blue)" }}
            >
              Cómo funciona
            </div>
            <ol className="grid sm:grid-cols-3 gap-4 text-[13.5px]" style={{ color: "var(--ink)" }}>
              <li>
                <strong>1.</strong> Me dices por WhatsApp qué leads quieres (industria + ciudad).
              </li>
              <li>
                <strong>2.</strong> Pagas por PayPal en un clic — el bot confirma automático.
              </li>
              <li>
                <strong>3.</strong> En menos de 15 min recibes nombre, empresa, teléfono y email de cada lead.
              </li>
            </ol>
            <p className="text-[12px] mt-4" style={{ color: "var(--ink-soft)" }}>
              ✓ Si el contacto del lead está caído o equivocado, te lo reemplazo gratis o te devuelvo el pago.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
