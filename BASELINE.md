# Design System Baseline

`accent-trainer` consumes the `@sandy/ui-registry` design system. This file is
the manifest of every registry item the project depends on, pinned to the
dotfiles commit the items were sourced from.

Lineage: this baseline was established by the `@sandy` registry migration
(PR #1, `feat/registry-migration`) and closed out under the
`design-system-as-product` objective as the **migration proof** — the
existing-project counterpart to the greenfield init proof tracked in
openspec change `design-system-as-product-p1-greenfield-project-pick-and-init`.

Registry source: `@sandy` → `file:///Users/sandy/projects/dotfiles/toolchain/ui-registry/` (see `components.json`).
Pinned to: **dotfiles @ `e17facdba`**.

## Registry items consumed

### Base

- `@sandy/sandy-base` — OKLCH color tokens, `--radius: 0.375rem`, Inter / JetBrains Mono typography. Wired into `src/app/globals.css` (`:root`, `.dark`, `@theme inline`).

### Theme

- `sandy-theme-default` — neutral, hue-free OKLCH grayscale ramp. Token values are baked into `src/app/globals.css` rather than tracked as a discrete installed item.

### Layout blocks

- `@sandy/sandy-layout-top-nav` — `src/components/ui/top-nav.tsx`. Consumed as the root-layout shell in `src/app/layout.tsx`.

### Primitives

Installed under `src/components/ui/`:

- `badge`
- `button`
- `card`
- `navigation-menu`
- `progress`
- `separator`
- `sheet`
- `skeleton`
- `sonner`
- `tooltip`

## Known gaps

- **`@sandy/sandy-block-providers-stack` not adopted.** `ThemeProvider` and `QueryProvider` are hand-wired in `src/components/theme-provider.tsx` and `src/components/query-provider.tsx`, and composed directly in `src/app/layout.tsx` rather than via the registry's `<Providers>` block. The registry block now exists; adopting it is a follow-up (canonical pattern: `<Providers><TopNavContentLayout>{children}</TopNavContentLayout></Providers>`).

## How this baseline was constructed

See `MIGRATION-NOTES.md` for the wave-by-wave migration record and the original
registry gaps surfaced (two of which — shared oxlint config and the
`sandy-layout-top-nav` block — have since been closed registry-side).
