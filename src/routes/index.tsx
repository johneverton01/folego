import { createFileRoute, Link } from '@tanstack/react-router'
import { Logo } from '@/components/brand/Logo'
import { Card } from '@/components/ui/card'
import { Semaforo } from '@/components/ui/Semaforo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SalarioFantasma } from '@/components/app/SalarioFantasma'

export const Route = createFileRoute('/')({ component: Landing })

const RENDA = [4200, 11000, 6500, 9800, 3500, 12500, 7000, 8500]

const FEATURES = [
  { t: 'Painel simples de gastos', d: 'Entrou, saiu, sobrou — a leitura de 3 segundos, com um semáforo que mostra na hora se o mês tá no verde.' },
  { t: 'Alertas de despesas exageradas', d: 'Um toque de amigo quando algo foge do seu padrão, com o número real e uma saída prática. Nunca um puxão de orelha.' },
  { t: 'Recomendações personalizadas', d: 'Dicas do seu perfil — renda, idade e objetivo. Uma de cada vez, com número e prazo.' },
]

function Landing() {
  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-line/60 bg-paper/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
          <Link to="/"><Logo /></Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {/* <Link to="/login" className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink">Entrar</Link> */}
            <Link to="/app" className="rounded-control bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105">
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft shadow-float">
            <span className="size-1.5 rounded-full bg-accent" /> Feito pra renda que sobe e desce
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight md:text-6xl">
            Sua renda oscila.<br />
            <span className="text-accent-deep">Seu fôlego, não.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            O controle financeiro pensado pra quem é dev PJ: entra muito num mês, pouco no outro — e mesmo assim você dorme tranquilo.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/app" className="rounded-control bg-accent px-6 py-3 font-semibold text-white transition hover:brightness-105">Criar conta grátis</Link>
            <a href="#recursos" className="rounded-control border border-line bg-surface px-6 py-3 font-semibold transition hover:bg-surface-soft">Ver como funciona</a>
          </div>
        </div>

        <Card className="shadow-float border border-line bg-surface p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-ink-soft">Painel · setembro</p>
              <div>
                <div className="mt-1 font-display text-4xl font-bold tracking-tight">2,3 </div>
                <div className="text-sm font-semibold text-ink-soft">meses de fôlego</div>
              </div>
            </div>
            <Semaforo estado="ok" />
          </div>
          <div className="border border-line bg-surface p-2 grid grid-cols-3 rounded-2xl">
            <div className="">
              <span className="block text-sm font-semibold text-ink-soft">Entrou</span>
              <div>Entrou</div>
            </div>
            <div className="">
              <span className="block text-sm font-semibold text-ink-soft">Saiu</span>
              <div>Saiu</div>
            </div>
            <div className="">
              <span className="block text-sm font-semibold text-ink-soft">Sobrou</span>
              <div>Sobrou</div>
            </div>
          </div>
          <div className="mt-4 rounded-control border border-line bg-surface-soft p-4">
            <SalarioFantasma income={RENDA} />
          </div>
        </Card>
      </section>

      {/* RECURSOS */}
      <section id="recursos" className="border-t border-line bg-surface-soft">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="text-sm font-semibold text-accent-deep">Recursos</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Tudo que você precisa pra domar a renda irregular</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.t} className="border border-line bg-surface p-6">
                <h3 className="font-display text-lg font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm text-ink-soft">{f.d}</p>
              </Card>
            ))}
          </div>
          {/* NOTA: as demais seções (problema, como funciona, voz, CTA) estão na landing
              publicada — porte-as pra cá como componentes em src/components/marketing/. */}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Logo />
          <p className="text-xs text-ink-faint">Fôlego — educação financeira pra desenvolvedores PJ.</p>
        </div>
      </footer>
    </div>
  )
}
