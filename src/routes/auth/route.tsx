import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthLayout } from '@/components/auth/AuthLayout'

export const Route = createFileRoute('/auth')({
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
})
