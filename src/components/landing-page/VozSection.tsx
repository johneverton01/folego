import { cn } from '@/lib/cn'
import { SECTION, WRAP } from './constants'
import { SectionHeader } from './SectionHeader'
import { VoiceColumn } from './VoiceColumn'

const COLUMNS = [
  { yes: false, h: '✕ O que você não vai ouvir', items: ['“Campo inválido.”', '“Você gastou demais com lazer.”', '“Poupe mais para atingir seus objetivos.”'] },
  {
    yes: true,
    h: '✓ O que a gente diz',
    items: ['“Confere o e-mail — falta algo aí.”', '“Delivery dobrou esse mês: R$ 950. Faltam 8 dias.”', '“Guardando R$ 500/mês, você chega em 12 meses.”'],
  },
]

export function VozSection() {
  return (
    <section id="voz" className={cn(SECTION, 'border-y border-line bg-surface-soft')}>
      <div className={WRAP}>
        <SectionHeader eyebrow="Nosso jeito de falar" title="Como um colega dev, nunca como um gerente de banco">
          A gente traduz o financês, fala com número e prazo, e nunca te faz sentir burro. Zero julgamento.
        </SectionHeader>
        <div className="mt-9 grid gap-5 min-[900px]:grid-cols-2">
          {COLUMNS.map((c, ci) => (
            <VoiceColumn key={c.h} yes={c.yes} heading={c.h} items={c.items} delay={ci * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
