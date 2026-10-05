import { ComoFuncionaSection } from '@/components/landing-page/ComoFuncionaSection'
import { VozSection } from '@/components/landing-page/VozSection'
import { CtaSection } from '@/components/landing-page/CtaSection'
import { LandingFooter } from '@/components/landing-page/LandingFooter'
import { Hero } from '@/components/landing-page/Hero'
import { LandingNav } from '@/components/landing-page/LandingNav'
import { ProblemSection } from '@/components/landing-page/ProblemSection'
import { RecursosSection } from '@/components/landing-page/RecursosSection'
import { MotionConfig } from 'motion/react'


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
