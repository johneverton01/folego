import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { WRAP } from './constants'
import { HeroCopy } from './HeroCopy'
import { HeroPanel } from './HeroPanel'

export function Hero() {
  const { scrollY } = useScroll()
  const parallax = useTransform(scrollY, [0, 600], [0, -48])
  const glow = useTransform(scrollY, [0, 500], [1, 0.4])

  return (
    <section className="relative isolate pt-[clamp(2.5rem,7vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
      <motion.div
        aria-hidden="true"
        style={{ opacity: glow }}
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_78%_8%,rgb(var(--accent-wash)),transparent_60%)]"
      />
      <div className={cn(WRAP, 'grid items-center gap-[clamp(2rem,5vw,3.5rem)] min-[900px]:grid-cols-[1.05fr_.95fr]')}>
        <HeroCopy />
        <motion.div style={{ y: parallax }} className="[perspective:1000px]">
          <HeroPanel />
        </motion.div>
      </div>
    </section>
  )
}
