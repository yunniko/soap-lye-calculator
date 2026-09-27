# D003 · Main calculator expresses water as % of oil weight (default 38%); a converter covers the other conventions
Date: 2026-09-09 · Goal: G-001 · Status: active
Context: Water:lye ratio and lye concentration are equally real conventions.
Decision: `/water-lye-ratio` translates between all three rather than forcing one. Manual security review (skill needs `origin/HEAD`) clean.
Rejected: one convention only.
Consequence: —
Evidence: `lib/water-lye-ratio.ts` header.
