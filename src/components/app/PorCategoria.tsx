import { useState } from 'react'
import { PieCenter } from '@/components/charts/pie-center'
import { PieChart } from '@/components/charts/pie-chart'
import { PieSlice } from '@/components/charts/pie-slice'
import { chartCenterLabelClassName } from '@/components/charts/chart-center-typography'
import { money, totaisPorCategoria, type Lancamento, type Tipo } from '@/lib/finance'

function percentual(fatia: number) {
  const pct = Math.round(fatia * 100)
  return pct === 0 ? '<1%' : `${pct}%`
}

const TOTAL_LABEL: Record<Tipo, string> = { entrada: 'Total de entradas', saida: 'Total de saídas' }

// Entradas ou saídas do mês por categoria: rosca com legenda da maior pra menor.
export function PorCategoria({ tipo, lancamentos }: { tipo: Tipo; lancamentos: Lancamento[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const categorias = totaisPorCategoria(lancamentos, tipo)
  const fatias = categorias.map(({ cat, valor, cor }) => ({ label: cat, value: valor, color: cor }))

  if (categorias.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-soft">
        Nada registrado neste mês.
      </p>
    )
  }

  return (
    <>
      <PieChart
        className="mx-auto mb-4"
        data={fatias}
        size={200}
        innerRadius={68}
        hoverOffset={6}
        padAngle={0.02}
        cornerRadius={4}
        hoveredIndex={hovered}
        onHoverChange={setHovered}
      >
        {fatias.map((fatia, index) => (
          <PieSlice key={fatia.label} index={index} />
        ))}
        <PieCenter defaultLabel={TOTAL_LABEL[tipo]}>
          {({ value, label }) => (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="font-mono text-sm font-semibold tabular-nums text-ink">{money(value)}</span>
              <span className={chartCenterLabelClassName}>{label}</span>
            </div>
          )}
        </PieCenter>
      </PieChart>
      {/* A cor sozinha não separa todas as categorias: nome e valor ficam sempre escritos. */}
      <ul className="space-y-2">
        {categorias.map(({ cat, valor, fatia, cor }, index) => (
          <li
            key={cat}
            className="flex items-center gap-2 text-sm transition-opacity motion-reduce:transition-none"
            style={{ opacity: hovered === null || hovered === index ? 1 : 0.5 }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <i aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: cor }} />
            <span className="min-w-0 flex-1 truncate text-ink">{cat}</span>
            <span className="font-mono font-semibold tabular-nums text-ink">{money(valor)}</span>
            <span className="w-9 text-right text-xs text-ink-faint">{percentual(fatia)}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
