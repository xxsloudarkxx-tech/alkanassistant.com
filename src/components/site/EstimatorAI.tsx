import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import jsPDF from "jspdf";
import { generateEstimate } from "@/lib/estimator.functions";
import type { Estimate } from "@/lib/estimator.functions";

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

type FormState = {
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
  ciudad: string;
  tipo: string;
  descripcion: string;
  metraje: string;
  plazo: string;
};

const empty: FormState = {
  nombre: "",
  empresa: "",
  telefono: "",
  email: "",
  ciudad: "",
  tipo: "",
  descripcion: "",
  metraje: "",
  plazo: "",
};

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function buildPdf(estimate: Estimate, input: FormState) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  // Header
  doc.setFillColor(15, 31, 61);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("ALKAN ASSISTANT", margin, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Estimado profesional · Washington State", margin, 58);
  doc.text(new Date().toLocaleDateString("es-MX", { dateStyle: "long" }), margin, 74);

  y = 120;
  doc.setTextColor(15, 31, 61);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(estimate.titulo, margin, y);
  y += 22;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.text(`Cliente: ${input.nombre}${input.empresa ? " — " + input.empresa : ""}`, margin, y);
  y += 14;
  doc.text(`Ciudad: ${input.ciudad}    Tipo: ${input.tipo}`, margin, y);
  y += 14;
  if (input.telefono || input.email) {
    doc.text(`Contacto: ${[input.telefono, input.email].filter(Boolean).join(" · ")}`, margin, y);
    y += 14;
  }
  y += 8;

  // Resumen
  doc.setTextColor(15, 31, 61);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Resumen", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  const resumen = doc.splitTextToSize(estimate.resumen, W - margin * 2);
  doc.text(resumen, margin, y);
  y += resumen.length * 12 + 10;

  // Alcance
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 31, 61);
  doc.text("Alcance del trabajo", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  estimate.alcance.forEach((a) => {
    const lines = doc.splitTextToSize("• " + a, W - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 12;
  });
  y += 10;

  // Tabla partidas
  if (y > 600) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 31, 61);
  doc.text("Partidas", margin, y);
  y += 14;

  const colX = { desc: margin, qty: 320, unit: 370, price: 420, sub: 500 };
  doc.setFillColor(240, 240, 245);
  doc.rect(margin, y - 10, W - margin * 2, 18, "F");
  doc.setFontSize(9);
  doc.text("Descripción", colX.desc, y);
  doc.text("Cant.", colX.qty, y);
  doc.text("Unidad", colX.unit, y);
  doc.text("P. unit.", colX.price, y);
  doc.text("Subtotal", colX.sub, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  estimate.partidas.forEach((p) => {
    const descLines = doc.splitTextToSize(p.descripcion, 260);
    if (y + descLines.length * 12 > 720) {
      doc.addPage();
      y = margin;
    }
    doc.text(descLines, colX.desc, y);
    doc.text(String(p.cantidad), colX.qty, y);
    doc.text(p.unidad, colX.unit, y);
    doc.text(money(p.precio_unitario), colX.price, y);
    doc.text(money(p.subtotal), colX.sub, y);
    y += Math.max(descLines.length * 12, 14) + 4;
  });

  y += 10;
  if (y > 660) {
    doc.addPage();
    y = margin;
  }

  // Totales
  const rightX = W - margin;
  const labelX = rightX - 180;
  doc.setFontSize(10);
  const row = (label: string, val: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, labelX, y);
    doc.text(val, rightX, y, { align: "right" });
    y += 14;
  };
  row("Subtotal", money(estimate.subtotal));
  row(`Contingencia (${estimate.contingencia_pct}%)`, money(estimate.contingencia));
  row(`Impuestos WA (${estimate.impuestos_pct}%)`, money(estimate.impuestos));
  doc.setDrawColor(15, 31, 61);
  doc.line(labelX, y - 6, rightX, y - 6);
  doc.setTextColor(15, 31, 61);
  doc.setFontSize(12);
  row("TOTAL", money(estimate.total), true);

  y += 14;
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text("Plazo estimado: ", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(estimate.plazo_estimado, margin + 90, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("Términos de pago: ", margin, y);
  doc.setFont("helvetica", "normal");
  const tp = doc.splitTextToSize(estimate.terminos_pago, W - margin * 2 - 110);
  doc.text(tp, margin + 110, y);
  y += tp.length * 12 + 10;

  if (estimate.notas.length) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 31, 61);
    doc.text("Notas y exclusiones", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    estimate.notas.forEach((n) => {
      const lines = doc.splitTextToSize("• " + n, W - margin * 2);
      if (y + lines.length * 12 > 740) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y);
      y += lines.length * 12;
    });
  }

  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text(estimate.validez, margin, y);
  y += 12;
  doc.text("Generado por Alkan Assistant · alkanassistant.com", margin, y);

  doc.save(`Estimado-${input.nombre.replace(/\s+/g, "_") || "Cliente"}.pdf`);
}

export function EstimatorAI() {
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const run = useServerFn(generateEstimate);

  function update<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEstimate(null);
    setLoading(true);
    try {
      const result = await run({ data: form });
      setEstimate(result.estimate);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error generando estimado";
      setError(msg.includes("429") ? "Límite alcanzado. Intenta en un minuto." : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="estimador-ai"
      className="px-6 py-24"
      style={{ background: "#f6f5f0", color: "var(--ink, #0f1f3d)" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <div
            className="font-mono-brand text-[11px] uppercase tracking-[0.14em] mb-3"
            style={{ color: "var(--gold, #c89a3a)" }}
          >
            ⚡ Powered by IA · Resultado en 30 segundos
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05]" style={{ letterSpacing: "-0.025em" }}>
            Genera tu estimado o{" "}
            <em style={{ color: "var(--gold, #c89a3a)", fontStyle: "italic" }}>Bid al instante con IA</em>
          </h2>
          <p className="mt-5 text-[16px] max-w-2xl mx-auto" style={{ color: "var(--ink-soft, #4a5468)" }}>
            Describe tu proyecto y la IA genera un estimado o bid profesional con partidas, precios
            de mercado WA, contingencia e impuestos. Descárgalo en PDF listo para mandar al cliente
            o al GC.
          </p>
          <div
            className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full text-[12.5px] font-semibold"
            style={{
              background: "rgba(26,142,84,0.10)",
              color: "#0f6b3e",
              border: "1px solid rgba(26,142,84,0.25)",
            }}
          >
            🎁 Si tu estimado no te sirve, te regalo <span style={{ color: "var(--ink)" }}>1 Lead calificado</span> gratis
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <form
            onSubmit={onSubmit}
            className="rounded-2xl p-7 space-y-3 bg-white"
            style={{ boxShadow: "0 20px 50px -20px rgba(15,31,61,0.25)" }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tu nombre *" v={form.nombre} on={(v) => update("nombre", v)} required />
              <Field label="Empresa" v={form.empresa} on={(v) => update("empresa", v)} />
              <Field label="Teléfono" v={form.telefono} on={(v) => update("telefono", v)} />
              <Field label="Email" v={form.email} on={(v) => update("email", v)} />
              <Field label="Ciudad / Condado *" v={form.ciudad} on={(v) => update("ciudad", v)} required />
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Tipo de trabajo *</label>
                <select
                  required
                  value={form.tipo}
                  onChange={(e) => update("tipo", e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none bg-white"
                  style={{ borderColor: "rgba(15,31,61,0.18)" }}
                >
                  <option value="">Selecciona...</option>
                  {WORK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Metraje / tamaño" v={form.metraje} on={(v) => update("metraje", v)} placeholder="120 lf, 800 sqft..." />
              <Field label="Plazo deseado" v={form.plazo} on={(v) => update("plazo", v)} placeholder="2 semanas" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Describe el proyecto *</label>
              <textarea
                required
                rows={5}
                value={form.descripcion}
                onChange={(e) => update("descripcion", e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none resize-none"
                style={{ borderColor: "rgba(15,31,61,0.18)" }}
                placeholder="120 ft de cedar fence 6ft con dos gates, demoler cerca vieja, terreno plano, acceso fácil con truck..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3.5 rounded-xl font-semibold text-[15px] transition hover:opacity-90 disabled:opacity-60"
              style={{
                background: "var(--gold, #c89a3a)",
                color: "var(--ink, #0f1f3d)",
                boxShadow: "0 0 28px rgba(200,154,58,0.35)",
              }}
            >
              {loading ? "Generando estimado con IA..." : "⚡ Generar estimado con IA"}
            </button>
            {error && (
              <p className="text-[13px] text-center" style={{ color: "#b91c1c" }}>
                {error}
              </p>
            )}
            <p className="text-[11.5px] text-center" style={{ color: "var(--ink-soft, #4a5468)" }}>
              🔒 Tus datos no se comparten. Resultado en formato editable.
            </p>
          </form>

          <div
            className="rounded-2xl p-7 min-h-[420px] bg-white"
            style={{ boxShadow: "0 20px 50px -20px rgba(15,31,61,0.15)" }}
          >
            {!estimate && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-16" style={{ color: "var(--ink-soft, #4a5468)" }}>
                <div className="text-5xl mb-4">📋</div>
                <p className="text-[14px] max-w-xs">
                  Tu estimado aparecerá aquí. Llena el formulario y haz click en generar.
                </p>
              </div>
            )}
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="animate-spin w-10 h-10 border-3 rounded-full mb-4" style={{ borderColor: "var(--gold, #c89a3a)", borderTopColor: "transparent", borderWidth: 3 }} />
                <p className="text-[14px]">La IA está analizando tu proyecto y calculando precios de mercado WA...</p>
              </div>
            )}
            {estimate && (
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--gold, #c89a3a)" }}>
                      Estimado generado
                    </div>
                    <h3 className="text-xl font-semibold mt-1">{estimate.titulo}</h3>
                  </div>
                  <button
                    onClick={() => buildPdf(estimate, form)}
                    className="shrink-0 px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
                    style={{ background: "var(--ink, #0f1f3d)" }}
                  >
                    ⬇ Descargar PDF
                  </button>
                </div>
                <p className="text-[13px] mb-4" style={{ color: "var(--ink-soft, #4a5468)" }}>
                  {estimate.resumen}
                </p>
                <div className="border-t pt-4 space-y-1.5 text-[13px]">
                  {estimate.partidas.map((p, i) => (
                    <div key={i} className="flex justify-between gap-3">
                      <span className="flex-1">{p.descripcion} <span style={{ color: "var(--ink-soft, #4a5468)" }}>· {p.cantidad} {p.unidad}</span></span>
                      <span className="font-medium">{money(p.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-3 space-y-1 text-[13px]">
                  <Row l="Subtotal" v={money(estimate.subtotal)} />
                  <Row l={`Contingencia (${estimate.contingencia_pct}%)`} v={money(estimate.contingencia)} />
                  <Row l={`Impuestos WA (${estimate.impuestos_pct}%)`} v={money(estimate.impuestos)} />
                  <Row l="TOTAL" v={money(estimate.total)} bold />
                </div>
                <p className="text-[11.5px] mt-4" style={{ color: "var(--ink-soft, #4a5468)" }}>
                  {estimate.validez} · {estimate.plazo_estimado}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  v,
  on,
  required,
  placeholder,
}: {
  label: string;
  v: string;
  on: (s: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5">{label}</label>
      <input
        value={v}
        onChange={(e) => on(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none"
        style={{ borderColor: "rgba(15,31,61,0.18)" }}
      />
    </div>
  );
}

function Row({ l, v, bold }: { l: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-[15px] pt-1" : ""}`} style={bold ? { color: "var(--ink, #0f1f3d)" } : undefined}>
      <span>{l}</span>
      <span>{v}</span>
    </div>
  );
}