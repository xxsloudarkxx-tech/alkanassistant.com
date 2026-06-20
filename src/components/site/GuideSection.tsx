import { Reveal } from "@/components/Reveal";

const GUIDES = [
  {
    badge: "Guía principal",
    pages: "28 págs",
    title: "Cómo conseguir más jale en Washington",
    subtitle: "Edición contratistas 2026",
    desc: "GCs activos, bids que ganan, permisos y cobranza. Lo que está funcionando ahorita.",
    file: "/guias/Guia_Alkan_Mas_Jale_WA.pdf",
    accent: "var(--gold)",
    rotate: "-3deg",
  },
  {
    badge: "Certificaciones",
    pages: "Guía OMWBE",
    title: "Certificación OMWBE en Washington",
    subtitle: "MBE · WBE · DBE paso a paso",
    desc: "Quién califica, documentos requeridos, tiempos reales y cómo usar la certificación para ganar más contratos públicos.",
    file: "/guias/Guia_OMWBE_Certificaciones.pdf",
    accent: "#5cbdb9",
    rotate: "2deg",
  },
  {
    badge: "Public Works",
    pages: "Guía L&I",
    title: "Public Works & Prevailing Wage",
    subtitle: "Registro L&I y reportes sin multas",
    desc: "Intent & Affidavit, certified payroll, tasas por trade y cómo no perder dinero en proyectos públicos.",
    file: "/guias/Guia_PublicWorks_PrevailingWage.pdf",
    accent: "#e8a87c",
    rotate: "-1.5deg",
  },
];

export function GuideSection() {
  const waMsg =
    "Hola, quiero la guía gratuita Cómo conseguir más jale en Washington. Soy contratista de ___ en ___.";

  return (
    <section
      id="guia"
      className="px-6 py-24"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center max-w-[760px] mx-auto mb-14">
            <div
              className="font-mono-brand text-[11px] uppercase tracking-[0.14em] mb-4"
              style={{ color: "var(--blue)" }}
            >
              Guías gratuitas 2026
            </div>
            <h2
              className="font-display text-4xl md:text-5xl leading-[1.05]"
              style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
            >
              Tres guías de lo que está{" "}
              <em style={{ color: "var(--blue)", fontStyle: "italic" }}>funcionando</em> ahorita.
            </h2>
            <p className="mt-4 text-[15px]" style={{ color: "var(--ink-soft)" }}>
              Descárgalas al instante. Si prefieres, el bot también te las puede mandar por WhatsApp.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {GUIDES.map((g, i) => (
            <Reveal key={g.file} delay={i * 100}>
              <div
                className="rounded-2xl p-6 h-full flex flex-col"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(15,31,61,0.08)",
                  boxShadow: "0 10px 30px -16px rgba(15,31,61,0.18)",
                }}
              >
                <div className="relative flex justify-center mb-6">
                  <div
                    className="relative w-[180px] h-[230px] rounded-lg p-4 flex flex-col justify-between"
                    style={{
                      background: "linear-gradient(160deg, var(--blue-deep, #0f1f3d) 0%, var(--blue, #2A4F82) 100%)",
                      color: "#fff",
                      boxShadow: `0 20px 40px -14px rgba(15,31,61,0.45), 0 0 0 1px ${g.accent}40`,
                      transform: `rotate(${g.rotate})`,
                    }}
                  >
                    <div>
                      <div
                        className="font-mono-brand text-[9px] uppercase tracking-[0.18em] mb-2"
                        style={{ color: g.accent }}
                      >
                        {g.badge}
                      </div>
                      <div
                        className="font-display text-[1.05rem] leading-[1.1]"
                        style={{ letterSpacing: "-0.01em" }}
                      >
                        {g.title}
                      </div>
                    </div>
                    <div className="text-[10px]" style={{ color: "#cdd5ec" }}>
                      {g.subtitle}
                    </div>
                  </div>
                  <span
                    className="absolute -top-1 right-2 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: g.accent, color: "var(--ink)" }}
                  >
                    {g.pages}
                  </span>
                  <span
                    className="absolute -bottom-2 left-2 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "#1a8e54", color: "#fff" }}
                  >
                    GRATIS
                  </span>
                </div>

                <div className="font-semibold text-[15px] mb-2" style={{ color: "var(--ink)" }}>
                  {g.title}
                </div>
                <div className="text-[13px] mb-5 leading-relaxed flex-1" style={{ color: "var(--ink-soft)" }}>
                  {g.desc}
                </div>

                <a
                  href={g.file}
                  download
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-[14px] text-white transition hover:opacity-90"
                  style={{ background: "var(--blue)", boxShadow: "0 12px 28px -14px rgba(42,79,130,0.55)" }}
                >
                  ⬇ Descargar PDF
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="mt-10 text-center">
            <a
              href={`https://wa.me/12066406034?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[15px] text-white transition hover:opacity-90"
              style={{ background: "#1a8e54", boxShadow: "0 18px 40px -16px rgba(26,142,84,0.55)" }}
            >
              💬 Pedir las guías por WhatsApp →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
