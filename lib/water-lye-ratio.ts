// Converts between the common ways cold-process soap recipes express how
// much water to use: a water:lye ratio (parts water per 1 part lye), a
// lye concentration percentage (lye / (lye + water) × 100), and — given a
// known lye weight — the actual water weight needed. Different
// calculators/suppliers default to different conventions; this lets
// someone translate a recipe from one to another rather than guessing.
// Pure arithmetic, verified by round-trip tests in
// tests/unit/water-lye-ratio.spec.ts.
//
// Both conversions are capped at a 50% lye concentration (a 1:1
// water:lye ratio) — a 2026-09-09 domain-expert review (see
// docs/domain-reference.md) flagged that NaOH's practical solubility
// ceiling in water is roughly 50% w/w at room temperature, and
// soap-making practice treats that as a hard limit: a stronger
// "concentration" than that describes a physically unrealistic solution,
// not just an unusual recipe, and undissolved lye risks a caustic pocket
// in the finished bar.

export class WaterLyeRatioError extends Error {}

const MAX_SAFE_LYE_CONCENTRATION_PERCENT = 50;

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new WaterLyeRatioError(`${label} must be a positive number.`);
  }
}

/** Given a water:lye ratio (parts water per 1 part lye), returns the lye concentration %. */
export function ratioToConcentration(waterPartsPerLye: number): number {
  assertPositive(waterPartsPerLye, "Water:lye ratio");
  if (waterPartsPerLye < 1) {
    throw new WaterLyeRatioError(
      `A water:lye ratio below 1:1 exceeds sodium/potassium hydroxide's practical solubility limit in water (roughly 50% lye concentration, i.e. a 1:1 ratio) — undissolved lye risks a caustic pocket in the finished bar.`
    );
  }
  return (1 / (1 + waterPartsPerLye)) * 100;
}

/** Given a lye concentration % (0-50], returns the water:lye ratio (parts water per 1 part lye). */
export function concentrationToRatio(lyeConcentrationPercent: number): number {
  if (
    !Number.isFinite(lyeConcentrationPercent) ||
    lyeConcentrationPercent <= 0 ||
    lyeConcentrationPercent > MAX_SAFE_LYE_CONCENTRATION_PERCENT
  ) {
    throw new WaterLyeRatioError(
      `Lye concentration must be between 0% (exclusive) and ${MAX_SAFE_LYE_CONCENTRATION_PERCENT}% — sodium/potassium hydroxide can't reliably dissolve much above that in water, and undissolved lye risks a caustic pocket in the finished bar.`
    );
  }
  return (100 - lyeConcentrationPercent) / lyeConcentrationPercent;
}

/** Given a known lye weight and a target lye concentration %, returns the water weight needed. */
export function waterFromLyeAndConcentration(
  lyeGrams: number,
  lyeConcentrationPercent: number
): number {
  assertPositive(lyeGrams, "Lye weight");
  const ratio = concentrationToRatio(lyeConcentrationPercent);
  return lyeGrams * ratio;
}
