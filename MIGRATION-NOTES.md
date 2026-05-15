# Accent Trainer — @sandy Registry Migration

Migration completed 2026-04-20.

## Result

- **TypeScript**: `npx tsc --noEmit` — passes, zero errors.
- **Dev server**: Boots (Next.js 16.2.0 + Turbopack, ~424ms). Renders `<TopNav>` with Home/Practice nav items; `<main>` shell wraps page content. Server-rendered HTML confirms OKLCH tokens applied via CSS vars and shadcn component classes.
- **ast-grep (no-raw-html-elements)**: clean, zero violations.
- **oxlint (default ruleset)**: 2 unused-import warnings (`wordPhonemeShifts`, one other) — unrelated to registry migration.

## Wave recap

| Wave | Scope | Status |
|------|-------|--------|
| 0 | Registry config, OKLCH tokens, fonts | done |
| 1 | Top-nav layout block integration | done |
| 2 | Component reinstallation from `@sandy` | done |
| 3 | Enforcement fixes | done |
| 4 | Integration verification (this pass) | done |

## Spec acceptance

- **REQ-registry-foundation-002** (OKLCH token flow): ✅ CSS vars render, dark-mode script attached to `<html class>`.
- **REQ-layout-shell-001** (top-nav as app shell): ✅ `<header class="sticky top-0…">` with `<TopNav>` wraps `<main>` in root layout.
- **REQ-enforcement-compliance-001/002/003** (zero violations): ✅ ast-grep HTML rule clean; component-library oxlint surface clean (see gap below re: shared config).

## Registry gaps discovered

1. **Shared oxlint config (`$DOTFILES/.claude/rules/oxlint/oxlintrc.jsonc`) fails to parse** against the oxlint binary currently installed:
   - `Rule 'no-restricted-syntax' not found in plugin 'eslint'`
   - `Rule 'no-restricted-syntax_log-and-throw' not found in plugin 'eslint'`
   - `Rule 'prop-types' not found in plugin 'react'`
   This is a dotfiles-side bug, not accent-trainer's. The ast-grep rules still work and were used for enforcement.
2. No registry-provided `AppShell` block — `TopNav` is reinstalled per-project rather than composed via a registry layout primitive. Candidate for a future `@sandy/layout-top-nav-shell` block so apps don't reimplement the `<header><main>` structure.
3. No registry `QueryProvider` / `ThemeProvider` provider composition block — both are hand-wired in `src/app/layout.tsx`. Candidate for `@sandy/providers-stack`.

## Known non-blocking items

- Port 3000 is occupied by the wearebeam/magicnotes Rails app on this machine; verified accent-trainer on `PORT=3456` instead.
- Two unused `schema` imports flagged by default oxlint — safe to prune in a follow-up cleanup.
