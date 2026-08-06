# ToolsOnway

A free online tools platform — manifest-driven and engine-powered. Every
route, page, sitemap, search entry, JSON-LD schema and internal link is
generated from a single source of truth: the **tool registry**.

## Stack

- React 19 + TypeScript (strict)
- Vite 8 + custom Static Site Generation (every page pre-rendered to HTML)
- Tailwind CSS 4 + shadcn-style UI components
- React Router 7 (declarative tree used by both client and SSR)
- Fuse.js fuzzy search + Cmd/Ctrl+K command palette
- Vitest for engine unit tests
- Hosted on Vercel (static output, no server functions)

## Core architecture

```
ToolDefinition (data only, 1 manifest per tool)
   └─ derived → routes, sitemap, search, JSON-LD, OG, breadcrumbs, internal links
   └─ resolved by convention → engine.ts + index.tsx (lazy chunk per tool)
```

Two hard rules:

1. **The registry is data only.** Manifests are serializable and contain no
   React components or functions. Code is resolved by path convention.
2. **Engines are environment-agnostic.** No DOM, no `window`, no `FileReader`.
   They receive bytes and return bytes, so they are testable, swappable and
   Web-Worker ready.

## Adding a new tool (~10 minutes)

Create one folder:

```
src/features/tools/{category}/{slug}/
  manifest.ts   # all SEO content, FAQ, how-to, metadata (see below)
  engine.ts     # pure logic (calculator / text / file contract)
  index.tsx     # default-exported component: ({ tool }) => JSX
```

That's it. Routes, sitemap, search, breadcrumbs, JSON-LD and related links are
generated automatically. Duplicate slugs or dangling related links fail the
build. Run `npm run build` and `npm test` to verify.

### `manifest.ts` requirements

```ts
import type { ToolDefinition } from "@/data/types"
export const definition: ToolDefinition = { /* see src/data/types.ts */ }
```

### Engine contracts (`src/features/tools/engine.ts`)

- **calculator** — pure `(input) => output`
- **text** — `(input) => EngineResult<output>`
- **file** — `(input) => FileJob<output>` (async, progress + cancel)

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run typecheck` | Strict TS check |
| `npm test` | Engine unit tests (Vitest) |
| `npm run lint` | oxlint |
| `npm run build` | Typecheck → client build → sitemap/robots → SSG prerender |

## SEO

Every route is pre-rendered with a complete head: title, description,
canonical, OpenGraph, Twitter Card and JSON-LD (WebSite, Organization,
BreadcrumbList, WebApplication, FAQPage, HowTo). `sitemap.xml` + `robots.txt`
are generated from the registry at build time.

## Analytics & monetisation

- GA4 / GTM / Clarity IDs live in `src/data/site.ts` (empty = disabled).
- Events: `tool_viewed`, `tool_used`, `download`, `search_opened`.
- Ad slots use fixed reserved dimensions (`AdPlaceholder`) so there is zero
  layout shift.
