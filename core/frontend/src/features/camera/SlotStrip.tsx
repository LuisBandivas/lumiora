import { framePresets } from '../editor/presets'
import type { Template } from '../templates/catalog'
import { gridOf } from '../templates/layout'
import type { PhotoSession } from './usePhotoSession'

interface Props {
  template: Template
  session: PhotoSession
}

// Shows the template's slots, laid out like the final composition, filled with local photos.
// Selecting a slot targets it for retake or replace.
export function SlotStrip({ template, session }: Props) {
  const { layout } = template
  const { columns, rows } = gridOf(template.columns, template.photoCount)
  const frame = framePresets.find((f) => f.id === template.defaults.frameId) ?? framePresets[0]
  return (
    <div
      role="group"
      aria-label={`${template.name} photo slots`}
      className="shadow-md ring-1 ring-line"
      style={{
        height: 'clamp(14rem, 50vh, 28rem)',
        aspectRatio: String(template.aspect),
        background: frame.background,
        containerType: 'inline-size',
      }}
    >
      <div
        className="flex size-full flex-col"
        style={{ padding: `${layout.padding}cqw`, gap: `${layout.gap}cqw` }}
      >
        <div
          className="grid min-h-0 flex-1"
          style={{
            gap: `${layout.gap}cqw`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
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
                  className={`grid size-full place-items-center overflow-hidden bg-black/10 text-sm text-muted ring-2 ${
                    selected ? 'ring-accent' : 'ring-transparent'
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
        <div style={{ height: `${layout.captionHeight}cqw` }} />
      </div>
    </div>
  )
}
