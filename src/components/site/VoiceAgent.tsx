import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Reveal } from "@/components/Reveal";
import { voiceTurn, bookVoiceCall } from "@/lib/voice.functions";
import { Mic, MicOff, PhoneCall, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };
type Slots = {
  name: string | null;
  phone: string | null;
  email: string | null;
  service: string | null;
  city: string | null;
  urgency: string | null;
  preferred_datetime_iso: string | null;
};

const INITIAL_GREETING =
  "¡Hola! Soy Alka, el asistente de Alkan Assistant. ¿Con quién tengo el gusto?";

// Browser SpeechRecognition types
type SRConstructor = new () => SpeechRecognition;
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

function getSR(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function pickEsVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /es[-_](MX|US|419)/i.test(v.lang)) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("es")) ??
    null
  );
}

export function VoiceAgent() {
  const turn = useServerFn(voiceTurn);
  const book = useServerFn(bookVoiceCall);

  const [supported, setSupported] = useState(true);
  const [active, setActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [slots, setSlots] = useState<Slots>({
    name: null, phone: null, email: null, service: null, city: null, urgency: null, preferred_datetime_iso: null,
  });
  const [booked, setBooked] = useState<{ when: string; link: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recogRef = useRef<SpeechRecognition | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const SR = getSR();
    if (!SR || typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const load = () => { voiceRef.current = pickEsVoice(); };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback((text: string) => new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return resolve();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-MX";
    u.rate = 1.02;
    u.pitch = 1;
    if (voiceRef.current) u.voice = voiceRef.current;
    u.onstart = () => setSpeaking(true);
    u.onend = () => { setSpeaking(false); resolve(); };
    u.onerror = () => { setSpeaking(false); resolve(); };
    window.speechSynthesis.speak(u);
  }), []);

  const startListening = useCallback(() => {
    const SR = getSR();
    if (!SR) return;
    const r = new SR();
    r.lang = "es-MX";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => {
      const transcript = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript)
        .join(" ")
        .trim();
      if (transcript) handleUserText(transcript);
    };
    r.onerror = (e) => {
      if (e.error !== "no-speech" && e.error !== "aborted") setError(`Micrófono: ${e.error}`);
      setListening(false);
    };
    r.onend = () => setListening(false);
    recogRef.current = r;
    try {
      r.start();
      setListening(true);
      setError(null);
    } catch {
      setListening(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopListening = useCallback(() => {
    recogRef.current?.stop();
    setListening(false);
  }, []);

  const handleUserText = useCallback(async (text: string) => {
    setMessages((prev) => {
      const next: Msg[] = [...prev, { role: "user", content: text }];
      void runTurn(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runTurn = useCallback(async (history: Msg[]) => {
    setThinking(true);
    setError(null);
    try {
      const res = await turn({ data: { messages: history } });
      const assistantMsg: Msg = { role: "assistant", content: res.reply };
      const newHistory = [...history, assistantMsg];
      setMessages(newHistory);
      setSlots(res.state);
      setThinking(false);
      await speak(res.reply);

      if (res.ready_to_book && res.state.preferred_datetime_iso && res.state.name) {
        try {
          const r = await book({
            data: {
              name: res.state.name,
              phone: res.state.phone,
              email: res.state.email,
              service: res.state.service,
              city: res.state.city,
              urgency: res.state.urgency,
              preferred_datetime_iso: res.state.preferred_datetime_iso,
              transcript: newHistory,
            },
          });
          setBooked({ when: r.scheduledAt, link: r.eventLink });
        } catch (e) {
          setError("La llamada quedó registrada pero hubo un problema con el calendario. Erick te contactará.");
        }
      } else {
        // continue listening
        setTimeout(() => { if (active) startListening(); }, 350);
      }
    } catch (e) {
      setThinking(false);
      setError("No pude procesar tu mensaje. Intenta de nuevo.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, turn, book, speak, startListening]);

  const start = useCallback(async () => {
    setActive(true);
    setBooked(null);
    setError(null);
    const greet: Msg = { role: "assistant", content: INITIAL_GREETING };
    setMessages([greet]);
    await speak(INITIAL_GREETING);
    startListening();
  }, [speak, startListening]);

  const stop = useCallback(() => {
    setActive(false);
    stopListening();
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
  }, [stopListening]);

  useEffect(() => () => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    recogRef.current?.abort();
  }, []);

  const whenLabel = useMemo(() => {
    if (!booked) return "";
    return new Date(booked.when).toLocaleString("es-MX", {
      timeZone: "America/Los_Angeles",
      weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit",
    });
  }, [booked]);

  return (
    <section id="voice-agent" className="px-6 py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <div className="font-mono-brand text-[11px] uppercase tracking-[0.1em] mb-4 font-medium" style={{ color: "var(--blue)" }}>
            Voice Agent · 24/7 · Incluido
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}>
            Habla con{" "}
            <em className="gold-underline" style={{ color: "var(--blue)", fontStyle: "italic" }}>Alka</em>
            , nuestro asistente de voz
          </h2>
          <p className="mt-5 max-w-[680px] text-[16px]" style={{ color: "var(--ink-soft)" }}>
            Cuéntale qué necesitas. Te califica, propone un horario y agenda una llamada de 20
            minutos con Erick directo en Google Calendar — sin formularios, sin esperar.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 rounded-[24px] border bg-white p-6 md:p-10"
            style={{ borderColor: "rgba(15,31,61,0.10)", boxShadow: "0 24px 60px -30px rgba(10,16,36,0.4)" }}>

            {!supported && (
              <div className="rounded-xl p-4 text-[14px]" style={{ background: "rgba(192,57,43,0.08)", color: "#922b21" }}>
                Tu navegador no soporta voz en vivo. Usa Chrome o Safari en escritorio/móvil, o llama directo al{" "}
                <a className="underline" href="tel:+12533000000">teléfono de Alkan</a>.
              </div>
            )}

            {supported && (
              <div className="flex flex-col items-center text-center">
                <button
                  onClick={active ? stop : start}
                  disabled={thinking}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-transform hover:scale-[1.03] disabled:opacity-60"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #c0392b, #8e2a20)"
                      : "linear-gradient(135deg, var(--blue), #0a1a3d)",
                    boxShadow: active
                      ? "0 0 0 12px rgba(192,57,43,0.12), 0 18px 40px -10px rgba(192,57,43,0.5)"
                      : "0 0 0 12px rgba(15,31,61,0.08), 0 18px 40px -10px rgba(15,31,61,0.45)",
                  }}
                  aria-label={active ? "Terminar llamada" : "Iniciar llamada"}
                >
                  {active ? (
                    listening ? <Mic size={48} color="#fff" /> : speaking ? <PhoneCall size={48} color="#fff" /> : <MicOff size={48} color="#fff" />
                  ) : (
                    <PhoneCall size={48} color="#fff" />
                  )}
                  {(listening || speaking) && (
                    <span className="absolute inset-0 rounded-full animate-ping" style={{ background: active ? "rgba(192,57,43,0.25)" : "rgba(15,31,61,0.2)" }} />
                  )}
                </button>

                <div className="mt-5 font-mono-brand text-[12px] uppercase tracking-[0.12em]" style={{ color: "var(--gray-soft)" }}>
                  {!active && "Toca para hablar con Alka"}
                  {active && thinking && (<span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Pensando…</span>)}
                  {active && !thinking && speaking && "Alka está hablando…"}
                  {active && !thinking && listening && "Te escucho — habla ahora"}
                  {active && !thinking && !speaking && !listening && "Procesando…"}
                </div>

                {active && (
                  <button onClick={stop} className="mt-3 text-[13px] underline" style={{ color: "var(--ink-soft)" }}>
                    Terminar llamada
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl p-3 text-[13.5px] text-center" style={{ background: "rgba(192,57,43,0.08)", color: "#922b21" }}>
                {error}
              </div>
            )}

            {messages.length > 0 && (
              <div className="mt-8 grid md:grid-cols-[1fr_280px] gap-6">
                <div className="rounded-2xl p-5 max-h-[360px] overflow-y-auto space-y-3"
                  style={{ background: "var(--bg-2)", border: "1px solid rgba(15,31,61,0.08)" }}>
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed"
                        style={{
                          background: m.role === "user" ? "var(--blue)" : "#fff",
                          color: m.role === "user" ? "#fff" : "var(--ink)",
                          border: m.role === "user" ? "none" : "1px solid rgba(15,31,61,0.08)",
                        }}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl p-5" style={{ background: "var(--bg-2)", border: "1px solid rgba(15,31,61,0.08)" }}>
                  <div className="font-mono-brand text-[10.5px] uppercase tracking-[0.12em] mb-3" style={{ color: "var(--gray-soft)" }}>
                    Datos capturados
                  </div>
                  <dl className="space-y-2 text-[13px]" style={{ color: "var(--ink)" }}>
                    {[
                      ["Nombre", slots.name],
                      ["Servicio", slots.service],
                      ["Ciudad", slots.city],
                      ["Urgencia", slots.urgency],
                      ["Teléfono", slots.phone],
                      ["Email", slots.email],
                    ].map(([k, v]) => (
                      <div key={k as string} className="flex justify-between gap-3">
                        <dt style={{ color: "var(--ink-soft)" }}>{k}</dt>
                        <dd className="text-right">{v || <span style={{ color: "var(--gray-soft)" }}>—</span>}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {booked && (
              <div className="mt-6 rounded-2xl p-5 flex items-start gap-3"
                style={{ background: "rgba(26,142,84,0.08)", border: "1px solid rgba(26,142,84,0.25)" }}>
                <CheckCircle2 size={22} style={{ color: "#1a8e54", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="font-display text-[17px]" style={{ color: "var(--ink)" }}>
                    ¡Llamada agendada!
                  </div>
                  <div className="text-[14px] mt-1" style={{ color: "var(--ink-soft)" }}>
                    Erick te marca el <strong style={{ color: "var(--ink)" }}>{whenLabel}</strong> (hora del Pacífico).
                    {booked.link && (
                      <> · <a href={booked.link} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--blue)" }}>Ver en Google Calendar</a></>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3 justify-center text-[12px] font-mono-brand uppercase tracking-[0.1em]" style={{ color: "var(--gray-soft)" }}>
              <span className="inline-flex items-center gap-1.5"><Sparkles size={12} /> Voz natural en español</span>
              <span>·</span>
              <span>Agenda en Google Calendar</span>
              <span>·</span>
              <span>24/7 sin operador humano</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}