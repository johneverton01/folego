import { Logo } from '@/components/brand/Logo'
import { NAV, WRAP } from './constants'

export function LandingFooter() {
  return (
    <footer className="pt-12 pb-16">
      <div className={WRAP}>
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <a href="#top" aria-label="Fôlego — voltar ao topo">
            <Logo className="text-[1.1rem]" />
          </a>
          <nav className="flex flex-wrap gap-6 text-[.9rem] text-ink-soft">
            {[...NAV, { href: '#comecar', label: 'Começar' }].map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <p className="mt-2 w-full text-[.82rem] text-ink-faint">
            Fôlego — educação financeira pra desenvolvedores PJ · protótipo de landing page, dados fictícios.
          </p>
        </div>
      </div>
    </footer>
  )
}
