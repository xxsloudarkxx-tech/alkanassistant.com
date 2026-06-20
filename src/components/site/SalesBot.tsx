import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

const STORAGE_KEY = "alkan_salesbot_v1";

const SUGGESTIONS = [
  "¿Qué leads tienes esta semana?",
  "¿Cómo funciona el pago?",
  "Quiero el lead de Excavation en Tacoma",
  "¿Cuál paquete me conviene?",
];

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function renderText(m: UIMessage) {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

export function SalesBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [initial] = useState<UIMessage[]>(() => loadMessages());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: "alkan-salesbot",
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* quota */
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status, open]);

  // Focus on open / after send / after stream end
  useEffect(() => {
    if (open && status !== "streaming") inputRef.current?.focus();
  }, [open, status]);

  const isBusy = status === "submitted" || status === "streaming";

  function submit() {
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    void sendMessage({ text });
  }

  function reset() {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir chat con Alkan"
          className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition hover:scale-105"
          style={{
            background: "var(--blue)",
            color: "#fff",
            boxShadow: "0 14px 36px -10px rgba(42,79,130,0.55)",
          }}
        >
          <MessageCircle size={26} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ background: "#1a8e54" }} />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className="fixed z-[60] flex flex-col rounded-2xl overflow-hidden border bottom-5 right-5 w-[min(380px,calc(100vw-2.5rem))] h-[min(620px,calc(100vh-2.5rem))]"
          style={{
            background: "var(--bg)",
            borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)",
            boxShadow: "0 30px 80px -20px rgba(15,31,61,0.45)",
          }}
        >
          {/* Header */}
          <header
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{
              background: "var(--ink)",
              borderColor: "color-mix(in oklab, var(--ink) 80%, transparent)",
              color: "#fff",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-display text-[15px] font-bold"
              style={{ background: "var(--blue)", color: "#fff" }}
            >
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[14px] leading-tight">Alkan · Asistente 24/7</div>
              <div className="flex items-center gap-1.5 text-[11px] opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                En línea · responde al instante
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </header>

          {/* Transcript */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style={{ background: "var(--bg-2)" }}
          >
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="text-[13.5px] leading-relaxed" style={{ color: "var(--ink)" }}>
                  Hola 👋 Soy <strong>Alkan</strong>, tu asistente para contratistas en Washington.
                  Puedo mostrarte los leads activos esta semana, explicarte cómo pagar y agendar la
                  entrega de contactos por WhatsApp.
                </div>
                <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--ink-soft)" }}>
                  Pregúntame algo
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setInput("");
                        void sendMessage({ text: s });
                      }}
                      className="text-[12px] px-2.5 py-1.5 rounded-full border transition hover:bg-white"
                      style={{
                        borderColor: "color-mix(in oklab, var(--ink) 14%, transparent)",
                        color: "var(--ink)",
                        background: "#fff",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = renderText(m);
              const captured = m.parts.some(
                (p) => p.type === "tool-capture_lead" && (p as any).state === "output-available",
              );
              if (m.role === "user") {
                return (
                  <div key={m.id} className="flex justify-end">
                    <div
                      className="max-w-[80%] rounded-2xl rounded-br-md px-3.5 py-2 text-[13.5px] leading-relaxed"
                      style={{ background: "var(--blue)", color: "#fff" }}
                    >
                      {text}
                    </div>
                  </div>
                );
              }
              return (
                <div key={m.id} className="text-[13.5px] leading-relaxed" style={{ color: "var(--ink)" }}>
                  {text ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-strong:text-[var(--ink)] prose-a:text-[var(--blue)]">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  ) : null}
                  {captured && (
                    <div
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md"
                      style={{
                        background: "color-mix(in oklab, var(--green-brand) 14%, transparent)",
                        color: "var(--green-brand)",
                      }}
                    >
                      ✓ Tus datos quedaron registrados
                    </div>
                  )}
                </div>
              );
            })}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-[12.5px]" style={{ color: "var(--ink-soft)" }}>
                <Loader2 size={14} className="animate-spin" /> Pensando...
              </div>
            )}

            {error && (
              <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(239,68,68,0.1)", color: "#b91c1c" }}>
                Hubo un problema. Intenta de nuevo o escríbeme por WhatsApp.
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="border-t px-3 py-3 flex items-end gap-2"
            style={{
              background: "var(--bg)",
              borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Pregunta sobre leads, paquetes, pagos..."
              rows={1}
              className="flex-1 resize-none rounded-lg px-3 py-2 text-[13.5px] outline-none focus:ring-2 max-h-32"
              style={{
                background: "var(--bg-2)",
                color: "var(--ink)",
                border: "1px solid color-mix(in oklab, var(--ink) 12%, transparent)",
              }}
            />
            <button
              type="submit"
              disabled={isBusy || !input.trim()}
              aria-label="Enviar"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition disabled:opacity-40"
              style={{ background: "var(--blue)" }}
            >
              {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
          <div className="flex items-center justify-between text-[10.5px] px-3 py-2 border-t"
            style={{ color: "var(--ink-soft)", borderColor: "color-mix(in oklab, var(--ink) 8%, transparent)", background: "var(--bg)" }}>
            <span>Powered by Lovable AI</span>
            <button type="button" onClick={reset} className="hover:underline">Nueva conversación</button>
          </div>
        </div>
      )}
    </>
  );
}
