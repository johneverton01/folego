import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { item } from '@/components/marketing/motion'

export function FeatureCard({ icon, title, text, children }: { icon: ReactNode; title: string; text: string; children: ReactNode }) {
  return (
    <motion.div
      variants={item}
      className="group flex flex-col rounded-card border border-line bg-surface p-6 transition-[translate,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.75 hover:border-accent/40 hover:shadow-lift"
    >
      <div className="mb-4 grid size-10.5 place-items-center rounded-[11px] bg-accent-wash text-accent-deep transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110">
        {icon}
      </div>
      <h4 className="mb-2 font-display text-[1.15rem] font-semibold">{title}</h4>
      <p className="flex-1 text-[.94rem] text-ink-soft">{text}</p>
      <div className="mt-4 border-t border-line pt-4">{children}</div>
    </motion.div>
  )
}
