import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useFinance } from '@/lib/store'
import { lancamentosDoMesQueryOptions, useLancamentosDoMes } from '@/hooks/useLancamentos'
import { FolegoHero } from '@/components/app/FolegoHero'
import { Ledger } from '@/components/app/Ledger'
import { SalarioFantasma } from '@/components/app/SalarioFantasma'
import { DrawerInputSalary } from '@/components/app/DrawerInputSalary'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CircleArrowUp, CircleArrowDown } from 'lucide-react'
import { DrawerOutputSalary } from '@/components/app/DrawerOutputSalary'

export const Route = createFileRoute('/app/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(lancamentosDoMesQueryOptions()),
  component: Painel,
})

function Painel() {
  const reserva = useFinance((s) => s.reserva)
  const { data: lancamentos } = useLancamentosDoMes()
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
      <DrawerInputSalary
        open={isDrawerInputSalaryOpen}
        onOpenChange={setIsDrawerInputSalaryOpen}
      />
      <DrawerOutputSalary
        open={isDrawerOutputSalaryOpen}
        onOpenChange={setIsDrawerOutputSalaryOpen}
      />
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
