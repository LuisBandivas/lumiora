import { AnimatePresence, motion } from 'motion/react'
import { categories, photoCountLabel } from './catalog'
import { TemplatePreview } from './TemplatePreview'
import { useTemplateSelection } from './useTemplateSelection'
import { navigateTabs } from '../../components/ui/tabNavigation'

interface Props {
  selection: ReturnType<typeof useTemplateSelection>
  onContinue: () => void
}

export function ChooseLook({ selection, onContinue }: Props) {
  const { category, template, notice, options, selectCategory, selectTemplate, next, previous } =
    selection
  const index = options.findIndex((t) => t.id === template.id)
  const neighbours = options.length > 1
  const prev = options[(index - 1 + options.length) % options.length]
  const following = options[(index + 1) % options.length]

  return (
    <section aria-labelledby="choose-heading" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 text-center sm:pt-12">
        <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted">The little moments, made lasting</p>
        <h1 id="choose-heading" className="text-4xl sm:text-5xl">
          A moment to remember.
        </h1>
        <p className="mt-3 text-muted">Choose a look for your photos, then make it yours.</p>
      </div>

      <div
        role="tablist"
        onKeyDown={navigateTabs}
        aria-label="Template categories"
        className="mx-auto mt-6 flex w-full max-w-5xl gap-2 overflow-x-auto px-4 pb-1 sm:justify-center"
      >
        {categories.map((c) => {
          const selected = c.id === category
          return (
            <button
              key={c.id}
              role="tab"
              id={`category-${c.id}`}
              aria-controls="template-panel"
              tabIndex={selected ? 0 : -1}
              type="button"
              aria-selected={selected}
              onClick={() => selectCategory(c.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? 'border-ink bg-ink text-surface'
                  : 'border-line bg-surface text-muted hover:text-ink'
              }`}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      {notice && (
        <p role="status" className="mx-auto mt-4 max-w-md px-4 text-center text-sm text-muted">
          {notice}
        </p>
      )}

      <div role="tabpanel" id="template-panel" aria-labelledby={`category-${category}`} className="mx-auto mt-8 w-full max-w-5xl flex-1 px-4">
        <div aria-hidden="true" className="mx-auto mb-8 flex max-w-xs items-center gap-3 text-champagne"><span className="h-px flex-1 bg-line" /><span className="font-editorial text-xl">✦</span><span className="h-px flex-1 bg-line" /></div>
        {options.length === 0 ? (
          <p className="py-16 text-center text-muted">No templates in this category yet.</p>
        ) : (
          <div className="flex items-center justify-center gap-3 sm:gap-8">
            <button
              type="button"
              onClick={previous}
              disabled={!neighbours}
              aria-label="Previous template"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-lg hover:border-ink disabled:opacity-30"
            >
              ←
            </button>

            <div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)]">
              {neighbours && options.length > 2 && (
                <button type="button" aria-label={`Select ${prev.name}`} onClick={previous} className="hidden min-w-0 cursor-pointer lg:block">
                  <TemplatePreview template={prev} heightRem={14} active={false} />
                </button>
              )}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={template.id}
                  className="min-w-0"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.15 }}
                >
                  <TemplatePreview template={template} heightRem={22} />
                </motion.div>
              </AnimatePresence>
              {neighbours && (
                <button type="button" aria-label={`Select ${following.name}`} onClick={next} className="hidden min-w-0 cursor-pointer lg:block">
                  <TemplatePreview template={following} heightRem={14} active={false} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={next}
              disabled={!neighbours}
              aria-label="Next template"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-lg hover:border-ink disabled:opacity-30"
            >
              →
            </button>
          </div>
        )}

        <div className="mt-6 text-center" aria-live="polite">
          <p className="text-lg font-medium">{template.name}</p>
          <p className="text-sm text-muted">
            {photoCountLabel(template.photoCount)} · {index + 1} / {options.length}
          </p>
        </div>

        <ul className="mt-4 flex flex-wrap justify-center" aria-label="Templates in this category">
          {options.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => selectTemplate(t)}
                aria-label={`${t.name}, ${photoCountLabel(t.photoCount)}`}
                aria-current={t.id === template.id}
                className="grid size-11 place-items-center rounded-full"
              >
                <span aria-hidden="true" className={`size-2.5 rounded-full ${t.id === template.id ? 'bg-ink' : 'bg-line'}`} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent">
        <motion.button
          type="button"
          onClick={onContinue}
          whileTap={{ scale: 0.97 }}
          className="mx-auto block w-full max-w-sm rounded-full bg-accent px-6 py-3 font-medium text-accent-ink hover:opacity-90"
        >
          Continue with this
        </motion.button>
      </div>
    </section>
  )
}
