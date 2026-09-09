import { describe, expect, it } from "vitest";
import { KOH_CONVERSION_FACTOR, OIL_SAP_REFERENCE } from "@/lib/oil-sap-reference";

describe("OIL_SAP_REFERENCE", () => {
  it("has a name and a positive, plausible NaOH SAP value for every oil", () => {
    expect(OIL_SAP_REFERENCE.length).toBeGreaterThanOrEqual(10);
    for (const oil of OIL_SAP_REFERENCE) {
      expect(oil.name.length).toBeGreaterThan(0);
      // Every real cold-process oil's NaOH SAP value falls in this band —
      // guards against a data-entry typo (e.g. a stray decimal shift).
      expect(oil.sapNaOH).toBeGreaterThan(0.05);
      expect(oil.sapNaOH).toBeLessThan(0.3);
    }
  });

  it("has no duplicate oil names", () => {
    const names = OIL_SAP_REFERENCE.map((oil) => oil.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("KOH_CONVERSION_FACTOR", () => {
  it("matches the molar-mass ratio of KOH to NaOH", () => {
    expect(KOH_CONVERSION_FACTOR).toBeCloseTo(56.11 / 40.0, 2);
  });
});
