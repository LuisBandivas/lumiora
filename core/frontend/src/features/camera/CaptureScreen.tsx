import { useState } from 'react'
import { motion } from 'motion/react'
import { photoCountLabel, type Template } from '../templates/catalog'
import { CameraPanel } from './CameraPanel'
import { SlotStrip } from './SlotStrip'
import { UploadPanel } from './UploadPanel'
import type { PhotoSession } from './usePhotoSession'
import { navigateTabs } from '../../components/ui/tabNavigation'
import { useMotionPlayback } from './useMotionPlayback'

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
  const playback = useMotionPlayback()
  const targetLabel = `photo ${session.active + 1}`
  const remaining = template.photoCount - session.filled

  return (
    <section aria-labelledby="capture-heading" className="journey-screen flex flex-1 flex-col">
      <div className="journey-intro mx-auto w-full max-w-5xl px-4 pt-8 text-center sm:pt-12">
        <p className="journey-eyebrow">✿ &nbsp; Your little photo booth</p>
        <h1 id="capture-heading" className="text-3xl sm:text-4xl">
          Capture or upload
        </h1>
        <p className="mt-2 text-muted">
          {template.name} · {photoCountLabel(template.photoCount)}. Select a slot to retake or replace it.
        </p>
      </div>

      <div className="journey-capture-grid mx-auto mt-8 grid w-full max-w-5xl flex-1 gap-6 px-4 lg:grid-cols-2 lg:items-start">
        <div className="journey-capture-card min-w-0">
          <fieldset className="journey-timer mb-4 flex justify-center gap-4" aria-describedby="timer-help">
            <legend className="mb-2 w-full text-center text-sm font-medium">A little countdown</legend>
            {([0, 3, 5] as const).map((seconds) => (
              <label key={seconds} className="flex items-center gap-2 text-sm">
                <input type="radio" name="capture-timer" value={seconds} checked={session.timer === seconds}
                  disabled={session.timerLocked} onChange={() => session.setTimer(seconds)} />
                {seconds === 0 ? 'Off' : `${seconds} seconds`}
              </label>
            ))}
            <span id="timer-help" className="sr-only">{session.timerLocked ? 'Remove all camera photos to change the timer.' : 'One timer applies to all camera photos in this template.'}</span>
          </fieldset>
          {session.timerLocked && <p className="mb-3 text-center text-xs text-muted">Timer locked while this template has camera photos. Remove them to change it.</p>}
          <div role="tablist" onKeyDown={navigateTabs} aria-label="Photo source" className="journey-source-tabs mb-4 flex justify-center gap-2">
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
                    ? 'border-accent bg-accent text-accent-ink shadow-sm'
                    : 'border-line bg-surface text-muted hover:border-champagne hover:text-ink'
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
                timer={session.timer}
                facing={session.cameraFacing}
                onFacingChange={session.setCameraFacing}
                onCapture={session.placeCapture}
                onUseUpload={() => setSource('upload')}
              />
            ) : (
              <UploadPanel targetLabel={targetLabel} onFiles={session.place} />
            )}
          </div>
        </div>

        <div className="journey-preview-card flex min-w-0 flex-col items-center gap-3">
          <SlotStrip template={template} session={session} playing={playback.playing} onPlaybackFailure={playback.fail} />
          {session.hasMotion && (
            <button type="button" onClick={playback.toggle} className="rounded-full border border-line px-5 py-2 text-sm font-medium">
              {playback.playing ? 'Pause clips' : 'Play clips'}
            </button>
          )}
          {playback.failed && <p role="status" className="text-sm text-muted">Playback paused on this device. The clips are still saved; press Play to try again.</p>}
          <p className="text-sm text-muted" aria-live="polite">
            {session.filled} of {template.photoCount} photos
          </p>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-5xl px-4 text-center text-xs text-muted">
        Photos and clips stay in this browser tab and are lost if you refresh or close it.
      </p>

      <div className="journey-action-bar sticky bottom-0 mt-6 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent">
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
