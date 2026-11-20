import { useState } from 'react'
import { gridOf } from '../templates/layout'
import type { Template } from '../templates/catalog'
import { OverlayLayer, type OverlayControls } from './OverlayLayer'
import { resolveEdits, type EditSettings } from './useEditSettings'

interface Props {
  template: Template
  slots: (string | null)[]
  edits: EditSettings
  /** CSS height of the preview; width follows the export aspect ratio. */
  height?: string
  /** Makes stickers and text selectable and movable. Review and Export leave this out. */
  overlayControls?: OverlayControls
}

// Renders the composition from the original photos plus edit choices. Reused by every screen.
export function CompositionPreview({
  template,
  slots,
  edits,
  height = 'clamp(16rem, 55vh, 30rem)',
  overlayControls,
}: Props) {
  const { frame, filter, caption, overlays } = resolveEdits(edits, template)
  const { layout } = template
  const { columns, rows } = gridOf(template.columns, template.photoCount)
  const [failed, setFailed] = useState(false)

  const description = `${template.name} preview, ${filter.label} filter, ${frame.label} frame${
    caption ? `, caption: ${caption}` : ''
  }${overlays.length ? `, ${overlays.length} sticker or text items` : ''}`

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <div
        // Interactive items must stay reachable, so only the read-only preview is an image.
        role={overlayControls ? 'group' : 'img'}
        aria-label={description}
        className="relative overflow-hidden shadow-md ring-1 ring-line transition-colors duration-200"
        style={{
          height,
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
            {slots.map((url, i) => (
              <div key={i} className="min-h-0 overflow-hidden bg-black/10">
                {url && (
                  <img
                    src={url}
                    alt=""
                    onError={() => setFailed(true)}
                    className="size-full object-cover"
                    style={{ filter: filter.css }}
                  />
                )}
              </div>
            ))}
          </div>
          {/* The caption band is always reserved so typing never resizes the photos. */}
          <p
            className="m-0 flex items-center justify-center truncate text-center font-medium"
            style={{
              height: `${layout.captionHeight}cqw`,
              fontSize: `${layout.captionFont}cqw`,
              color: frame.ink,
            }}
          >
            {caption}
          </p>
        </div>
        <OverlayLayer items={overlays} controls={overlayControls} />
      </div>
      {failed && (
        <p role="alert" className="text-sm text-red-700">
          A photo could not be displayed. Go back to Capture or upload and replace it.
        </p>
      )}
    </figure>
  )
}
