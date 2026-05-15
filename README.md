# accent-trainer

An AI-powered accent training coach. Practice words and phrases for a target
accent, record yourself, and get evaluation feedback with reference text-to-speech.

Design system: see [`BASELINE.md`](./BASELINE.md) — this project consumes the
`@sandy/ui-registry` design system (lineage: dotfiles openspec change
`design-system-as-product-p1-greenfield-project-pick-and-init`, migration proof).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind · Drizzle · bun.

## Develop

```bash
bun install
bun run dev      # dev server (Turbopack)
bun run build    # production build
bun run test     # vitest
```

Database (Drizzle):

```bash
bun run db:generate
bun run db:migrate
bun run db:seed
```
