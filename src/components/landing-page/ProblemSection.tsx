import { Stagger } from '@/components/marketing/motion'
import { cn } from '@/lib/cn'
import { SECTION, WRAP } from './constants'
import { PainCard } from './PainCard'
import { SectionHeader } from './SectionHeader'

const PAINS = [
  { ic: '🎢', t: 'Renda serrilhada', d: 'Um mês dois contratos, no outro um cliente some. Você acaba gastando como se o mês bom fosse a média.' },
  { ic: '🧾', t: 'Imposto surpresa', d: 'DAS, contador, pró-labore. Some do radar até o boleto chegar e comer sua reserva.' },
  { ic: '🔀', t: 'PJ e pessoal misturados', d: 'O dinheiro do cliente cai na conta e some junto com o iFood. A raiz de quase todo descontrole.' },
  { ic: '🛟', t: 'Sem rede de proteção', d: 'Nada de 13º, férias ou FGTS. Tudo isso vira responsabilidade sua — e quase ninguém provisiona.' },
]

export function ProblemSection() {
  return (
    <section id="problema" className={cn(SECTION, 'border-y border-line bg-surface-soft')}>
      <div className={WRAP}>
        <SectionHeader eyebrow="Por que os apps comuns não servem" title="Eles assumem holerite fixo. Sua vida não é assim.">
          Ferramenta de CLT quebra na renda de PJ. O Fôlego foi desenhado do zero pra montanha-russa de quem vive de contrato.
        </SectionHeader>
        <Stagger className="mt-9 grid gap-4 min-[560px]:grid-cols-2 min-[900px]:grid-cols-4">
          {PAINS.map((p) => (
            <PainCard key={p.t} icon={p.ic} title={p.t} text={p.d} />
          ))}
        </Stagger>
      </div>
    </section>
  )
}
