# Domain reference: cold-process soap-making chemistry and safety

Reviewed 2026-09-09 by a `domain-expert` subagent per
`COMPANY\STANDARDS.md`'s "Domain depth" guidance. This is the saved
findings summary; see `HANDOVER.md` D2 for what was fixed as a result.
WebFetch was denied for both the original build and this review — all
findings rest on WebSearch-result synthesis plus stoichiometric
reasoning, not a directly-read primary source; confidence is noted
per finding.

## What real sources say

**SAP value** (grams of NaOH needed to fully saponify one gram of oil) is
inversely proportional to a fat's mean triglyceride molecular weight —
short-chain-rich fats (coconut, palm kernel) have high SAP, long-chain-
rich fats have low SAP. Published as mg KOH/g in chemistry references and
re-published as g NaOH/g in soap-making charts, related by the molar-mass
ratio `SAP_NaOH = SAP_KOH / 1402.5`.

**KOH vs. NaOH SAP values differ by a fixed, exact molar-mass ratio**
(56.11 / 40.00 = 1.403) — saponification consumes one mole of hydroxide
per mole of ester bond regardless of the counter-ion, so this conversion
is chemically exact, not an approximation.

**Commercial KOH commonly ships around 90% pure** (the remainder water/
carbonate), unlike NaOH which is typically close to 100%. Treating KOH as
100% pure silently under-delivers actual alkali — for liquid soap, whose
superfat convention is much tighter (1-3%, vs. bar soap's 5%+), this can
push real-world superfat well above intended, causing cloudiness/
separation in the finished product.

**NaOH's practical solubility ceiling in water is roughly 50% w/w** at
room temperature. Soap-making practice treats this as a hard limit for
lye-solution concentration — undissolved lye carried into the batter
becomes a caustic pocket in the finished bar, one of the few failure
modes in this whole tool category that produces a genuine burn risk
rather than just a product-quality issue.

**Canola vs. traditional rapeseed have materially different SAP values.**
Canola is specifically bred to be low-erucic (under 2% erucic acid — the
origin of the name). Erucic acid is a C22 fatty acid; replacing it with
shorter C18 acids raises the SAP value. Some older soap-making charts
still carry the traditional high-erucic rapeseed figure (~0.124 NaOH)
under a "canola/rapeseed" label, when modern canola (what's actually sold
today) saponifies closer to 0.133, in line with its similarity to
sunflower and avocado oil.

**Standard lye safety practice** includes: add lye to water, never the
reverse (violent boiling reaction); weigh both lye and water by mass, not
volume; never use aluminum (lye + aluminum releases flammable hydrogen
gas); sealed splash goggles, not eyeglasses; heat-resistant containers
(stainless steel or HDPE/PP plastic — lye can etch/weaken glass over
repeated use); work ventilated, avoid the fumes released in the first
moments of mixing; solution can reach 200°F/93°C or higher; flush skin/
eyes with cool water for 15+ minutes on contact and seek emergency care
for eye exposure; freshly poured soap stays caustic until saponification
completes.

## Findings against this project's code (2026-09-09)

| # | Finding | Severity | Fixed? |
|---|---|---|---|
| F1 | `docs/domain-reference.md` (this file) didn't exist yet three pages already cited it, and copy claimed a review "verified this table" in the past tense before one had happened | Honesty gap | ✅ Fixed (this file written; page copy now describes the review accurately) |
| F2 | Coconut Oil 76°F was listed at NaOH SAP 0.183, but the two named sources (SoapCalc, soap-making-resource.com) actually publish ~0.190-0.191 for that oil | Wrong figure vs. the sources cited; lye-light by ~3.7% (nominal 5% superfat on a 100%-coconut recipe was really ~8.5%) | ✅ Fixed — changed to 0.19 |
| F3 | Canola (Rapeseed) Oil was listed at NaOH SAP 0.124 — the traditional high-erucic rapeseed figure, not modern low-erucic canola (~0.133) | Real source disagreement, not a rounding difference; lye-light by ~7% (at the tool's 20% superfat ceiling, a 100%-canola recipe would really be ~25% superfat — outside the tool's own stated safe range) | ✅ Fixed — changed to 0.133, relabeled "Canola Oil (low-erucic rapeseed)" |
| F4 | No maximum lye-concentration check — a low-enough water percentage could request a physically impossible (>50%) solution; undissolved lye risks a caustic pocket in the finished bar. **The only finding with a direct burn-risk mechanism.** | Safety-relevant gap | ✅ Fixed — `calculateLyeAndWater` now throws above 50% lye concentration; `concentrationToRatio`/`ratioToConcentration` capped the same way |
| F5 | KOH path silently assumed 100% purity; real commercial KOH is commonly ~90% pure, meaningfully under-delivering alkali for liquid soap's tighter superfat convention | Real, safe-direction (lye-light) gap that should be user-visible | ✅ Fixed — added an adjustable `lyePurityPercent` field (lye calculator form), defaulting to 100 |
| F6 | Selecting "KOH (liquid soap)" still used bar-soap conventions: 5% default superfat (liquid-soap norm is 1-3%) and no mention that liquid soap needs a separate dilution step beyond the lye-solution water this tool computes | Real gap — the label over-promises what the tool does for liquid soap | ✅ Disclosed — inline note shown when KOH is selected; not auto-changed (deliberate: switching lye type shouldn't silently rewrite a user's other inputs) |
| F7 | Missing standard safety guidance: no-aluminum/hydrogen-gas warning, weigh-by-mass instruction, first-aid guidance | Real gap — no-aluminum is the most likely to surprise a beginner since the failure mode (gas) isn't obvious | ✅ Fixed — added to the lye calculator's safety box and summarized on the homepage |
| F8 | "Lye solution gets very hot (up to roughly 200°F/93°C)" understated real sources, which describe 200°F as commonly exceeded, not a ceiling | Minor inaccuracy | ✅ Fixed — reworded to "can reach 200°F/93°C or higher" |
| F9 | 10 of 12 SAP values, the 1.403 KOH conversion factor, the core `Σ(weight×SAP)×(1−superfat/100)` formula, the 0-20% superfat range, rejecting negative superfat, the 38%-of-oils and 2:1/33.33% water defaults, and the ratio↔concentration arithmetic | N/A — reviewed and confirmed grounded | No change needed |

## What's still worth a human soaper's double-check

- **The canola correction (0.124 → 0.133)**: the reviewer's mechanism
  (erucic-acid content driving SAP) is well-established chemistry, but
  neither the original build nor the review could read SoapCalc's or
  From Nature With Love's chart directly (WebFetch denied both times) —
  0.133 is a back-conversion from a search-reported KOH figure, not a
  directly-confirmed NaOH figure. Worth opening those charts by hand in
  a future session with working WebFetch.
- **The coconut correction (0.183 → 0.190)**: 0.183 isn't chemically
  wrong (it's within the real published range for coconut oil across
  different sources), the issue is specifically that it didn't match the
  two sources this table's header cites as corroboration. A future
  session could decide 0.183 vs. 0.190 more definitively by reading
  SoapCalc's page directly.
- **The 20% superfat ceiling** is craft convention with no single
  measured threshold — a working soap maker may have a better bound for
  a beginner-facing public tool.
- Not reviewed: the test suite itself, `lib/json-ld.tsx`.
