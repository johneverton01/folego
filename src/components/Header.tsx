import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
          >
          <svg className="lung" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 4v9M16 13c0 6-4 7-8 7-2.4 0-4-1.6-4-4 0-4 4-6 8-6 2.4 0 4 1.3 4 3Zm0 0c0 6 4 7 8 7 2.4 0 4-1.6 4-4 0-4-4-6-8-6-2.4 0-4 1.3-4 3Z" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
           Fôlego
          </Link>
        </h2>

       

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
           <Link
            to="/auth/sign-in"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Entrar
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
