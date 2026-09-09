# Handover — soap-lye-calculator

Read this before touching the project. Goal in `GOALS.md` (G-001).
Company-wide standards in `E:\CLAUDE\COMPANY\`. Parent initiative:
`E:\CLAUDE\projects\svc-lab\`.

## Current state

Built, domain-expert reviewed (with real fixes applied — see D2), locally
verified clean. Three tools: `/lye-calculator` (multi-oil recipe →
NaOH/KOH + water amounts, with a lye-purity adjustment and a
maximum-safe-concentration guard), `/water-lye-ratio` (ratio ↔
concentration ↔ water-weight converter, capped at 50% concentration),
`/oil-sap-reference` (sourced SAP-value chart). No database, no accounts.

## How things fit together

Standard svc-lab stateless Next.js service — see `svc-lab/HANDOVER.md` for
the shared template/deploy pattern. Business logic lives in
`lib/lye-calculator.ts` (recipe → lye/water math), `lib/water-lye-ratio.ts`
(ratio/concentration conversions), and `lib/oil-sap-reference.ts` (the
sourced data table both the calculator and the reference page draw from)
as pure functions/data, unit-tested in `tests/unit/`. UI forms are in
`app/_components/`, pages in `app/lye-calculator`, `app/water-lye-ratio`,
`app/oil-sap-reference`.

## Decision record

**D1 — Sourcing: WebFetch denied this session, so every SAP figure comes
from WebSearch-snippet synthesis, not a directly-read primary document.**
Same known limitation documented in `svc-lab/HANDOVER.md`'s research-caveat
decision. Cross-corroborated across three independent, long-standing
soap-making references (From Nature With Love's saponification chart,
SoapCalc's own published oil list, soap-making-resource.com's
saponification table) rather than trusted from one source — all three
converged on the same NaOH SAP values within normal rounding for every oil
in the table. The KOH conversion factor (×1.403, the standard molar-mass
ratio of KOH to NaOH) is applied uniformly rather than sourced per oil;
spot-checked against liquid-soap-specific sources' own published KOH
figures for olive oil (~189-190 mg KOH/g) and coconut oil (~255-268 mg
KOH/g), both of which matched the computed conversion within rounding. See
`lib/oil-sap-reference.ts`'s header comment for the full citation list and
`docs/domain-reference.md` for the mandatory domain-expert review's
findings once that review has run (M1b — not yet complete as of this
writing).

**D2 — Superfat is clamped to a 0-20% range in `lib/lye-calculator.ts`,
not left unbounded.** 0% has no built-in margin for measurement error
(a slightly-off scale reading could leave a batch lye-heavy with no
cushion); cold-process recipes above ~20% superfat aren't a recognized
safe technique and risk an unstable, overly soft, or rancidity-prone bar.
Rejecting outside that range with a clear error message, rather than
silently computing a number for an input outside normal safe practice,
matches this project's real safety stakes — a wrong or unvalidated lye
figure is a genuine hazard, not just an inconvenience the way a wrong
craft-measurement figure would be in most of this portfolio's other
calculators.

**D3 — Water is expressed as "percent of oil weight" (default 38%), not
as a water:lye ratio or lye concentration percentage, in the main lye
calculator.** This is one common convention among several real ones (see
`lib/water-lye-ratio.ts`'s header comment) — rather than pick one
convention and leave someone with a ratio-based recipe unable to use this
tool, `/water-lye-ratio` exists specifically to translate between all
three, mirroring the same "give a converter, not just one convention"
pattern used elsewhere in the portfolio (e.g. the resin calculator's
separate ratio/coverage tools).

**D2 — Domain-expert review (2026-09-09) found real, fixable issues, not
just documentation gaps — all fixed before shipping.** Full detail,
citations, and confidence notes in `docs/domain-reference.md`; summary
here:
1. `docs/domain-reference.md` didn't exist yet three pages already cited
   it, and copy claimed a review had "verified this table" before one
   had happened — an honesty gap in the original build's own copy. Fixed
   by writing this file and correcting the page copy to describe the
   review accurately.
2. Coconut Oil 76°F's NaOH SAP value (0.183) didn't match the two sources
   the table's own header cites (SoapCalc, soap-making-resource.com, both
   ~0.190-0.191) — corrected to 0.19.
3. Canola (Rapeseed) Oil's SAP value (0.124) turned out to be the
   traditional high-erucic rapeseed figure, not modern low-erucic canola
   (~0.133) — real source disagreement, not rounding. Corrected to 0.133
   and relabeled "Canola Oil (low-erucic rapeseed)" to disambiguate.
4. **No maximum lye-concentration check** — the one finding with a direct
   burn-risk mechanism: a low enough water percentage could request a
   physically impossible (>50% w/w) NaOH/KOH solution, and undissolved
   lye carried into the batter risks a caustic pocket in the finished
   bar. Fixed: `calculateLyeAndWater` now throws above 50% lye
   concentration (`lib/lye-calculator.ts`); `water-lye-ratio.ts`'s
   `ratioToConcentration`/`concentrationToRatio` cap the same way.
5. KOH silently assumed 100% purity; commercial KOH commonly ships ~90%
   pure, meaningfully under-delivering alkali (particularly consequential
   for liquid soap's much tighter 1-3% superfat convention). Fixed: added
   an adjustable `lyePurityPercent` option (`lib/lye-calculator.ts`),
   exposed as a form field defaulting to 100.
6. Selecting "KOH (liquid soap)" still applied bar-soap conventions (5%
   default superfat vs. liquid soap's 1-3% norm) with no mention that
   liquid soap needs a separate dilution step beyond this tool's
   lye-solution water. Disclosed via an inline note when KOH is selected
   rather than auto-changing the user's other inputs.
7. Missing standard lye-safety guidance: no-aluminum/hydrogen-gas
   warning, weigh-by-mass instruction, first aid. Added to the lye
   calculator's safety box and summarized on the homepage.
8. The "up to roughly 200°F/93°C" temperature claim understated real
   sources (which describe 200°F as commonly exceeded, not a ceiling) —
   reworded to "can reach 200°F/93°C or higher."

Ten of twelve SAP values, the 1.403 KOH conversion factor, the core
`Σ(weight×SAP)×(1−superfat/100)` formula, the 0-20% superfat range,
rejecting negative superfat, the 38%-of-oils and 2:1/33.33% water
defaults, and the ratio↔concentration arithmetic all came back grounded
with no changes needed. Re-ran the full verification suite after every
fix (not just trusted the pre-fix run) — see `GOALS.md`'s progress log
for the actual test counts.

**D3 — Security review (2026-09-09): manual equivalent, clean, no
findings.** The `/security-review` skill's `origin/HEAD` precondition
fails before a GitHub remote exists (same known gap already logged for
several sibling services — see `svc-lab/HANDOVER.md`). Did a manual
review instead: no API routes, no server-side data handling, no
database, no auth, no `.env`/secrets in the commit, all form input stays
client-side React state and is never sent to a server. The only
`dangerouslySetInnerHTML` usage (`lib/json-ld.tsx`) serializes static FAQ
objects (no user input) and escapes `<` defensively. No findings.

## Next steps and open questions

- The domain-expert review flagged two of its own corrections (canola
  0.133, coconut 0.190) as worth a human soap maker's or a future
  WebFetch-enabled session's direct confirmation against SoapCalc's and
  From Nature With Love's charts — see `docs/domain-reference.md`'s
  closing section for exactly which figures and why.
- Monetization: wired via the shared `ADSENSE_PUBLISHER_ID` env var,
  awaiting AdSense's own per-domain approval, same as every other
  svc-lab service.
