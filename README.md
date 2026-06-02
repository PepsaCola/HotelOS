# HotelOS

Web application for hotel procurement and finance management. Single-page React app that consolidates purchase orders, approvals, receiving, invoicing, exports and budgeting into one workspace.

## Tech stack

- **React 18** + **TypeScript**
- **Vite 5** (dev server + bundler)
- **Tailwind CSS v4** via `@tailwindcss/vite` — design tokens declared in `src/index.css` `@theme`
- **react-router-dom v6** with `createBrowserRouter`
- Path alias `@/` → `src/`

## Getting started

```bash
npm install
npm run dev       # start dev server on http://localhost:5173
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint      # eslint
```

## Modules

The app ships 13 modules. Each is reachable from the sidebar:

| Path | Module | Purpose |
| --- | --- | --- |
| `/dashboard` | Dashboard | Daily visibility across approvals, budgets and receiving |
| `/po-log` | PO Log | Purchase-order queue, risk monitoring, activity history |
| `/create-po` | Create PO | New purchase order wizard |
| `/approval` | Approvals | Pending POs and the approval chain |
| `/receiving` | Receiving | PO fulfillment, remaining lines, delivery status |
| `/invoices` | Invoices | Receive, extract, match, approve and stage invoices |
| `/exceptions` | Exceptions | Investigate and resolve invoice / purchasing issues |
| `/exports` | Exports / M3 | Export pipeline from HotelOS to the M3 ERP |
| `/profitsword` | Profitsword | Import, validate and audit budget & forecast files |
| `/vendors` | Vendors / Contracts | Vendor and contract management |
| `/departments/*` | Departments | Department budgets and account-level performance (Rooms, F&B, A&G, IT, S&M, R&M) |
| `/settings` | Account Settings | Profile, permissions, accounting structure, integrations |

## Project structure

```
src/
  components/
    layout/        # AppShell, Sidebar, Topbar
    ui/            # Card, SegmentedControl, StatusPill, DeptTag, PageHeader, icons, ...
  lib/
    nav.tsx        # Sidebar navigation + breadcrumb helpers
    departments.ts # Department → Tailwind colour map
    money.ts       # Currency formatters
  services/        # Per-module data-access seams (mock today, real fetch later)
  types/           # Domain types describing backend payload shapes
  modules/
    <name>/
      data/        # Mock payload, shaped exactly as the backend will return
      lib/         # Pure view-model derivations, no React
      components/  # Presentational sections
      use<Name>.ts # Hook consuming the service
      <Name>Page.tsx
  router.tsx       # createBrowserRouter — maps each nav path to its page
  index.css        # Tailwind v4 @theme tokens + global keyframes
  main.tsx
```

## Module architecture

Every module follows the same backend-ready layering so swapping mock data for a real API only touches the service:

1. **`types/<module>.ts`** — domain types (top-level aggregate returned by the service).
2. **`modules/<name>/data/<name>Mock.ts`** — mock payload in the backend shape.
3. **`services/<name>Service.ts`** — async data-access seam: `fetch<Thing>(signal?): Promise<T>`. The single file to change when wiring a real backend.
4. **`modules/<name>/use<Name>.ts`** — hook returning `{ data, loading, error }` with `AbortController` cleanup.
5. **`modules/<name>/lib/*.ts`** — pure functions (view-model derivation, formatters, chart math). No React.
6. **`modules/<name>/components/*.tsx`** — presentational sections, props in, local UI state only.
7. **`modules/<name>/<Name>Page.tsx`** — composition: calls the hook, handles loading / error, lays out sections.

## Shared infrastructure

- **Layout** lives in `src/components/layout/`. `AppShell` provides the static sidebar (lg+) / drawer (mobile) and an `<Outlet/>` for module pages.
- **Display options** are global via `LayoutContext` — `density`, `showKpiStrip`, `financialEmphasis`. `density` and `financialEmphasis` apply app-wide through `data-*` attributes on `<main>` and global CSS, so per-table wiring is not required. `showKpiStrip` is wired per page by wrapping the page's KPI section.
- **Breadcrumbs** are rendered by the Topbar. Default trail is derived from the route via `breadcrumbForPath`; detail views publish a dynamic trail with `useBreadcrumb([...])`. Do not render in-page breadcrumbs (full-screen overlays such as `InvoiceReviewPage` are the only exception, and they still publish to the Topbar for lg+).
- **PO Log Totals Bar** is the only module-specific layout toggle, exposed through `useLayout().showTotalsBar`.

## Wiring a new module

1. Create the layers above under `src/modules/<name>/`.
2. Add the page import to `src/router.tsx` and register it in `moduleElements` under the module's nav path.
3. If the module needs a sidebar entry, append it to `primaryNav` (or `secondaryNav`) in `src/lib/nav.tsx`.

Unmapped nav paths fall back to `PagePlaceholder`, so new modules can be added incrementally.

## Verification

Run `npm run build` (tsc + Vite) before shipping changes. Visually verify the affected route in the dev server at desktop and mobile breakpoints — the layout uses `lg:` for the sidebar / mobile-drawer split, and several panels switch grid shape at `2xl:`.
