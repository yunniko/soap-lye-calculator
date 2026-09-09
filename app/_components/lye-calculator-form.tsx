"use client";

import { useId, useMemo, useState } from "react";
import {
  calculateLyeAndWater,
  LyeCalculatorError,
  type LyeType,
  type RecipeOil,
} from "@/lib/lye-calculator";
import { OIL_SAP_REFERENCE } from "@/lib/oil-sap-reference";

const CUSTOM_OIL = "__custom__";

interface OilRow {
  id: string;
  oilName: string; // matches an OIL_SAP_REFERENCE entry name, or CUSTOM_OIL
  customSap: string;
  weightGrams: string;
}

function round(n: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

function sapForRow(row: OilRow): number {
  if (row.oilName === CUSTOM_OIL) return Number(row.customSap);
  return OIL_SAP_REFERENCE.find((o) => o.name === row.oilName)?.sapNaOH ?? NaN;
}

let nextRowId = 0;
function makeRow(oilName: string, weightGrams: string): OilRow {
  nextRowId += 1;
  return { id: `oil-${nextRowId}`, oilName, customSap: "", weightGrams };
}

export function LyeCalculatorForm() {
  const [rows, setRows] = useState<OilRow[]>(() => [
    makeRow("Olive Oil", "500"),
    makeRow("Coconut Oil (76°F melt point)", "300"),
  ]);
  const [superfatPercent, setSuperfatPercent] = useState("5");
  const [lyeType, setLyeType] = useState<LyeType>("NaOH");
  const [waterPercent, setWaterPercent] = useState("38");
  const [lyePurityPercent, setLyePurityPercent] = useState("100");
  const formId = useId();

  function updateRow(id: string, patch: Partial<OilRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow("Olive Oil", "100")]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const result = useMemo(() => {
    try {
      const oils: RecipeOil[] = rows.map((row) => ({
        name: row.oilName === CUSTOM_OIL ? "Custom oil" : row.oilName,
        sapNaOH: sapForRow(row),
        weightGrams: Number(row.weightGrams),
      }));
      return {
        error: null as string | null,
        value: calculateLyeAndWater(oils, {
          superfatPercent: Number(superfatPercent),
          lyeType,
          waterAsPercentOfOils: Number(waterPercent),
          lyePurityPercent: Number(lyePurityPercent),
        }),
      };
    } catch (e) {
      return {
        error: e instanceof LyeCalculatorError ? e.message : "Invalid input.",
        value: null,
      };
    }
  }, [rows, superfatPercent, lyeType, waterPercent, lyePurityPercent]);

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Before you mix — lye safety:</strong>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Always add lye to water, never water to lye — adding water to
            lye can cause a violent, boiling reaction.
          </li>
          <li>
            Weigh lye and water by mass (a scale), never by volume — this
            calculator&rsquo;s numbers are all masses.
          </li>
          <li>
            Never use aluminum containers or utensils — lye reacts with
            aluminum to release flammable hydrogen gas. Use stainless
            steel, or heat-safe HDPE/PP plastic (not ordinary glass, which
            lye can etch and weaken over repeated use).
          </li>
          <li>
            Wear sealed splash goggles (not just eyeglasses) and gloves,
            and mix in a well-ventilated area — avoid breathing the fumes
            given off in the first moments after mixing.
          </li>
          <li>
            Lye solution can reach 200°F/93°C or higher within seconds —
            use cool water, not hot, and keep it away from children and
            pets.
          </li>
          <li>
            Freshly poured soap is still caustic until saponification
            finishes — wear gloves when unmolding, and allow the full cure
            time before handling bare-handed.
          </li>
          <li>
            <strong>If lye contacts skin or eyes:</strong> flush with cool
            running water for at least 15 minutes, remove any
            contaminated clothing, and seek emergency medical care for eye
            contact.
          </li>
        </ul>
      </div>

      <h3 className="mt-6 font-medium">Recipe oils</h3>
      <div className="mt-3 space-y-3">
        {rows.map((row, index) => (
          <div key={row.id} className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">
                Oil {index + 1} type
              </span>
              <select
                className="w-56 rounded border border-gray-300 px-3 py-2"
                value={row.oilName}
                onChange={(e) => updateRow(row.id, { oilName: e.target.value })}
                aria-label={`Oil ${index + 1} type`}
              >
                {OIL_SAP_REFERENCE.map((oil) => (
                  <option key={oil.name} value={oil.name}>
                    {oil.name}
                  </option>
                ))}
                <option value={CUSTOM_OIL}>Custom oil (enter SAP value)</option>
              </select>
            </label>

            {row.oilName === CUSTOM_OIL && (
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">
                  Oil {index + 1} NaOH SAP value
                </span>
                <input
                  className="w-32 rounded border border-gray-300 px-3 py-2"
                  value={row.customSap}
                  onChange={(e) => updateRow(row.id, { customSap: e.target.value })}
                  aria-label={`Oil ${index + 1} NaOH SAP value`}
                  inputMode="decimal"
                />
              </label>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-600">
                Oil {index + 1} weight in grams
              </span>
              <input
                className="w-32 rounded border border-gray-300 px-3 py-2"
                value={row.weightGrams}
                onChange={(e) => updateRow(row.id, { weightGrams: e.target.value })}
                aria-label={`Oil ${index + 1} weight in grams`}
                inputMode="decimal"
              />
            </label>

            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                aria-label={`Remove oil ${index + 1}`}
                className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-red-400 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 rounded border border-gray-300 px-3 py-2 text-sm hover:border-gray-500"
      >
        + Add another oil
      </button>

      <div className="mt-6 flex flex-wrap gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Superfat %</span>
          <input
            className="w-28 rounded border border-gray-300 px-3 py-2"
            value={superfatPercent}
            onChange={(e) => setSuperfatPercent(e.target.value)}
            aria-label="Superfat percent"
            inputMode="decimal"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Lye type</span>
          <select
            className="rounded border border-gray-300 px-3 py-2"
            value={lyeType}
            onChange={(e) => setLyeType(e.target.value as LyeType)}
            aria-label="Lye type"
          >
            <option value="NaOH">NaOH (bar soap)</option>
            <option value="KOH">KOH (liquid soap)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Water, % of oil weight</span>
          <input
            className="w-28 rounded border border-gray-300 px-3 py-2"
            value={waterPercent}
            onChange={(e) => setWaterPercent(e.target.value)}
            aria-label="Water percent of oil weight"
            inputMode="decimal"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Lye purity %</span>
          <input
            className="w-28 rounded border border-gray-300 px-3 py-2"
            value={lyePurityPercent}
            onChange={(e) => setLyePurityPercent(e.target.value)}
            aria-label="Lye purity percent"
            inputMode="decimal"
          />
        </label>
      </div>

      {lyeType === "KOH" && (
        <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
          Commercial KOH commonly ships around 90% pure (not 100%) — check
          your product&rsquo;s label and set the purity field above to
          match, or the actual lye delivered will be lower than intended.
          Liquid soap also typically uses a much lower superfat (around
          1-3%) than bar soap. This calculator gives the lye-solution
          amount for the paste stage only — diluting the finished paste
          into liquid soap needs additional water not calculated here.
        </p>
      )}

      <div className="mt-6" data-testid="result" id={formId}>
        {result.error ? (
          <p className="text-red-600" role="alert">
            {result.error}
          </p>
        ) : (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-lg">
              Total oils:{" "}
              <span className="font-semibold">
                {round(result.value!.totalOilGrams)} g
              </span>
            </p>
            <p className="text-lg">
              {result.value!.lyeType}:{" "}
              <span className="font-semibold">
                {round(result.value!.lyeGrams)} g
              </span>
              {result.value!.lyePurityPercent !== 100 && (
                <span className="text-sm text-gray-600">
                  {" "}
                  (at {result.value!.lyePurityPercent}% purity)
                </span>
              )}
            </p>
            <p className="text-lg">
              Water:{" "}
              <span className="font-semibold">
                {round(result.value!.waterGrams)} g
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Total batch weight: {round(result.value!.batchWeightGrams)} g
              {" · "}
              Lye concentration: {round(result.value!.lyeConcentrationPercent)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
