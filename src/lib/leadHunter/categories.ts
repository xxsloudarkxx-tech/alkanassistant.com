/**
 * Fase B — Lead Hunter v14 (PEGAR TAL CUAL desde el Kit de Rescate)
 * Categorías objetivo + lista de exclusión.
 * NO MODIFICAR estos valores: son la calibración del producto.
 */

export type ProjectCategory = {
  code: string;
  label: string;
  keys: string[];
  min_units?: number;
  max_units?: number;
  sweet_spot: [number, number];
  priority: "PRIMARY" | "HIGH" | "STRATEGIC";
};

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    code: "multifamily",
    label: "Multifamily",
    keys: ["multifamily","multi-family","apartment","apt building","5-unit","6-unit","8-unit","10-unit","12-unit","15-unit","20-unit","25-unit","30-unit","units","duplex","triplex","fourplex","5+ units","dwelling units","dwelling unit"],
    min_units: 5,
    max_units: 30,
    sweet_spot: [500000, 10000000],
    priority: "PRIMARY",
  },
  {
    code: "commercial",
    label: "Commercial TI / New",
    keys: ["tenant improvement","tenant improvements","ti project","commercial","office building","retail","warehouse","industrial","mixed-use","mixed use","commercial new construction","commercial new build","restaurant build-out","medical office","dental office"],
    sweet_spot: [150000, 5000000],
    priority: "PRIMARY",
  },
  {
    code: "sfr",
    label: "SFR new construction",
    keys: ["single family","single-family","sfr","new construction","custom home","new sfr","new house","new dwelling","new residence","one-family dwelling","construct one-family","construct single"],
    sweet_spot: [300000, 2500000],
    priority: "HIGH",
  },
  {
    code: "adu",
    label: "ADU / DADU",
    keys: ["adu","dadu","accessory dwelling","accessory dwelling unit","detached accessory","attached accessory","garage conversion","backyard cottage","mother-in-law","laneway"],
    sweet_spot: [100000, 350000],
    priority: "HIGH",
  },
  {
    code: "townhome",
    label: "Townhomes",
    keys: ["townhome","townhouse","town home","town house","row house","rowhouse","attached townhomes","townhome development"],
    sweet_spot: [300000, 1500000],
    priority: "HIGH",
  },
  {
    code: "affordable",
    label: "Affordable Housing",
    keys: ["affordable housing","affordable"," lihtc","low-income housing","workforce housing","section 8","public housing","sha ","seattle housing authority","king county housing authority","housing authority","wshfc","tax credit"],
    sweet_spot: [1000000, 50000000],
    priority: "STRATEGIC",
  },
];

export const EXCLUSION_KEYWORDS: string[] = [
  "sign permit","sign installation","minor repair","minor alteration",
  "re-roof only","reroof only","siding only","window replacement only",
  "fence permit only","deck repair","deck replacement only",
  "plumbing permit only","mechanical permit only","electrical permit only",
  "demolition only","demolition permit only",
  "street improvement","sidewalk repair","road improvement","stormwater pipe",
  "sewer main","water main",
  "water heater","furnace replacement","hvac replacement","panel upgrade",
  "kitchen remodel","bathroom remodel","master bath","master bedroom addition",
  "interior remodel","interior alteration",
];

export function fmtMoney(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return "$" + Math.round(n).toLocaleString("en-US");
}