import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Nav } from "@/components/site/Nav";
import { Reveal } from "@/components/Reveal";
import { LeadsCatalog } from "@/components/site/LeadsCatalog";
import { GuideSection } from "@/components/site/GuideSection";
import { PaymentMethods } from "@/components/site/PaymentMethods";
import { PartnershipModels } from "@/components/site/PartnershipModels";
import { StickyTopBar } from "@/components/site/StickyTopBar";
import { SalesBot } from "@/components/site/SalesBot";
import { AIFeatures } from "@/components/site/AIFeatures";
import alkanLogo from "@/assets/alkan-logo.png";
import alkanAssistantGirl from "@/assets/alkan-assistant-girl.jpg";
import testimonialFabricator from "@/assets/testimonial-fabricator.jpg";
import testimonialAlvarez from "@/assets/testimonial-alvarez.jpg";
import testimonialEnvision from "@/assets/testimonial-envision.jpg";
import heroVideo from "@/assets/hero-handshake.mp4.asset.json";
import { Instagram, Facebook, Mail, Phone, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Alkan Assistant · Servicios para contratistas en WA" },
      {
        name: "description",
        content:
          "Asistente operativo remoto para contratistas en Washington State. Bids, materiales, permisos, financiamiento y back-office bajo esquema 1099.",
      },
      { property: "og:title", content: "Alkan Assistant · Servicios para contratistas en WA" },
      {
        property: "og:description",
        content:
          "Asistente operativo remoto para contratistas en Washington State. Bids, materiales, permisos, financiamiento y back-office bajo esquema 1099.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://alkanassistant.com/" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5b31942a-376e-4020-8c05-59a87f43a501/id-preview-bbaafc2d--536ee21b-8441-40bf-ae1d-5a455368e2b5.lovable.app-1778141777910.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5b31942a-376e-4020-8c05-59a87f43a501/id-preview-bbaafc2d--536ee21b-8441-40bf-ae1d-5a455368e2b5.lovable.app-1778141777910.png",
      },
    ],
    links: [
      { rel: "canonical", href: "https://alkanassistant.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Alkan Assistant",
          description:
            "Asistente operativo remoto para contratistas en Washington State: bids, materiales, permisos y back-office.",
          url: "https://alkanassistant.com",
          areaServed: { "@type": "State", name: "Washington" },
          serviceType: "Operaciones y back-office para contratistas",
        }),
      },
    ],
  }),
});

const stats = [
  { v: "+$1.284M", l: "En contratos para clientes", c: "Acumulado desde enero 2025" },
  { v: "68", l: "Tareas semanales promedio", c: "Por cada cliente activo" },
  { v: "18 meses", l: "Ayudando contratistas", c: "Desde enero 2025 en Northwest" },
  { v: "100%", l: "Deducible ante el IRS", c: "Bajo Form W-8BEN" },
];

type Pkg = {
  name: string;
  price: string;
  oldPrice?: string;
  priceNote?: string;
  equiv?: string;
  badge: string;
  featured?: boolean;
  cta: string;
  features: string[];
};

const packages: Pkg[] = [
  {
    name: "Soporte Esencial",
    price: "$125",
    oldPrice: "$200",
    priceNote: "Precio de lanzamiento",
    badge: "Básico",
    cta: "Empezar con Esencial →",
    features: [
      "Hasta 25 tareas administrativas por semana",
      "5 leads calificados al mes incluidos",
      "Gestión de emails y documentos",
      "Reporte semanal de actividades",
      "Coordinación con 1 proveedor principal",
      "Atención Lunes a Viernes",
      "Documentación IRS básica (1099 / W-8BEN)",
    ],
  },
  {
    name: "Operaciones",
    price: "$275",
    equiv: "Equivale a $6.87/hora de soporte profesional",
    badge: "⭐ Más popular",
    featured: true,
    cta: "Empezar con Operaciones →",
    features: [
      "Tareas ilimitadas (promedio 68/semana)",
      "20 leads calificados por semana incluidos",
      "Estimados y listas de materiales completas",
      "Coordinación de proveedores y clientes",
      "Gestión de financiamiento y crédito",
      "Documentación IRS completa (1099 / W-8BEN)",
      "Recuperación de Sales Tax con Reseller Permit",
      "Atención 7 días de la semana",
      "Reporte semanal ejecutivo",
    ],
  },
  {
    name: "Operaciones + Leads",
    price: "$450",
    badge: "Crecimiento",
    cta: "Empezar con Crecimiento →",
    features: [
      "Todo lo del plan Operaciones",
      "Leads ilimitados (unlimited) cada semana",
      "Preparación de bids completos y competitivos",
      "Networking con GCs y contratistas generales",
      "Permisos y cumplimiento OSHA / L&I",
      "Marketing digital básico y redes sociales",
      "Respuesta prioritaria en menos de 2 horas",
    ],
  },
  {
    name: "Seguimiento Garantizado",
    price: "$300",
    badge: "Garantía de cierre",
    cta: "Activar Seguimiento →",
    features: [
      "Hacemos el follow-up completo a tus leads (nuestros o tuyos)",
      "Llamadas, mensajes, recordatorios y envío de cotizaciones",
      "Garantía: mínimo 1 contrato cerrado por semana",
      "Si no cerramos uno, la siguiente semana corre por nuestra cuenta",
      "Reportes diarios + transcripciones de cada contacto",
      "Sin prueba gratis: se contrata con confianza en el resultado",
      "Respaldado por reseñas reales de clientes",
    ],
  },
];

const steps = [
  { t: "Me cuentas tus proyectos activos", d: "Una llamada de 15 minutos o mensaje de WhatsApp. Me pongo al día con tus obras, proveedores y pendientes." },
  { t: "Empezamos con una semana de prueba", d: "Sin costo. Te entrego estimados, coordino proveedores y te mando un reporte al final de la semana." },
  { t: "Elegimos tu paquete", d: "Según tu carga de trabajo, seleccionamos el plan que más te conviene. Pago fijo cada viernes." },
  { t: "Tú te concentras en la obra", d: "Yo manejo el back-office. Tú ganas más contratos, sin estrés administrativo." },
];

const testimonials = [
  {
    q: "Excelente aliado comercial. Desde enero de 2025, gracias al apoyo de Alkan Assistant como nuestro Sales Manager, hemos logrado cerrar contratos por un valor de $836,000 dólares. Su gestión comercial ha sido clave para nuestro crecimiento.",
    n: "Tirso Alcántar",
    initials: "TA",
    work: "The Fabricator · Welding & Metal Works",
    since: "Cliente activo desde enero 2025 · Sales Manager",
    color: "#1f4e8c",
    image: testimonialFabricator,
  },
  {
    q: "Una solución integral para nuestro negocio. Nos ayudan con todo, desde las tareas diarias hasta la gestión de más de 12 contratos en solo 4 meses. Gracias a que Alkan Assistant se encarga por completo de todo el trabajo de oficina y la administración, yo puedo enfocarme al 100% en supervisar el trabajo de campo y coordinar a las cuadrillas durante las jornadas laborales.",
    n: "Alvarez Landscaping",
    initials: "AL",
    work: "Landscaping · Washington State",
    since: "12+ contratos cerrados en 4 meses",
    color: "#2f7a4a",
    image: testimonialAlvarez,
  },
  {
    q: "Altamente recomendados. Nos gestionaron con éxito la autorización necesaria para operar en Obra Pública (Public Works). Actualmente, siguen siendo un pilar fundamental ayudándonos a conseguir nuevos contratos, tanto en el sector privado como en el público.",
    n: "JB Construction",
    initials: "JB",
    work: "General Contractor · Public & Private Works",
    since: "Certificación Public Works gestionada",
    color: "#c89a3a",
  },
  {
    q: "Son el motor que mantiene nuestro negocio en movimiento. Han logrado llenar por completo nuestro pipeline, ayudándonos a asegurar adiciones comerciales (ADVS) y contratos de gran envergadura.",
    n: "Envision Builders Inc.",
    initials: "EB",
    work: "Commercial Construction · WA",
    since: "Pipeline lleno · ADVS & contratos grandes",
    color: "#e85d2c",
    image: testimonialEnvision,
  },
];

const faqs = [
  {
    q: "¿En qué consiste la prueba de 7 días sin costo?",
    a: "Trabajo contigo durante 7 días completos sin que pagues un solo dólar. Tomo tareas reales de tu operación. Si al final de la semana no ves valor claro, no me debes nada.",
  },
  {
    q: "¿Cómo inicio la prueba?",
    a: "Me escribes por WhatsApp o email. Tenemos una llamada corta de 20-30 min y al día siguiente arrancamos. Sin contratos, sin papeleo previo, sin tarjeta de crédito.",
  },
  {
    q: "¿Qué incluye exactamente la prueba?",
    a: "Acceso completo a mi trabajo durante 7 días: cotizaciones, llamadas y emails con GCs, seguimiento de permisos, búsqueda de materiales y precios, organización de tu inbox y un reporte al final de la semana.",
  },
  {
    q: "¿Cómo cancelo si no me convence?",
    a: "Cero penalizaciones, cero compromisos. Al terminar los 7 días tú decides si continuamos. Si no, simplemente me lo dices por mensaje y cerramos sin pago.",
  },
  {
    q: "¿Tienes que retenerme impuestos? (W-8BEN)",
    a: "No. Bajo el Form W-8BEN, eres un pagador a contratista extranjero. No retienes Social Security ni Medicare. Solo reportas el pago en el Form 1042-S si aplica.",
  },
  {
    q: "¿Cómo me mandas el pago?",
    a: "Por Zelle, Felix Pago, o transferencia bancaria. Lo que te sea más cómodo. El pago es cada viernes junto con el reporte de la semana.",
  },
];

const PROBLEM_OPTIONS = [
  "No me alcanza el tiempo para cotizar",
  "No consigo suficientes leads / GCs",
  "Tengo el inbox y papeleo desordenado",
  "Me atrasan los permisos y trámites L&I",
  "No sé manejar Sales Tax / Reseller Permit",
  "Otro",
];

const CONTRACTOR_TYPES = [
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

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className="font-mono-brand text-[11px] uppercase tracking-[0.1em] mb-4 font-medium"
      style={{ color: light ? "var(--blue-bright)" : "var(--blue)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight"
      style={{ color: light ? "#fff" : "var(--ink)", letterSpacing: "-0.025em" }}
    >
      {children}
    </h2>
  );
}

function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSent, setContactSent] = useState(false);

  function onContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nombre = String(f.get("c_nombre") || "");
    const tel = String(f.get("c_tel") || "");
    const tipo = String(f.get("c_tipo") || "");
    const problema = String(f.get("c_problema") || "");
    const msg =
      `Hola Alkan, vengo del sitio 👋\n` +
      `Nombre: ${nombre}\n` +
      `WhatsApp: ${tel}\n` +
      `Tipo de contratista: ${tipo}\n` +
      `Mi mayor problema hoy: ${problema}\n` +
      `Quiero coordinar una llamada.`;
    window.open(
      `https://wa.me/12066406034?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setContactSent(true);
  }

  return (
    <main id="top" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <StickyTopBar />
      <Nav />

      {/* HERO */}
      <section className="relative px-6 pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto">
          {/* Urgency: live ticker */}
          <Reveal>
            <div
              className="inline-flex items-center gap-2 bg-white border rounded-full pl-3 pr-4 py-1.5 mb-5 max-w-full"
              style={{ borderColor: "rgba(15,31,61,0.08)" }}
            >
              <span className="pulse-dot shrink-0" />
              <span className="text-[11.5px] font-medium leading-tight" style={{ color: "var(--ink)" }}>
                <span style={{ color: "var(--gold)" }}>⚡</span>{" "}
                <strong>1 cupo</strong> esta semana —{" "}
                <span style={{ color: "var(--blue)" }}>3 contratistas</span> lo están viendo ahora
              </span>
            </div>
          </Reveal>

          {/* CINEMATIC HEADLINE — video + H1 overlay */}
          <Reveal delay={80}>
            <h1
              className="font-display text-[2rem] sm:text-[2.8rem] md:text-[3.8rem] leading-[1.04] mb-6 md:mb-8"
              style={{ letterSpacing: "-0.03em", color: "var(--ink)" }}
            >
              Te conseguimos el trabajo,
              <br />
              tú firmas el contrato
              <br />
              y te ayudamos a{" "}
              <em
                className="gold-underline"
                style={{ color: "var(--blue)", fontStyle: "italic" }}
              >
                manejar tu oficina
              </em>
              .
            </h1>
            <div
              className="relative overflow-hidden rounded-[28px] border shadow-2xl"
              style={{
                borderColor: "rgba(15,31,61,0.10)",
                aspectRatio: "16 / 9",
                background: "var(--ink)",
                boxShadow:
                  "0 40px 80px -30px rgba(10,16,36,0.45), 0 0 0 1px rgba(200,154,58,0.08)",
              }}
            >
              <video
                src={heroVideo.url}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "saturate(1.05) contrast(1.02)" }}
              />
              {/* Gradient overlay — keep brand palette dominant */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(15,31,61,0.15) 0%, rgba(15,31,61,0.05) 40%, rgba(15,31,61,0.78) 100%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(15,31,61,0.55) 0%, rgba(15,31,61,0.15) 55%, rgba(15,31,61,0) 100%)",
                }}
              />
              {/* LIVE chip */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md"
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  <span className="pulse-dot shrink-0" />
                  <span className="font-mono-brand text-[10px] uppercase tracking-[0.14em] text-white">
                    En obra · Washington State
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-7 inline-flex items-center gap-2 text-[12.5px] font-medium" style={{ color: "var(--ink-soft)" }}>
              <span className="flex -space-x-1.5">
                {["#2A4F82", "#1a8e54", "#c89a3a"].map((c) => (
                  <span key={c} className="w-5 h-5 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </span>
              Usado por <strong style={{ color: "var(--ink)" }}>+40 contratistas</strong> en King, Pierce y Kitsap County
            </div>
          </Reveal>

          {/* TRUST PROMISES BANNER */}
          <Reveal delay={140}>
            <div
              className="mt-6 rounded-2xl p-5 md:p-6 grid sm:grid-cols-3 gap-4"
              style={{
                background: "linear-gradient(135deg, var(--ink) 0%, var(--blue-deep, #0f1f3d) 100%)",
                border: "1px solid rgba(200,154,58,0.35)",
                boxShadow: "0 18px 40px -20px rgba(15,31,61,0.45)",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0" style={{ color: "var(--gold)" }}>⚡</span>
                <div>
                  <div className="font-semibold text-white text-[14px] leading-snug">
                    Leads frescos del día
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: "#a3acce" }}>
                    Verificados en tiempo real y enviados a tu WhatsApp.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0" style={{ color: "var(--gold)" }}>✓</span>
                <div>
                  <div className="font-semibold text-white text-[14px] leading-snug">
                    Resultados reales, no promesas
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: "#a3acce" }}>
                    Si el contacto no responde, te lo reemplazamos gratis.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0" style={{ color: "var(--gold)" }}>🚫</span>
                <div>
                  <div className="font-semibold text-white text-[14px] leading-snug">
                    Cero reciclados o inexistentes
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: "#a3acce" }}>
                    Nada de leads viejos, vendidos antes o inventados.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-[640px] text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              Soy el asistente operativo que los contratistas en Washington State necesitan para
              ganar más contratos, coordinar proveedores y no perderse en trámites — sin contratar
              a nadie físicamente.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 grid md:grid-cols-[260px_1fr] gap-8 items-center">
              <div
                className="relative rounded-2xl overflow-hidden border mx-auto md:mx-0"
                style={{
                  borderColor: "rgba(15,31,61,0.10)",
                  boxShadow: "0 20px 50px -20px rgba(10,16,36,0.35)",
                  width: "100%",
                  maxWidth: 260,
                  aspectRatio: "1 / 1",
                }}
              >
                <img
                  src={alkanAssistantGirl}
                  alt="Asistente de Alkan en obra"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                {stats.map((s) => (
                  <div key={s.l} className="pl-4 border-l-2" style={{ borderColor: "var(--blue)" }}>
                    <div className="font-display text-3xl md:text-[2rem]" style={{ color: "var(--ink)" }}>
                      {s.v}
                    </div>
                    <div className="font-mono-brand text-[11px] uppercase tracking-[0.08em] mt-1" style={{ color: "var(--gray-soft)" }}>
                      {s.l}
                    </div>
                    <div className="text-[11px] mt-1 italic" style={{ color: "var(--ink-soft)" }}>
                      {s.c}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#packages"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-[15px] hover:opacity-90 transition"
                style={{ background: "var(--ink)", boxShadow: "0 18px 40px -16px rgba(10,16,36,0.5)" }}
              >
                Ver paquetes y precios →
              </a>
              <a
                href="#estimador-ia"
                className="text-[14px] font-semibold underline underline-offset-4"
                style={{ color: "var(--blue)" }}
              >
                → o pide un estimado gratis
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INGLÉS PA TRABAJAR */}
      <AIFeatures />

      {/* MODELOS DE ASOCIACIÓN */}
      <PartnershipModels />

      {/* BLOG TEASER */}
      <section className="px-6 py-20" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1100px] mx-auto rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between"
          style={{
            background: "linear-gradient(135deg, var(--ink) 0%, var(--blue-deep, #0f1f3d) 100%)",
            color: "#fff",
            boxShadow: "0 30px 70px -30px rgba(10,16,36,0.5)",
          }}
        >
          <div className="max-w-[560px]">
            <div className="font-mono-brand text-[11px] uppercase tracking-[0.14em] mb-3" style={{ color: "var(--gold)" }}>
              📰 Blog · Escrito con IA, curado por Alkan
            </div>
            <h2 className="font-display text-3xl md:text-4xl leading-[1.05]" style={{ letterSpacing: "-0.025em" }}>
              Guías reales para contratistas en <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Washington State</em>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "#cdd5ec" }}>
              L&I, W-8BEN, Sales Tax, bids, marketing y trucos de IA — todo en español, escrito para tu día a día en obra.
            </p>
          </div>
          <Link
            to="/blog"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[15px]"
            style={{ background: "var(--gold)", color: "var(--ink)", boxShadow: "0 0 28px rgba(200,154,58,0.35)" }}
          >
            Leer el blog →
          </Link>
        </div>
      </section>

      {/* CATÁLOGO */}
      <LeadsCatalog />

      {/* MÉTODOS DE PAGO */}
      <PaymentMethods />

      {/* HOW IT WORKS */}
      <section className="px-6 py-24" style={{ background: "var(--bg-2)" }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <Eyebrow>Cómo funciona</Eyebrow>
            <SectionTitle>
              De caos operativo a{" "}
              <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
                sistema que funciona
              </em>
            </SectionTitle>
          </Reveal>
          <div className="mt-14 grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 90}>
                <div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl text-white mb-5"
                    style={{ background: "var(--blue)", boxShadow: "0 10px 24px -10px rgba(42,79,130,0.55)" }}
                  >
                    {i + 1}
                  </div>
                  <div className="font-semibold text-[16px] mb-2" style={{ color: "var(--ink)" }}>
                    {s.t}
                  </div>
                  <div className="text-[14px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    {s.d}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="px-6 py-24">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <Eyebrow>Paquetes de servicio</Eyebrow>
            <SectionTitle>
              Elige cómo{" "}
              <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
                trabajamos juntos
              </em>
            </SectionTitle>
            <p className="mt-5 max-w-[640px] text-[16px]" style={{ color: "var(--ink-soft)" }}>
              Pago semanal fijo, esquema 1099 con W-8BEN. Cada peso que me pagas es{" "}
              <strong>100% deducible</strong> en tu declaración de impuestos como contratista.
            </p>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {packages.map((p, idx) => {
              const featured = p.featured;
              return (
                <Reveal key={p.name} delay={idx * 100}>
                  <div
                    className="card-hover h-full rounded-2xl p-7 flex flex-col"
                    style={{
                      background: featured ? "var(--ink)" : "var(--paper)",
                      color: featured ? "#fff" : "var(--ink)",
                      border: featured ? "1px solid rgba(79,125,255,0.4)" : "1px solid rgba(15,31,61,0.07)",
                      boxShadow: featured
                        ? "0 24px 60px -20px rgba(15,31,61,0.45), inset 0 1px 0 rgba(255,255,255,0.05)"
                        : "0 8px 24px -12px rgba(15,31,61,0.08)",
                    }}
                  >
                    <div
                      className="inline-block self-start text-[11px] font-mono-brand uppercase tracking-[0.08em] px-2.5 py-1 rounded-full mb-5"
                      style={{
                        background: featured ? "rgba(79,125,255,0.18)" : "rgba(42,79,130,0.08)",
                        color: featured ? "var(--blue-bright)" : "var(--blue)",
                      }}
                    >
                      {p.badge}
                    </div>
                    <div className="font-display text-2xl mb-2">{p.name}</div>
                    <div
                      className="rounded-xl px-4 py-3 mb-5"
                      style={{
                        background: featured
                          ? "linear-gradient(135deg, rgba(79,125,255,0.18), rgba(200,154,58,0.10))"
                          : "linear-gradient(135deg, rgba(42,79,130,0.08), rgba(200,154,58,0.10))",
                        border: featured
                          ? "1px solid rgba(200,154,58,0.4)"
                          : "1px solid rgba(200,154,58,0.35)",
                      }}
                    >
                      <div className="font-mono-brand text-[10px] uppercase tracking-[0.12em] mb-1"
                        style={{ color: featured ? "var(--gold)" : "var(--blue)" }}>
                        Precio semanal
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        {p.oldPrice && (
                          <span
                            className="font-display text-[1.5rem] line-through opacity-60"
                            style={{ color: featured ? "#a3acce" : "var(--gray-soft)" }}
                          >
                            {p.oldPrice}
                          </span>
                        )}
                        <span
                          className="font-display text-[3rem] leading-none"
                          style={{
                            color: featured ? "#fff" : "var(--ink)",
                            textShadow: featured ? "0 0 24px rgba(200,154,58,0.35)" : "none",
                          }}
                        >
                          {p.price}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: featured ? "var(--gold)" : "var(--blue)" }}>
                          USD / semana
                        </span>
                      </div>
                      <div className="font-mono-brand text-[10px] mt-1" style={{ color: featured ? "#a3acce" : "var(--gray-soft)" }}>
                        Pago cada viernes · 1099 deducible
                      </div>
                      {p.priceNote && (
                        <div className="text-[11px] font-semibold mt-1.5" style={{ color: featured ? "var(--gold)" : "var(--green-brand)" }}>
                          🏷️ {p.priceNote}
                        </div>
                      )}
                      {p.equiv && (
                        <div className="text-[11.5px] font-medium mt-1.5" style={{ color: featured ? "var(--gold)" : "var(--blue)" }}>
                          ≈ {p.equiv}
                        </div>
                      )}
                    </div>
                    <ul className="space-y-3 mb-7 text-[14px] leading-relaxed flex-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <span style={{ color: "var(--green-brand)" }} className="mt-0.5 shrink-0">✓</span>
                          <span style={{ color: featured ? "#d6dbed" : "var(--ink-soft)" }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className="block text-center px-5 py-3 rounded-lg font-semibold text-[14px] transition hover:opacity-90"
                      style={{
                        background: featured ? "var(--blue-bright)" : "var(--ink)",
                        color: "#fff",
                      }}
                    >
                      {p.cta}
                    </a>
                    <div className="text-center text-[10.5px] mt-2" style={{ color: featured ? "#a3acce" : "var(--gray-soft)" }}>
                      Respondo en &lt;2 hrs · L-D
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={200}>
            <div
              className="mt-8 text-center text-[14px] font-medium rounded-xl px-5 py-4 mx-auto max-w-[680px]"
              style={{
                background: "color-mix(in oklab, var(--gold) 12%, transparent)",
                border: "1px dashed rgba(200,154,58,0.5)",
                color: "var(--ink)",
              }}
            >
              💡 El primer contratista que cerró con <strong>Operaciones</strong> recuperó su inversión en <strong>4 días</strong>.
            </div>
          </Reveal>

          {/* Nota condensada de comisiones */}
          <Reveal delay={120}>
            <div
              className="mt-8 rounded-xl p-5 text-[13.5px] leading-relaxed"
              style={{
                background: "rgba(42,79,130,0.06)",
                border: "1px solid rgba(42,79,130,0.18)",
                color: "var(--ink-soft)",
              }}
            >
              <strong style={{ color: "var(--ink)" }}>Comisiones por contrato (adicionales):</strong>{" "}
              5% hasta $10k · 4% de $10k–$50k · 3% de $50k–$100k · 2.5% sobre $100k · $50 fijos por
              lead calificado no cerrado. Aplica solo cuando yo genero el lead y cierro el contrato.
              Todo 100% deducible en tu Schedule C bajo W-8BEN.
            </div>
          </Reveal>
        </div>
      </section>

      {/* GUÍA */}
      <GuideSection />

      {/* TESTIMONIALS */}
      <section className="px-6 py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <Eyebrow>Lo que dicen mis clientes</Eyebrow>
            <SectionTitle>
              Resultados{" "}
              <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
                reales
              </em>
              , no promesas
            </SectionTitle>
          </Reveal>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.n} delay={i * 90}>
                <div
                  className="card-hover h-full rounded-2xl p-6 flex flex-col"
                  style={{ background: "var(--paper)", border: "1px solid rgba(15,31,61,0.07)", boxShadow: "0 8px 24px -12px rgba(15,31,61,0.10)" }}
                >
                  <div style={{ color: "var(--gold)" }} className="text-lg mb-3">★★★★★</div>
                  <p className="text-[15px] leading-relaxed flex-1" style={{ color: "var(--ink)" }}>
                    "{t.q}"
                  </p>
                  <div className="mt-5 pt-4 border-t flex items-center gap-3" style={{ borderColor: "rgba(15,31,61,0.08)" }}>
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.n}
                        className="w-14 h-14 rounded-full object-cover shrink-0"
                        style={{ background: "#fff", border: "1px solid rgba(15,31,61,0.10)", boxShadow: `0 6px 16px -6px ${t.color}66` }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-[16px] shrink-0"
                        style={{ background: t.color, color: "#fff", boxShadow: `0 6px 16px -6px ${t.color}88` }}
                      >
                        {t.initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>{t.n}</div>
                      <div className="font-mono-brand text-[10.5px] uppercase tracking-[0.06em] mt-0.5 truncate" style={{ color: "var(--gray-soft)" }}>
                        {t.work}
                      </div>
                      <div
                        className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide mt-0.5 px-1.5 py-0.5 rounded"
                        style={{ background: "color-mix(in oklab, var(--green-brand, #1a8e54) 14%, transparent)", color: "var(--green-brand, #1a8e54)" }}
                      >
                        <CheckCircle2 className="w-3 h-3" /> {t.since}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* GUARANTEE BANNER */}
          <Reveal>
            <div
              className="mt-14 rounded-2xl p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center gap-6"
              style={{
                background: "linear-gradient(135deg, var(--ink) 0%, var(--blue-deep) 100%)",
                border: "1px solid rgba(200,154,58,0.45)",
                boxShadow: "0 24px 60px -20px rgba(15,31,61,0.45)",
              }}
            >
              <div
                className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center font-display text-3xl relative"
                style={{
                  background: "linear-gradient(135deg, var(--gold), #e0b860)",
                  color: "var(--ink)",
                  boxShadow: "0 0 32px rgba(200,154,58,0.45)",
                  animation: "pulseDot 2.4s infinite",
                }}
              >
                🛡️
              </div>
              <div className="flex-1">
                <div className="font-mono-brand text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: "var(--gold)" }}>
                  Garantía 10x · Sin riesgo
                </div>
                <div className="font-display text-2xl md:text-3xl text-white mb-2">
                  Si en 7 días no vale al menos <em style={{ color: "var(--gold)", fontStyle: "italic" }}>10x</em> lo que pagas — no me debes nada.
                </div>
                <div className="text-[15px]" style={{ color: "#a3acce" }}>
                  Sin preguntas. Sin contratos largos. Sin penalizaciones. Tú decides al final de la semana.
                </div>
              </div>
              <div className="shrink-0">
                <a
                  href={`https://wa.me/12066406034?text=${encodeURIComponent(
                    "Hola Alkan, quiero empezar mi semana de prueba sin costo. ¿Cuándo podemos hablar?",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] hover:opacity-90 transition"
                  style={{ background: "var(--gold)", color: "var(--ink)", boxShadow: "0 0 28px rgba(200,154,58,0.35)" }}
                >
                  💬 Empezar prueba por WhatsApp →
                </a>
                <div className="text-center text-[10.5px] mt-2" style={{ color: "#a3acce" }}>
                  Respondo en &lt;2 hrs · L-D
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="max-w-[820px] mx-auto">
          <Reveal>
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <SectionTitle>
              <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
                Preguntas
              </em>{" "}
              que siempre hacen
            </SectionTitle>
          </Reveal>

          <div className="mt-12 space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={f.q} delay={i * 50}>
                  <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid rgba(15,31,61,0.07)" }}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between text-left px-6 py-5"
                    >
                      <span className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>
                        {f.q}
                      </span>
                      <span
                        className="text-2xl font-light shrink-0 transition-transform ml-4"
                        style={{ color: "var(--blue)", transform: open ? "rotate(45deg)" : "rotate(0)" }}
                      >
                        +
                      </span>
                    </button>
                    <div className="overflow-hidden transition-all duration-300 ease-out" style={{ maxHeight: open ? 400 : 0 }}>
                      <div className="px-6 pb-5 text-[14px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                        {f.a}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="px-6 py-24"
        style={{ background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%)" }}
      >
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <div>
              <Eyebrow>Hablemos hoy</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05]" style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}>
                Listo para{" "}
                <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>
                  trabajar contigo
                </em>
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                Llena el formulario o contáctame directo. Respondo en menos de 2 horas y coordinamos
                una llamada de 15 minutos.
              </p>

              <div className="mt-8 space-y-3">
                <a
                  href="tel:+12066406034"
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-[15px] transition hover:opacity-90"
                  style={{ background: "var(--ink)", color: "#fff" }}
                >
                  <Phone size={18} /> Llamar: +1 (206) 640-6034
                </a>
                <a
                  href="https://wa.me/12066406034"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-[15px] transition hover:opacity-90"
                  style={{ background: "#25D366", color: "#fff", boxShadow: "0 18px 40px -16px rgba(37,211,102,0.5)" }}
                >
                  💬 WhatsApp directo
                </a>
                <a
                  href="mailto:alkan@alkanassistant.com"
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-[15px] transition hover:opacity-90"
                  style={{ background: "rgba(15,31,61,0.06)", color: "var(--ink)", border: "1px solid rgba(15,31,61,0.12)" }}
                >
                  <Mail size={18} /> <span>alkan@alkanassistant.com</span>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={onContactSubmit}
              className="rounded-2xl p-6 md:p-7 space-y-4"
              style={{
                background: "#fff",
                border: "1px solid rgba(15,31,61,0.08)",
                boxShadow: "0 20px 50px -20px rgba(15,31,61,0.18)",
              }}
            >
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Nombre</label>
                <input
                  name="c_nombre"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none"
                  style={{ borderColor: "rgba(15,31,61,0.18)" }}
                  placeholder="Marco Torres"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Teléfono / WhatsApp</label>
                <input
                  name="c_tel"
                  type="tel"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none"
                  style={{ borderColor: "rgba(15,31,61,0.18)" }}
                  placeholder="(206) 555-0100"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Tipo de contratista</label>
                <select
                  name="c_tipo"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none bg-white"
                  style={{ borderColor: "rgba(15,31,61,0.18)" }}
                >
                  <option value="">Selecciona...</option>
                  {CONTRACTOR_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">¿Cuál es tu mayor problema hoy?</label>
                <select
                  name="c_problema"
                  required
                  className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none bg-white"
                  style={{ borderColor: "rgba(15,31,61,0.18)" }}
                >
                  <option value="">Selecciona...</option>
                  {PROBLEM_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-5 py-3.5 rounded-xl font-semibold text-[15px] text-white transition hover:opacity-90"
                style={{ background: "var(--ink)" }}
              >
                Enviar y abrir WhatsApp →
              </button>
              <p className="text-[12px] text-center" style={{ color: "var(--ink-soft)" }}>
                🔒 Tu info no se comparte con nadie · Respondo en &lt;2 hrs · L-D
              </p>
              {contactSent && (
                <div
                  className="text-[13px] rounded-lg p-3"
                  style={{
                    background: "color-mix(in oklab, #1a8e54 12%, transparent)",
                    color: "#0f6b3e",
                  }}
                >
                  ✓ Listo. Abrí WhatsApp con tus datos prellenados — mándame el mensaje y te respondo en menos de 2 horas.
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12" style={{ background: "var(--ink)", color: "#a3acce" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-8 justify-between">
            <div className="flex items-start gap-3">
              <img
                src={alkanLogo}
                alt="Alkan Assistant"
                className="w-10 h-10 rounded-lg object-contain bg-white"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.25)" }}
              />
              <div>
                <div className="font-bold text-white text-[16px]">Alkan Assistant</div>
                <div className="text-[13px] mt-1 max-w-[320px]">
                  Consultoría operativa para contratistas · Washington State
                </div>
              </div>
            </div>
            <div className="font-mono-brand text-[12px] space-y-1.5">
              <div>
                <a href="tel:+12066406034" className="hover:text-white transition-colors">
                  📞 Llamar: +1 (206) 640-6034
                </a>
              </div>
              <div>WhatsApp · +1 206 640 6034</div>
              <div>
                <a href="mailto:alkan@alkanassistant.com" className="hover:text-white transition-colors">
                  alkan@alkanassistant.com
                </a>
              </div>
              <div style={{ color: "var(--blue-bright)" }}>Esquema 1099 · W-8BEN disponible</div>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="https://www.instagram.com/alkanassistant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full inline-flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Instagram size={16} color="#fff" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61580183279631"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full inline-flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Facebook size={16} color="#fff" />
                </a>
                <a
                  href="mailto:alkan@alkanassistant.com"
                  aria-label="Email"
                  className="w-9 h-9 rounded-full inline-flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Mail size={16} color="#fff" />
                </a>
              </div>
            </div>
          </div>
          <div
            className="mt-10 pt-6 text-[12px] font-mono-brand"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: "#6e7596" }}
          >
            © 2026 Alkan Assistant · All rights reserved
          </div>
        </div>
      </footer>

      <SalesBot />
    </main>
  );
}
