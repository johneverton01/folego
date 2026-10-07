# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml` / `pnpm-workspace.yaml` present), even though the README shows `npm`.

```bash
pnpm dev                # start dev server on port 3000 (vite dev)
pnpm build               # production build (vite build)
pnpm preview             # preview production build

pnpm lint                # biome lint
pnpm format               # biome format
pnpm check                # biome check (lint + format)

pnpm generate-routes      # regenerate src/routeTree.gen.ts via `tsr generate` (normally automatic via the TanStack Start vite plugin during dev/build)

pnpm db:generate           # prisma generate (uses .env.local + .env via dotenv-cli)
pnpm db:push                # prisma db push
pnpm db:migrate              # prisma migrate dev
pnpm db:studio                 # prisma studio
pnpm db:seed                    # prisma db seed (runs prisma/seed.ts)

pnpm storybook             # storybook dev server on port 6006
pnpm build-storybook        # build static storybook
```

There is no top-level `test` script. Tests run through Vitest's Storybook addon (`vite.config.ts` `test.projects`), which executes stories in a real Chromium browser via Playwright. Run with `pnpm vitest` (or `pnpm vitest run` for CI mode); target a single story file with `pnpm vitest run path/to/File.stories.ts`.

Biome formatting uses **tabs** and **double quotes** (see `biome.json`). Biome only lints/formats `src/**`, `.vscode/**`, `index.html`, and `vite.config.ts`, and explicitly excludes the generated `src/routeTree.gen.ts` and `src/globals.css`.

## Architecture

This is a **TanStack Start** app (file-based routing via TanStack Router, Vite-based SSR framework, Nitro server adapter) bootstrapped from the `create-tanstack` CLI (`.cta.json` lists the chosen add-ons: biome, nitro, prisma, ai, shadcn, table, store, tanstack-query, storybook, paraglide, better-auth, neon — the `neon` add-on has since been replaced by a local Docker Postgres, see Data layer below).

### Routing
- Routes are files under `src/routes/`; `src/routeTree.gen.ts` is auto-generated — never edit it by hand.
- `src/routes/__root.tsx` defines the document shell (`shellComponent`), injects the theme-init script (reads `localStorage` theme before hydration to avoid FOUC), mounts `Header`/`Footer`, and wires up `TanStackDevtools` (router, store, query panels).
- API routes are TanStack Start server routes using `server: { handlers: { GET, POST, ... } }` inside `createFileRoute` (see `src/routes/api/auth/$.ts`, `src/routes/demo/api.ai.*.ts`). Files named `demo*` or `api.*` under `src/routes/demo/` are throwaway scaffolding from the CLI template and are safe to delete/replace.
- Path alias: `#/*` (and `@/*`) → `./src/*` (configured in both `tsconfig.json` and `package.json#imports`). Prefer `#/` in new code since it's the primary alias used throughout `src/`.

### Data layer
- **Postgres via Docker**: `docker-compose.yml` runs a local `postgres:17-alpine` container (service `db`, container `folego-db`) on port 5432, with user/password/db all `folego`. Start it with `docker compose up -d` before `pnpm dev` or any `pnpm db:*` command.
- **Prisma** (`prisma/schema.prisma`) targets Postgres, with the generated client output to `src/generated/prisma` (not the default `node_modules` location). Regenerate with `pnpm db:generate` after schema changes. The client is constructed via `@prisma/adapter-pg` (`src/lib/prisma.ts`), using `DATABASE_URL` directly rather than a `url` in the Prisma schema's `datasource` block.
- `src/database-url.ts` reads `process.env.DATABASE_URL` (throws if missing) — this is the single source of the connection string, used by both `src/lib/prisma.ts` and `prisma/seed.ts`.
- Prisma env vars load through `dotenv-cli` from `.env.local` and `.env` (see the `db:*` scripts), with `.env.local` taking precedence. `.env` holds `DATABASE_URL` pointing at the Docker container (see `.env.example`).
- The project previously used Neon (`@neondatabase/serverless`, `vite-plugin-neon-new`, auto-provisioned claimable DBs) — this has been fully removed in favor of the local Docker Postgres above.

### Auth
- **Better Auth** is configured in `src/lib/auth.ts` (email/password enabled, `tanstackStartCookies()` plugin for TanStack Start cookie integration) and mounted at the catch-all route `src/routes/api/auth/$.ts`. Client-side hooks are in `src/lib/auth-client.ts`; `src/integrations/better-auth/header-user.tsx` renders the signed-in user in the header.

### AI integration
- Uses `@tanstack/ai` (provider-agnostic chat/streaming primitives) with adapter packages per vendor (`@tanstack/ai-anthropic`, `-openai`, `-gemini`, `-ollama`). See `src/routes/demo/api.ai.chat.ts` for the pattern: pick a provider/model at request time based on which API key env var is set (Anthropic → OpenAI → Gemini → Ollama fallback), build an adapter, and stream via `chat({ adapter, tools, systemPrompts, agentLoopStrategy, messages })` returned as SSE (`toServerSentEventsResponse`).
- Tool-calling pattern: tools can execute server-side (e.g. `getGuitars` in `src/lib/demo-guitar-tools.ts`) or be declared without a server `execute` so the client handles rendering/interaction (e.g. `recommendGuitarToolDef`).
- Other AI demo routes (`api.ai.image.ts`, `api.ai.structured.ts`, `api.ai.transcription.ts`, `api.ai.tts.ts`) show image generation, structured output, transcription, and TTS variants of the same adapter pattern.

### State management
- `@tanstack/store` for lightweight global client state (`src/lib/demo-store.ts`), wired into `TanStackDevtools` via `src/lib/demo-store-devtools.tsx`.
- `@tanstack/react-query` for server state, integrated with the router via `setupRouterSsrQueryIntegration` in `src/router.tsx` and `src/integrations/tanstack-query/root-provider.tsx` (SSR-aware query hydration).

### i18n
- **Paraglide JS** (`@inlang/paraglide-js`) generates typed message functions into `src/paraglide/` from source messages in `messages/` / `project.inlang/`. This output is regenerated by the Vite plugin (`paraglideVitePlugin` in `vite.config.ts`, `outdir: './src/paraglide'`) on dev/build — don't hand-edit files under `src/paraglide/`.
- Locale strategy is `['url', 'baseLocale']` — locale is encoded in the URL. `getLocale()` (from `#/paraglide/runtime`) is used both in `__root.tsx`'s `beforeLoad` (sets `<html lang>`) and in the shell component.
- `LocaleSwitcher` component (`src/components/LocaleSwitcher.tsx`) handles locale switching UI.

### Styling & UI
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not a separate PostCSS config). Global styles in `src/globals.css` and `src/styles.css`.
- **shadcn/ui** components (config in `components.json`) — add new components with `pnpm dlx shadcn@latest add <component>`, per `.cursorrules`.
- Design tokens in `tokens.json` and `tailwind.config.ts`; `design.md` documents the design system at the root.
- `ThemeToggle` supports light/dark/auto, persisted to `localStorage` and applied pre-hydration by the inline script in `__root.tsx` to avoid flash-of-incorrect-theme.

### Storybook
- Config in `.storybook/main.ts` / `.storybook/preview.tsx`. Stories currently only exist for the CLI-scaffolded demo components in `src/stories/` (Button, Header, Page). Storybook tests run through the Vitest browser addon (see Commands above), not `pnpm storybook` itself.

### Demo/scaffold files
Files and routes prefixed `demo` (`src/components/demo-*`, `src/hooks/demo-*`, `src/lib/demo-*`, `src/routes/demo/**`, `src/routes/demo.i18n.tsx`) are starter examples from the `create-tanstack` scaffold, intended to be deleted or replaced as real features are built — don't treat them as established architectural patterns to preserve, but they're useful as reference for how each add-on (AI, Prisma, TanStack Query/Store/Table, Better Auth, i18n) is expected to be wired up. (The Neon demo route, `src/routes/demo/neon.tsx`, was removed along with the rest of the Neon integration.)
