import { createFileRoute } from '@tanstack/react-router'
import { AuthHeader } from '@/components/auth/AuthLayout'

export const Route = createFileRoute('/auth/recover')({
  component: Recoverer,
})

function Recoverer() {
  return <AuthHeader title="Recuperar senha" description="Insira seu email para recuperar sua senha." />
}
