# soap-lye-calculator

Three tools for cold-process soap makers: a lye calculator (exact NaOH or
KOH and water amounts for a recipe of oils, by weight, with a superfat
percentage), a water:lye ratio / concentration converter, and a sourced
SAP-value reference chart for common oils. Part of the `svc-lab` portfolio
(see `E:\CLAUDE\projects\svc-lab\`).

## Running it

```
npm install --legacy-peer-deps
npm run dev
```

Production build/run: `docker compose --profile app up -d --build`
(no database — stateless).

## Tests

```
npx vitest run        # unit tests — lib/*.ts lye/ratio math and reference data
npx playwright test   # e2e — real browser flows for all three tools
```

## Current state

See `HANDOVER.md` for the math/sourcing notes (including the safety
rationale for the superfat/lye-type validation) and `GOALS.md` for the
full build and deploy history.
