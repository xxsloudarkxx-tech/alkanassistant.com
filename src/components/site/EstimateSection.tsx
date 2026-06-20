import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";

const WORK_TYPES = [
  "Fencing",
  "Landscaping",
  "Excavation/Demolition",
  "Concrete",
  "Framing",
  "ADU/New Construction",
  "Remodeling",
  "Roofing",
  "Otro",
];

export function EstimateSection() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nombre = String(f.get("nombre") || "");
    const tel = String(f.get("telefono") || "");
    const tipo = String(f.get("tipo") || "");
    const ciudad = String(f.get("ciudad") || "");
    const desc = String(f.get("descripcion") || "");
    const msg =
      `Hola Alkan, quiero pedir un estimado gratuito 📋\n` +
      `Nombre: ${nombre}\n` +
      `Teléfono: ${tel}\n` +
      `Tipo de trabajo: ${tipo}\n` +
      `Ciudad: ${ciudad}\n` +
      `Proyecto: ${desc}\n` +
      `¿Cuándo me lo pueden mandar?`;
    window.open(
      `https://wa.me/12066406034?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <section
      id="estimado"
      className="px-6 py-24"
      style={{
        background: "var(--blue-deep, #0f1f3d)",
        color: "#fff",
      }}
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <Reveal>
          <div>
            <div
              className="font-mono-brand text-[11px] uppercase tracking-[0.14em] mb-4"
              style={{ color: "var(--gold)" }}
            >
              Estimado gratuito · Sin compromiso
            </div>
            <h2
              className="font-display text-4xl md:text-5xl leading-[1.05]"
              style={{ letterSpacing: "-0.025em" }}
            >
              Te hacemos un{" "}
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>
                estimado personalizado
              </em>{" "}
              y gratis
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed" style={{ color: "#cdd5ec" }}>
              Cuéntame el proyecto. Te mando el estimado en formato profesional listo para
              mostrarle al cliente.
            </p>
            <ul className="mt-8 space-y-3 text-[15px]" style={{ color: "#d6dbed" }}>
              {[
                "Formato editable en Word o PDF con tu nombre",
                "Entrega en menos de 24 horas",
                "Gratis, sin contrato ni tarjeta",
                "Precios basados en mercado real de WA 2026",
              ].map((b) => (
                <li key={b} className="flex gap-3 items-start">
                  <span style={{ color: "var(--gold)" }} className="mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form
            onSubmit={onSubmit}
            className="rounded-2xl p-7 md:p-8 space-y-4"
            style={{
              background: "#fff",
              color: "var(--ink)",
              boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)",
            }}
          >
            <Field label="Nombre completo" name="nombre" required placeholder="Marco Torres" />
            <Field
              label="WhatsApp / Teléfono"
              name="telefono"
              required
              type="tel"
              placeholder="(206) 555-0100"
            />
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Tipo de trabajo</label>
              <select
                name="tipo"
                required
                className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none"
                style={{ borderColor: "rgba(15,31,61,0.18)", background: "#fff" }}
              >
                <option value="">Selecciona...</option>
                {WORK_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Ciudad / Condado en WA" name="ciudad" required placeholder="Tacoma, Pierce County" />
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Describe el proyecto brevemente
              </label>
              <textarea
                name="descripcion"
                required
                rows={3}
                className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none resize-none"
                style={{ borderColor: "rgba(15,31,61,0.18)" }}
                placeholder="120 ft de cedar fence, demo de cerca vieja, instalar gate..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-5 py-3.5 rounded-xl font-semibold text-[15px] transition hover:opacity-90"
              style={{
                background: "var(--gold)",
                color: "var(--ink)",
                boxShadow: "0 0 28px rgba(200,154,58,0.35)",
              }}
            >
              Quiero mi estimado gratis — tarda 24hrs o menos →
            </button>
            <p className="text-[12px] text-center" style={{ color: "var(--ink-soft)" }}>
              🔒 Tu información no se comparte con nadie. Solo la uso para preparar tu estimado.
            </p>
            <p className="text-[11.5px] text-center font-medium" style={{ color: "var(--green-brand)" }}>
              Respondo en menos de 2 horas · Lunes a domingo
            </p>
            {sent && (
              <div
                className="text-[13px] rounded-lg p-3"
                style={{
                  background: "color-mix(in oklab, #1a8e54 12%, transparent)",
                  color: "#0f6b3e",
                }}
              >
                ✓ Abriendo WhatsApp con tu solicitud...
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none"
        style={{ borderColor: "rgba(15,31,61,0.18)" }}
      />
    </div>
  );
}
