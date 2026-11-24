import { ChoiceGroup } from '../../components/ui/ChoiceGroup'
import {
  MAX_OVERLAYS,
  SIZE_RANGE,
  TEXT_MAX_LENGTH,
  createSticker,
  createText,
  overlayColors,
  overlayLabel,
  stickerPresets,
  type OverlayItem,
} from './overlays'
import type { EditSession } from './useEditSettings'
import { fontPresets } from './fonts'

interface Props {
  edits: EditSession
  /** Default text color, chosen to stay readable on the current frame. */
  textColor: string
  selected: OverlayItem | undefined
  onSelect: (id: string | null) => void
}

const colorChoices = overlayColors.map((c) => ({
  id: c.value,
  label: c.label,
  swatch: (
    <span aria-hidden="true" className="size-4 rounded-full ring-1 ring-line" style={{ background: c.value }} />
  ),
}))

const button =
  'rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium hover:border-ink disabled:opacity-40'

export function OverlayPanel({ edits, textColor, selected, onSelect }: Props) {
  const { settings, addOverlay, updateOverlay, removeOverlay } = edits
  const count = settings.overlays.length
  const full = count >= MAX_OVERLAYS

  const add = (item: OverlayItem) => {
    addOverlay(item)
    onSelect(item.id)
  }

  const range = selected ? SIZE_RANGE[selected.kind] : SIZE_RANGE.sticker

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 p-0 text-sm font-medium">Stickers and text</legend>
        <div className="flex flex-wrap gap-2">
          {stickerPresets.map((sticker) => (
            <button
              key={sticker.id}
              type="button"
              disabled={full}
              onClick={() => add(createSticker(sticker.id, count))}
              aria-label={`Add ${sticker.label} sticker`}
              className="grid size-11 place-items-center rounded-lg border border-line bg-surface hover:border-ink disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
                <path d={sticker.path} fill="currentColor" fillRule={sticker.evenodd ? 'evenodd' : 'nonzero'} />
              </svg>
            </button>
          ))}
          <button type="button" disabled={full} onClick={() => add(createText(textColor, count))} className={button}>
            Add text
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">
          {full
            ? `Limit of ${MAX_OVERLAYS} items reached.`
            : 'Drag items on the preview, or select one and use the arrow keys.'}
        </p>
      </fieldset>

      {selected && (
        <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4" role="group" aria-label={`Edit ${overlayLabel(selected)}`}>
          <p className="text-sm font-medium">{overlayLabel(selected)}</p>

          {selected.kind === 'text' && (
            <div>
              <label htmlFor="overlay-text" className="mb-1 block text-sm font-medium">
                Text
              </label>
              <input
                id="overlay-text"
                type="text"
                value={selected.text}
                maxLength={TEXT_MAX_LENGTH}
                onChange={(e) => updateOverlay(selected.id, { text: e.target.value })}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
              />
              <ChoiceGroup legend="Text font" name="overlay-font" value={selected.fontId ?? 'default'}
                choices={fontPresets.map((font) => ({ id: font.id, label: font.label }))}
                onChange={(fontId) => updateOverlay(selected.id, { fontId })} />
            </div>
          )}

          <div>
            <label htmlFor="overlay-size" className="mb-1 block text-sm font-medium">
              Size
            </label>
            <input
              id="overlay-size"
              type="range"
              min={range.min}
              max={range.max}
              value={selected.size}
              onChange={(e) => updateOverlay(selected.id, { size: Number(e.target.value) })}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <label htmlFor="overlay-rotation" className="mb-1 block text-sm font-medium">
              Rotation <span className="font-normal text-muted">{selected.rotation}°</span>
            </label>
            <input
              id="overlay-rotation"
              type="range"
              min={-180}
              max={180}
              step={5}
              value={selected.rotation}
              onChange={(e) => updateOverlay(selected.id, { rotation: Number(e.target.value) })}
              className="w-full accent-accent"
            />
          </div>

          <ChoiceGroup
            legend="Color"
            name="overlay-color"
            value={selected.color}
            choices={colorChoices}
            onChange={(color) => updateOverlay(selected.id, { color })}
          />

          <div>
            <button
              type="button"
              onClick={() => {
                removeOverlay(selected.id)
                onSelect(null)
              }}
              className={button}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
