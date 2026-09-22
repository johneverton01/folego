import type { Config } from "tailwindcss";

/**
 * Fôlego — Tailwind config (v3.4+)
 * As cores apontam para as CSS variables de globals.css (canais RGB),
 * então o tema claro/escuro troca sozinho, sem precisar de variantes `dark:`.
 * O padrão rgb(var(--x) / <alpha-value>) habilita opacidade: bg-accent/10, text-ink/70.
 */

const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
  ],
  // Theming é automático via CSS vars; este seletor cobre o caso raro de precisar de `dark:`
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: withAlpha("--paper"),
        surface: {
          DEFAULT: withAlpha("--surface"),
          soft: withAlpha("--surface-2"),
        },
        ink: {
          DEFAULT: withAlpha("--ink"),
          soft: withAlpha("--ink-soft"),
          faint: withAlpha("--ink-faint"),
        },
        line: withAlpha("--line"),
        accent: {
          DEFAULT: withAlpha("--accent"),
          deep: withAlpha("--accent-deep"),
          wash: withAlpha("--accent-wash"),
          foreground: "#FFFFFF",
        },
        ok: withAlpha("--ok"),
        amber: {
          DEFAULT: withAlpha("--amber"),
          wash: withAlpha("--amber-wash"),
        },
        danger: {
          DEFAULT: withAlpha("--red"),
          wash: withAlpha("--red-wash"),
        },
        // Paleta de dados — fixa nos dois temas (gráfico "onde seu dinheiro foi")
        cat: {
          casa: "#268C5C",
          comida: "#7FB98F",
          impostos: "#C9871E",
          lazer: "#7C9CE0",
          transporte: "#5FB0C9",
          assinaturas: "#B98FD0",
          outros: "#B0938A",
        },
      },

      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },

      // Escala semântica: text-display, text-h1, text-h2, text-h3, text-body, text-money…
      fontSize: {
        display: ["clamp(2.4rem, 6vw, 3.7rem)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "700" }],
        h1: ["2rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        h2: ["1.7rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["1.2rem", { lineHeight: "1.25", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.45" }],
        xs: ["0.8125rem", { lineHeight: "1.4" }],
        // valor em R$: combine com `font-mono tabular-nums`
        money: ["1.5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "600" }],
      },

      borderRadius: {
        tab: "9px",
        control: "12px",
        card: "18px",
        pill: "9999px",
      },

      boxShadow: {
        float: "var(--shadow)",
      },

      transitionTimingFunction: {
        pop: "cubic-bezier(.2,.8,.3,1)",
      },

      keyframes: {
        breathe: {
          "0%,100%": { transform: "scale(.9)", opacity: ".85" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        pop: {
          from: { opacity: "0", transform: "translateY(12px) scale(.98)" },
          to: { opacity: "1", transform: "none" },
        },
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        breathe: "breathe 5.5s ease-in-out infinite",
        rise: "rise .35s ease",
        pop: "pop .22s cubic-bezier(.2,.8,.3,1)",
        fade: "fade .18s ease",
      },
    },
  },
  plugins: [],
} satisfies Config;
