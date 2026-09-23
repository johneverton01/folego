import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '../components/ThemeToggle'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

const linkBase = 'rounded-tab px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface-soft hover:text-ink'
const linkActive = 'bg-accent-wash text-accent-deep hover:bg-accent-wash'


function AppLayout() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-5">
          <Link to="/app"><Logo className="text-lg" /></Link>
          <nav className="ml-2 flex gap-1">
            <Link to="/app" activeOptions={{ exact: true }} className={linkBase} activeProps={{ className: `${linkBase} ${linkActive}` }}>Painel</Link>
            <Link to="/app/metas" className={linkBase} activeProps={{ className: `${linkBase} ${linkActive}` }}>Metas</Link>
            <Link to="/app/aprender" className={linkBase} activeProps={{ className: `${linkBase} ${linkActive}` }}>Aprender</Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <span className="grid size-8 place-items-center rounded-full bg-accent font-display text-sm font-semibold text-white">J</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
