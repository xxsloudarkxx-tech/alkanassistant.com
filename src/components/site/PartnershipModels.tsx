import { Reveal } from "@/components/Reveal";
import { CalendarCheck, Briefcase, Handshake, type LucideIcon } from "lucide-react";

type Model = {
  icon: LucideIcon;
  badge: string;
  title: string;
  tag: string;
  desc: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const MODELS: Model[] = [
  {
    icon: CalendarCheck,
    badge: "Modelo 01",
    title: "Pago semanal fijo",
    tag: "Predecible · 1099 deducible",
    desc: "Una cuota fija cada viernes. Tareas ilimitadas dentro del plan que elijas. Sin sorpresas a fin de mes.",
    features: [
      "Pago todos los viernes",
      "Tareas administrativas ilimitadas",
      "Reporte semanal ejecutivo",
    ],
    cta: "Quiero pago semanal fijo →",
  },
  {
    icon: Briefcase,
    badge: "Modelo 02",
    title: "Por cada trabajo",
    tag: "Pay-per-job · Sin mensualidad",
    desc: "Pagas solo cuando cerramos contrato. Comisión escalonada por tamaño del proyecto. Cero costo fijo si no producimos.",
    features: [
      "Cero mensualidad · cero riesgo",
      "5% hasta $10k · 4% hasta $50k · 3% hasta $100k",
      "Cobramos cuando tú cobras",
    ],
    cta: "Pagar solo por jale cerrado →",
    featured: true,
  },
  {
    icon: Handshake,
    badge: "Modelo 03",
    title: "En sociedad",
    tag: "Partnership · Largo plazo",
    desc: "Entramos como socios operativos: nosotros ponemos pipeline, oficina y sistemas. Tú pones la obra. Reparto de utilidades.",
    features: [
      "Pipeline y bids manejados al 100%",
      "Acceso a nuestra red de GCs en WA",
      "Reparto transparente · revisado mensual",
    ],
    cta: "Conversar una sociedad →",
  },
];

export function PartnershipModels() {
  return (
    <section id="modelos" className="px-6 py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div
            className="font-mono-brand text-[11px] uppercase tracking-[0.1em] mb-4 font-medium"
            style={{ color: "var(--blue)" }}
          >
            Asociación y precios
          </div>
          <h2
            className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight"
            style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
          >
            Elige cómo{" "}
            <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
              trabajamos juntos
            </em>
          </h2>
          <p className="mt-5 max-w-[640px] text-[16px]" style={{ color: "var(--ink-soft)" }}>
            Tres formas de meternos contigo a tu obra. Tú eliges la que mejor se acomode a tu flujo
            de caja y al tamaño de tu operación.
          </p>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {MODELS.map((m, i) => {
            const Icon = m.icon;
            const featured = m.featured;
            return (
              <Reveal key={m.title} delay={i * 100}>
                <div
                  className="card-hover h-full rounded-2xl p-7 flex flex-col transition-all duration-300"
                  style={{
                    background: featured ? "var(--ink)" : "var(--paper)",
                    color: featured ? "#fff" : "var(--ink)",
                    border: featured
                      ? "1px solid rgba(200,154,58,0.45)"
                      : "1px solid rgba(15,31,61,0.08)",
                    boxShadow: featured
                      ? "0 24px 60px -20px rgba(15,31,61,0.45)"
                      : "0 8px 24px -12px rgba(15,31,61,0.10)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="font-mono-brand text-[10.5px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
                      style={{
                        background: featured
                          ? "rgba(200,154,58,0.18)"
                          : "rgba(42,79,130,0.08)",
                        color: featured ? "var(--gold)" : "var(--blue)",
                      }}
                    >
                      {m.badge}
                    </div>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background: featured
                          ? "rgba(200,154,58,0.16)"
                          : "color-mix(in oklab, var(--blue) 10%, transparent)",
                        border: featured
                          ? "1px solid rgba(200,154,58,0.4)"
                          : "1px solid rgba(42,79,130,0.18)",
                      }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.9}
                        color={featured ? "var(--gold)" : "var(--blue-deep, #0f1f3d)"}
                      />
                    </div>
                  </div>

                  <div className="font-display text-[1.75rem] leading-tight mb-1">
                    {m.title}
                  </div>
                  <div
                    className="font-mono-brand text-[10.5px] uppercase tracking-[0.08em] mb-4"
                    style={{ color: featured ? "var(--gold)" : "var(--blue)" }}
                  >
                    {m.tag}
                  </div>
                  <p
                    className="text-[14.5px] leading-relaxed mb-5"
                    style={{ color: featured ? "#d6dbed" : "var(--ink-soft)" }}
                  >
                    {m.desc}
                  </p>

                  <ul className="space-y-2.5 mb-6 text-[13.5px] leading-relaxed flex-1">
                    {m.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <span
                          style={{ color: "var(--green-brand, #1a8e54)" }}
                          className="mt-0.5 shrink-0"
                        >
                          ✓
                        </span>
                        <span style={{ color: featured ? "#d6dbed" : "var(--ink-soft)" }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="block text-center px-5 py-3 rounded-lg font-semibold text-[14px] transition hover:opacity-90"
                    style={{
                      background: featured ? "var(--gold)" : "var(--ink)",
                      color: featured ? "var(--ink)" : "#fff",
                    }}
                  >
                    {m.cta}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={250}>
          <div
            className="mt-10 text-center text-[14.5px] font-medium rounded-xl px-6 py-5 mx-auto max-w-[760px]"
            style={{
              background: "color-mix(in oklab, var(--gold) 12%, transparent)",
              border: "1px dashed rgba(200,154,58,0.5)",
              color: "var(--ink)",
            }}
          >
            💰 <strong>Cada dólar que pagas</strong> se traduce en jale real, leads frescos y oficina
            ordenada. Cero promesas, cero leads reciclados, cero cobros sin trabajo entregado.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
