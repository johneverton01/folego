import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { simularMeta, money } from '@/lib/finance'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/app/metas')({ component: Metas })

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function Metas() {
  const alvo = 12000
  const [porMes, setPorMes] = useState(1000)
  const { meses, quando } = simularMeta(alvo, porMes)
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-accent-deep">Metas de economia</p>
        <h2 className="font-display text-2xl font-semibold">Simule sua economia</h2>
      </div>
      <Card className="max-w-lg  border border-line bg-surface p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink-soft">Guardar por mês</span>
          <span className="font-mono text-xl font-semibold tabular-nums">{money(porMes)}</span>
        </div>
        <input
          type="range" min={300} max={3000} step={100} value={porMes}
          onChange={(e) => setPorMes(Number(e.target.value))}
          className="mt-3 w-full accent-accent"
          aria-label="Quanto guardar por mês"
        />
        <div className="mt-3 rounded-control border border-line bg-surface-soft p-4">
          Você chega na sua reserva em <b className="text-accent-deep">{meses} meses</b> — lá por {MES[quando.getMonth()]}/{quando.getFullYear()}.
        </div>
      </Card>
    </div>
  )
}
