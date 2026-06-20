import { Reveal } from "@/components/Reveal";
import {
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

type Trade = {
  icon: LucideIcon;
  title: string;
  sub: string;
};

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

export function Specialties() {
  return (
    <section id="especialidades" className="px-6 py-24" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div
            className="font-mono-brand text-[11px] uppercase tracking-[0.1em] mb-4 font-medium"
            style={{ color: "var(--blue)" }}
          >
            Operaciones · Inglés pa' trabajar
          </div>
          <h2
            className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight"
            style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
          >
            Cubrimos los oficios que{" "}
            <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
              mueven Washington
            </em>
          </h2>
          <p className="mt-5 max-w-[640px] text-[16px]" style={{ color: "var(--ink-soft)" }}>
            Conseguimos leads, preparamos bids y manejamos la oficina para contratistas en estas
            especialidades. Si tu trade no está aquí, escríbenos — probablemente también lo cubrimos.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {TRADES.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal key={t.title} delay={i * 50}>
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
                    <div
                      className="font-semibold text-[15px] leading-tight"
                      style={{ color: "var(--ink)" }}
                    >
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
      </div>
    </section>
  );
}
