import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Check, EASE } from '@/components/marketing/motion'
import { cn } from '@/lib/cn'
import { Arrow } from './Arrow'
import { GHOST, PRIMARY } from './constants'

const heroLine = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: (i: number) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease: EASE } }),
}

export function HeroCopy() {
  return (
    <motion.div initial="hidden" animate="show">
      <motion.span
        custom={0}
        variants={heroLine}
        className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1.5 text-[.85rem] font-medium text-ink-soft shadow-float"
      >
        <span className="relative flex size-[7px]">
          <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping motion-safe:[animation-iteration-count:3]" />
          <span className="relative size-[7px] rounded-full bg-accent" />
        </span>
        Feito pra renda que sobe e desce
      </motion.span>
      <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4rem)] leading-[1.08] font-bold tracking-[-.035em] text-balance">
        <motion.span custom={1} variants={heroLine} className="block">
          Sua renda oscila.
        </motion.span>
        <motion.span custom={2} variants={heroLine} className="block text-accent-deep">
          Seu fôlego, não.
        </motion.span>
      </h1>
      <motion.p custom={3} variants={heroLine} className="mt-5 max-w-[36ch] text-[clamp(1.05rem,2vw,1.22rem)] text-ink-soft">
        O controle financeiro pensado pra quem é dev PJ: entra muito num mês, pouco no outro — e mesmo assim você dorme tranquilo.
      </motion.p>
      <motion.div custom={4} variants={heroLine} className="mt-7 flex flex-wrap gap-3">
        <Link to="/app" className={cn(PRIMARY, 'flex-1 px-7 py-4 text-[1.05rem] min-[560px]:flex-none')}>
          Criar conta grátis <Arrow />
        </Link>
        <a href="#recursos" className={cn(GHOST, 'flex-1 px-7 py-4 text-[1.05rem] min-[560px]:flex-none')}>
          Ver como funciona
        </a>
      </motion.div>
      <motion.div custom={5} variants={heroLine} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[.85rem] text-ink-faint">
        {['Grátis pra começar', 'Sem cartão', 'Linguagem de gente'].map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <Check className="text-accent" /> {t}
          </span>
        ))}
      </motion.div>
    </motion.div>
  )
}
