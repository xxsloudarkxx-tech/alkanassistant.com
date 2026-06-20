import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/alkan-app/ui/Card";
import { Badge } from "@/components/alkan-app/ui/Badge";
import { Button } from "@/components/alkan-app/ui/Button";
import { Input } from "@/components/alkan-app/ui/Input";
import { runSeattleHunt, listLeads, extractDocument } from "@/lib/leadHunter/hunter.functions";
import { fmtMoney } from "@/lib/leadHunter/categories";

export const Route = createFileRoute("/app/_authenticated/leads")({
  component: LeadsPage,
  head: () => ({ meta: [{ title: "Lead Hunter · Alkan Platform" }] }),
});

type LeadRow = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  status: string;
  permit_number: string | null;
  jurisdiction: string | null;
  permit_score: number | null;
  golden_lead: boolean;
  source: string | null;
  enrichment_data: Record<string, unknown> | null;
  permit_data: Record<string, unknown> | null;
  created_at: string;
  email: string | null;
  phone: string | null;
};

function intentBadge(score: number | null | undefined) {
  const s = score ?? 0;
  if (s >= 75) return <Badge tone="green">Hot · {s}</Badge>;
  if (s >= 55) return <Badge tone="gold">Warm · {s}</Badge>;
  return <Badge tone="neutral">Cold · {s}</Badge>;
}

function LeadsPage() {
  const qc = useQueryClient();
  const hunt = useServerFn(runSeattleHunt);
  const list = useServerFn(listLeads);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "hot" | "golden" | "no_gc">("all");
  const [selected, setSelected] = useState<LeadRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["alkan-leads"],
    queryFn: () => list(),
  });

  const huntMut = useMutation({
    mutationFn: () => hunt(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alkan-leads"] }),
  });

  const rows = (data?.leads ?? []) as LeadRow[];
  const filtered = useMemo(() => {
    let r = rows;
    if (filter === "hot") r = r.filter((l) => (l.permit_score ?? 0) >= 75);
    if (filter === "golden") r = r.filter((l) => l.golden_lead);
    if (filter === "no_gc")
      r = r.filter((l) => (l.enrichment_data as { eb_no_gc?: boolean } | null)?.eb_no_gc === true);
    if (search.trim()) {
      const s = search.toLowerCase();
      r = r.filter(
        (l) =>
          l.name.toLowerCase().includes(s) ||
          (l.permit_number || "").toLowerCase().includes(s) ||
          (l.city || "").toLowerCase().includes(s),
      );
    }
    return r;
  }, [rows, filter, search]);

  const stats = useMemo(() => {
    const total = rows.length;
    const hot = rows.filter((l) => (l.permit_score ?? 0) >= 75).length;
    const golden = rows.filter((l) => l.golden_lead).length;
    const noGc = rows.filter(
      (l) => (l.enrichment_data as { eb_no_gc?: boolean } | null)?.eb_no_gc === true,
    ).length;
    return { total, hot, golden, noGc };
  }, [rows]);

  return (
    <div className="px-8 py-10">
      <header className="mb-6 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="alkan-eyebrow mb-1">Módulo · 01</div>
          <h1 className="alkan-h1" style={{ fontFamily: "var(--font-serif)", fontSize: 38, fontWeight: 500 }}>
            Lead Hunter
          </h1>
          <p style={{ color: "var(--ink-muted)", fontSize: 13, marginTop: 4 }}>
            Permisos pre-GC del Puget Sound. Scoring invertido: cuanto más temprano, mejor.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.invalidate()}
            disabled={isLoading || huntMut.isPending}
          >
            Recargar
          </Button>
          <Button onClick={() => huntMut.mutate()} loading={huntMut.isPending}>
            Cazar Seattle DCI
          </Button>
        </div>
      </header>

      {huntMut.data && (
        <div
          style={{
            background: "var(--green-bg)",
            border: "1px solid var(--green)",
            color: "var(--green-text)",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          ✓ {huntMut.data.summary} — {huntMut.data.upserted} guardados.
        </div>
      )}
      {huntMut.error && (
        <div
          style={{
            background: "var(--red-bg)",
            border: "1px solid var(--red)",
            color: "var(--red-text)",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          ✗ {(huntMut.error as Error).message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-6">
        <KpiCard label="Total" value={stats.total} accent="alkan" />
        <KpiCard label="Hot (≥75)" value={stats.hot} accent="green" />
        <KpiCard label="Golden" value={stats.golden} accent="gold" />
        <KpiCard label="Sin GC" value={stats.noGc} accent="amber" />
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>Todos</FilterPill>
        <FilterPill active={filter === "hot"} onClick={() => setFilter("hot")}>Hot</FilterPill>
        <FilterPill active={filter === "golden"} onClick={() => setFilter("golden")}>Golden</FilterPill>
        <FilterPill active={filter === "no_gc"} onClick={() => setFilter("no_gc")}>Sin GC</FilterPill>
        <div className="ml-auto w-72">
          <Input
            placeholder="Buscar por nombre, permiso, ciudad…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card accent="none">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--surface-warm)", borderBottom: "1px solid var(--border)" }}>
                <Th>Score</Th>
                <Th>Proyecto</Th>
                <Th>Categoría</Th>
                <Th>Stage</Th>
                <Th>Ciudad</Th>
                <Th>Permit #</Th>
                <Th>Valor</Th>
                <Th>GC</Th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: "var(--ink-muted)" }}>Cargando…</td></tr>
              )}
              {error && (
                <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: "var(--red-text)" }}>{(error as Error).message}</td></tr>
              )}
              {!isLoading && !error && filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: "var(--ink-muted)" }}>
                  Sin leads aún. Haz clic en <strong>Cazar Seattle DCI</strong> para traer permisos.
                </td></tr>
              )}
              {filtered.map((l) => {
                const enr = (l.enrichment_data ?? {}) as Record<string, unknown>;
                const noGc = enr.eb_no_gc === true;
                const value = enr.valuation as number | null | undefined;
                return (
                  <tr
                    key={l.id}
                    onClick={() => setSelected(l)}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer",
                      background: l.golden_lead ? "var(--gold-pale)" : "transparent",
                    }}
                  >
                    <Td>{intentBadge(l.permit_score)}</Td>
                    <Td>
                      <div style={{ fontWeight: 500 }}>{l.name}</div>
                      {l.golden_lead && (
                        <div style={{ marginTop: 2 }}>
                          <Badge tone="gold">Golden</Badge>
                        </div>
                      )}
                    </Td>
                    <Td>{(enr.eb_category_label as string) ?? "—"}</Td>
                    <Td><code style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{(enr.eb_stage as string) ?? "—"}</code></Td>
                    <Td>{l.city ?? "—"}</Td>
                    <Td><code style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{l.permit_number ?? "—"}</code></Td>
                    <Td>{fmtMoney(value ?? null)}</Td>
                    <Td>{noGc ? <Badge tone="green">Sin GC</Badge> : <Badge tone="neutral">Asignado</Badge>}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <LeadDrawer lead={selected} onClose={() => setSelected(null)} extract={extractDocument} />
      )}
    </div>
  );
}

function KpiCard({ label, value, accent }: { label: string; value: number; accent: "gold" | "green" | "alkan" | "amber" }) {
  const color =
    accent === "gold" ? "var(--gold)" :
    accent === "green" ? "var(--green)" :
    accent === "amber" ? "var(--amber)" : "var(--alkan2)";
  return (
    <Card accent="none" style={{ borderTop: `3px solid ${color}` }}>
      <CardBody style={{ padding: "14px 18px" }}>
        <div className="alkan-eyebrow" style={{ color }}>{label}</div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, lineHeight: 1.1, marginTop: 4 }}>
          {value}
        </div>
      </CardBody>
    </Card>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: "6px 12px",
        borderRadius: 6,
        border: `1px solid ${active ? "var(--ink)" : "var(--border-strong)"}`,
        background: active ? "var(--ink)" : "var(--surface-card)",
        color: active ? "var(--surface)" : "var(--ink-soft)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{
      textAlign: "left",
      padding: "10px 14px",
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--ink-muted)",
    }}>{children}</th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px 14px", verticalAlign: "top" }}>{children}</td>;
}

// ──────────────────────────────────────────────────────────────
// Drawer + EDMS upload
// ──────────────────────────────────────────────────────────────

function LeadDrawer({
  lead,
  onClose,
  extract,
}: {
  lead: LeadRow;
  onClose: () => void;
  extract: typeof extractDocument;
}) {
  const qc = useQueryClient();
  const extractFn = useServerFn(extract);
  const [pasteText, setPasteText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const enr = (lead.enrichment_data ?? {}) as Record<string, unknown>;
  const permitData = (lead.permit_data ?? {}) as Record<string, unknown>;
  const reasons = (enr.eb_reasons as string[]) ?? [];
  const why = (enr.eb_why as string[]) ?? [];
  const edms = enr.edms as Record<string, unknown> | undefined;

  const edmsMut = useMutation({
    mutationFn: async () => {
      const payload: { leadId: string; pasteText?: string; fileB64?: string; fileMedia?: string } = {
        leadId: lead.id,
      };
      if (file) {
        const buf = await file.arrayBuffer();
        let bin = "";
        const bytes = new Uint8Array(buf);
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        payload.fileB64 = btoa(bin);
        payload.fileMedia = file.type || "application/pdf";
      } else if (pasteText.trim()) {
        payload.pasteText = pasteText;
      } else {
        throw new Error("Sube un PDF/imagen o pega texto del permiso");
      }
      return extractFn({ data: payload });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alkan-leads"] }),
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,13,11,0.45)",
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 100%)",
          height: "100vh",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          overflowY: "auto",
          padding: "28px 28px 60px",
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="alkan-eyebrow">{(enr.eb_category_label as string) ?? "Lead"}</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginTop: 4 }}>{lead.name}</h2>
            <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 4 }}>
              {lead.city ?? ""} {lead.state ?? ""} · {lead.permit_number ?? "sin permit #"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink-muted)" }}
          >
            ×
          </button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {intentBadge(lead.permit_score)}
          {lead.golden_lead && <Badge tone="gold">Golden</Badge>}
          {enr.eb_no_gc === true && <Badge tone="green">Sin GC</Badge>}
          <Badge tone="alkan">{(enr.eb_stage as string) ?? "—"}</Badge>
        </div>

        {why.length > 0 && (
          <Card accent="green" className="mb-4">
            <CardHeader>
              <CardTitle>Por qué importa</CardTitle>
            </CardHeader>
            <CardBody>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: "var(--ink-soft)" }}>
                {why.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </CardBody>
          </Card>
        )}

        <Card accent="alkan" className="mb-4">
          <CardHeader><CardTitle>Datos del permiso</CardTitle></CardHeader>
          <CardBody>
            <DataRow k="Dirección" v={(permitData.address as string) || "—"} />
            <DataRow k="Valor estimado" v={fmtMoney((enr.valuation as number) ?? null)} />
            <DataRow k="Unidades" v={String((enr.eb_unit_count as number) ?? "—")} />
            <DataRow k="Contratista" v={(permitData.contractor_name as string) || "— No GC of Record"} />
            <DataRow k="Owner" v={(enr.owner_name as string) || lead.name} />
            <DataRow k="Email" v={(enr.owner_email as string) || lead.email || "—"} />
            <DataRow k="Teléfono" v={(enr.owner_phone as string) || lead.phone || "—"} />
            {(permitData.url as string) && (
              <DataRow
                k="Permit URL"
                v={
                  <a href={permitData.url as string} target="_blank" rel="noreferrer" style={{ color: "var(--alkan2)" }}>
                    Abrir en Accela ↗
                  </a>
                }
              />
            )}
          </CardBody>
        </Card>

        {reasons.length > 0 && (
          <Card accent="none" className="mb-4">
            <CardHeader><CardTitle>Desglose del score</CardTitle></CardHeader>
            <CardBody>
              <ul style={{
                margin: 0, paddingLeft: 0, listStyle: "none",
                fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.7, color: "var(--ink-soft)",
              }}>
                {reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </CardBody>
          </Card>
        )}

        <Card accent="gold">
          <CardHeader><CardTitle>EDMS · extraer del documento</CardTitle></CardHeader>
          <CardBody>
            <p style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 12 }}>
              Sube el PDF/imagen del permiso firmado (o pega el texto). El modelo extrae
              owner, architect, GC y valida si ya tiene contratista asignado.
            </p>

            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ fontSize: 12, marginBottom: 10, width: "100%" }}
            />
            <textarea
              placeholder="…o pega el texto del documento aquí"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: 10,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                border: "1px solid var(--border-strong)",
                borderRadius: 6,
                background: "var(--surface-card)",
                marginBottom: 10,
              }}
            />
            <Button onClick={() => edmsMut.mutate()} loading={edmsMut.isPending} size="sm">
              Extraer con IA
            </Button>

            {edmsMut.error && (
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--red-text)" }}>
                ✗ {(edmsMut.error as Error).message}
              </div>
            )}
            {(edmsMut.data || edms) && (
              <div style={{ marginTop: 14, padding: 12, background: "var(--surface-warm)", borderRadius: 6, fontSize: 12 }}>
                <div className="alkan-eyebrow mb-2">Resultado EDMS</div>
                <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "var(--font-mono)", fontSize: 11 }}>
                  {JSON.stringify(edmsMut.data ?? edms, null, 2)}
                </pre>
              </div>
            )}
          </CardBody>
        </Card>
      </aside>
    </div>
  );
}

function DataRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0", borderBottom: "1px dashed var(--border)", fontSize: 13 }}>
      <span style={{ color: "var(--ink-muted)", fontSize: 11, textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>{k}</span>
      <span style={{ color: "var(--ink)", textAlign: "right" }}>{v}</span>
    </div>
  );
}