import { useState } from 'react'
import { useAuth } from '../../features/auth/authContext'
import { BrandMark } from './BrandMark'

interface Props {
  onHome: () => void
  isHome?: boolean
  onTemplates?: () => void
}

export function AppHeader({ onHome, isHome = false, onTemplates }: Props) {
  const { user, signOut } = useAuth()
  const [authNotice, setAuthNotice] = useState('')

  async function handleSignOut() {
    setAuthNotice('')
    try {
      await signOut()
    } catch (error) {
      setAuthNotice(error instanceof Error ? error.message : 'Unable to sign out. Please try again.')
    }
  }

  return (
    <header className="border-b border-line bg-surface/80">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className={`mx-auto flex w-full items-center justify-between gap-4 px-4 py-3 sm:py-4 ${isHome ? 'landing-nav' : ''}`}>
        <button type="button" onClick={onHome} aria-label="Ephemora, return to start" className="group flex min-w-0 items-center gap-3 rounded-xl text-left">
          <BrandMark />
          <span className="flex min-w-0 flex-col">
            <span className="font-editorial text-xl leading-tight group-hover:text-accent sm:text-2xl">Ephemora</span>
          </span>
        </button>
        {isHome && <nav aria-label="Main navigation" className="landing-nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#templates">Templates</a>
        </nav>}
        <div className="flex shrink-0 items-center gap-2">
          {isHome && onTemplates && <button type="button" onClick={onTemplates} className="landing-nav-cta">Get started <span aria-hidden="true">↗</span></button>}
          {user && <>
            <span className="hidden max-w-48 truncate text-xs text-muted sm:inline" title={user.email ?? undefined}>{user.email}</span>
            <button type="button" onClick={() => void handleSignOut()} className="rounded-full border border-line bg-canvas px-3 py-2 text-xs font-medium text-muted transition hover:text-ink">Sign out</button>
          </>}
          <p className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-canvas px-3 py-2 text-xs font-medium text-muted sm:text-sm">
            <span aria-hidden="true" className="size-2 rounded-full bg-sage" />
            <span className="sm:hidden">Photos stay here</span>
            <span className="hidden sm:inline">Your photos stay in this browser</span>
          </p>
        </div>
      </div>
      {authNotice && <p role="status" className="mx-auto max-w-3xl px-4 pb-2 text-right text-xs text-muted">{authNotice}</p>}
    </header>
  )
}
