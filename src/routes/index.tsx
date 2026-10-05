import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/pages/site/LandingPage'

export const Route = createFileRoute('/')({ component: LandingPage })
