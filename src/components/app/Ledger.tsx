import { soma, money, type Lancamento } from '@/lib/finance'

function Cell({ k, v, delta, pos }: { k: string; v: string; delta: string; pos?: boolean }) {
  return (
    <div className="bg-surface p-4">
      <div className="text-sm text-ink-soft">{k}</div>
      <div className={`mt-1 font-mono text-xl font-semibold tabular-nums ${pos ? 'text-accent-deep' : 'text-ink'}`}>{v}</div>
      <div className="mt-0.5 text-xs text-ink-faint">{delta}</div>
    </div>
  )
}

export function Ledger({ lancamentos }: { lancamentos: Lancamento[] }) {
  const entrou = soma(lancamentos.filter((l) => l.tipo === 'entrada'))
  const saiu = soma(lancamentos.filter((l) => l.tipo === 'saida'))
  const sobrou = entrou - saiu
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
      <Cell k="Entrou esse mês" v={money(entrou)} delta={`${lancamentos.filter((l) => l.tipo === 'entrada').length} entradas`} />
      <Cell k="Saiu esse mês" v={money(saiu)} delta={`${lancamentos.filter((l) => l.tipo === 'saida').length} lançamentos`} />
      <Cell k="Sobrou" v={money(sobrou)} delta={sobrou >= 0 ? '→ vai pra reserva' : '⚠ mês no vermelho'} pos={sobrou >= 0} />
    </div>
  )
}
