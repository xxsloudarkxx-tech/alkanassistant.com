/**
 * Fase B — Lead Hunter v14 (PEGAR TAL CUAL).
 * Helpers de clasificación: categoría, exclusión, unit count, stage.
 */
import { PROJECT_CATEGORIES, EXCLUSION_KEYWORDS, type ProjectCategory } from "./categories";

export function matchCategory(text: string): ProjectCategory | null {
  const lc = String(text || "").toLowerCase();
  for (const cat of PROJECT_CATEGORIES) {
    for (const k of cat.keys) {
      if (lc.includes(k)) return cat;
    }
  }
  return null;
}

export function isExcluded(text: string): boolean {
  const lc = String(text || "").toLowerCase();
  for (const k of EXCLUSION_KEYWORDS) {
    if (lc.includes(k)) return true;
  }
  return false;
}

export function extractUnitCount(text: string): number | null {
  const lc = String(text || "").toLowerCase();
  const patterns = [
    /(\d+)\s*[- ]?\s*units?/,
    /(\d+)\s*[- ]?\s*dwelling/,
    /(\d+)\s*[- ]?\s*unit\s*apartment/,
    /(\d+)\s*[- ]?\s*unit\s*building/,
  ];
  for (const p of patterns) {
    const m = lc.match(p);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

export type LeadStage =
  | "application"
  | "intake"
  | "review"
  | "correction"
  | "pre_issuance"
  | "issued_lt_14d"
  | "issued_lt_30d"
  | "issued_old";

export function classifyStage(
  permitStatus: string | null | undefined,
  issuedDate: string | null | undefined,
): LeadStage {
  if (!permitStatus && !issuedDate) return "application";
  const status = String(permitStatus || "").toLowerCase();
  if (status.includes("application accepted") || status.includes("intake")) return "intake";
  if (status.includes("application")) return "application";
  if (status.includes("review") || status.includes("routing") || status.includes("plan check")) return "review";
  if (status.includes("correction") || status.includes("revisions")) return "correction";
  if (status.includes("approved") && !issuedDate) return "pre_issuance";
  if (status.includes("issued") || issuedDate) {
    if (issuedDate) {
      const days = (Date.now() - new Date(issuedDate).getTime()) / 86400000;
      if (days < 14) return "issued_lt_14d";
      if (days < 30) return "issued_lt_30d";
      return "issued_old";
    }
    return "issued_old";
  }
  return "application";
}