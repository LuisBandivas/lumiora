import { useState } from 'react'
import { motion } from 'motion/react'
import { photoCountLabel, type Template } from '../templates/catalog'
import { CameraPanel } from './CameraPanel'
import { SlotStrip } from './SlotStrip'
import { UploadPanel } from './UploadPanel'
import type { PhotoSession } from './usePhotoSession'
import { navigateTabs } from '../../components/ui/tabNavigation'

type Source = 'camera' | 'upload'

interface Props {
  template: Template
  session: PhotoSession
  onBack: () => void
  onContinue: () => void
}

const sources: { id: Source; label: string }[] = [
  { id: 'camera', label: 'Use camera' },
  { id: 'upload', label: 'Upload photos' },
]

export function CaptureScreen({ template, session, onBack, onContinue }: Props) {
  const [source, setSource] = useState<Source>('camera')
  const targetLabel = `photo ${session.active + 1}`
  const remaining = template.photoCount - session.filled

  return (
    <section aria-labelledby="capture-heading" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 text-center sm:pt-12">
        <h1 id="capture-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Capture or upload
        </h1>
        <p className="mt-2 text-muted">
          {template.name} · {photoCountLabel(template.photoCount)}. Select a slot to retake or replace it.
        </p>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-5xl flex-1 gap-8 px-4 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0">
          <div role="tablist" onKeyDown={navigateTabs} aria-label="Photo source" className="mb-4 flex justify-center gap-2">
            {sources.map((s) => (
              <button
                key={s.id}
                role="tab"
                id={`source-${s.id}`}
                aria-controls="source-panel"
                tabIndex={s.id === source ? 0 : -1}
                type="button"
                aria-selected={s.id === source}
                onClick={() => setSource(s.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  s.id === source
                    ? 'border-ink bg-ink text-surface'
                    : 'border-line bg-surface text-muted hover:text-ink'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id="source-panel" aria-labelledby={`source-${source}`}>
            {source === 'camera' ? (
              <CameraPanel
                targetLabel={targetLabel}
                onCapture={(url) => void session.place([url])}
                onUseUpload={() => setSource('upload')}
              />
            ) : (
              <UploadPanel targetLabel={targetLabel} onFiles={session.place} />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-3">
          <SlotStrip template={template} session={session} />
          <p className="text-sm text-muted" aria-live="polite">
            {session.filled} of {template.photoCount} photos
          </p>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-5xl px-4 text-center text-xs text-muted">
        Photos stay in this browser tab and are lost if you refresh or close it.
      </p>

      <div className="sticky bottom-0 mt-6 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent">
        <div className="mx-auto flex max-w-sm flex-col gap-2">
          <motion.button
            type="button"
            disabled={!session.complete}
            onClick={onContinue}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink hover:opacity-90 disabled:opacity-40"
          >
            {session.complete
              ? 'Continue'
              : `Add ${remaining} more ${remaining === 1 ? 'photo' : 'photos'} to continue`}
          </motion.button>
          <button type="button" onClick={onBack} className="rounded-full px-6 py-2 text-sm font-medium text-muted hover:text-ink">
            Back to Choose look
          </button>
        </div>
      </div>
    </section>
  )
}
