import { MotionConfig } from 'motion/react'
import { ComoFuncionaSection } from './ComoFuncionaSection'
import { CtaSection } from './CtaSection'
import { Hero } from './Hero'
import { LandingFooter } from './LandingFooter'
import { LandingNav } from './LandingNav'
import { ProblemSection } from './ProblemSection'
import { RecursosSection } from './RecursosSection'
import { VozSection } from './VozSection'

export function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="overflow-x-clip">
        <LandingNav />
        <Hero />
        <ProblemSection />
        <RecursosSection />
        <ComoFuncionaSection />
        <VozSection />
        <CtaSection />
        <LandingFooter />
      </div>
    </MotionConfig>
  )
}
