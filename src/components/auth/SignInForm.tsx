import { Card } from '@/components/ui/card'
import { InputEmail } from '../ui/input-email'
import { InputPassword } from '../ui/input-password'
import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'

export function SignInForm() {
  return (
    <Card className="w-full max-w-100 p-3 border-r border-line bg-accent-wash">
        <form className="flex flex-col gap-4">
          <InputEmail />
          <InputPassword />
          <div className="flex items-baseline justify-end">
            <Link to="/auth/recover" className="text-sm text-accent-deep">Esqueci minha senha</Link>
          </div>
          <Button type="submit">
            Entrar
          </Button>
          <Button variant="link" asChild>
            <Link to="/auth/sign-up">Criar conta</Link>
          </Button>
        </form>
    </Card>
  )
}