# Fôlego

Fôlego é um educador e organizador financeiro para desenvolvedores PJ. Renda de contrato ou
freela é irregular — Fôlego existe pra dar esse espaço de respirar entre um pagamento e outro:
registra o que entra e sai, mostra quanto sobra no mês num semáforo (verde/âmbar/vermelho) em
vez de números frios, ajuda a planejar metas de reserva e devolve sugestões geradas por IA sobre
como chegar nelas mais rápido.

Construído em **TanStack Start** (Vite-nativo, SSR) com Postgres (Docker) via Prisma, Better
Auth e Tailwind v4, seguindo um design system próprio (tokens → CSS variables → utilitários).

## Principais funcionalidades

- **Painel do mês** — resumo de entradas, saídas e quanto sobrou (`Fôlego`), com indicador em
  semáforo (ok / atenção / crítico) em vez de só um número.
- **Lançamentos** — registra entradas e saídas por categoria (Casa, Comida, Impostos/PJ, Lazer,
  Transporte, Assinaturas, Contrato PJ, Freela, Outros...), com um drawer rápido pra adicionar.
- **Histórico** — navegação por mês/ano com filtros por tipo e categoria, e resumo anual.
- **Gastos por categoria** — visualização em gráfico de pizza da distribuição de entradas e
  saídas no período.
- **"Salário fantasma"** — ajuda a visualizar o equivalente a um salário fixo a partir de uma
  renda que varia mês a mês.
- **Metas de reserva** — criação de metas com valor-alvo e aporte mensal planejado, acompanhamento
  de aportes feitos, progresso e previsão de quando a meta fecha.
- **Sugestão com IA** — cada meta recebe uma sugestão gerada por IA (Gemini), construída a partir
  dos dados da própria meta e do resumo financeiro do mês, com a chamada feita em uma server
  function autenticada (a chave da API nunca chega ao client).
- **Aprender** — lições curtas e práticas sobre finanças PJ (reserva de emergência, renda
  irregular, DAS e impostos).
- **Autenticação** — cadastro, login (e-mail/senha ou Google) e recuperação de senha via
  Better Auth, com saldo inicial configurável por usuário pra calibrar a reserva com o saldo
  real.
- **Tema claro/escuro** — alternância persistida em `localStorage`, aplicada antes da hidratação
  pra evitar flash de tema incorreto.

## Rodar

Requer [Docker](https://www.docker.com/) (banco local) e **pnpm** como gerenciador de pacotes.

```bash
pnpm install
docker compose up -d      # sobe o Postgres local (folego-db)
pnpm db:push               # aplica o schema do Prisma no banco
pnpm dev                   # sobe em http://localhost:3000
```

Variáveis de ambiente: copie `.env.example` para `.env` (e `.env.local` se quiser sobrescrever
localmente) — inclui `DATABASE_URL`, segredos do Better Auth (e, opcionalmente, login com
Google) e `GEMINI_API_KEY` (necessária pra sugestão com IA nas metas).

Outros comandos úteis:

```bash
pnpm build                # build de produção
pnpm preview              # preview do build

pnpm lint                 # biome lint
pnpm format               # biome format
pnpm check                # biome check (lint + format)

pnpm db:generate           # prisma generate
pnpm db:migrate             # prisma migrate dev
pnpm db:studio               # prisma studio
pnpm db:seed                  # prisma db seed

pnpm storybook             # storybook dev server (porta 6006)
pnpm vitest                 # testes (stories via Vitest + Playwright)
```

Na primeira execução, o plugin do Start gera `src/routeTree.gen.ts` a partir de `src/routes/`
(por isso ele está no `.gitignore` e não existe ainda).

## Estrutura

```
folego/
├─ docker-compose.yml     # Postgres local (serviço "db", container "folego-db")
├─ prisma/schema.prisma   # User, Session/Account (Better Auth), Lancamento, Meta, Aporte
├─ tokens.json            # fonte da verdade dos design tokens (DTCG)
├─ design.md              # documentação do design system
└─ src/
   ├─ routes/             # rotas (TanStack Router, file-based)
   │  ├─ index.tsx           # / landing
   │  ├─ auth/               # /auth/sign-in, sign-up, recover
   │  ├─ app.tsx              # /app layout (topbar + Outlet)
   │  ├─ app.index.tsx         # /app painel do mês
   │  ├─ app.historico.tsx      # /app/historico
   │  ├─ app.metas.tsx            # /app/metas layout
   │  ├─ app.metas.index.tsx       # /app/metas lista de metas
   │  ├─ app.metas.$id.tsx          # /app/metas/:id detalhe + sugestão de IA
   │  ├─ app.aprender.tsx            # /app/aprender lições
   │  └─ api/auth/$.ts                # rota catch-all do Better Auth
   ├─ pages/              # componentes de página (landing, sign-in, sign-up)
   ├─ components/
   │  ├─ brand/              # Logo
   │  ├─ ui/                 # primitivos do design system (shadcn + Semaforo, ThemeToggle...)
   │  └─ app/                # FolegoHero, Ledger, PorCategoria, SalarioFantasma, drawers...
   ├─ hooks/              # useLancamentos, useMetas, useInsight (TanStack Query)
   ├─ lib/
   │  └─ finance.ts         # núcleo de cálculo: resumo(), totaisPorCategoria(), progressoMeta()...
   ├─ data/ai-prompt.ts   # monta o prompt enviado à IA a partir da meta e do resumo do mês
   ├─ services/ai-service.ts  # integração com o Gemini (chamada server-side)
   └─ styles/             # tokens.css (CSS variables claro/escuro) + app.css (Tailwind v4)
```

## Design system

- `styles/tokens.css` guarda as cores como **canais RGB** (`--accent: 38 140 92`).
- `styles/app.css` faz `@theme { --color-accent: rgb(var(--accent)); … }`, então nascem os
  utilitários (`bg-accent`, `text-ink-soft`, `rounded-card`, `shadow-float`, `font-display`).
  Como apontam pra variável, **claro/escuro troca sozinho** — quase nunca se usa `dark:`.
- Opacidade funciona (`bg-accent/10`) via `color-mix` do Tailwind v4.
- Detalhes completos de cor, tipografia, espaçamento e componentes em [`design.md`](./design.md).

> **Versões:** as libs do TanStack estão fixadas intencionalmente — o Start ainda estabiliza
> a API rápido entre versões. Ao atualizar, confira os pins de `@tanstack/react-start`,
> `@tanstack/react-router` e `vite` juntos.
