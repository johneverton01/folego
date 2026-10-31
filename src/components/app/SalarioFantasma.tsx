import { useMemo } from 'react'
import { ComposedChart } from '@/components/charts/composed-chart'
import { Grid } from '@/components/charts/grid'
import { Line } from '@/components/charts/line'
import { SeriesBar } from '@/components/charts/series-bar'
import { monthYearFmt } from '@/components/charts/chart-formatters'
import { ChartTooltip } from '@/components/charts/tooltip'
import { type HistoricoMes, money, salarioFantasma } from '@/lib/finance'

const AMBER = 'var(--color-amber)'
const ACCENT = 'var(--color-accent)'
const DANGER = 'var(--color-danger)'

// Gráfico-assinatura: renda serrilhada (entradas, barras) x linha reta (salário fixo),
// com os gastos (saídas) do mês por cima pra mostrar se o salário cobre a vida.
export function SalarioFantasma({ historico }: { historico: HistoricoMes[] }) {
  const { data, salario } = useMemo(() => {
    const { meses, salario } = salarioFantasma(historico)
    return {
      salario,
      data: meses.map(({ mes, entrou, saiu }) => {
        const [ano, m] = mes.split('-').map(Number)
        return { date: new Date(ano, m - 1, 1), renda: entrou, gastos: saiu, salario }
      }),
    }
  }, [historico])

  if (salario === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-ink-soft">
        Registre suas entradas e saídas pra ver seu salário fantasma.
      </p>
    )
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5"><i className="inline-block w-5 border-t-[3px] border-amber" /> Renda real</span>
        <span className="flex items-center gap-1.5"><i className="inline-block w-5 border-t-[3px] border-danger" /> Gastos</span>
        <span className="flex items-center gap-1.5"><i className="inline-block w-5 border-t-[3px] border-accent" /> Seu salário fixo: {money(salario)}</span>
      </div>
      <ComposedChart
        aspectRatio="520 / 200"
        data={data}
        margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
        maxBarSize={36}
      >
        <Grid horizontal numTicksRows={4} />
        <SeriesBar dataKey="renda" fill={AMBER} fadedOpacity={0.35} radius={4} />
        <Line dataKey="gastos" stroke={DANGER} strokeWidth={2} fadeEdges={false} showMarkers />
        <Line dataKey="salario" stroke={ACCENT} strokeWidth={3} fadeEdges={false} />
        <ChartTooltip
          showDatePill={false}
          formatDate={monthYearFmt.format}
          rows={(point) => [
            { color: AMBER, label: 'Renda real', value: money(point.renda as number) },
            { color: DANGER, label: 'Gastos', value: money(point.gastos as number) },
            { color: ACCENT, label: 'Salário fixo', value: money(point.salario as number) },
          ]}
        />
      </ComposedChart>
    </div>
  )
}
