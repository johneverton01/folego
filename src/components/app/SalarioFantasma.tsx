// Gráfico-assinatura: renda serrilhada (real) x linha reta (salário fixo). SVG puro.
export function SalarioFantasma({ income }: { income: number[] }) {
  const w = 520, h = 170, pad = 6, n = income.length
  const avg = income.reduce((a, b) => a + b, 0) / n
  const flat = income.map(() => avg)
  const max = Math.max(...income) * 1.1
  const min = Math.min(...income) * 0.55
  const X = (i: number) => pad + (i * (w - 2 * pad)) / (n - 1)
  const Y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - 2 * pad)
  const path = (a: number[]) => a.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5"><i className="inline-block w-5 border-t-[3px] border-amber" /> Renda real</span>
        <span className="flex items-center gap-1.5"><i className="inline-block w-5 border-t-[3px] border-accent" /> Seu salário fixo</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" className="block">
        <path d={path(income)} className="fill-none stroke-amber opacity-90" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        <path d={path(flat)} className="fill-none stroke-accent" strokeWidth={3} strokeLinecap="round" />
      </svg>
    </div>
  )
}
