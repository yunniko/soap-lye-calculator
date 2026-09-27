# D002 · Superfat clamped 0–20%; domain review fixed eight issues including a burn-risk gap
Date: 2026-09-09 · Goal: G-001 · Status: active
Context: A wrong lye figure is a genuine hazard, not an inconvenience. (Two former entries both numbered D2 are merged here.)
Decision: Superfat outside 0–20% is rejected. Review fixes: `docs/domain-reference.md` written (pages had cited it before it existed); coconut 76° SAP 0.183 → 0.19; canola 0.124 → 0.133 (relabelled low-erucic); **no maximum lye-concentration check** added — `calculateLyeAndWater` throws above 50% w/w, ratio converters cap the same; adjustable `lyePurityPercent` (commercial KOH ~90%); KOH-mode note on liquid-soap superfat and dilution; lye-safety guidance (no aluminium, weigh by mass, first aid); temperature copy "200°F or higher".
Rejected: unbounded superfat; silent concentration.
Consequence: Ten of twelve SAP values and the core formula confirmed.
Evidence: `docs/domain-reference.md`; `lib/lye-calculator.ts`.
