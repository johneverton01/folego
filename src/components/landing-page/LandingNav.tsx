import { Link } from '@tanstack/react-router'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useState } from 'react'
import { Logo } from '@/components/brand/Logo'
import { LocaleToggle } from '@/components/LocaleToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/cn'
import { PRIMARY, WRAP } from './constants'
import { NavLinks } from './NavLinks'

import { m } from '@/paraglide/messages'

export function LandingNav() {
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 8))

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-paper/80 backdrop-blur-md backdrop-saturate-150 transition-colors duration-200',
        scrolled ? 'border-line' : 'border-transparent',
      )}
    >
      <div className={cn(WRAP, 'flex h-16 items-center gap-6')}>
        <a href="#top" aria-label="Fôlego — início">
          <Logo />
        </a>
        <NavLinks />
        <div className="ml-auto flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
          <Link to="/auth/sign-in" className={cn(PRIMARY, 'hidden px-2.5 py-2 text-[.94rem] font-medium text-ink-soft transition-colors hover:text-ink min-[560px]:block')}>
            {m.sign_in()}
          </Link>
        </div>
      </div>
      <motion.div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-accent/70" style={{ scaleX: progress }} />
    </header>
  )
}
