import { useState } from 'react'
import type { Template } from '../templates/catalog'
import { LAYOUT } from './compositionLayout'
import { resolveEdits, type EditSettings } from './useEditSettings'

interface Props {
  template: Template
  slots: (string | null)[]
  edits: EditSettings
  /** CSS height of the preview; width follows the export aspect ratio. */
  height?: string
}

// Renders the composition from the original photos plus edit choices. Reused by Review and Export.
export function CompositionPreview({ template, slots, edits, height = 'clamp(16rem, 55vh, 30rem)' }: Props) {
  const { frame, filter, caption } = resolveEdits(edits)
  const rows = Math.ceil(template.photoCount / template.columns)
  const [failed, setFailed] = useState(false)

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <div
        role="img"
        aria-label={`${template.name} preview, ${filter.label} filter, ${frame.label} frame${
          caption ? `, caption: ${caption}` : ''
        }`}
        className="shadow-md ring-1 ring-line transition-colors duration-200"
        style={{
          height,
          aspectRatio: String(template.aspect),
          background: frame.background,
          containerType: 'inline-size',
        }}
      >
        <div
          className="flex size-full flex-col"
          style={{ padding: `${LAYOUT.padding}cqw`, gap: `${LAYOUT.gap}cqw` }}
        >
          <div
            className="grid min-h-0 flex-1"
            style={{
              gap: `${LAYOUT.gap}cqw`,
              gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
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
              height: `${LAYOUT.captionHeight}cqw`,
              fontSize: `${LAYOUT.captionFont}cqw`,
              color: frame.ink,
            }}
          >
            {caption}
          </p>
        </div>
      </div>
      {failed && (
        <p role="alert" className="text-sm text-red-700">
          A photo could not be displayed. Go back to Capture or upload and replace it.
        </p>
      )}
    </figure>
  )
}
