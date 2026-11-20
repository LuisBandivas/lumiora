interface Props {
  onHome: () => void
}

export function AppHeader({ onHome }: Props) {
  return (
    <header className="bg-surface">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-4">
        <button type="button" onClick={onHome} className="text-xl font-semibold tracking-tight">
          Lumiora
        </button>
        <p className="hidden text-sm text-muted sm:block">
          Photos stay in your browser · no sign-up
        </p>
      </div>
    </header>
  )
}
