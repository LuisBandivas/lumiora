import { BrandMark } from './BrandMark'

interface Props {
  onHome: () => void
}

export function AppHeader({ onHome }: Props) {
  return (
    <header className="border-b border-line bg-surface">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-surface focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <button type="button" onClick={onHome} aria-label="Lumiora, return to Choose look" className="group flex min-w-0 items-center gap-3 rounded-xl text-left">
          <BrandMark />
          <span className="flex min-w-0 flex-col">
            <span className="text-lg font-semibold leading-tight tracking-tight group-hover:text-accent sm:text-xl">Lumiora</span>
            <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted sm:inline">Photo booth</span>
          </span>
        </button>
        <p className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-canvas px-3 py-2 text-xs font-medium text-muted sm:text-sm">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          <span className="sm:hidden">Photos stay here</span>
          <span className="hidden sm:inline">Your photos stay in this browser</span>
        </p>
      </div>
    </header>
  )
}
