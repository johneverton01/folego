import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  folegoQueryOptions,
  historicoMensalQueryOptions,
  lancamentosDoMesQueryOptions,
  useFolego,
  useHistoricoMensal,
  useLancamentosDoMes,
} from '@/hooks/useLancamentos'
import { FolegoHero } from '@/components/app/FolegoHero'
import { Ledger } from '@/components/app/Ledger'
import { PorCategoria } from '@/components/app/PorCategoria'
import { SalarioFantasma } from '@/components/app/SalarioFantasma'
import { DrawerLancamento } from '@/components/app/DrawerLancamento'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CircleArrowUp, CircleArrowDown } from 'lucide-react'

export const Route = createFileRoute('/app/')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(lancamentosDoMesQueryOptions()),
      context.queryClient.ensureQueryData(historicoMensalQueryOptions()),
      context.queryClient.ensureQueryData(folegoQueryOptions()),
    ]),
  component: Painel,
})

function Painel() {
  const { data: folego } = useFolego()
  const { data: lancamentos } = useLancamentosDoMes()
  const { data: historico } = useHistoricoMensal()
  const [isDrawerInputSalaryOpen, setIsDrawerInputSalaryOpen] = useState(false)
  const [isDrawerOutputSalaryOpen, setIsDrawerOutputSalaryOpen] = useState(false)
  function handleOpenDrawerInputSalary() {
    setIsDrawerInputSalaryOpen(true)
  }
  function handleOpenDrawerOutputSalary() {
    setIsDrawerOutputSalaryOpen(true)
  }
  return (
    <div className="space-y-4">
      <div className='w-full flex justify-end align-center gap-2'>
        <Button onClick={handleOpenDrawerInputSalary}>
          <CircleArrowDown />
          Entradas
        </Button>
        <Button onClick={handleOpenDrawerOutputSalary} variant="outline" className='border-danger text-danger hover:bg-danger hover:text-white'>
          <CircleArrowUp /> 
          Saída
        </Button>
      </div>
      <DrawerLancamento
        tipo="entrada"
        open={isDrawerInputSalaryOpen}
        onOpenChange={setIsDrawerInputSalaryOpen}
      />
      <DrawerLancamento
        tipo="saida"
        open={isDrawerOutputSalaryOpen}
        onOpenChange={setIsDrawerOutputSalaryOpen}
      />
      <FolegoHero folego={folego} />
      <Ledger lancamentos={lancamentos} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-float border border-line bg-surface p-6">
          <h3 className="mb-1 font-display text-lg font-semibold">Saídas por categoria</h3>
          <p className="mb-4 max-w-prose text-sm text-ink-soft">Para onde foi o seu dinheiro neste mês.</p>
          <PorCategoria tipo="saida" lancamentos={lancamentos} />
        </Card>
        <Card className="shadow-float border border-line bg-surface p-6">
          <h3 className="mb-1 font-display text-lg font-semibold">Entradas por categoria</h3>
          <p className="mb-4 max-w-prose text-sm text-ink-soft">De onde veio o seu dinheiro neste mês.</p>
          <PorCategoria tipo="entrada" lancamentos={lancamentos} />
        </Card>
      </div>
      <Card className="shadow-float border border-line bg-surface p-6">
        <h3 className="mb-1 font-display text-lg font-semibold">Salário Fantasma</h3>
        <p className="mb-4 max-w-prose text-sm text-ink-soft">
          Sua renda pula a cada mês. O Fôlego fixa um salário saudável e guarda o excedente — sua vida anda numa linha reta.
        </p>
        <SalarioFantasma historico={historico} />
      </Card>
    </div>
  )
}
