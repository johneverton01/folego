import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { MenuIcon } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { LocaleToggle } from '../components/LocaleToggle'
import { ThemeToggle } from '../components/ThemeToggle'

import { DropdownMenuProfile } from '@/components/app/DropdownMenuProfile'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authMiddleware } from '@/middleware/auth-middleware'

export const Route = createFileRoute('/app')({
  beforeLoad: authMiddleware,
  component: AppLayout,
})

const linkBase = 'rounded-tab px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-soft hover:text-ink'
const linkActive = 'bg-accent-wash text-accent-deep hover:bg-accent-wash'

const links = [
  { to: '/app', label: 'Painel', exact: true },
  { to: '/app/historico', label: 'Histórico', exact: false },
  { to: '/app/metas', label: 'Metas', exact: false },
  { to: '/app/aprender', label: 'Aprender', exact: false },
] as const

function MenuMobile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Abrir menu"
          className="border-line bg-transparent text-ink hover:bg-surface-soft hover:text-ink dark:border-line dark:bg-transparent dark:hover:bg-surface-soft"
        >
          <MenuIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 border-line bg-paper">
        {links.map(({ to, label, exact }) => (
          <DropdownMenuItem key={to} asChild className="h-11 text-ink focus:bg-surface-soft focus:text-ink">
            <Link
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: 'bg-accent-wash font-medium text-accent-deep focus:bg-accent-wash focus:text-accent-deep', 'aria-current': 'page' }}
            >
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppLayout() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-5">
          <Link to="/app"><Logo className="text-lg" /></Link>
          <nav className="ml-2 hidden gap-1 sm:flex">
            {links.map(({ to, label, exact }) => (
              <Link key={to} to={to} activeOptions={{ exact }} className={linkBase} activeProps={{ className: `${linkBase} ${linkActive}` }}>{label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <LocaleToggle />
            <ThemeToggle />
            <DropdownMenuProfile />
            <div className="sm:hidden">
              <MenuMobile />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
