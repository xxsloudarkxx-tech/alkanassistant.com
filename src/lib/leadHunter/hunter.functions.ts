import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { matchCategory, extractUnitCount, classifyStage, isExcluded } from "./classify";
import { scoreLead, type ScoredLead } from "./score";
import type { Database } from "@/integrations/supabase/types";

const CLIENT_ID = "alkan";

// ──────────────────────────────────────────────────────────────
// scrapeSeattleDCI — server-side, sin cadena de proxies (Worker
// no necesita CORS). Preserva nombres de campo smashed-lowercase
// del dataset 76t5-zqzr y el mapeo exacto del lead.
// ──────────────────────────────────────────────────────────────

type SocrataRow = {
  permitnum?: string;
  permitclass?: string;
  permitclassmapped?: string;
  permittypemapped?: string;
  permittypedesc?: string;
  description?: string;
  housingunits?: string;
  housingunitsadded?: string;
  estprojectcost?: string;
  applieddate?: string;
  issueddate?: string;
  statuscurrent?: string;
  originaladdress1?: string;
  originalcity?: string;
  originalzip?: string;
  contractorcompanyname?: string;
  link?: { url?: string };
};

async function scrapeSeattleDCI(): Promise<{ leads: ScoredLead[]; summary: string }> {
  const out: ScoredLead[] = [];
  let rawCount = 0;
  let categoryMatches = 0;
  let exclusionDrops = 0;

  const cutoff = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const url =
    `https://data.seattle.gov/resource/76t5-zqzr.json?$where=applieddate>'${cutoff}T00:00:00'&$limit=200`;

  let rows: SocrataRow[];
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) {
      return { leads: [], summary: `Seattle DCI: ❌ HTTP ${r.status}` };
    }
    const j = (await r.json()) as SocrataRow[] | { message?: string };
    if (!Array.isArray(j)) {
      return { leads: [], summary: `Seattle DCI: ❌ ${(j as { message?: string }).message || "non-array"}` };
    }
    rows = j;
  } catch (e) {
    return { leads: [], summary: `Seattle DCI: ❌ ${(e as Error).message}` };
  }

  rawCount = rows.length;

  for (const p of rows) {
    const desc = p.description || "";
    const fullText = [
      desc,
      p.permittypedesc || "",
      p.permittypemapped || "",
      p.permitclass || "",
      p.permitclassmapped || "",
    ].join(" ");

    const category = matchCategory(fullText);
    if (!category) continue;
    categoryMatches++;
    if (isExcluded(fullText)) { exclusionDrops++; continue; }

    const unitCount =
      (p.housingunitsadded ? parseInt(p.housingunitsadded, 10) : null) ||
      (p.housingunits ? parseInt(p.housingunits, 10) : null) ||
      extractUnitCount(fullText);

    const stage = classifyStage(p.statuscurrent, p.issueddate);
    const permitUrl =
      p.link?.url ??
      `https://cosaccela.seattle.gov/Portal/Cap/CapDetail.aspx?Module=DPD&capID1=${p.permitnum || ""}`;

    const lead: ScoredLead = {
      id: "sea_" + (p.permitnum || crypto.randomUUID()),
      source: "seattle_dci",
      source_label: "Seattle DCI",
      title: `${category.label} — ${(p.originaladdress1 || "").slice(0, 60)}`,
      description: desc.slice(0, 800),
      permit_type: p.permittypedesc || p.permittypemapped,
      permit_number: p.permitnum,
      permit_status_raw: p.statuscurrent || "",
      stage,
      category,
      unit_count: unitCount,
      address: p.originaladdress1 || "",
      city: p.originalcity || "Seattle",
      zip: p.originalzip || "",
      county: "KING",
      value: parseFloat(p.estprojectcost || "0") || null,
      posted_ts: p.applieddate
        ? new Date(p.applieddate).getTime()
        : p.issueddate
          ? new Date(p.issueddate).getTime()
          : Date.now(),
      issued_date: p.issueddate,
      application_date: p.applieddate,
      url: permitUrl,
      contractor_name: p.contractorcompanyname || "",
      owner_name: "",
      owner_phone: "",
      owner_email: "",
      architect_name: "",
      owners_rep: "",
      state: "new",
      timeline: [],
      notes: "",
    };
    scoreLead(lead);
    out.push(lead);
  }

  return {
    leads: out,
    summary: `Seattle DCI: ${rawCount} fetched → ${categoryMatches} matched category → ${out.length} kept (${exclusionDrops} excluded)`,
  };
}

// ──────────────────────────────────────────────────────────────
// Server fns
// ──────────────────────────────────────────────────────────────

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export const runSeattleHunt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { leads, summary } = await scrapeSeattleDCI();
    if (leads.length === 0) return { summary, upserted: 0 };

    const rows: LeadInsert[] = leads.map((l) => ({
      client_id: CLIENT_ID,
      name: l.owner_name || l.address || l.permit_number || l.title || "Sin nombre",
      company: null,
      email: l.owner_email || null,
      phone: l.owner_phone || null,
      city: l.city || null,
      state: "WA",
      industry: l.category?.label || null,
      permit_number: l.permit_number || null,
      jurisdiction: "Seattle DCI",
      permit_score: l.score ?? 0,
      status: "new",
      source: "seattle_dci",
      golden_lead: !!l.ready_for_handoff,
      permit_data: l as never,
      enrichment_data: {
        eb_category: l.category?.code ?? null,
        eb_category_label: l.category?.label ?? null,
        eb_stage: l.stage,
        eb_unit_count: l.unit_count ?? null,
        eb_no_gc: !!l.no_gc,
        eb_excluded: !!l.is_excluded,
        eb_intent: l.intent_level,
        eb_why: l.why_relevant ?? [],
        eb_reasons: l.score_reasons ?? [],
        eb_ready_for_handoff: !!l.ready_for_handoff,
        valuation: l.value ?? null,
        url: l.url,
      } as never,
    }));

    const withPermit = rows.filter((r) => r.permit_number);
    const withoutPermit = rows.filter((r) => !r.permit_number);
    let upserted = 0;

    if (withPermit.length) {
      const { data, error } = await supabase
        .from("leads")
        .upsert(withPermit as never, { onConflict: "client_id,permit_number" })
        .select("id");
      if (error) throw new Error(`upsert: ${error.message}`);
      upserted += data?.length ?? 0;
    }
    if (withoutPermit.length) {
      const { data, error } = await supabase
        .from("leads")
        .insert(withoutPermit as never)
        .select("id");
      if (error) throw new Error(`insert: ${error.message}`);
      upserted += data?.length ?? 0;
    }

    return { summary, upserted };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, name, city, state, status, permit_number, jurisdiction, permit_score, golden_lead, source, enrichment_data, permit_data, created_at, last_contacted, email, phone",
      )
      .order("permit_score", { ascending: false, nullsFirst: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { leads: data ?? [] };
  });

// ──────────────────────────────────────────────────────────────
// EDMS — extraer datos de owner/applicant/architect/contractor
// desde un documento de permiso. Usa Lovable AI Gateway con
// google/gemini-2.5-pro (Claude no está disponible en Lovable AI).
// El EDMS_SYSTEM y el contrato JSON se preservan TAL CUAL del v14.
// ──────────────────────────────────────────────────────────────

export const EDMS_SYSTEM = `You extract contact and project data from Washington State construction permit documents (signed applications, SEPA checklists, financial-responsibility forms, plan cover sheets). Respond with ONLY a valid JSON object, no preamble, no markdown fences. Use this exact schema, with null for any field you cannot find:
{
  "owner_name": string|null,
  "owner_phone": string|null,
  "owner_email": string|null,
  "owner_mailing_address": string|null,
  "applicant_type": "owner"|"owner-builder"|"contractor"|"architect"|"agent"|null,
  "architect_name": string|null,
  "architect_firm": string|null,
  "owners_rep": string|null,
  "contractor_name": string|null,
  "has_gc_assigned": boolean,
  "project_address": string|null,
  "parcel_number": string|null,
  "project_description": string|null,
  "estimated_value": number|null,
  "confidence": "high"|"medium"|"low",
  "notes": string|null
}
has_gc_assigned is true ONLY if a licensed general contractor company is clearly named as the builder of record. An owner acting as owner-builder, or a blank contractor field, means has_gc_assigned = false. Be conservative.`;

const EdmsInput = z.object({
  leadId: z.string().uuid().optional(),
  fileB64: z.string().min(10).optional(),
  fileMedia: z.string().max(120).optional(),
  pasteText: z.string().max(50000).optional(),
});

const EdmsSchema = z.object({
  owner_name: z.string().nullable(),
  owner_phone: z.string().nullable(),
  owner_email: z.string().nullable(),
  owner_mailing_address: z.string().nullable(),
  applicant_type: z.enum(["owner", "owner-builder", "contractor", "architect", "agent"]).nullable(),
  architect_name: z.string().nullable(),
  architect_firm: z.string().nullable(),
  owners_rep: z.string().nullable(),
  contractor_name: z.string().nullable(),
  has_gc_assigned: z.boolean(),
  project_address: z.string().nullable(),
  parcel_number: z.string().nullable(),
  project_description: z.string().nullable(),
  estimated_value: z.number().nullable(),
  confidence: z.enum(["high", "medium", "low"]),
  notes: z.string().nullable(),
});

export type EdmsResult = z.infer<typeof EdmsSchema>;

export const extractDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => EdmsInput.parse(input))
  .handler(async ({ data, context }) => {
    if (!data.fileB64 && !data.pasteText) {
      throw new Error("Falta archivo o texto");
    }
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY no configurada");

    // Content parts en formato OpenAI-compatible. Lovable Gateway acepta
    // image_url con data URL; Gemini soporta PDF e imagen nativamente.
    const userContent: Array<Record<string, unknown>> = [];
    if (data.fileB64) {
      const media = data.fileMedia || "application/pdf";
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${media};base64,${data.fileB64}` },
      });
      userContent.push({
        type: "text",
        text: "Extract all owner/applicant/architect/contractor contact data and the GC status from this permit document. Return only the JSON object.",
      });
    } else {
      userContent.push({
        type: "text",
        text:
          "Extract all owner/applicant/architect/contractor contact data and the GC status from this permit document text. Return only the JSON object.\n\nDOCUMENT TEXT:\n" +
          (data.pasteText ?? ""),
      });
    }

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: EDMS_SYSTEM },
          { role: "user", content: userContent },
        ],
        temperature: 0,
      }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      if (r.status === 429) throw new Error("Lovable AI: límite de uso alcanzado");
      if (r.status === 402) throw new Error("Lovable AI: créditos agotados");
      throw new Error(`Lovable AI ${r.status}: ${txt.slice(0, 200)}`);
    }
    const j = (await r.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = j.choices?.[0]?.message?.content ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    let parsed: EdmsResult;
    try {
      parsed = EdmsSchema.parse(JSON.parse(clean));
    } catch (err) {
      throw new Error(`No pude parsear la respuesta del modelo: ${(err as Error).message}`);
    }

    // Si nos pasaron leadId, mezclamos en enrichment_data y actualizamos GC + score.
    if (data.leadId) {
      const { supabase } = context;
      const { data: row } = await supabase
        .from("leads")
        .select("enrichment_data, permit_data, permit_score, name, email, phone")
        .eq("id", data.leadId)
        .single();
      const prevEnrich =
        (row?.enrichment_data as Record<string, unknown> | null | undefined) ?? {};
      const merged = {
        ...prevEnrich,
        edms: parsed,
        owner_name: parsed.owner_name ?? prevEnrich.owner_name,
        owner_phone: parsed.owner_phone ?? prevEnrich.owner_phone,
        owner_email: parsed.owner_email ?? prevEnrich.owner_email,
        architect_name: parsed.architect_name ?? prevEnrich.architect_name,
        owners_rep: parsed.owners_rep ?? prevEnrich.owners_rep,
        eb_no_gc: !parsed.has_gc_assigned,
      };
      const update: Record<string, unknown> = {
        enrichment_data: merged,
      };
      if (parsed.owner_name && !row?.name) update.name = parsed.owner_name;
      if (parsed.owner_email) update.email = parsed.owner_email;
      if (parsed.owner_phone) update.phone = parsed.owner_phone;
      await supabase.from("leads").update(update as never).eq("id", data.leadId);
    }

    return parsed;
  });