import { Link } from '@tanstack/react-router'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import type { PointerEvent } from 'react'
import { EASE } from '@/components/marketing/motion'
import { cn } from '@/lib/cn'
import { Arrow } from './Arrow'
import { BTN, SECTION, WRAP } from './constants'

export function CtaSection() {
  const mx = useMotionValue(50)
  const my = useMotionValue(-10)
  const x = useSpring(mx, { stiffness: 120, damping: 20 })
  const y = useSpring(my, { stiffness: 120, damping: 20 })
  const bg = useMotionTemplate`radial-gradient(60% 80% at ${x}% ${y}%, rgba(72,189,132,.26), transparent 60%)`

  function move(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 100)
    my.set(((e.clientY - r.top) / r.height) * 100)
  }

  return (
    <section id="comecar" className={SECTION}>
      <div className={WRAP}>
        <motion.div
          onPointerMove={move}
          onPointerLeave={() => {
            mx.set(50)
            my.set(-10)
          }}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative isolate overflow-hidden rounded-card bg-[linear-gradient(160deg,#12241E_0%,#17342B_60%,#113029_100%)] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4rem)] text-center text-[#EAF3ED]"
        >
          <motion.div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: bg }} />
          <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.08] font-bold tracking-tight text-balance text-white">
            Comece a respirar melhor com seu dinheiro
          </h2>
          <p className="mx-auto mt-3.5 max-w-[44ch] text-[1.1rem] text-[#AFCBBE]">
            Leva 2 minutos pra montar seu primeiro fôlego. Grátis, sem cartão, sem enrolação.
          </p>
          <Link to="/app" className={cn(BTN, 'mt-7 bg-white px-7 py-4 text-[1.05rem] text-accent-deep hover:bg-[#EAF3ED]')}>
            Criar minha conta grátis <Arrow />
          </Link>
          <p className="mt-4 text-[.85rem] text-[#8FA99D]">
            Já tem conta?{' '}
            <Link to="/auth/sign-in" className="text-[#CFE6DA] underline underline-offset-2 transition-colors hover:text-white">
              Entrar
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
