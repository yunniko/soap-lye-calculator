import { describe, expect, it } from "vitest";
import {
  concentrationToRatio,
  ratioToConcentration,
  waterFromLyeAndConcentration,
  WaterLyeRatioError,
} from "@/lib/water-lye-ratio";

describe("ratioToConcentration", () => {
  it("converts a 2:1 water:lye ratio to ~33.3% concentration", () => {
    expect(ratioToConcentration(2)).toBeCloseTo(33.333, 2);
  });

  it("converts a 1:1 ratio to 50% concentration", () => {
    expect(ratioToConcentration(1)).toBeCloseTo(50, 9);
  });

  it("rejects a non-positive ratio", () => {
    expect(() => ratioToConcentration(0)).toThrow(WaterLyeRatioError);
  });

  it("rejects a ratio below 1:1 (would exceed the 50% safety ceiling)", () => {
    expect(() => ratioToConcentration(0.5)).toThrow(WaterLyeRatioError);
  });
});

describe("concentrationToRatio", () => {
  it("converts 33.3% concentration back to ~2:1", () => {
    expect(concentrationToRatio(33.333)).toBeCloseTo(2, 2);
  });

  it("converts 50% concentration to a 1:1 ratio", () => {
    expect(concentrationToRatio(50)).toBeCloseTo(1, 9);
  });

  it.each([0, 100, -5, 150, 60])(
    "rejects an out-of-range concentration (%s)",
    (value) => {
      expect(() => concentrationToRatio(value)).toThrow(WaterLyeRatioError);
    }
  );
});

describe("round-trip", () => {
  it("ratio -> concentration -> ratio recovers the original ratio", () => {
    const original = 2.5;
    const concentration = ratioToConcentration(original);
    const recovered = concentrationToRatio(concentration);
    expect(recovered).toBeCloseTo(original, 9);
  });
});

describe("waterFromLyeAndConcentration", () => {
  it("computes water for a known lye weight at 33% concentration", () => {
    const water = waterFromLyeAndConcentration(100, 33.333);
    expect(water).toBeCloseTo(200, 1);
  });

  it("rejects a non-positive lye weight", () => {
    expect(() => waterFromLyeAndConcentration(0, 33)).toThrow(
      WaterLyeRatioError
    );
  });
});
