import { useState } from 'react'
import { motion } from 'motion/react'
import { ChoiceGroup } from '../../components/ui/ChoiceGroup'
import { navigateTabs } from '../../components/ui/tabNavigation'
import type { PhotoSession } from '../camera/usePhotoSession'
import type { Template } from '../templates/catalog'
import { CompositionPreview } from './CompositionPreview'
import { OverlayPanel } from './OverlayPanel'
import { CAPTION_MAX_LENGTH, filterPresets, framePresets } from './presets'
import { resolveEdits, type EditSession } from './useEditSettings'

interface Props {
  template: Template
  photos: PhotoSession
  edits: EditSession
  onBack: () => void
  onContinue: () => void
}

type Panel = 'look' | 'caption' | 'stickers'

// On a phone these are tabs so one compact group shows at a time and the preview stays in view.
// From the md breakpoint (tablets and phones held sideways) every group is visible beside the preview.
const panels: { id: Panel; label: string }[] = [
  { id: 'look', label: 'Look' },
  { id: 'caption', label: 'Caption' },
  { id: 'stickers', label: 'Stickers and text' },
]

const frameChoices = framePresets.map((f) => ({
  id: f.id,
  label: f.label,
  swatch: (
    <span
      aria-hidden="true"
      className="size-4 rounded-full ring-1 ring-line"
      style={{ background: f.background }}
    />
  ),
}))

const filterChoices = filterPresets.map((f) => ({ id: f.id, label: f.label }))

export function CustomizeScreen({ template, photos, edits, onBack, onContinue }: Props) {
  const { settings, update, reset, isDefault } = edits
  // Which item is selected and which tab is open are temporary UI state, apart from the edit data.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panel, setPanel] = useState<Panel>('look')
  const resolved = resolveEdits(settings, template)
  const selected = settings.overlays.find((o) => o.id === selectedId)

  // Selecting an item on the preview opens its controls, even if another tab was showing.
  const selectItem = (id: string | null) => {
    setSelectedId(id)
    if (id) setPanel('stickers')
  }

  // On phones the preview is pinned, so focus scrolling must leave room for it (scroll-margin-top);
  // otherwise a focused slider can land underneath the preview.
  // Class names are written out in full so Tailwind can see them.
  const panelClass = (id: Panel) =>
    `${panel === id ? 'flex' : 'hidden'} flex-col gap-6 md:flex [&_:is(input,button)]:scroll-mt-[calc(var(--preview-h)+2.5rem)] [&_:is(input,button)]:scroll-mb-32 sm:[&_:is(input,button)]:scroll-mb-4 md:[&_:is(input,button)]:scroll-mt-4`

  return (
    <section aria-labelledby="customize-heading" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-4 text-center sm:pt-12">
        <h1 id="customize-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Customize
        </h1>
        <p className="mt-2 hidden text-muted sm:block">
          Start from the {template.name} look, then change the frame, filter, caption, stickers and text. Your
          photos are not changed.
        </p>
      </div>

      <div className="mx-auto mt-2 flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 [--preview-h:clamp(11rem,38vh,18rem)] md:mt-8 md:grid md:grid-cols-2 md:items-start md:gap-8 md:[--preview-h:clamp(16rem,55vh,30rem)]">
        {/* Pinned on phones so the preview stays visible while adjusting controls below it. */}
        <div className="sticky top-0 z-10 -mx-4 flex justify-center bg-canvas/95 px-4 py-2 backdrop-blur md:top-4 md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <CompositionPreview
            template={template}
            slots={photos.slots}
            edits={settings}
            height="var(--preview-h)"
            overlayControls={{
              selectedId,
              onSelect: selectItem,
              onChange: edits.updateOverlay,
              onRemove: (id) => {
                edits.removeOverlay(id)
                setSelectedId(null)
              },
            }}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
          <div role="tablist" onKeyDown={navigateTabs} aria-label="Editing options" className="flex gap-2 overflow-x-auto md:hidden">
            {panels.map((p) => (
              <button
                key={p.id}
                id={`tab-${p.id}`}
                role="tab"
                type="button"
                aria-selected={p.id === panel}
                tabIndex={p.id === panel ? 0 : -1}
                aria-controls={`panel-${p.id}`}
                onClick={() => setPanel(p.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  p.id === panel
                    ? 'border-ink bg-ink text-surface'
                    : 'border-line bg-surface text-muted hover:text-ink'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div id="panel-look" role="tabpanel" aria-labelledby="tab-look" className={panelClass('look')}>
            <ChoiceGroup
              legend="Frame"
              name="frame"
              value={resolved.frame.id}
              choices={frameChoices}
              onChange={(frameId) => update({ frameId })}
            />
            <ChoiceGroup
              legend="Filter"
              name="filter"
              value={resolved.filter.id}
              choices={filterChoices}
              onChange={(filterId) => update({ filterId })}
            />
          </div>

          <div id="panel-caption" role="tabpanel" aria-labelledby="tab-caption" className={panelClass('caption')}>
            <div>
              <label htmlFor="caption" className="mb-2 block text-sm font-medium">
                Caption <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="caption"
                type="text"
                value={settings.caption}
                maxLength={CAPTION_MAX_LENGTH}
                onChange={(e) => update({ caption: e.target.value })}
                placeholder="Add a short caption"
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-muted">
                {settings.caption.length} / {CAPTION_MAX_LENGTH}
              </p>
            </div>
          </div>

          <div id="panel-stickers" role="tabpanel" aria-labelledby="tab-stickers" className={panelClass('stickers')}>
            <OverlayPanel
              edits={edits}
              textColor={resolved.frame.ink}
              selected={selected}
              onSelect={selectItem}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                reset()
                setSelectedId(null)
              }}
              disabled={isDefault}
              className="scroll-mb-32 scroll-mt-[calc(var(--preview-h)+2.5rem)] rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium hover:border-ink disabled:opacity-40 sm:scroll-mb-4 md:scroll-mt-4"
            >
              Reset edits
            </button>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-6 border-t border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:py-4">
        <div className="mx-auto flex max-w-sm flex-col gap-1 sm:gap-2">
          <motion.button
            type="button"
            onClick={onContinue}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink hover:opacity-90"
          >
            Continue to review
          </motion.button>
          <button type="button" onClick={onBack} className="rounded-full px-6 py-1.5 text-sm font-medium text-muted hover:text-ink sm:py-2">
            Back to Capture or upload
          </button>
        </div>
      </div>
    </section>
  )
}
