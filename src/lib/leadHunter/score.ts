/**
 * Fase B — Lead Hunter v14 (PEGAR TAL CUAL).
 * EL CORAZÓN. No tocar los números: cambian el ranking.
 */
import { fmtMoney, type ProjectCategory } from "./categories";
import { isExcluded, type LeadStage } from "./classify";

export const STAGE_SCORES: Record<LeadStage, number> = {
  application: 25,
  intake: 22,
  review: 18,
  correction: 12,
  pre_issuance: 10,
  issued_lt_14d: -2,
  issued_lt_30d: -8,
  issued_old: -15,
};

export const TARGET_COUNTIES = new Set(["KING", "PIERCE", "SNOHOMISH", "KITSAP"]);

export type ScoredLead = {
  id?: string;
  source?: string;
  source_label?: string;
  title?: string;
  description?: string;
  permit_type?: string;
  permit_number?: string;
  permit_status_raw?: string;
  stage?: LeadStage;
  category?: ProjectCategory | null;
  unit_count?: number | null;
  address?: string;
  city?: string;
  zip?: string;
  county?: string;
  value?: number | null;
  posted_ts?: number;
  issued_date?: string;
  application_date?: string;
  url?: string;
  contractor_name?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  architect_name?: string;
  owners_rep?: string;
  state?: string;
  timeline?: unknown[];
  notes?: string;

  // Salidas del scoring
  score?: number;
  score_reasons?: string[];
  why_relevant?: string[];
  intent_level?: "hot" | "warm" | "cold";
  is_excluded?: boolean;
  no_gc?: boolean;
  fully_enriched?: boolean;
  ready_for_handoff?: boolean;
};

export function scoreLead(lead: ScoredLead): ScoredLead {
  let score = 40;
  const reasons: string[] = [];
  const why: string[] = [];

  const text = `${lead.title || ""} ${lead.description || ""} ${lead.permit_type || ""}`.toLowerCase();

  // 0) HARD EXCLUSION
  if (isExcluded(text)) {
    lead.score = 0;
    lead.score_reasons = ["EXCLUDED: matches client exclusion list"];
    lead.why_relevant = [];
    lead.intent_level = "cold";
    lead.is_excluded = true;
    return lead;
  }

  // 1) CATEGORY MATCH
  if (lead.category) {
    score += 18;
    reasons.push(`+18 ${lead.category.label} (target category)`);
    why.push(`${lead.category.label} — target category`);
  } else {
    score -= 12;
    reasons.push("-12 no target category");
  }

  // 2) UNIT COUNT for multifamily
  if (lead.category && lead.category.code === "multifamily" && lead.unit_count) {
    if (lead.unit_count > 30) {
      score -= 25;
      reasons.push("-25 multifamily >30 units (out of scope)");
    } else if (lead.unit_count >= 5 && lead.unit_count <= 30) {
      score += 10;
      reasons.push(`+10 multifamily ${lead.unit_count} units (sweet spot)`);
      why.push(`${lead.unit_count}-unit multifamily — fits Alkan's profile exactly`);
    }
  }

  // 3) PERMIT STAGE — THE KEY INVERSION
  if (lead.stage) {
    const stageScore = STAGE_SCORES[lead.stage] || 0;
    score += stageScore;
    if (stageScore > 0) {
      reasons.push(`+${stageScore} permit stage: ${lead.stage}`);
      if (lead.stage === "application" || lead.stage === "intake") {
        why.push("pre-permit / application stage — no GC selected yet");
      } else if (lead.stage === "review") {
        why.push("under review — owner still evaluating GCs");
      }
    } else {
      reasons.push(`${stageScore} permit stage: ${lead.stage}`);
    }
  }

  // 4) GC OF RECORD
  if (!lead.contractor_name || lead.contractor_name === "" || lead.contractor_name === "— No GC of Record") {
    score += 22;
    reasons.push("+22 no GC of record");
    why.push("no general contractor of record yet");
    lead.no_gc = true;
  } else {
    if (lead.stage && lead.stage.startsWith("issued")) {
      score -= 25;
      reasons.push("-25 issued + GC already assigned");
    } else {
      score -= 8;
      reasons.push("-8 contractor named (may be preconstruction only)");
    }
  }

  // 5) OWNER ENRICHMENT
  let enrichScore = 0;
  if (lead.owner_name) { enrichScore += 4; reasons.push("+4 owner name"); }
  if (lead.owner_phone || lead.owner_email) { enrichScore += 8; reasons.push("+8 owner contact"); }
  if (lead.architect_name) { enrichScore += 4; reasons.push("+4 architect named"); }
  if (lead.owners_rep) { enrichScore += 3; reasons.push("+3 owner's rep"); }
  score += enrichScore;
  if (enrichScore >= 12) {
    why.push("owner / architect contact verified — ready to reach out");
    lead.fully_enriched = true;
  } else if (enrichScore >= 4) {
    why.push("partial enrichment — needs follow-up");
  }

  // 6) PROJECT VALUE
  if (lead.value) {
    if (lead.category && lead.category.sweet_spot) {
      const [min, max] = lead.category.sweet_spot;
      if (lead.value >= min && lead.value <= max) {
        score += 10;
        reasons.push("+10 value in sweet spot");
        why.push(`${fmtMoney(lead.value)} — Alkan's sweet spot`);
      } else if (lead.value < min * 0.5) {
        score -= 8;
        reasons.push("-8 value below threshold");
      } else if (lead.value > max * 2) {
        score -= 5;
        reasons.push("-5 value above typical scope");
      }
    } else if (lead.value > 500000) {
      score += 6;
    }
  }

  // 7) COUNTY
  if (lead.county && TARGET_COUNTIES.has(String(lead.county).toUpperCase())) {
    score += 6;
    reasons.push(`+6 ${lead.county} County (target)`);
  } else if (lead.county) {
    score -= 12;
    reasons.push(`-12 outside Puget Sound (${lead.county})`);
  }

  // 8) Recency
  if (lead.posted_ts) {
    const days = (Date.now() - lead.posted_ts) / 86400000;
    if (days < 7) { score += 6; reasons.push("+6 posted <7d"); }
    else if (days < 30) { score += 2; reasons.push("+2 posted <30d"); }
    else if (days > 90) { score -= 10; reasons.push("-10 posted >90d (stale)"); }
  }

  lead.score = Math.max(0, Math.min(100, Math.round(score)));
  lead.score_reasons = reasons;
  lead.why_relevant = why.slice(0, 4);
  lead.intent_level = lead.score >= 75 ? "hot" : lead.score >= 55 ? "warm" : "cold";
  lead.ready_for_handoff = lead.score >= 70 && !!lead.fully_enriched && !!lead.no_gc;

  return lead;
}