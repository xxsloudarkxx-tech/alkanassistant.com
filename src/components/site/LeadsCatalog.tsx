import { Reveal } from "@/components/Reveal";
import {
  ArrowRight,
  Fence,
  Trees,
  Shovel,
  HardHat,
  MapPin,
  Calendar,
  type LucideIcon,
} from "lucide-react";

type Intent = "hot" | "warm" | "cold";

type Lead = {
  id: string;
  score: number;
  name: string;
  company: string;
  type: string;
  typeIcon: LucideIcon;
  city: string;
  value: string;
  intent: Intent;
  permitStatus: string; // e.g. "Pre-Permit" / "Review" / "Gov. Source"
  whyChips: { label: string; tone?: "neutral" | "green" }[];
  pubDate: string; // YYYY.MM.DD
  leadId: string;
};

const DEMO_LEADS: Lead[] = [
  {
    id: "1",
    score: 98,
    name: "Michael R.",
    company: "Cascade Outdoor LLC",
    type: "Fencing",
    typeIcon: Fence,
    city: "Renton, WA",
    value: "$12,500",
    intent: "hot",
    permitStatus: "Pre-Permit",
    whyChips: [
      { label: "High Value Project" },
      { label: "Permit issued <7d" },
      { label: "No GC Contracted", tone: "green" },
    ],
    pubDate: "2026.05.24",
    leadId: "#WA-2901",
  },
  {
    id: "2",
    score: 91,
    name: "Jennifer S.",
    company: "Evergreen Yards Inc.",
    type: "Landscaping",
    typeIcon: Trees,
    city: "Bremerton, WA",
    value: "$28,000",
    intent: "warm",
    permitStatus: "Review",
    whyChips: [
      { label: "Buscando sub activamente" },
      { label: "Residential Project" },
    ],
    pubDate: "2026.05.22",
    leadId: "#WA-2887",
  },
  {
    id: "3",
    score: 85,
    name: "David K.",
    company: "Pacific Site Works",
    type: "Excavation",
    typeIcon: Shovel,
    city: "Tacoma, WA",
    value: "$47,500",
    intent: "hot",
    permitStatus: "Gov. Source",
    whyChips: [
      { label: "GC sin contacto previo", tone: "green" },
      { label: "Bidding Open" },
    ],
    pubDate: "2026.05.24",
    leadId: "#WA-2895",
  },
  {
    id: "4",
    score: 88,
    name: "Robert M.",
    company: "Sound Concrete Co.",
    type: "Concrete",
    typeIcon: HardHat,
    city: "Puyallup, WA",
    value: "$62,000",
    intent: "warm",
    permitStatus: "Pre-Permit",
    whyChips: [
      { label: "Licitación abierta hasta 3 Jun" },
      { label: "Commercial Project" },
    ],
    pubDate: "2026.05.23",
    leadId: "#WA-2912",
  },
];

function intentBadge(intent: Intent) {
  if (intent === "hot") {
    return {
      label: "HOT INTENT",
      bg: "rgba(239,68,68,0.12)",
      color: "#dc2626",
      dot: "#dc2626",
      pulse: true,
    };
  }
  if (intent === "warm") {
    return {
      label: "WARM INTENT",
      bg: "rgba(245,158,11,0.14)",
      color: "#c2410c",
      dot: "#ea580c",
      pulse: false,
    };
  }
  return {
    label: "COLD",
    bg: "color-mix(in oklab, var(--ink) 8%, transparent)",
    color: "var(--ink-soft)",
    dot: "var(--ink-soft)",
    pulse: false,
  };
}

function scoreColor(score: number) {
  if (score >= 95) return "var(--blue)";
  if (score >= 88) return "var(--gold)";
  return "color-mix(in oklab, var(--ink) 60%, transparent)";
}

export function LeadsCatalog() {
  return (
    <section
      id="catalogo"
      className="px-6 py-24"
      style={{ background: "var(--bg-2)" }}
    >
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div
              className="inline-block text-[11px] uppercase tracking-[0.18em] font-semibold mb-4 px-3 py-1 rounded-full"
              style={{ color: "var(--blue)", background: "color-mix(in oklab, var(--blue) 10%, transparent)" }}
            >
              Catálogo de leads · Washington
            </div>
            <h2
              className="font-display text-4xl md:text-5xl leading-[1.05]"
              style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
            >
              Leads activos esta semana en Washington — <em style={{ color: "var(--blue)", fontStyle: "italic" }}>verificados</em> antes de publicarse
            </h2>
            <p className="mt-5 text-[15px] max-w-[600px] mx-auto" style={{ color: "var(--ink-soft)" }}>
              Contratistas activos en WA con proyecto en marcha. Pagas solo por el contacto que quieras
              desbloquear — recibes nombre completo, empresa, teléfono y email al instante.
            </p>
            <div
              className="mt-6 inline-flex items-center gap-2 text-[12px] font-mono-brand uppercase tracking-[0.1em] px-3 py-1.5 rounded-full"
              style={{ background: "color-mix(in oklab, var(--green-brand) 12%, transparent)", color: "var(--green-brand)" }}
            >
              <span className="pulse-dot" /> 12 leads publicados este mes · 8 ya desbloqueados
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-4">
          {DEMO_LEADS.map((lead) => {
            const waMsg = `Hola Alkan, quiero desbloquear el lead de ${lead.type} en ${lead.city} (${lead.leadId})`;
            const intent = intentBadge(lead.intent);
            const TypeIcon = lead.typeIcon;
            return (
              <Reveal key={lead.id}>
                <article
                  className="relative rounded-2xl p-5 border shadow-sm hover:shadow-md transition flex flex-col lg:flex-row gap-5 lg:gap-6 lg:items-center"
                  style={{
                    background: "var(--bg)",
                    borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)",
                  }}
                >
                  {/* Score pill */}
                  <div
                    className="flex flex-col items-center justify-center px-4 py-3 rounded-xl border min-w-[100px]"
                    style={{
                      background: "var(--bg-2)",
                      borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)",
                    }}
                  >
                    <span
                      className="font-display text-[30px] font-bold leading-none"
                      style={{ color: scoreColor(lead.score) }}
                    >
                      {lead.score}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.18em] mt-1"
                      style={{ color: "color-mix(in oklab, var(--ink) 40%, transparent)" }}
                    >
                      Match
                    </span>
                  </div>

                  {/* Info area */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Title + tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[17px] font-bold" style={{ color: "var(--ink)" }}>
                        {lead.name} ****{" "}
                        <span className="font-normal" style={{ color: "var(--ink-soft)" }}>
                          · {lead.company}
                        </span>
                      </h3>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight"
                        style={{
                          background: "color-mix(in oklab, var(--blue) 12%, transparent)",
                          color: "var(--blue)",
                        }}
                      >
                        <TypeIcon className="w-3 h-3" strokeWidth={2.5} />
                        {lead.type}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight"
                        style={{
                          background: "color-mix(in oklab, var(--gold) 14%, transparent)",
                          color: "var(--gold)",
                        }}
                      >
                        {lead.permitStatus}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ background: intent.bg, color: intent.color }}
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full${intent.pulse ? " animate-pulse" : ""}`}
                          style={{ background: intent.dot }}
                        />
                        {intent.label}
                      </span>
                    </div>

                    {/* Why chips */}
                    <div className="flex flex-wrap gap-2">
                      {lead.whyChips.map((c) => (
                        <span
                          key={c.label}
                          className="px-2.5 py-1 text-[11.5px] font-medium rounded-full border"
                          style={
                            c.tone === "green"
                              ? {
                                  background: "color-mix(in oklab, var(--green-brand) 10%, transparent)",
                                  color: "var(--green-brand)",
                                  borderColor: "color-mix(in oklab, var(--green-brand) 22%, transparent)",
                                }
                              : {
                                  background: "var(--bg-2)",
                                  color: "color-mix(in oklab, var(--ink) 70%, transparent)",
                                  borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)",
                                }
                          }
                        >
                          {c.label}
                        </span>
                      ))}
                    </div>

                    {/* Mono enrichment line */}
                    <div
                      className="font-mono-brand text-[11px] uppercase flex flex-wrap gap-x-4 gap-y-1"
                      style={{ color: "color-mix(in oklab, var(--ink) 50%, transparent)" }}
                    >
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {lead.city}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Pub: {lead.pubDate}
                      </span>
                      <span>ID: {lead.leadId}</span>
                    </div>
                  </div>

                  {/* CTA area */}
                  <div
                    className="w-full lg:w-auto flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:border-l lg:pl-6"
                    style={{ borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)" }}
                  >
                    <div className="text-right lg:text-center">
                      <p
                        className="text-[10px] uppercase tracking-[0.18em] font-bold mb-0.5"
                        style={{ color: "color-mix(in oklab, var(--ink) 40%, transparent)" }}
                      >
                        Valor estimado
                      </p>
                      <p
                        className="font-mono-brand text-[20px] font-bold"
                        style={{ color: "var(--gold)" }}
                      >
                        {lead.value}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/12066406034?text=${encodeURIComponent(waMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[13px] font-bold text-white transition hover:opacity-90 whitespace-nowrap"
                      style={{ background: "var(--blue)" }}
                    >
                      Quiero este contacto · $25
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* DEMO ribbon */}
                  <span
                    className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                    style={{ background: "color-mix(in oklab, var(--ink) 8%, transparent)", color: "var(--ink-soft)" }}
                  >
                    DEMO
                  </span>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="text-center mt-10 text-[14px] flex flex-col sm:flex-row items-center justify-center gap-3" style={{ color: "var(--ink-soft)" }}>
            <a
              href="#pagos"
              className="font-semibold px-5 py-2.5 rounded-lg text-white"
              style={{ background: "var(--blue)" }}
            >
              Ver métodos de pago →
            </a>
            <a
              href={`https://wa.me/12066406034?text=${encodeURIComponent(
                "Hola Alkan, me interesa el catálogo completo de leads en Washington",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
              style={{ color: "var(--blue)" }}
            >
              o hablemos por WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
