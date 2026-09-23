import { resumo, type Lancamento } from '@/lib/finance'
import { Semaforo } from '@/components/ui/Semaforo'
import { Card } from '@/components/ui/card'

export function FolegoHero({ lancamentos, reserva }: { lancamentos: Lancamento[]; reserva: number }) {
  const r = resumo(lancamentos, reserva)
  const meses = r.folegoMeses.toFixed(1).replace('.', ',')
  return (
    <Card className="flex flex-col gap-4 shadow-float sm:flex-row sm:items-end sm:justify-between  border border-line bg-surface p-6">
      <div>
        <p className="text-sm text-ink-soft">Se sua renda zerar hoje, você aguenta</p>
        <p className="mt-1 font-display text-5xl font-bold tracking-tight">
          {meses} <span className="align-baseline text-base font-semibold text-ink-soft">meses de fôlego</span>
        </p>
      </div>
      <Semaforo estado={r.semaforo} />
    </Card>
  )
}
