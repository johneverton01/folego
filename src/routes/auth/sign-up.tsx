import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUp,
})

function SignUp() {
  return <div>Hello "/auth/sign-up"!</div>
}
