import { useState } from 'react'
import { money, type Folego } from '@/lib/finance'
import { DrawerSaldoAtual } from '@/components/app/DrawerSaldoAtual'
import { Semaforo } from '@/components/ui/Semaforo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function fraseProximoMes(f: Folego) {
  return f.cobreProximoMes
    ? `Dá pra pagar as contas de ${f.nomeProximoMes} sem receber nada: sobram ${money(f.folgaProximoMes)}.`
    : `Sem nova renda, faltam ${money(-f.folgaProximoMes)} pra fechar ${f.nomeProximoMes}.`
}

function fraseConta(f: Folego) {
  const custo =
    f.mesesNaMedia > 0
      ? `gasto médio de ${money(f.custoMensal)}/mês (${f.mesesNaMedia === 1 ? 'último mês' : `últimos ${f.mesesNaMedia} meses`})`
      : `gastos de ${f.nomeMesAtual} até agora, ${money(f.custoMensal)}`
  return `Reserva de ${money(f.reserva)} ÷ ${custo}`
}

export function FolegoHero({ folego }: { folego: Folego }) {
  const [editandoSaldo, setEditandoSaldo] = useState(false)
  const { folegoMeses, reserva, saldoInformado, semaforo } = folego
  return (
    <Card className="flex flex-col gap-4 shadow-float border border-line bg-surface p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {folegoMeses === null ? (
            <p className="max-w-prose text-sm text-ink-soft">
              {saldoInformado && `Você tem ${money(reserva)} em conta. `}
              Registre seus gastos pra calcular seu fôlego.
            </p>
          ) : (
            <>
              <p className="text-sm text-ink-soft">Se sua renda zerar hoje, você aguenta</p>
              <p className="mt-1 font-display text-5xl font-bold tracking-tight">
                {folegoMeses.toFixed(1).replace('.', ',')}{' '}
                <span className="align-baseline text-base font-semibold text-ink-soft">meses de fôlego</span>
              </p>
              <p className="mt-3 max-w-prose text-sm font-medium">{fraseProximoMes(folego)}</p>
              <p className="mt-1 max-w-prose text-xs text-ink-soft">{fraseConta(folego)}</p>
            </>
          )}
          {saldoInformado && (
            <Button
              variant="link"
              className="mt-2 h-auto p-0 text-accent-deep"
              onClick={() => setEditandoSaldo(true)}
            >
              Atualizar saldo em conta
            </Button>
          )}
        </div>
        {folegoMeses !== null && <Semaforo estado={semaforo} />}
      </div>
      {!saldoInformado && (
        <div className="flex flex-col gap-3 rounded-lg bg-accent-wash p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-prose text-sm">
            <b className="font-semibold">Quanto você tem em conta hoje?</b> Sem isso, seu fôlego só enxerga o que você lançou.
          </p>
          <Button className="shrink-0" onClick={() => setEditandoSaldo(true)}>
            Informar saldo
          </Button>
        </div>
      )}
      <DrawerSaldoAtual
        open={editandoSaldo}
        onOpenChange={setEditandoSaldo}
        saldoAtual={saldoInformado ? Math.max(0, reserva) : 0}
      />
    </Card>
  )
}
