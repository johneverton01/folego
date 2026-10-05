import { createFileRoute } from '@tanstack/react-router'
import { AuthHeader } from '@/components/auth/AuthLayout'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUp,
})

function SignUp() {
  return <AuthHeader title="Crie sua conta" description="Leva menos de um minuto. Sem cartão de crédito." />
}
