import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/app/aprender')({ component: Aprender })

const LICOES = [
  { tag: 'A base de tudo', t: 'Reserva de emergência', d: 'Dinheiro parado pra uns 3 meses, caso um cliente suma.' },
  { tag: 'Por que PJ é diferente', t: 'Renda irregular', d: 'Ache sua média e se pague um valor fixo todo mês.' },
  { tag: 'O boleto chato', t: 'DAS e impostos', d: 'Separe a fatia assim que o dinheiro cai — o susto some.' },
]

function Aprender() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-accent-deep">Aprender no fluxo</p>
        <h2 className="font-display text-2xl font-semibold">Educação sem aula chata</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {LICOES.map((l) => (
          <Card key={l.t} className="border border-line bg-surface p-6">
            <p className="text-xs font-semibold text-accent-deep">{l.tag}</p>
            <h3 className="mt-1 font-display text-base font-semibold">{l.t}</h3>
            <p className="mt-1 text-sm text-ink-soft">{l.d}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
