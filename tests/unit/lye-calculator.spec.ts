import { describe, expect, it } from "vitest";
import {
  calculateLyeAndWater,
  LyeCalculatorError,
} from "@/lib/lye-calculator";

const OLIVE = { name: "Olive Oil", sapNaOH: 0.134, weightGrams: 500 };
const COCONUT = { name: "Coconut Oil", sapNaOH: 0.183, weightGrams: 300 };

describe("calculateLyeAndWater", () => {
  it("computes NaOH and water for a single-oil recipe with 0% superfat", () => {
    const result = calculateLyeAndWater([{ ...OLIVE, weightGrams: 1000 }], {
      superfatPercent: 0,
      lyeType: "NaOH",
      waterAsPercentOfOils: 38,
    });
    expect(result.totalOilGrams).toBe(1000);
    expect(result.pureLyeGrams).toBeCloseTo(134, 9);
    expect(result.lyeGrams).toBeCloseTo(134, 9);
    expect(result.waterGrams).toBeCloseTo(380, 9);
    expect(result.batchWeightGrams).toBeCloseTo(1514, 9);
  });

  it("applies a superfat discount to the lye amount, not the water", () => {
    const result = calculateLyeAndWater([{ ...OLIVE, weightGrams: 1000 }], {
      superfatPercent: 5,
      lyeType: "NaOH",
      waterAsPercentOfOils: 38,
    });
    expect(result.pureLyeGrams).toBeCloseTo(134, 9);
    expect(result.lyeGrams).toBeCloseTo(134 * 0.95, 9);
    expect(result.waterGrams).toBeCloseTo(380, 9);
  });

  it("sums lye across multiple oils by their own SAP values", () => {
    const result = calculateLyeAndWater([OLIVE, COCONUT], {
      superfatPercent: 0,
      lyeType: "NaOH",
      waterAsPercentOfOils: 38,
    });
    const expectedPureLye = 500 * 0.134 + 300 * 0.183;
    expect(result.totalOilGrams).toBe(800);
    expect(result.pureLyeGrams).toBeCloseTo(expectedPureLye, 9);
  });

  it("converts to KOH via the standard molar-mass factor", () => {
    const naoh = calculateLyeAndWater([{ ...OLIVE, weightGrams: 1000 }], {
      superfatPercent: 0,
      lyeType: "NaOH",
      waterAsPercentOfOils: 38,
    });
    const koh = calculateLyeAndWater([{ ...OLIVE, weightGrams: 1000 }], {
      superfatPercent: 0,
      lyeType: "KOH",
      waterAsPercentOfOils: 38,
    });
    expect(koh.pureLyeGrams).toBeCloseTo(naoh.pureLyeGrams * 1.403, 9);
    expect(koh.lyeType).toBe("KOH");
  });

  it("rejects an empty oil list", () => {
    expect(() =>
      calculateLyeAndWater([], {
        superfatPercent: 5,
        lyeType: "NaOH",
        waterAsPercentOfOils: 38,
      })
    ).toThrow(LyeCalculatorError);
  });

  it("rejects a non-positive oil weight", () => {
    expect(() =>
      calculateLyeAndWater([{ ...OLIVE, weightGrams: 0 }], {
        superfatPercent: 5,
        lyeType: "NaOH",
        waterAsPercentOfOils: 38,
      })
    ).toThrow(LyeCalculatorError);
  });

  it.each([-1, 25, 100])(
    "rejects an out-of-safe-range superfat percent (%s)",
    (superfatPercent) => {
      expect(() =>
        calculateLyeAndWater([OLIVE], {
          superfatPercent,
          lyeType: "NaOH",
          waterAsPercentOfOils: 38,
        })
      ).toThrow(LyeCalculatorError);
    }
  );

  it("rejects a non-positive water percentage", () => {
    expect(() =>
      calculateLyeAndWater([OLIVE], {
        superfatPercent: 5,
        lyeType: "NaOH",
        waterAsPercentOfOils: 0,
      })
    ).toThrow(LyeCalculatorError);
  });

  it("defaults lye purity to 100% when not specified", () => {
    const result = calculateLyeAndWater([{ ...OLIVE, weightGrams: 1000 }], {
      superfatPercent: 0,
      lyeType: "NaOH",
      waterAsPercentOfOils: 38,
    });
    expect(result.lyePurityPercent).toBe(100);
    expect(result.lyeGrams).toBeCloseTo(result.effectiveLyeGrams, 9);
  });

  it("divides the product weight by purity when lye is impure", () => {
    const result = calculateLyeAndWater([{ ...OLIVE, weightGrams: 1000 }], {
      superfatPercent: 0,
      lyeType: "KOH",
      waterAsPercentOfOils: 38,
      lyePurityPercent: 90,
    });
    expect(result.lyeGrams).toBeCloseTo(result.effectiveLyeGrams / 0.9, 9);
    expect(result.lyeGrams).toBeGreaterThan(result.effectiveLyeGrams);
  });

  it("rejects a lye purity outside (0, 100]", () => {
    expect(() =>
      calculateLyeAndWater([OLIVE], {
        superfatPercent: 5,
        lyeType: "NaOH",
        waterAsPercentOfOils: 38,
        lyePurityPercent: 110,
      })
    ).toThrow(LyeCalculatorError);
  });

  it("rejects a recipe whose water is too low for a safe lye concentration", () => {
    // 1000g oil at SAP 0.134 needs 134g pure NaOH; 10% water = 100g water
    // -> 134/(134+100) = 57.3% concentration, above the 50% safety ceiling.
    expect(() =>
      calculateLyeAndWater([{ ...OLIVE, weightGrams: 1000 }], {
        superfatPercent: 0,
        lyeType: "NaOH",
        waterAsPercentOfOils: 10,
      })
    ).toThrow(LyeCalculatorError);
  });

  it("reports the lye concentration for an accepted recipe", () => {
    const result = calculateLyeAndWater([{ ...OLIVE, weightGrams: 1000 }], {
      superfatPercent: 0,
      lyeType: "NaOH",
      waterAsPercentOfOils: 38,
    });
    // 134 / (134 + 380) = 26.1%
    expect(result.lyeConcentrationPercent).toBeCloseTo(26.06, 1);
  });
});
