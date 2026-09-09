// Saponification (SAP) values for common cold-process soap-making oils and
// fats: the amount of NaOH (grams) needed to fully saponify one gram of
// that oil. This is the reference table lib/lye-calculator.ts's math
// draws from, and what app/oil-sap-reference/page.tsx displays.
//
// Sources: retrieved 2026-09-09 via WebSearch-result synthesis (WebFetch
// was denied this session — same known limitation documented in
// svc-lab/HANDOVER.md's research-caveat decision), then reviewed by a
// domain-expert pass the same day. Cross-corroborated across three
// independent, long-standing soap-making references:
//   - From Nature With Love's saponification chart
//     (fromnaturewithlove.com/resources/sapon.asp)
//   - SoapCalc's own published oil list (soapcalc.net/oil-list) — the
//     de facto industry-standard reference most other lye calculators
//     draw from
//   - soap-making-resource.com's saponification table
// Ten of the twelve oils below converged on the same NaOH SAP value
// (within normal rounding) across all three. The domain-expert review
// found the initial build's figures for coconut oil and canola oil did
// NOT actually match what those sources say — both are corrected below,
// with the discrepancy explained in each entry's own note. See
// docs/domain-reference.md for the full per-oil review, citations, and
// confidence notes.
//
// KOH values are NOT independently sourced per oil here — they're
// computed in lib/lye-calculator.ts via the standard, well-established
// molar-mass conversion factor (KOH molar mass 56.11 / NaOH molar mass
// 40.00 = 1.403), which the domain-expert review confirmed is chemically
// exact (saponification consumes one mole of hydroxide per mole of ester
// bond regardless of the counter-ion, so the mass ratio is pure
// molar-mass arithmetic). Spot-checked against liquid-soap-specific
// sources' own published KOH figures for olive oil (~189-190 mg KOH/g)
// and coconut oil (~255-268 mg KOH/g) — both matched this computed
// conversion within normal rounding.
//
// IMPORTANT KOH caveat the review also surfaced: these KOH figures are
// for 100%-pure KOH. Commercial KOH commonly ships at around 90% purity
// (the rest water/carbonate) — see lib/lye-calculator.ts's
// `lyePurityPercent` option, which the lye calculator page exposes as an
// adjustable field so a user can correct for their actual product's
// stated purity rather than silently assuming 100%.

export interface OilSapEntry {
  name: string;
  sapNaOH: number; // grams of NaOH per gram of oil
  note?: string;
}

export const OIL_SAP_REFERENCE: OilSapEntry[] = [
  { name: "Olive Oil", sapNaOH: 0.134 },
  {
    name: "Coconut Oil (76°F melt point)",
    sapNaOH: 0.19,
    note:
      "An earlier version of this table listed 0.183 for coconut oil — corrected by a domain-expert review to 0.190 to match SoapCalc's and soap-making-resource.com's own published figures (both around 0.190-0.191), the two sources this table is corroborated against. Refined 92° coconut oil is sometimes listed with a slightly different SAP value by suppliers — confirm which grade you have before relying on this exact figure for a large batch.",
  },
  { name: "Palm Oil", sapNaOH: 0.141 },
  { name: "Castor Oil", sapNaOH: 0.128 },
  { name: "Cocoa Butter", sapNaOH: 0.137 },
  { name: "Shea Butter", sapNaOH: 0.128 },
  { name: "Sunflower Oil", sapNaOH: 0.134 },
  {
    name: "Canola Oil (low-erucic rapeseed)",
    sapNaOH: 0.133,
    note:
      "An earlier version of this table listed 0.124 — a domain-expert review found that figure is the traditional HIGH-erucic rapeseed SAP value, not modern canola. Canola is specifically bred to be low-erucic (under 2% erucic acid, the origin of the name \"canola\"), and replacing erucic acid (a C22 fatty acid) with shorter C18 acids raises the SAP value — modern canola oil (what's sold in stores today) saponifies closer to 0.133, in line with its similarity to sunflower and avocado oil.",
  },
  { name: "Sweet Almond Oil", sapNaOH: 0.136 },
  { name: "Avocado Oil", sapNaOH: 0.133 },
  { name: "Lard", sapNaOH: 0.138 },
  { name: "Tallow (Beef)", sapNaOH: 0.14 },
];

// KOH molar mass (56.11) / NaOH molar mass (40.00) — the standard
// conversion used across the soap-making community to go from a published
// NaOH SAP value to the equivalent KOH SAP value.
export const KOH_CONVERSION_FACTOR = 1.403;
