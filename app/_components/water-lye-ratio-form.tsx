"use client";

import { useMemo, useState } from "react";
import {
  concentrationToRatio,
  ratioToConcentration,
  waterFromLyeAndConcentration,
  WaterLyeRatioError,
} from "@/lib/water-lye-ratio";

function round(n: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

export function WaterLyeRatioForm() {
  const [ratioWater, setRatioWater] = useState("2");
  const [concentration, setConcentration] = useState("33.33");
  const [lyeWeight, setLyeWeight] = useState("100");

  function handleRatioChange(value: string) {
    setRatioWater(value);
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) {
      try {
        setConcentration(String(round(ratioToConcentration(num), 2)));
      } catch {
        // leave concentration as-is while the ratio field is mid-edit
      }
    }
  }

  function handleConcentrationChange(value: string) {
    setConcentration(value);
    const num = Number(value);
    if (Number.isFinite(num) && num > 0 && num < 100) {
      try {
        setRatioWater(String(round(concentrationToRatio(num), 2)));
      } catch {
        // leave ratio as-is while the concentration field is mid-edit
      }
    }
  }

  const waterResult = useMemo(() => {
    try {
      const lye = Number(lyeWeight);
      const conc = Number(concentration);
      return {
        error: null as string | null,
        water: waterFromLyeAndConcentration(lye, conc),
      };
    } catch (e) {
      return {
        error: e instanceof WaterLyeRatioError ? e.message : "Invalid input.",
        water: null,
      };
    }
  }, [lyeWeight, concentration]);

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h3 className="font-medium">Ratio ↔ concentration</h3>
      <p className="mt-1 text-sm text-gray-600">
        Edit either field — the other updates to match.
      </p>

      <div className="mt-3 flex flex-wrap gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">
            Water:lye ratio (parts water per 1 part lye)
          </span>
          <input
            className="w-32 rounded border border-gray-300 px-3 py-2"
            value={ratioWater}
            onChange={(e) => handleRatioChange(e.target.value)}
            aria-label="Water to lye ratio"
            inputMode="decimal"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Lye concentration %</span>
          <input
            className="w-32 rounded border border-gray-300 px-3 py-2"
            value={concentration}
            onChange={(e) => handleConcentrationChange(e.target.value)}
            aria-label="Lye concentration percent"
            inputMode="decimal"
          />
        </label>
      </div>

      <h3 className="mt-6 font-medium">Water weight for a known lye amount</h3>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Lye weight (g)</span>
          <input
            className="w-32 rounded border border-gray-300 px-3 py-2"
            value={lyeWeight}
            onChange={(e) => setLyeWeight(e.target.value)}
            aria-label="Lye weight in grams"
            inputMode="decimal"
          />
        </label>

        <div data-testid="result">
          {waterResult.error ? (
            <p className="text-red-600" role="alert">
              {waterResult.error}
            </p>
          ) : (
            <p className="text-lg">
              Water needed:{" "}
              <span className="font-semibold">
                {round(waterResult.water!, 1)} g
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
