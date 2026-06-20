import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { enrichLead, bulkEnrichLeads } from "@/lib/enrich.functions";
import { triggerHunt } from "@/lib/hunt.functions";
import {
  Crosshair,
  LogOut,
  Plus,
  Search,
  Zap,
  Pencil,
  Trash2,
  X,
  Upload,
  Download,
  Target,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/hunter")({
  component: HunterPage,
  head: () => ({
    meta: [{ title: "Alkan Lead Hunter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
});

type Lead = {
  id: string;
  client_id: string | null;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  source: string | null;
  notes: string | null;
  permit_number: string | null;
  jurisdiction: string | null;
  permit_score: number | null;
  golden_lead: boolean | null;
  last_contacted: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
const JURISDICTIONS = [
  "Seattle SDCI",
  "King County",
  "Pierce County",
  "Snohomish County",
  "Tacoma",
  "Bellevue",
  "Other",
];
const ENTITY_RX =
  /\b(LLC|L\.L\.C\.|Inc\.?|Corp\.?|Ltd\.?|PLLC|LP|LLP|Holdings|Group|Properties|Realty|Trust)\b/i;

function HunterPage() {
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      if (s?.user) {
        setSession({ userId: s.user.id, email: s.user.email ?? "" });
      } else {
        setSession(null);
        setClientId(null);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSession({ userId: data.session.user.id, email: data.session.user.email ?? "" });
      }
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase
      .rpc("get_my_client_id")
      .then(({ data }) => setClientId((data as string | null) ?? null));
  }, [session]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-slate-400">
        Cargando…
      </div>
    );
  }

  if (!session) return <LoginScreen />;
  return <Dashboard email={session.email} clientId={clientId} />;
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-[#1a1d27] border border-white/5 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#4f8ef7]/15 border border-[#4f8ef7]/30 flex items-center justify-center">
            <Crosshair className="w-6 h-6 text-[#4f8ef7]" />
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold tracking-tight">Alkan Lead Hunter</h1>
            <p className="text-xs text-slate-500">Permit intelligence · WA</p>
          </div>
        </div>
        <label className="text-xs text-slate-400 uppercase tracking-wider">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 mb-4 w-full bg-[#0f1117] border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4f8ef7]"
        />
        <label className="text-xs text-slate-400 uppercase tracking-wider">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 mb-6 w-full bg-[#0f1117] border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4f8ef7]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4f8ef7] hover:bg-[#3b7ce6] text-white text-sm font-medium rounded-md py-2.5 transition disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ email, clientId }: { email: string; clientId: string | null }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jurFilter, setJurFilter] = useState("");
  const [goldenOnly, setGoldenOnly] = useState(false);
  const [scoreFilter, setScoreFilter] = useState<"" | "high" | "mid" | "low">("");
  const [dateFilter, setDateFilter] = useState<"" | "today" | "7d" | "30d">("");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [huntBusy, setHuntBusy] = useState(false);
  const [importBusy, setImportBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const enrichFn = useServerFn(enrichLead);
  const bulkFn = useServerFn(bulkEnrichLeads);
  const huntFn = useServerFn(triggerHunt);
  const loadedFor = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select(
        "id,client_id,name,company,email,phone,status,source,notes,permit_number,jurisdiction,permit_score,golden_lead,last_contacted,created_at",
      )
      .order("golden_lead", { ascending: false })
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setLeads((data as Lead[]) ?? []);
  }, []);

  useEffect(() => {
    if (clientId && loadedFor.current !== clientId) {
      loadedFor.current = clientId;
      void load();
    }
    if (!clientId) loadedFor.current = null;
  }, [clientId, load]);

  // Realtime: refresh on any insert/update/delete to leads
  useEffect(() => {
    if (!clientId) return;
    const channel = supabase
      .channel("leads-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => {
          void load();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [clientId, load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = Date.now();
    const dayMs = 86_400_000;
    return leads.filter((l) => {
      if (statusFilter && (l.status ?? "new") !== statusFilter) return false;
      if (jurFilter && (l.jurisdiction ?? "") !== jurFilter) return false;
      if (goldenOnly && !(l.golden_lead || (l.permit_score ?? 0) >= 70)) return false;
      if (scoreFilter) {
        const s = l.permit_score ?? -1;
        if (scoreFilter === "high" && s < 70) return false;
        if (scoreFilter === "mid" && (s < 40 || s >= 70)) return false;
        if (scoreFilter === "low" && (s < 0 || s >= 40)) return false;
      }
      if (dateFilter) {
        const age = now - new Date(l.created_at).getTime();
        const max = dateFilter === "today" ? dayMs : dateFilter === "7d" ? 7 * dayMs : 30 * dayMs;
        if (age > max) return false;
      }
      if (!q) return true;
      return [l.name, l.company, l.phone, l.email, l.permit_number, l.notes]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [leads, search, statusFilter, jurFilter, goldenOnly, scoreFilter, dateFilter]);

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const allFilteredSelected = filtered.length > 0 && filtered.every((l) => selected.has(l.id));
  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((l) => next.delete(l.id));
      else filtered.forEach((l) => next.add(l.id));
      return next;
    });
  };

  const onExportCsv = () => {
    const rows = selected.size > 0 ? leads.filter((l) => selected.has(l.id)) : filtered;
    if (rows.length === 0) {
      toast.error("Nada para exportar");
      return;
    }
    const cols = [
      "name",
      "company",
      "email",
      "phone",
      "status",
      "source",
      "permit_number",
      "jurisdiction",
      "permit_score",
      "golden_lead",
      "last_contacted",
      "notes",
      "created_at",
    ] as const;
    const esc = (v: unknown) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      cols.join(","),
      ...rows.map((r) =>
        cols.map((c) => esc((r as unknown as Record<string, unknown>)[c])).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exportados ${rows.length} leads`);
  };

  const stats = useMemo(() => {
    const by = (s: string) => leads.filter((l) => (l.status ?? "new") === s).length;
    return {
      total: leads.length,
      new: by("new"),
      contacted: by("contacted"),
      qualified: by("qualified"),
      won: by("won"),
      golden: leads.filter((l) => l.golden_lead || (l.permit_score ?? 0) >= 70).length,
    };
  }, [leads]);

  const onEnrich = async (lead: Lead) => {
    if (!lead.permit_number || !lead.jurisdiction) {
      toast.error("Falta permit_number o jurisdiction");
      return;
    }
    setEnrichingId(lead.id);
    try {
      await enrichFn({
        data: {
          leadId: lead.id,
          permit_number: lead.permit_number,
          jurisdiction: lead.jurisdiction,
        },
      });
      toast.success("Lead enriquecido");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setEnrichingId(null);
    }
  };

  const onBulk = async () => {
    setBulkBusy(true);
    try {
      const res = await bulkFn({});
      toast.success(`Enriquecidos: ${res.updated}`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBulkBusy(false);
    }
  };

  const onHuntNow = async () => {
    setHuntBusy(true);
    const t = toast.loading("Cazando permisos…");
    try {
      const res = await huntFn({});
      toast.success(
        `Cacería completa: ${res.upserted} leads, ${res.enriched} enriquecidos, ${res.golden} 🏆`,
        { id: t },
      );
      if (res.errors.length) {
        console.warn("[hunt] errores", res.errors);
        toast.warning(res.errors[0], { duration: 9000 });
      }
      await load();
    } catch (e) {
      toast.error((e as Error).message, { id: t });
    } finally {
      setHuntBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("¿Borrar este lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Borrado");
    await load();
  };

  const onImportCsv = async (file: File) => {
    if (!clientId) return;
    setImportBusy(true);
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length === 0) {
        toast.error("CSV vacío");
        return;
      }
      const header = rows[0].map((h) => h.trim().toLowerCase());
      const required = ["name"];
      if (!required.every((r) => header.includes(r))) {
        toast.error("CSV debe tener columna 'name'");
        return;
      }
      const allowed = new Set([
        "name",
        "company",
        "email",
        "phone",
        "city",
        "state",
        "industry",
        "notes",
        "source",
        "permit_number",
        "jurisdiction",
        "permit_score",
        "status",
      ]);
      const payload = rows
        .slice(1)
        .filter((r) => r.some((c) => c.trim() !== ""))
        .map((r) => {
          const obj: Record<string, unknown> = { client_id: clientId };
          header.forEach((h, i) => {
            if (!allowed.has(h)) return;
            const val = (r[i] ?? "").trim();
            if (val === "") return;
            if (h === "permit_score") {
              const n = parseInt(val, 10);
              if (!isNaN(n)) obj[h] = n;
            } else {
              obj[h] = val;
            }
          });
          if (typeof obj.permit_score === "number" && obj.permit_score >= 70) {
            obj.golden_lead = true;
          }
          return obj;
        })
        .filter((o) => typeof o.name === "string");

      if (payload.length === 0) {
        toast.error("Sin filas válidas");
        return;
      }

      const { error } = await supabase.from("leads").insert(payload as never);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(`Importados ${payload.length} leads`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setImportBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!clientId) {
    return (
      <div className="min-h-screen bg-[#0f1117] text-slate-200">
        <TopBar email={email} />
        <div className="max-w-2xl mx-auto mt-20 bg-[#1a1d27] border border-white/5 rounded-xl p-8 text-center">
          <Crosshair className="w-10 h-10 text-[#4f8ef7] mx-auto mb-4" />
          <h2 className="text-white text-lg font-semibold mb-2">Cuenta sin client_id asignado</h2>
          <p className="text-sm text-slate-400">
            Pide a un administrador que te asigne un{" "}
            <code className="text-[#4f8ef7]">client_id</code> en la tabla{" "}
            <code className="text-[#4f8ef7]">client_profiles</code> para empezar a ver tus leads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-200">
      <TopBar email={email} />

      {/* Stats */}
      <div className="max-w-[1400px] mx-auto px-6 pt-6 grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="New" value={stats.new} tone="blue" />
        <Stat label="Contacted" value={stats.contacted} />
        <Stat label="Qualified" value={stats.qualified} />
        <Stat label="Won" value={stats.won} tone="green" />
        <Stat label="🏆 Golden" value={stats.golden} tone="gold" />
      </div>

      {/* Toolbar */}
      <div className="max-w-[1400px] mx-auto px-6 mt-5 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre, empresa, permiso…"
            className="w-full bg-[#1a1d27] border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#4f8ef7]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1d27] border border-white/10 rounded-md px-3 py-2 text-sm text-white"
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={jurFilter}
          onChange={(e) => setJurFilter(e.target.value)}
          className="bg-[#1a1d27] border border-white/10 rounded-md px-3 py-2 text-sm text-white"
        >
          <option value="">Todas las jurisdicciones</option>
          {JURISDICTIONS.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
        <select
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value as "" | "high" | "mid" | "low")}
          className="bg-[#1a1d27] border border-white/10 rounded-md px-3 py-2 text-sm text-white"
          title="Filtrar por rango de score"
        >
          <option value="">Cualquier score</option>
          <option value="high">🏆 Alto (≥70)</option>
          <option value="mid">Medio (40–69)</option>
          <option value="low">Bajo (&lt;40)</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as "" | "today" | "7d" | "30d")}
          className="bg-[#1a1d27] border border-white/10 rounded-md px-3 py-2 text-sm text-white"
          title="Filtrar por fecha de creación"
        >
          <option value="">Cualquier fecha</option>
          <option value="today">Hoy</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
        </select>
        <button
          onClick={() => setGoldenOnly((v) => !v)}
          className={`text-sm rounded-md px-3 py-2 border flex items-center gap-1.5 transition ${
            goldenOnly
              ? "bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]"
              : "bg-[#1a1d27] border-white/10 text-slate-300 hover:border-white/30"
          }`}
          title="Mostrar solo golden leads"
        >
          🏆 Solo golden
        </button>
        <button
          onClick={onBulk}
          disabled={bulkBusy}
          className="bg-[#1a1d27] border border-[#4f8ef7]/40 hover:border-[#4f8ef7] text-[#4f8ef7] text-sm rounded-md px-3 py-2 flex items-center gap-1.5 disabled:opacity-50"
        >
          <Zap className="w-4 h-4" /> {bulkBusy ? "Enriqueciendo…" : "Bulk enrich"}
        </button>
        <button
          onClick={onHuntNow}
          disabled={huntBusy}
          className="bg-[#22c55e]/15 border border-[#22c55e]/40 hover:border-[#22c55e] text-[#22c55e] text-sm rounded-md px-3 py-2 flex items-center gap-1.5 disabled:opacity-50 font-medium"
          title="Ejecuta /hunt + /enrich al instante"
        >
          <Target className="w-4 h-4" /> {huntBusy ? "Cazando…" : "Cazar Ahora"}
        </button>
        <button
          onClick={onExportCsv}
          className="bg-[#1a1d27] border border-emerald-500/40 hover:border-emerald-500 text-emerald-400 text-sm rounded-md px-3 py-2 flex items-center gap-1.5"
          title="Exporta los seleccionados, o el filtro actual si no hay selección"
        >
          <Download className="w-4 h-4" />
          Exportar CSV{selected.size > 0 ? ` (${selected.size})` : ""}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importBusy}
          className="bg-[#1a1d27] border border-white/10 hover:border-white/30 text-slate-300 text-sm rounded-md px-3 py-2 flex items-center gap-1.5 disabled:opacity-50"
          title="CSV con columnas: name (req), company, email, phone, city, state, industry, notes, source, permit_number, jurisdiction, permit_score, status"
        >
          <Upload className="w-4 h-4" /> {importBusy ? "Importando…" : "Importar CSV"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onImportCsv(f);
          }}
        />
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-[#4f8ef7] hover:bg-[#3b7ce6] text-white text-sm rounded-md px-3 py-2 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Nuevo lead
        </button>
      </div>

      {/* Table */}
      <div className="max-w-[1400px] mx-auto px-6 mt-4 pb-12">
        <div className="bg-[#1a1d27] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0f1117] text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAllFiltered}
                      className="accent-[#4f8ef7]"
                      aria-label="Seleccionar todos"
                    />
                  </th>
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Empresa</th>
                  <th className="text-left px-4 py-3">Teléfono</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-left px-4 py-3">Score</th>
                  <th className="text-left px-4 py-3">Permiso</th>
                  <th className="text-left px-4 py-3">Jurisdicción</th>
                  <th className="text-left px-4 py-3">Fuente</th>
                  <th className="text-left px-4 py-3">Fecha</th>
                  <th className="text-right px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-slate-500">
                      Cargando leads…
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-slate-500">
                      Sin leads. Agrega uno con el botón "Nuevo lead".
                    </td>
                  </tr>
                )}
                {filtered.map((l) => {
                  const golden = l.golden_lead || (l.permit_score ?? 0) >= 70;
                  const isEntity =
                    (l.company && ENTITY_RX.test(l.company)) || ENTITY_RX.test(l.name);
                  return (
                    <tr
                      key={l.id}
                      className={`border-t border-white/5 hover:bg-white/[0.02] ${
                        golden ? "border-l-4 border-l-[#22c55e]" : ""
                      }`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(l.id)}
                          onChange={() => toggleOne(l.id)}
                          className="accent-[#4f8ef7]"
                          aria-label={`Seleccionar ${l.name}`}
                        />
                      </td>
                      <td className="px-4 py-3 text-white">
                        <div className="flex items-center gap-2 flex-wrap">
                          {golden && <span title="Golden lead">🏆</span>}
                          <span>{l.name}</span>
                          {isEntity && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                              🏢 EMPRESA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{l.company ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-300">{l.phone ?? "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={l.status ?? "new"} />
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBadge score={l.permit_score} />
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                        {l.permit_number ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{l.jurisdiction ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-400">{l.source ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {new Date(l.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {l.permit_number && (
                            <button
                              onClick={() => onEnrich(l)}
                              disabled={enrichingId === l.id}
                              title="Enriquecer"
                              className="p-1.5 rounded hover:bg-[#4f8ef7]/15 text-[#4f8ef7] disabled:opacity-50"
                            >
                              <Zap className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditing(l);
                              setShowForm(true);
                            }}
                            title="Editar"
                            className="p-1.5 rounded hover:bg-white/5 text-slate-400"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(l.id)}
                            title="Borrar"
                            className="p-1.5 rounded hover:bg-red-500/15 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <LeadForm
          initial={editing}
          clientId={clientId}
          onClose={() => setShowForm(false)}
          onSaved={async () => {
            setShowForm(false);
            await load();
          }}
        />
      )}
    </div>
  );
}

function TopBar({ email }: { email: string }) {
  return (
    <header className="border-b border-white/5 bg-[#0f1117]/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4f8ef7]/15 border border-[#4f8ef7]/30 flex items-center justify-center">
            <Crosshair className="w-4.5 h-4.5 text-[#4f8ef7]" />
          </div>
          <div className="leading-tight">
            <div className="text-white text-sm font-semibold">Alkan Lead Hunter</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">WA Permits</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block">{email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-white/5"
            title="Salir"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "blue" | "green" | "gold";
}) {
  const color =
    tone === "blue"
      ? "text-[#4f8ef7]"
      : tone === "green"
        ? "text-[#22c55e]"
        : tone === "gold"
          ? "text-yellow-400"
          : "text-white";
  return (
    <div className="bg-[#1a1d27] border border-white/5 rounded-lg px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    contacted: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    qualified: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    won: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    lost: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${map[status] ?? map.new}`}
    >
      {status}
    </span>
  );
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <span className="text-slate-600 text-xs">—</span>;
  if (score >= 70)
    return (
      <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        🏆 {score}
      </span>
    );
  if (score >= 40)
    return (
      <span className="text-[10px] px-2 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
        mid {score}
      </span>
    );
  return (
    <span className="text-[10px] px-2 py-1 rounded bg-slate-500/15 text-slate-400 border border-slate-500/30">
      low {score}
    </span>
  );
}

function LeadForm({
  initial,
  clientId,
  onClose,
  onSaved,
}: {
  initial: Lead | null;
  clientId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState({
    name: initial?.name ?? "",
    company: initial?.company ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    status: initial?.status ?? "new",
    source: initial?.source ?? "",
    permit_number: initial?.permit_number ?? "",
    jurisdiction: initial?.jurisdiction ?? "",
    notes: initial?.notes ?? "",
    golden_lead: initial?.golden_lead ?? false,
    last_contacted: initial?.last_contacted ? initial.last_contacted.slice(0, 16) : "",
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return toast.error("Nombre es obligatorio");
    setSaving(true);
    const payload = {
      name: f.name.trim(),
      company: f.company || null,
      email: f.email || null,
      phone: f.phone || null,
      status: f.status,
      source: f.source || null,
      permit_number: f.permit_number || null,
      jurisdiction: f.jurisdiction || null,
      notes: f.notes || null,
      golden_lead: f.golden_lead,
      last_contacted: f.last_contacted ? new Date(f.last_contacted).toISOString() : null,
      client_id: clientId,
    };
    const { error } = initial
      ? await supabase.from("leads").update(payload).eq("id", initial.id)
      : await supabase.from("leads").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Lead actualizado" : "Lead creado");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <form
        onSubmit={save}
        className="w-full max-w-md bg-[#1a1d27] border-l border-white/10 overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">{initial ? "Editar lead" : "Nuevo lead"}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <FormField label="Nombre *">
          <input
            required
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            className={inputClass}
          />
        </FormField>
        <FormField label="Empresa">
          <input
            value={f.company}
            onChange={(e) => setF({ ...f, company: e.target.value })}
            className={inputClass}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Email">
            <input
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
              className={inputClass}
            />
          </FormField>
          <FormField label="Teléfono">
            <input
              value={f.phone}
              onChange={(e) => setF({ ...f, phone: e.target.value })}
              className={inputClass}
            />
          </FormField>
        </div>
        <FormField label="Estado">
          <select
            value={f.status}
            onChange={(e) => setF({ ...f, status: e.target.value })}
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="N° permiso">
            <input
              value={f.permit_number}
              onChange={(e) => setF({ ...f, permit_number: e.target.value })}
              className={inputClass}
            />
          </FormField>
          <FormField label="Jurisdicción">
            <select
              value={f.jurisdiction}
              onChange={(e) => setF({ ...f, jurisdiction: e.target.value })}
              className={inputClass}
            >
              <option value="">—</option>
              {JURISDICTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Fuente">
          <input
            value={f.source}
            onChange={(e) => setF({ ...f, source: e.target.value })}
            className={inputClass}
          />
        </FormField>
        <FormField label="Último contacto">
          <input
            type="datetime-local"
            value={f.last_contacted}
            onChange={(e) => setF({ ...f, last_contacted: e.target.value })}
            className={inputClass}
          />
        </FormField>
        <FormField label="Notas">
          <textarea
            value={f.notes}
            onChange={(e) => setF({ ...f, notes: e.target.value })}
            rows={4}
            className={inputClass}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-slate-300 mt-2 mb-6">
          <input
            type="checkbox"
            checked={f.golden_lead}
            onChange={(e) => setF({ ...f, golden_lead: e.target.checked })}
            className="accent-[#22c55e]"
          />
          🏆 Marcar como golden lead
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#4f8ef7] hover:bg-[#3b7ce6] text-white text-sm font-medium rounded-md py-2.5 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 border border-white/10 text-slate-300 rounded-md text-sm hover:bg-white/5"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full bg-[#0f1117] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4f8ef7]";

// Minimal CSV parser: supports quoted fields, escaped quotes (""), commas, CRLF.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\n" || c === "\r") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      if (c === "\r" && text[i + 1] === "\n") i += 2;
      else i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 0);
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );
}
