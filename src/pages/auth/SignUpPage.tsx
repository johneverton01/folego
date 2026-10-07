import { AuthHeader } from '@/components/auth/AuthLayout'
import { SignUpForm } from '@/components/auth/SignUpForm'

export function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <AuthHeader title="Crie sua conta" description="Leva menos de um minuto. Sem cartão de crédito." />
      <SignUpForm />
    </div>
  )
}
