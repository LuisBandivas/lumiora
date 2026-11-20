import { motion } from 'motion/react'
import { ChoiceGroup } from '../../components/ui/ChoiceGroup'
import type { PhotoSession } from '../camera/usePhotoSession'
import type { Template } from '../templates/catalog'
import { CompositionPreview } from './CompositionPreview'
import { CAPTION_MAX_LENGTH, filterPresets, framePresets } from './presets'
import type { EditSession } from './useEditSettings'

interface Props {
  template: Template
  photos: PhotoSession
  edits: EditSession
  onBack: () => void
  onContinue: () => void
}

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

  return (
    <section aria-labelledby="customize-heading" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 text-center sm:pt-12">
        <h1 id="customize-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Customize
        </h1>
        <p className="mt-2 text-muted">Pick a frame, a filter and an optional caption. Your photos are not changed.</p>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-5xl flex-1 gap-8 px-4 lg:grid-cols-[auto_1fr] lg:items-start">
        <div className="flex justify-center">
          <CompositionPreview template={template} slots={photos.slots} edits={settings} />
        </div>

        <div className="flex flex-col gap-6">
          <ChoiceGroup
            legend="Frame"
            name="frame"
            value={settings.frameId}
            choices={frameChoices}
            onChange={(frameId) => update({ frameId })}
          />
          <ChoiceGroup
            legend="Filter"
            name="filter"
            value={settings.filterId}
            choices={filterChoices}
            onChange={(filterId) => update({ filterId })}
          />
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
          <div>
            <button
              type="button"
              onClick={reset}
              disabled={isDefault}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium hover:border-ink disabled:opacity-40"
            >
              Reset edits
            </button>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent">
        <div className="mx-auto flex max-w-sm flex-col gap-2">
          <motion.button
            type="button"
            onClick={onContinue}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink hover:opacity-90"
          >
            Continue to review
          </motion.button>
          <button type="button" onClick={onBack} className="rounded-full px-6 py-2 text-sm font-medium text-muted hover:text-ink">
            Back to Capture or upload
          </button>
        </div>
      </div>
    </section>
  )
}
