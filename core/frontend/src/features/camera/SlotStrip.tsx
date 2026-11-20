import type { Template } from '../templates/catalog'
import type { PhotoSession } from './usePhotoSession'

interface Props {
  template: Template
  session: PhotoSession
}

// Shows the template's slots filled with local photos. Selecting a slot targets it for retake or replace.
export function SlotStrip({ template, session }: Props) {
  const rows = Math.ceil(template.photoCount / template.columns)
  return (
    <div
      role="group"
      aria-label={`${template.name} photo slots`}
      className="grid gap-2 rounded-sm bg-surface p-3 shadow-md ring-1 ring-line"
      style={{
        height: 'clamp(14rem, 50vh, 28rem)',
        aspectRatio: String(template.aspect),
        gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {session.slots.map((url, i) => {
        const selected = i === session.active
        return (
          <div key={i} className="relative min-h-0">
            <button
              type="button"
              aria-pressed={selected}
              aria-label={`Photo ${i + 1}, ${url ? 'filled' : 'empty'}${selected ? ', selected' : ''}`}
              onClick={() => session.select(i)}
              className={`grid size-full place-items-center overflow-hidden rounded-[2px] bg-canvas text-sm text-muted ring-2 ${
                selected ? 'ring-accent' : 'ring-line'
              }`}
            >
              {url ? <img src={url} alt="" className="size-full object-cover" /> : <span>{i + 1}</span>}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => session.remove(i)}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-ink/80 text-xs text-surface hover:bg-ink"
              >
                ✕
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
