import { motion } from 'motion/react'
import type { PhotoSession } from '../camera/usePhotoSession'
import { photoCountLabel, type Template } from '../templates/catalog'
import { CompositionPreview } from './CompositionPreview'
import type { EditSession } from './useEditSettings'

interface Props {
  template: Template
  photos: PhotoSession
  edits: EditSession
  onEdit: () => void
  onContinue: () => void
}

export function ReviewScreen({ template, photos, edits, onEdit, onContinue }: Props) {
  return (
    <section aria-labelledby="review-heading" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 text-center sm:pt-12">
        <h1 id="review-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Review
        </h1>
        <p className="mt-2 text-muted">
          This is the image you will download. {template.name} · {photoCountLabel(template.photoCount)}.
        </p>
      </div>

      <div className="mt-8 flex flex-1 justify-center px-4">
        <CompositionPreview
          template={template}
          slots={photos.slots}
          edits={edits.settings}
          height="clamp(18rem, 62vh, 34rem)"
        />
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent">
        <div className="mx-auto flex max-w-sm flex-col gap-2">
          <motion.button
            type="button"
            onClick={onContinue}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink hover:opacity-90"
          >
            Continue to export
          </motion.button>
          <button type="button" onClick={onEdit} className="rounded-full px-6 py-2 text-sm font-medium text-muted hover:text-ink">
            Edit
          </button>
        </div>
      </div>
    </section>
  )
}
