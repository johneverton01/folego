import { motion } from 'motion/react'
import { item } from '@/components/marketing/motion'

export function StepCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <motion.div variants={item} className="group relative pt-4">
      <div className="font-display text-[2.4rem] leading-none font-bold text-accent opacity-35 transition-opacity duration-300 group-hover:opacity-100">
        {number}
      </div>
      <h4 className="mt-2 mb-1.5 font-display text-[1.2rem] font-semibold">{title}</h4>
      <p className="text-[.96rem] text-ink-soft">{text}</p>
    </motion.div>
  )
}
