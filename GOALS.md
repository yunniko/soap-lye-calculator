# Goals — soap-lye-calculator

> **SUSPENDED (Owner, 2026-09-27)** — part of the svc-lab family, suspended because it did not work out as expected.
> No new work; security upkeep only while anything of it is live. Treat its code, formulas and
> decisions as a **lower-reliability reference**: they may or may not still work, so re-verify before
> reusing anything. Rules: `E:\CLAUDE\COMPANY\GOALS.md` → "Suspended projects".

Owner writes goals here; The Company plans, executes, and logs against them.
Statuses: `DRAFT` · `ACTIVE` · `BLOCKED` · `DONE`.
Parent initiative: `E:\CLAUDE\projects\svc-lab\` (same milestone-gate waiver
and standing deploy pre-approval apply here). Template/numbering
conventions in `E:\CLAUDE\COMPANY\GOALS.md`.

## Active goals

### G-001 · Cold-process soap lye calculators — SUSPENDED
- **What:** Three tools: a lye calculator (`/lye-calculator` — exact NaOH
  or KOH and water amounts for a recipe of oils by weight, with a
  superfat percentage), a water:lye ratio / concentration converter
  (`/water-lye-ratio`), and a sourced oil SAP-value reference chart
  (`/oil-sap-reference`). No database, no accounts.
- **Why:** svc-lab backlog idea #12 — reasoned signal (competitor-gap: the
  dominant existing tool, SoapCalc, is real and free but has a dated,
  cluttered UI). A genuine craft-chemistry domain with real safety stakes
  (a wrong lye amount can leave a batch caustic or unsafely lye-heavy) —
  the same shape as the resin/clay/sourdough calculators that already
  proved this pattern out well, not the "legal advice" risk category that
  keeps ideas #5/#6 skipped.
- **Acceptance criteria:** Lye/water math unit-tested (including a
  superfat-discount check and a NaOH→KOH conversion check), SAP reference
  values sourced and cross-corroborated across independent references,
  domain-expert-reviewed before shipping given the real safety stakes, a
  real browser flow verified (e2e-tested), live and reachable over HTTPS,
  sitemap present, prominent lye-safety guidance on the calculator page.
- **Constraints:** No database, no accounts, no paid dependencies.

**Milestones:**
- [x] M1 — Build: lye/water calculation math (multi-oil recipe, superfat
      discount, NaOH/KOH conversion), water:lye ratio/concentration
      converter math, a sourced oil SAP-value reference table, 3 tool
      pages, unit tests, e2e tests. ✔ 2026-09-09.
- [x] M1b — Domain-expert review (cold-process soap-making chemistry/
      safety). Found and fixed real issues, not just gaps: two SAP
      figures (coconut, canola) that didn't match this table's own cited
      sources, a missing maximum-lye-concentration safety guard (the
      only finding with a direct burn-risk mechanism), an undisclosed
      KOH-purity assumption, a KOH/liquid-soap scope gap, and missing
      standard safety guidance. ✔ 2026-09-09 — see `docs/domain-
      reference.md` and `HANDOVER.md` D2.
- [ ] M2 — Ship: git init, security review, push via `init-repo.ps1`,
      deploy via `deploy-service.ps1`, verify live, update hub page and
      sitemap index.
- [ ] M3 — Monetization once an ad account exists for this domain (already
      wired via the shared `ADSENSE_PUBLISHER_ID` env var, awaiting
      AdSense's own per-domain approval, same as every other svc-lab
      service).

**Progress log** (newest first):
- 2026-09-09 — M1 complete this run (svc-lab daily automation, second
  invocation of the day). Sourcing note: WebFetch was denied this session
  (confirmed, same known limitation as prior runs — see
  `svc-lab/HANDOVER.md`'s research-caveat decision), so the oil SAP-value
  table is sourced via WebSearch synthesis, cross-corroborated across
  three independent long-standing soap-making references (From Nature
  With Love's saponification chart, SoapCalc's own published oil list,
  soap-making-resource.com's saponification table) that converged on the
  same NaOH SAP values within normal rounding for every oil. The KOH
  conversion factor (×1.403) is the standard, well-established molar-mass
  ratio, not independently sourced per oil — spot-checked against
  liquid-soap-specific sources' own KOH figures for olive and coconut oil,
  which matched. Full citations in `lib/oil-sap-reference.ts`'s header
  comment. Flagging this explicitly for the mandatory domain-expert review
  (M1b) to verify or correct before shipping, same pattern as every prior
  svc-lab service's sourcing caveat — and especially important here given
  the real safety stakes of a wrong lye figure.
