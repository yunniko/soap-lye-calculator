# Handover — soap-lye-calculator
Last verified: 2026-09-12 at 6515e60

> **SUSPENDED (Owner, 2026-09-27)** — part of the svc-lab family, suspended because it did not work out as expected.
> No new work; security upkeep only while anything of it is live. Treat its code, formulas and
> decisions as a **lower-reliability reference**: they may or may not still work, so re-verify before
> reusing anything. Rules: `E:\CLAUDE\COMPANY\GOALS.md` → "Suspended projects".

svc-lab service #10. Goal: `GOALS.md` G-001. Shared conventions: `E:\CLAUDE\projects\svc-lab\`;
charter: `E:\CLAUDE\COMPANY\`.

## Current state

- **Live** at https://soap-lye-calculator.svc.julienika.cz (deployed 2026-09-09, port 30140;
  HTTP 200 re-checked 2026-09-12).
- Three tools, no database: `/lye-calculator` (multi-oil recipe → NaOH/KOH + water, lye purity,
  50% max-concentration guard), `/water-lye-ratio` (ratio ↔ concentration ↔ water), and a
  sourced SAP reference.
- Verification on 2026-09-12: `npm run test:unit` 32/32. e2e last green 2026-09-09.
- Domain-expert and manual security reviews done (D002, D003). Git tree clean.

## How things fit together

Standard svc-lab stateless Next.js service. Pure logic in `lib/lye-calculator.ts`,
`lib/water-lye-ratio.ts`, `lib/oil-sap-reference.ts`; forms in `app/_components/`, pages under
`app/<tool>/`.

## Rules in force

- Real safety stakes: SAP values change only with a cited source; keep the 0–20% superfat clamp
  and the 50% concentration guard (D002).
- `npm ci --legacy-peer-deps`; run unit, e2e and `npm run build` before calling work done.

## Next steps and open questions

- Have a soap maker or a WebFetch session confirm canola 0.133 and coconut 0.190 against
  SoapCalc and From Nature With Love directly.
- AdSense per-domain approval unconfirmed (portfolio-wide).

## Deploy log

| Date | Commit | What changed | Verified how |
|---|---|---|---|
| 2026-09-09 | 6515e60 | First deploy (port 30140) | Routes curl 200, sibling sites unaffected |

## Decisions

`docs/decisions/README.md` (D001–D003).
