import { motion } from 'motion/react'
import { useState } from 'react'
import { NAV } from './constants'

export function NavLinks() {
  const [hover, setHover] = useState<string | null>(null)

  return (
    <nav className="ml-4 hidden gap-1 min-[900px]:flex" onMouseLeave={() => setHover(null)}>
      {NAV.map((l) => (
        <a
          key={l.href}
          href={l.href}
          onMouseEnter={() => setHover(l.href)}
          onFocus={() => setHover(l.href)}
          className="relative rounded-tab px-3 py-2 text-[.94rem] font-medium text-ink-soft transition-colors hover:text-ink"
        >
          {hover === l.href && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 rounded-tab bg-surface-soft"
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          <span className="relative">{l.label}</span>
        </a>
      ))}
    </nav>
  )
}
