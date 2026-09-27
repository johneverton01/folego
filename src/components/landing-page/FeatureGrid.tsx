import { brl, CountUp, Stagger } from '@/components/marketing/motion'
import { FeatureCard } from './FeatureCard'

export function FeatureGrid() {
  return (
    <Stagger className="mt-10 grid gap-5 min-[560px]:grid-cols-2 min-[900px]:grid-cols-3">
      <FeatureCard
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth={1.8} />
            <path d="M3 9h18M8 14h3" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
        }
        title="Painel simples de gastos"
        text="Entrou, saiu, sobrou — a leitura de 3 segundos. Poucas categorias grandes e um semáforo que mostra na hora se o mês tá no verde."
      >
        <div className="flex items-center justify-between gap-2.5">
          <div>
            <div className="text-[.72rem] text-ink-soft">Sobrou esse mês</div>
            <div className="font-mono text-[1.1rem] font-semibold tabular-nums tracking-[-.02em] text-accent-deep">
              <CountUp to={1600} format={brl} />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-wash px-2.5 py-1 text-[.82rem] font-semibold text-accent-deep">
            <span className="size-2 rounded-full bg-current transition-transform duration-300 group-hover:scale-150" /> Verde
          </span>
        </div>
      </FeatureCard>

      <FeatureCard
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3l9 16H3l9-16z" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
            <path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
        }
        title="Alertas de despesas exageradas"
        text="Um toque de amigo quando algo foge do seu padrão — sempre com o número real e uma saída prática. Nunca um puxão de orelha."
      >
        <div className="flex gap-3 rounded-control bg-danger-wash px-3.5 py-3">
          <span className="inline-block flex-none text-[1.05rem] group-hover:motion-safe:animate-nudge">🍔</span>
          <div>
            <b className="text-ink">Delivery dobrou</b>
            <p className="text-[.82rem] text-ink-soft">R$ 950 esse mês — faltam 8 dias.</p>
          </div>
        </div>
      </FeatureCard>

      <FeatureCard
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3a6 6 0 016 6c0 2.5-1.5 3.8-2.5 5-.5.6-.5 1.2-.5 2H9c0-.8 0-1.4-.5-2C7.5 12.8 6 11.5 6 9a6 6 0 016-6z" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
            <path d="M9.5 21h5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
        }
        title="Recomendações personalizadas"
        text="Dicas que nascem do seu perfil — renda, idade e objetivo. Uma de cada vez, com número e prazo, ligadas ao que você realmente gasta."
      >
        <div className="rounded-[4px_14px_14px_14px] bg-accent-wash px-3.5 py-3 text-[.86rem] leading-normal text-ink">
          Cortando 2 apps de streaming, em 1 ano você junta <b className="text-accent-deep">R$ 720</b> — quase um mês de aluguel.
        </div>
      </FeatureCard>
    </Stagger>
  )
}
