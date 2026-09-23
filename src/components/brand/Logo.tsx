import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-display text-xl font-bold text-ink', className)}>
      <svg viewBox="0 0 32 32" className="size-6 motion-safe:animate-breathe origin-center" fill="none" aria-hidden>
        <path
          d="M16 4v9M16 13c0 6-4 7-8 7-2.4 0-4-1.6-4-4 0-4 4-6 8-6 2.4 0 4 1.3 4 3Zm0 0c0 6 4 7 8 7 2.4 0 4-1.6 4-4 0-4-4-6-8-6-2.4 0-4 1.3-4 3Z"
          className="stroke-accent"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Fôlego
    </span>
  )
}
