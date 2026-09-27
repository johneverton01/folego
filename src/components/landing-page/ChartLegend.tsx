import { cn } from '@/lib/cn'

export function ChartLegend({ className }: { className?: string }) {
  return (
    <div className={cn('mb-2 flex flex-wrap gap-4 text-[.74rem] text-ink-soft', className)}>
      <span className="flex items-center gap-1.5">
        <i className="inline-block w-4.5 rounded-sm border-t-[3px] border-amber" /> Renda real
      </span>
      <span className="flex items-center gap-1.5">
        <i className="inline-block w-4.5 rounded-sm border-t-[3px] border-accent" /> Seu salário fixo
      </span>
    </div>
  )
}
