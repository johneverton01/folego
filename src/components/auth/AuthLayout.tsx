import { Link } from '@tanstack/react-router'
import { MotionConfig, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { RENDA } from '@/components/landing-page/constants'
import { Check, EASE, GhostChart } from '@/components/marketing/motion'

const PERKS = ['Salário Fantasma: um valor fixo pra viver todo mês', 'Reserva e impostos separados sozinhos', 'Sem planilha, sem culpa']

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <AuthBrandPanel />
        <div className="flex min-h-dvh flex-col">
          <header className="flex h-16 items-center justify-between px-[clamp(1.1rem,4vw,2rem)]">
            <Link to="/" aria-label="Fôlego — início" className="lg:invisible">
              <Logo />
            </Link>
            <ThemeToggle />
          </header>
          <main className="flex flex-1 items-center justify-center px-[clamp(1.1rem,4vw,2rem)] py-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="w-full max-w-100"
            >
              {children}
            </motion.div>
          </main>
          <footer className="px-[clamp(1.1rem,4vw,2rem)] pb-6 text-center text-[.82rem] text-ink-faint">
            Ao continuar você concorda com os termos de uso e a política de privacidade.
          </footer>
        </div>
      </div>
    </MotionConfig>
  )
}

/** Título + descrição padronizados para o topo de cada formulário de auth. */
export function AuthHeader({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-[clamp(1.8rem,4vw,2.2rem)] leading-[1.1] font-bold tracking-[-.03em] text-balance">{title}</h1>
      {description && <p className="mt-2.5 text-ink-soft">{description}</p>}
    </div>
  )
}

function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-r border-line bg-accent-wash lg:flex lg:flex-col lg:justify-between lg:px-10 lg:pb-10 xl:px-14 xl:pb-14">
      {/* Mesma altura (h-16) do header do formulário, para o logo alinhar com o ThemeToggle. */}
      <div className="relative flex h-16 shrink-0 items-center">
        <Link to="/" aria-label="Fôlego — início" className="w-fit">
          <Logo />
        </Link>
      </div>

      <div className="relative">
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="max-w-[16ch] font-display text-[clamp(2rem,3.2vw,2.8rem)] leading-[1.08] font-bold tracking-[-.035em] text-balance"
        >
          Sua renda oscila. <span className="text-accent-deep">Seu fôlego, não.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className="mt-8 rounded-card border border-line bg-surface p-5 shadow-lift"
        >
          <div className="flex items-center justify-between text-[.82rem] font-medium text-ink-soft">
            <span>Renda real × Salário Fantasma</span>
            <span className="font-mono text-accent-deep">8 meses</span>
          </div>
          <div className="mt-4">
            <GhostChart income={RENDA} w={320} h={110} delay={0.4} />
          </div>
        </motion.div>

        <ul className="mt-8 space-y-3">
          {PERKS.map((perk, i) => (
            <motion.li
              key={perk}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: EASE }}
              className="flex items-center gap-3 text-[.95rem] text-ink-soft"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                <Check size={13} />
              </span>
              {perk}
            </motion.li>
          ))}
        </ul>
      </div>

      <p className="relative text-[.82rem] text-ink-faint">Feito pra dev PJ, por dev PJ.</p>
    </aside>
  )
}
