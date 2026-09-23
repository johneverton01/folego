import { createFileRoute } from '@tanstack/react-router'
import { useFinance } from '@/lib/store'
import { FolegoHero } from '@/components/app/FolegoHero'
import { Ledger } from '@/components/app/Ledger'
import { SalarioFantasma } from '@/components/app/SalarioFantasma'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/app/')({ component: Painel })

function Painel() {
  const { lancamentos, reserva } = useFinance()
  return (
    <div className="space-y-4">
      <FolegoHero lancamentos={lancamentos} reserva={reserva} />
      <Ledger lancamentos={lancamentos} />
      <Card className="shadow-float border border-line bg-surface p-6">
        <h3 className="mb-1 font-display text-lg font-semibold">Salário Fantasma</h3>
        <p className="mb-4 max-w-prose text-sm text-ink-soft">
          Sua renda pula a cada mês. O Fôlego fixa um salário saudável e guarda o excedente — sua vida anda numa linha reta.
        </p>
        <SalarioFantasma income={[4200, 11000, 6500, 9800, 3500, 12500, 7000, 8500]} />
      </Card>
    </div>
  )
}
