# Fôlego — Design System

Dinheiro tranquilo pra quem é PJ. Este documento é a referência técnica do design system: como os tokens viram estilo, como consumir no código e como o tema claro/escuro funciona.

O produto é um educador financeiro para desenvolvedores PJ. A identidade nasce de uma ideia só — **fôlego**, o espaço pra respirar quando a renda é irregular. Tudo abaixo serve a isso: calma antes de densidade, um herói por tela, sem julgamento.

---

## Arquitetura de tokens

Uma fonte da verdade, três formatos derivados. Ninguém escreve hex solto no componente.

```
tokens.json            fonte da verdade (formato W3C Design Tokens / DTCG)
    │
    ├─► globals.css     CSS variables em canais RGB, com temas claro/escuro
    │
    └─► tailwind.config.ts   mapeia os tokens para utilitários do Tailwind
              │
              └─► componentes (React/Next)   usam só classes: bg-surface, text-accent…
```

Decisão-chave: as cores nas CSS variables ficam em **canais RGB** (`--accent: 38 140 92`), não em hex. O Tailwind as consome com o padrão `rgb(var(--accent) / <alpha-value>)`, o que libera opacidade nos utilitários (`bg-accent/10`, `text-ink/70`) — impossível quando a variável guarda um hex fechado. O tema troca sozinho porque as classes apontam para a variável, não para o valor.

### Arquivos do pacote

| Arquivo | Papel |
|---|---|
| `tokens.json` | Fonte da verdade. Cores, tipografia, espaço, raio, sombra, movimento. |
| `globals.css` | Variáveis CSS (claro + escuro) + base mínima (fontes, foco, seleção). Importe uma vez. |
| `tailwind.config.ts` | Traduz os tokens em classes utilitárias. |
| `design.md` | Este guia. |

---

## Instalação

1. **Fontes** — adicione ao `<head>` (ou use `next/font`):

   ```html
   <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
   ```

2. **CSS** — importe `globals.css` no topo da app (ex.: `app/globals.css` do Next) e, depois dele, as diretivas do Tailwind:

   ```css
   @import "./globals.css";
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Config** — coloque `tailwind.config.ts` na raiz. Ajuste o `content` para os seus caminhos.

---

## Cor

Camada semântica: os mesmos nomes valem nos dois temas. Você nunca escolhe "verde claro" — escolhe `accent`, e o tema decide o tom.

| Token (Tailwind) | Papel | Claro | Escuro |
|---|---|---|---|
| `paper` | Fundo da página | `#F1F5F0` | `#0D1815` |
| `surface` | Card / superfície | `#FFFFFF` | `#132320` |
| `surface-soft` | Superfície recuada | `#F7FAF6` | `#0F1E1A` |
| `ink` | Texto principal | `#14231F` | `#E9F2EC` |
| `ink-soft` | Texto de apoio | `#4E605A` | `#9DB2AA` |
| `ink-faint` | Legenda / placeholder | `#84968F` | `#6C8079` |
| `line` | Bordas e divisórias | `#DFE7DE` | `#233A32` |
| `accent` | Marca / ação | `#268C5C` | `#48BD84` |
| `accent-deep` | Marca sobre claro / link | `#1B6644` | `#6BD3A0` |
| `accent-wash` | Fundo suave / anel de foco | `#E6F2EA` | `#152C22` |
| `ok` | Semáforo verde | `#2FA36B` | `#4FC085` |
| `amber` | Semáforo âmbar | `#C9871E` | `#E0A63C` |
| `amber-wash` | Fundo âmbar | `#F8EFDB` | `#2B2416` |
| `danger` | Semáforo vermelho | `#CE5442` | `#E5705B` |
| `danger-wash` | Fundo vermelho | `#F8E7E2` | `#2E1B18` |

Classes: `bg-*`, `text-*`, `border-*`, `ring-*`, e com opacidade `bg-accent/10`, `text-ink-soft/80`.

### Cores de dados (fixas)

Paleta do gráfico "onde seu dinheiro foi" — igual nos dois temas, ordenada para separar fatias vizinhas. Uso: `bg-cat-casa`, `bg-cat-comida`, etc.

`casa #268C5C` · `comida #7FB98F` · `impostos #C9871E` · `lazer #7C9CE0` · `transporte #5FB0C9` · `assinaturas #B98FD0` · `outros #B0938A`

---

## Tipografia

Três famílias, papéis que não se misturam.

| Classe | Família | Uso |
|---|---|---|
| `font-display` | Bricolage Grotesque | Títulos e o número-herói |
| `font-sans` | IBM Plex Sans | Interface e corpo (padrão do `body`) |
| `font-mono` | IBM Plex Mono | **Só** valores em R$ |

Escala semântica (classe → tamanho):

| Classe | Tamanho | Onde |
|---|---|---|
| `text-display` | `clamp(2.4rem, 6vw, 3.7rem)` | Número-herói (meses de fôlego) |
| `text-h1` | `2rem` | Título de página |
| `text-h2` | `1.7rem` | Título de seção |
| `text-h3` | `1.2rem` | Título de bloco |
| `text-body` | `1rem / 1.5` | Corpo |
| `text-sm` | `0.875rem` | Apoio / legenda |
| `text-xs` | `0.8125rem` | Eyebrow / micro |
| `text-money` | `1.5rem` | Valor em R$ — combine com `font-mono tabular-nums` |

Regra: corpo com no máximo ~66 caracteres por linha. Valor monetário é sempre `font-mono tabular-nums` para alinhar dígitos.

---

## Forma, elevação e movimento

**Raio** — `rounded-tab` (9px, abas/ícone) · `rounded-control` (12px, inputs/botões) · `rounded-card` (18px, cards) · `rounded-pill` (chips, badges, toasts).

**Elevação** — uma sombra só: `shadow-float`, reservada ao que flutua (herói, cards de destaque, modais, toast). Superfície comum usa `border border-line`, não sombra.

**Movimento** — responde a uma ação ou marca a identidade uma vez; sempre com `motion-reduce`.

| Classe | Uso |
|---|---|
| `animate-breathe` | Respiração do símbolo do pulmão (único loop contínuo) |
| `animate-rise` | Troca de aba/visão |
| `animate-pop` | Entrada de modal |
| `animate-fade` | Fundo do modal |
| `ease-pop` | Curva `cubic-bezier(.2,.8,.3,1)` para transições de destaque |

---

## Temas (claro/escuro)

Como as classes apontam para variáveis, **você quase nunca escreve `dark:`** — a troca é automática.

- **Automático:** segue o SO via `prefers-color-scheme`.
- **Forçado:** defina o atributo na raiz.

```ts
// claro | escuro | seguir o SO
document.documentElement.dataset.theme = "dark";
document.documentElement.dataset.theme = "light";
delete document.documentElement.dataset.theme;
```

O seletor `darkMode: ["selector", '[data-theme="dark"]']` no config existe só para o caso raro de um utilitário `dark:` pontual.

---

## Exemplos de componente

Botão primário:

```tsx
<button className="bg-accent text-accent-foreground font-semibold rounded-control px-5 py-3
                   transition hover:brightness-105 active:translate-y-px">
  Salvar entrada
</button>
```

Card de superfície:

```tsx
<div className="bg-surface border border-line rounded-card shadow-float p-6">…</div>
```

Semáforo (verde):

```tsx
<span className="inline-flex items-center gap-2 bg-accent-wash text-accent-deep
                 font-semibold text-sm rounded-pill px-3 py-1.5">
  <span className="size-2 rounded-full bg-current" /> Mês no verde
</span>
```

Valor no razão:

```tsx
<span className="font-mono tabular-nums text-money text-accent-deep">R$ 1.600</span>
```

---

## Voz & tom (resumo)

Tão parte do sistema quanto a cor. Fôlego fala como um colega dev que manja de finanças.

1. **Colega, não banco** — conversa, não circular de gerente.
2. **Número + prazo** — "R$ 500/mês, 6 meses", nunca "poupe mais".
3. **Um conselho por vez** — nada de lista de 10 tarefas.
4. **Zero julgamento** — "notei um padrão", não "você errou".
5. **Traduz o jargão** — "DAS (a guia de imposto do mês)" na primeira vez.

Evite → Prefira: "Campo inválido" → "Confere o e-mail — falta algo aí." · "Gastou demais" → "Delivery dobrou: R$ 950. Faltam 8 dias." · "Erro ao salvar" → "Não consegui salvar. Confere a conexão e tenta de novo."

---

## Apêndice

### Regenerar `globals.css` a partir de `tokens.json`

O `globals.css` deste pacote já está pronto à mão. Se preferir gerá-lo por build (Style Dictionary v4), a ideia é emitir as cores como canais RGB e agrupar por tema. Esqueleto:

```js
// build-tokens.mjs
import StyleDictionary from "style-dictionary";

StyleDictionary.registerTransform({
  name: "color/rgb-channels",
  type: "value",
  filter: (t) => t.$type === "color",
  transform: (t) => {
    const h = t.$value.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
  },
});

export default {
  source: ["tokens.json"],
  platforms: {
    css: {
      transforms: ["attribute/cti", "name/kebab", "color/rgb-channels"],
      buildPath: "build/",
      files: [{ destination: "globals.css", format: "css/variables" }],
    },
  },
};
```

Rode um platform por tema (filtrando `color.light` e `color.dark`) e emita cada um sob seu seletor (`:root` e `[data-theme="dark"]`).

### Tailwind v4 (alternativa CSS-first)

Se migrar para o Tailwind v4, o mapeamento vive no CSS via `@theme` em vez do arquivo `.ts`:

```css
@import "tailwindcss";
@import "./globals.css";

@theme {
  --color-paper: rgb(var(--paper));
  --color-surface: rgb(var(--surface));
  --color-accent: rgb(var(--accent));
  --color-accent-deep: rgb(var(--accent-deep));
  --color-accent-wash: rgb(var(--accent-wash));
  --color-ink: rgb(var(--ink));
  /* …demais tokens… */
  --font-display: "Bricolage Grotesque", system-ui, sans-serif;
  --font-sans: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --radius-card: 18px;
}
```
