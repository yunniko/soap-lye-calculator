// Cold-process soap lye calculation: given a recipe's oils (each with a
// known NaOH saponification value — see lib/oil-sap-reference.ts) and a
// superfat percentage, computes the exact NaOH or KOH weight needed and
// the water weight for the batch.
//
// The core formula — oil weight × SAP value, summed across every oil in
// the recipe, then reduced by the superfat percentage — is standard
// cold-process soap-making arithmetic, not something this project
// invents; see lib/oil-sap-reference.ts for where each oil's SAP value
// comes from. This module only does the arithmetic for whatever recipe
// the user enters.
//
// A 2026-09-09 domain-expert review (see docs/domain-reference.md) found
// two real gaps in the original version of this module, both fixed here:
// (1) no lye-purity adjustment — commercial KOH commonly ships around
// 90% pure (the rest water/carbonate), and treating it as 100% pure
// silently under-delivers actual alkali, which for liquid soap (a much
// tighter 1-3% superfat convention) can push the real superfat well
// above intended; (2) no maximum lye-concentration check — a water
// amount low enough relative to the lye amount can request a physically
// impossible solution (NaOH tops out around 50% w/w in water), and
// undissolved lye carried into the batter becomes a genuinely caustic
// pocket in the finished bar, the one failure mode in this whole
// calculator that can actually leave someone with a chemical burn.

import { KOH_CONVERSION_FACTOR } from "./oil-sap-reference";

export class LyeCalculatorError extends Error {}

export type LyeType = "NaOH" | "KOH";

export interface RecipeOil {
  name: string;
  sapNaOH: number; // grams of NaOH per gram of oil
  weightGrams: number;
}

export interface LyeCalculatorOptions {
  superfatPercent: number;
  lyeType: LyeType;
  waterAsPercentOfOils: number;
  /**
   * Purity of the lye product being weighed out, as a percent (0-100].
   * Pure reagent-grade NaOH is close to 100%; commercial KOH commonly
   * ships around 90% pure. Defaults to 100 (pure) if omitted — the
   * caller (the UI) is expected to default this to 90 for KOH.
   */
  lyePurityPercent?: number;
}

export interface LyeCalculationResult {
  totalOilGrams: number;
  pureLyeGrams: number; // before the superfat discount, 100%-pure basis
  effectiveLyeGrams: number; // after the superfat discount, 100%-pure basis
  lyeGrams: number; // actual product weight to weigh out, adjusted for purity
  waterGrams: number;
  lyeConcentrationPercent: number; // effectiveLyeGrams / (effectiveLyeGrams + water)
  batchWeightGrams: number;
  lyeType: LyeType;
  lyePurityPercent: number;
}

// NaOH's practical solubility ceiling in water is roughly 50% w/w at room
// temperature; soap-making practice treats that as a hard ceiling since
// undissolved lye can be carried into the batter as a caustic pocket, and
// even close to 50% risks the solution crystallizing out in a cold room.
const MAX_SAFE_LYE_CONCENTRATION_PERCENT = 50;

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new LyeCalculatorError(`${label} must be a positive number.`);
  }
}

/**
 * Computes the lye (NaOH or KOH) and water needed for a cold-process soap
 * recipe. Superfat is restricted to a 0-20% safety range: 0% is allowed
 * but leaves no margin for measurement error, and cold-process recipes
 * above ~20% superfat aren't a recognized safe technique — they risk an
 * unstable, overly soft, or rancidity-prone bar.
 */
export function calculateLyeAndWater(
  oils: RecipeOil[],
  options: LyeCalculatorOptions
): LyeCalculationResult {
  if (oils.length === 0) {
    throw new LyeCalculatorError("Add at least one oil to the recipe.");
  }
  for (const oil of oils) {
    assertPositive(oil.weightGrams, `${oil.name || "Oil"} weight`);
    assertPositive(oil.sapNaOH, `${oil.name || "Oil"} SAP value`);
  }

  const { superfatPercent, lyeType, waterAsPercentOfOils } = options;
  const lyePurityPercent = options.lyePurityPercent ?? 100;
  if (
    !Number.isFinite(superfatPercent) ||
    superfatPercent < 0 ||
    superfatPercent > 20
  ) {
    throw new LyeCalculatorError(
      "Superfat should be between 0% and 20% — typical cold-process recipes use 0-20%; higher risks an unstable or overly soft bar."
    );
  }
  assertPositive(waterAsPercentOfOils, "Water percentage");
  if (
    !Number.isFinite(lyePurityPercent) ||
    lyePurityPercent <= 0 ||
    lyePurityPercent > 100
  ) {
    throw new LyeCalculatorError(
      "Lye purity must be between 0% (exclusive) and 100%."
    );
  }

  const totalOilGrams = oils.reduce((sum, oil) => sum + oil.weightGrams, 0);
  const pureLyeGramsNaOH = oils.reduce(
    (sum, oil) => sum + oil.weightGrams * oil.sapNaOH,
    0
  );
  const pureLyeGrams =
    lyeType === "NaOH" ? pureLyeGramsNaOH : pureLyeGramsNaOH * KOH_CONVERSION_FACTOR;
  const effectiveLyeGrams = pureLyeGrams * (1 - superfatPercent / 100);
  const waterGrams = totalOilGrams * (waterAsPercentOfOils / 100);

  const lyeConcentrationPercent =
    (effectiveLyeGrams / (effectiveLyeGrams + waterGrams)) * 100;
  if (lyeConcentrationPercent > MAX_SAFE_LYE_CONCENTRATION_PERCENT) {
    throw new LyeCalculatorError(
      `This recipe's water amount is too low for how much lye it needs (${lyeConcentrationPercent.toFixed(
        1
      )}% lye concentration) — sodium/potassium hydroxide can't fully dissolve much above ${MAX_SAFE_LYE_CONCENTRATION_PERCENT}% concentration in water, and undissolved lye risks a caustic pocket in the finished bar. Increase the water percentage.`
    );
  }

  const lyeGrams = effectiveLyeGrams / (lyePurityPercent / 100);

  return {
    totalOilGrams,
    pureLyeGrams,
    effectiveLyeGrams,
    lyeGrams,
    waterGrams,
    lyeConcentrationPercent,
    batchWeightGrams: totalOilGrams + lyeGrams + waterGrams,
    lyeType,
    lyePurityPercent,
  };
}
