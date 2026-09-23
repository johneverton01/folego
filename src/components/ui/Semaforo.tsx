import { cn } from '@/lib/cn'
import type { Semaforo as Estado } from '@/lib/finance'

const style: Record<Estado, string> = {
  ok: 'bg-accent-wash text-accent-deep',
  warn: 'bg-amber-wash text-amber',
  hot: 'bg-danger-wash text-danger',
}
const label: Record<Estado, string> = {
  ok: 'Mês no verde',
  warn: 'Dá pra apertar',
  hot: 'Atenção',
}

export function Semaforo({ estado }: { estado: Estado }) {
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-sm font-semibold', style[estado])}>
      <span className="size-2 rounded-full bg-current" />
      {label[estado]}
    </span>
  )
}
