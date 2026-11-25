interface Props {
  onTemplates: () => void
  onBlank: () => void
}

export function StartPage({ onTemplates, onBlank }: Props) {
  return (
    <section aria-labelledby="start-heading" className="flex flex-1 flex-col justify-center px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted">The little moments, made lasting</p>
        <h1 id="start-heading" className="text-4xl sm:text-6xl">Make room for a moment.</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">Start with a ready-made template or begin with a clean, blank layout.</p>

        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
          <button type="button" onClick={onTemplates} className="group min-h-52 rounded-3xl border border-line bg-surface p-7 text-left transition hover:-translate-y-1 hover:border-accent hover:shadow-lg">
            <span aria-hidden="true" className="mb-5 grid size-12 place-items-center rounded-2xl bg-canvas text-2xl text-accent">▤</span>
            <span className="block font-editorial text-2xl group-hover:text-accent">Choose a template</span>
            <span className="mt-2 block text-sm leading-relaxed text-muted">Browse photostrips, single photos and designed frames.</span>
          </button>
          <button type="button" onClick={onBlank} className="group min-h-52 rounded-3xl border border-line bg-surface p-7 text-left transition hover:-translate-y-1 hover:border-accent hover:shadow-lg">
            <span aria-hidden="true" className="mb-5 grid size-12 place-items-center rounded-2xl bg-canvas text-2xl text-accent">＋</span>
            <span className="block font-editorial text-2xl group-hover:text-accent">Start with a blank page</span>
            <span className="mt-2 block text-sm leading-relaxed text-muted">Pick an empty layout and decide how many photos to add.</span>
          </button>
        </div>
      </div>
    </section>
  )
}
