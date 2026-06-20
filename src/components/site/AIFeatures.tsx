import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import {
  Languages,
  Lock,
  ArrowRight,
  Trees,
  Layers,
  Hammer,
  House,
  PanelsTopLeft,
  SquareStack,
  PaintBucket,
  Grid3x3,
  Ruler,
  Construction,
  Flame,
  type LucideIcon,
} from "lucide-react";

type Trade = { icon: LucideIcon; title: string; sub: string };

const TRADES: Trade[] = [
  { icon: Trees, title: "Paisajismo", sub: "Landscaping / Jardinería" },
  { icon: Layers, title: "Concreto y Pisos", sub: "Concrete · Foundations" },
  { icon: Hammer, title: "Carpintería", sub: "Framing / Enmarcaciones" },
  { icon: House, title: "Techos", sub: "Roofing / Cubiertas" },
  { icon: PanelsTopLeft, title: "Revestimientos", sub: "Siding / Paredes exteriores" },
  { icon: SquareStack, title: "Tablaroca", sub: "Drywall · Hangers & Tapers" },
  { icon: PaintBucket, title: "Pintura", sub: "Painters / Pintores" },
  { icon: Grid3x3, title: "Pisos", sub: "Flooring / Suelos" },
  { icon: Ruler, title: "Carpintería fina", sub: "Finish Carpentry · Molduras" },
  { icon: Construction, title: "Azulejo y Granito", sub: "Tile · Stone Setters" },
  { icon: Flame, title: "Soldadura", sub: "Welding · Iron · Barandales" },
];

const SAMPLE_ES = "Dile al GC que vamos a llegar mañana a las 7 AM con cuadrilla de 4 para terminar el framing del segundo piso. Necesitamos que el inspector esté disponible el jueves.";
const SAMPLE_EN = "Hi, just a heads-up — we'll be on-site tomorrow at 7 AM with a 4-man crew to finish framing the second floor. Please let me know if the inspector can come by Thursday. Thanks!";

export function AIFeatures() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  function demo() {
    setInput(SAMPLE_ES);
    setOutput(SAMPLE_EN);
  }

  return (
    <section id="ingles-pa-trabajar" className="px-6 py-24" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div
            className="font-mono-brand text-[11px] uppercase tracking-[0.1em] mb-4 font-medium"
            style={{ color: "var(--blue)" }}
          >
            Servicio incluido · Próximamente
          </div>
          <h2
            className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight"
            style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
          >
            Inglés Pa'{" "}
            <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
              Trabajar
            </em>
          </h2>
          <p className="mt-5 max-w-[720px] text-[16px]" style={{ color: "var(--ink-soft)" }}>
            Traductor de obra y entrenador de inglés técnico — pensado para hablar con tu GC,
            inspectores L&I y proveedores con seguridad. Cubrimos el vocabulario real de cada
            oficio.
          </p>
        </Reveal>

        {/* TRANSLATOR DEMO CARD */}
        <Reveal delay={120}>
          <div
            className="mt-12 rounded-[24px] border p-6 md:p-8 grid md:grid-cols-[1.1fr,1fr] gap-6 items-stretch"
            style={{
              background: "linear-gradient(160deg, #fff 0%, #f4f1ea 100%)",
              borderColor: "rgba(15,31,61,0.10)",
              boxShadow: "0 20px 48px -28px rgba(10,16,36,0.35)",
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--gold)" }}
                >
                  <Languages size={22} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <div className="font-display text-[22px] leading-tight" style={{ color: "var(--ink)" }}>
                    Traductor de obra · ES ↔ EN
                  </div>
                  <div className="font-mono-brand text-[10.5px] uppercase tracking-[0.1em] mt-1" style={{ color: "var(--gray-soft)" }}>
                    Mensajes profesionales en segundos
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-5 text-[13.5px]" style={{ color: "var(--ink)" }}>
                <li className="flex gap-2"><span style={{ color: "var(--gold)" }}>›</span> Traduce SMS / email del GC al español al instante</li>
                <li className="flex gap-2"><span style={{ color: "var(--gold)" }}>›</span> Respuestas en inglés profesional, listas para enviar</li>
                <li className="flex gap-2"><span style={{ color: "var(--gold)" }}>›</span> Vocabulario técnico por oficio (framing, concrete, roofing…)</li>
                <li className="flex gap-2"><span style={{ color: "var(--gold)" }}>›</span> Frases para inspectores L&I y permisos</li>
              </ul>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe en español lo que quieres decirle a tu GC…"
                rows={4}
                className="w-full rounded-xl border p-3 text-[14px] resize-none focus:outline-none focus:ring-2"
                style={{
                  borderColor: "rgba(15,31,61,0.12)",
                  background: "#fff",
                  color: "var(--ink)",
                }}
              />

              <button
                onClick={demo}
                className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-[14px] hover:opacity-90 transition"
                style={{ background: "var(--ink)" }}
              >
                Ver ejemplo de traducción <ArrowRight size={16} />
              </button>
            </div>

            <div
              className="rounded-2xl p-5 flex flex-col"
              style={{
                background: "var(--ink)",
                color: "#fff",
                border: "1px solid rgba(200,154,58,0.35)",
              }}
            >
              <div
                className="font-mono-brand text-[10.5px] uppercase tracking-[0.14em] mb-3"
                style={{ color: "var(--gold)" }}
              >
                Versión en inglés sugerida
              </div>
              <div className="text-[14.5px] leading-relaxed whitespace-pre-wrap font-mono-brand min-h-[140px]">
                {output ?? "Aquí aparecerá tu mensaje listo para enviarle al GC en inglés profesional, sin errores de gramática."}
              </div>
              <div className="mt-auto pt-5 flex items-center gap-2 text-[11.5px]" style={{ color: "#a3acce" }}>
                <Lock size={12} /> Servicio en desarrollo · Lista de espera abierta para clientes Alkan
              </div>
            </div>
          </div>
        </Reveal>

        {/* TRADES GRID */}
        <Reveal delay={200}>
          <div className="mt-16">
            <div
              className="font-mono-brand text-[11px] uppercase tracking-[0.1em] mb-3 font-medium"
              style={{ color: "var(--blue)" }}
            >
              Oficios que cubrimos
            </div>
            <h3
              className="font-display text-2xl md:text-3xl leading-tight"
              style={{ color: "var(--ink)", letterSpacing: "-0.02em" }}
            >
              Vocabulario técnico para los oficios que mueven Washington
            </h3>
            <p className="mt-3 max-w-[640px] text-[15px]" style={{ color: "var(--ink-soft)" }}>
              Si tu trade no está en la lista, escríbenos — probablemente también lo cubrimos.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TRADES.map((t, i) => {
              const Icon = t.icon;
              return (
                <Reveal key={t.title} delay={i * 40}>
                  <div
                    className="card-hover h-full rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(15,31,61,0.08)",
                      boxShadow: "0 8px 24px -16px rgba(15,31,61,0.18)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in oklab, var(--blue) 14%, transparent), color-mix(in oklab, var(--gold) 18%, transparent))",
                        border: "1px solid rgba(42,79,130,0.18)",
                      }}
                    >
                      <Icon size={22} strokeWidth={1.8} color="var(--blue-deep, #0f1f3d)" />
                    </div>
                    <div>
                      <div className="font-semibold text-[15px] leading-tight" style={{ color: "var(--ink)" }}>
                        {t.title}
                      </div>
                      <div
                        className="font-mono-brand text-[10.5px] uppercase tracking-[0.06em] mt-1"
                        style={{ color: "var(--gray-soft)" }}
                      >
                        {t.sub}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}