import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function FloatBadge({ children, className, delay }: { children: ReactNode; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22, delay }}
      whileHover={{ y: -2 }}
      className={cn(
        'absolute z-10 flex items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1.5 text-[.8rem] font-semibold shadow-float',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
