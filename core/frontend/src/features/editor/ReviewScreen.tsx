import { motion } from 'motion/react'
import type { PhotoSession } from '../camera/usePhotoSession'
import { photoCountLabel, type Template } from '../templates/catalog'
import { CompositionPreview } from './CompositionPreview'
import type { EditSession } from './useEditSettings'
import { useMotionPlayback } from '../camera/useMotionPlayback'

interface Props {
  template: Template
  photos: PhotoSession
  edits: EditSession
  onEdit: () => void
  onContinue: () => void
}

export function ReviewScreen({ template, photos, edits, onEdit, onContinue }: Props) {
  const playback = useMotionPlayback()
  return (
    <section aria-labelledby="review-heading" className="journey-screen flex flex-1 flex-col">
      <div className="journey-intro mx-auto w-full max-w-5xl px-4 pt-8 text-center sm:pt-12">
        <p className="journey-eyebrow">✧ &nbsp; Almost a keepsake</p>
        <h1 id="review-heading" className="text-3xl sm:text-4xl">
          Review
        </h1>
        <p className="mt-2 text-muted">
          Preview your image and motion clip. {template.name} · {photoCountLabel(template.photoCount)}.
        </p>
      </div>

      <div className="mt-8 flex flex-1 flex-col items-center gap-3 px-4">
        <CompositionPreview
          template={template}
          slots={photos.slots}
          clips={photos.clips}
          cameras={photos.cameras}
          playing={playback.playing}
          onPlaybackFailure={playback.fail}
          edits={edits.settings}
          height="clamp(18rem, 62vh, 34rem)"
        />
        {photos.hasMotion && (
          <button type="button" onClick={playback.toggle} className="rounded-full border border-line px-5 py-2 text-sm font-medium">
            {playback.playing ? 'Pause clip' : 'Play clip'}
          </button>
        )}
        {playback.failed && <p role="status" className="text-sm text-muted">Playback paused on this device. Your clip is still available; press Play to try again.</p>}
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
