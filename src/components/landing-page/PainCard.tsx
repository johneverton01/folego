import { motion } from 'motion/react'
import { item } from '@/components/marketing/motion'

export function PainCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <motion.div variants={item} className="group rounded-card border border-line bg-surface p-5">
      <div className="mb-3 inline-block origin-bottom text-[1.4rem] transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-125">
        {icon}
      </div>
      <h4 className="mb-1.5 font-display text-[1.02rem] font-semibold">{title}</h4>
      <p className="text-[.9rem] text-ink-soft">{text}</p>
    </motion.div>
  )
}
