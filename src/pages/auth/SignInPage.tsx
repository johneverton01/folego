import { AuthHeader } from '@/components/auth/AuthLayout'
import { SignInForm } from '@/components/auth/SignInForm'

export function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <AuthHeader title="Bom te ver de novo" description="Entre pra ver como está seu fôlego este mês." />
      <SignInForm />
    </div>
  )
}