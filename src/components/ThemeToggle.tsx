import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const isDark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
    setDark(isDark)
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      className="grid size-9 place-items-center rounded-tab border border-line text-ink-soft transition hover:bg-surface-soft hover:text-ink"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
    </button>
  )
}
