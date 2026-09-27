import { Reveal } from '@/components/marketing/motion'
import { SECTION, WRAP } from './constants'
import { FeatureGrid } from './FeatureGrid'
import { GhostSalaryShowcase } from './GhostSalaryShowcase'
import { GoalSimulator } from './GoalSimulator'
import { LearnInFlow } from './LearnInFlow'
import { SectionHeader } from './SectionHeader'

export function RecursosSection() {
  return (
    <section id="recursos" className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow="Recursos" title="Tudo que você precisa pra domar a renda irregular">
          Sem planilha, sem jargão. As ferramentas certas conversando com você como um colega dev que manja de finanças.
        </SectionHeader>
        <GhostSalaryShowcase />
        <FeatureGrid />
        <div className="mt-5 grid gap-5 min-[900px]:grid-cols-2">
          <Reveal className="rounded-card border border-line bg-surface p-6">
            <GoalSimulator />
          </Reveal>
          <Reveal className="rounded-card border border-line bg-surface p-6" delay={0.1}>
            <LearnInFlow />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
