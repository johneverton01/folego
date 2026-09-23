# Fôlego — esqueleto (TanStack Start)

Scaffold do Fôlego em **TanStack Start** (RC, Vite-nativo) já com o design system plugado:
tokens → CSS variables → Tailwind v4, mais as rotas de landing, autenticação e app, e os
primitivos do DS.

## Rodar

```bash
pnpm install        # ou npm / yarn / bun
pnpm dev            # sobe em http://localhost:3000
pnpm build
```

Na primeira execução, o plugin do Start gera `src/routeTree.gen.ts` a partir de `src/routes/`
(por isso ele está no `.gitignore` e não existe ainda).

> **Versões:** as libs do TanStack estão como `latest` de propósito — o Start está em RC e a
> API se estabiliza rápido. O jeito mais seguro é gerar um projeto com o starter oficial
> (`npm create @tanstack/start@latest`) e conferir os pins de `@tanstack/react-start`,
> `@tanstack/react-router` e `vite`, ou rodar `npm i @tanstack/react-start@latest
> @tanstack/react-router@latest`.

## Estrutura

```
folego/
├─ vite.config.ts        # tailwindcss() + tanstackStart() + viteReact() (nessa ordem)
├─ tsconfig.json         # paths "@/*" -> "src/*"
├─ tokens.json           # fonte da verdade dos design tokens (DTCG)
├─ design.md             # documentação do design system
└─ src/
   ├─ router.tsx         # createRouter() do TanStack
   ├─ styles/
   │  ├─ tokens.css       # CSS variables (claro/escuro), canais RGB
   │  └─ app.css          # @import tailwindcss + @theme (mapeia tokens -> utilitários)
   ├─ lib/
   │  ├─ cn.ts            # junta classNames
   │  ├─ finance.ts       # NÚCLEO: resumo(), gastosPorCategoria(), simularMeta(), money()
   │  └─ store.ts         # estado (zustand) com semente de exemplo
   ├─ components/
   │  ├─ brand/Logo.tsx
   │  ├─ ui/              # Button, Card, Field, Semaforo, ThemeToggle
   │  └─ app/            # FolegoHero, Ledger, SalarioFantasma
   └─ routes/
      ├─ __root.tsx       # documento HTML, fontes, CSS, anti-flash de tema
      ├─ index.tsx        # / landing
      ├─ login.tsx        # /login
      ├─ recover.tsx      # /recover  (recuperar senha)
      ├─ app.tsx          # /app      layout (topbar + Outlet)
      ├─ app.index.tsx    # /app      painel
      ├─ app.metas.tsx    # /app/metas
      └─ app.aprender.tsx # /app/aprender
```

## Como o design system entra

- `styles/tokens.css` guarda as cores como **canais RGB** (`--accent: 38 140 92`).
- `styles/app.css` faz `@theme { --color-accent: rgb(var(--accent)); … }`, então nascem os
  utilitários (`bg-accent`, `text-ink-soft`, `rounded-card`, `shadow-float`, `font-display`,
  `animate-breathe`). Como apontam pra variável, **claro/escuro troca sozinho** — quase nunca
  se usa `dark:`.
- Opacidade funciona (`bg-accent/10`) via `color-mix` do Tailwind v4.

> Você também tem um `tailwind.config.ts` (Tailwind v3) do pacote de tokens anterior. Este
> esqueleto usa **Tailwind v4** (`@tailwindcss/vite` + `@theme`), que é o encaixe nativo com
> Vite/Start. Escolha um dos dois: se preferir v3, troque `app.css` pelas diretivas
> `@tailwind` e traga o `tailwind.config.ts` + `postcss`.

## Portar o resto

A **landing** e o **app** publicados como protótipo têm seções que aqui estão resumidas.
Portas naturais:

- Seções de marketing (problema, como funciona, voz, CTA) → `src/components/marketing/*`,
  usadas em `routes/index.tsx`.
- Modais de registrar entrada/saída e nova meta → `src/components/app/*` + ação `add()` do
  store; abra a partir do botão "Registrar" no `app.tsx`.
- Alertas e coach → componentes em `src/components/app/`, alimentados por regras sobre
  `finance.ts`.

## Próximos passos sugeridos

1. `Button`/`Field` já são a base — completar o kit (Select, Modal, Chip, Alert, Toast).
2. Trocar o `store` por **server functions** do Start (`createServerFn`) + persistência.
3. Storybook consumindo os mesmos tokens, com o design system publicado como especificação.