import { useState } from 'react'
import { motion } from 'motion/react'
import type { PhotoSession } from '../camera/usePhotoSession'
import { CompositionPreview } from '../editor/CompositionPreview'
import { EXPORT_WIDTH, FilterUnsupportedError, exportHeight, renderComposition } from '../editor/renderComposition'
import type { EditSession } from '../editor/useEditSettings'
import type { Template } from '../templates/catalog'
import { downloadBlob } from './downloadBlob'
import { renderCompositionVideo, VIDEO_WIDTH } from './renderCompositionVideo'

type Status = 'ready' | 'exporting' | 'downloaded' | 'error'

interface Props {
  template: Template
  photos: PhotoSession
  edits: EditSession
  onBack: () => void
  onStartOver: () => void
}

// Format, size and filename are provisional (docs/FEATURES.md): PNG, 1200 px wide.
export function ExportScreen({ template, photos, edits, onBack, onStartOver }: Props) {
  const [status, setStatus] = useState<Status>('ready')
  const [message, setMessage] = useState('')
  const [videoStatus, setVideoStatus] = useState<Status>('ready')
  const [videoMessage, setVideoMessage] = useState('')
  const [videoFilename, setVideoFilename] = useState('')
  const filename = `ephemora-${template.id}.png`

  const download = async () => {
    setStatus('exporting')
    try {
      const blob = await renderComposition(template, photos.slots, edits.settings)
      downloadBlob(blob, filename)
      setStatus('downloaded')
    } catch (error) {
      setMessage(
        error instanceof FilterUnsupportedError
          ? `${error.message} Choose the Original filter in Customize, or try another browser.`
          : 'The image could not be created. Try again.',
      )
      setStatus('error')
    }
  }

  const downloadVideo = async () => {
    setVideoStatus('exporting')
    try {
      const blob = await renderCompositionVideo(template, photos.slots, photos.clips, photos.cameras, edits.settings, photos.timer)
      const extension = blob.type.startsWith('video/mp4') ? 'mp4' : 'webm'
      const name = `ephemora-${template.id}.${extension}`
      downloadBlob(blob, name)
      setVideoFilename(name)
      setVideoStatus('downloaded')
    } catch (error) {
      setVideoMessage(error instanceof FilterUnsupportedError
        ? `${error.message} Choose the Original filter in Customize, or try another browser.`
        : 'The video could not be created. Try again.')
      setVideoStatus('error')
    }
  }

  const label = {
    ready: 'Download PNG',
    exporting: 'Preparing…',
    downloaded: 'Download again',
    error: 'Try again',
  }[status]

  return (
    <section aria-labelledby="export-heading" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 text-center sm:pt-12">
        <h1 id="export-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Export
        </h1>
        <p className="mt-2 text-muted">
          PNG · {EXPORT_WIDTH} × {exportHeight(template)} px · created in your browser.
        </p>
        {photos.hasMotion && <p className="mt-1 text-sm text-muted">Video · up to {VIDEO_WIDTH} px wide · MP4 or WebM, depending on your browser.</p>}
      </div>

      <div className="mt-8 flex flex-1 justify-center px-4">
        <CompositionPreview
          template={template}
          slots={photos.slots}
          edits={edits.settings}
          height="clamp(16rem, 50vh, 28rem)"
        />
      </div>

      <div className="sticky bottom-0 mt-8 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur sm:static sm:border-0 sm:bg-transparent">
        <div className="mx-auto flex max-w-sm flex-col gap-2">
          <p
            role={status === 'error' ? 'alert' : 'status'}
            className={`min-h-5 text-center text-sm ${status === 'error' ? 'text-red-700' : 'text-muted'}`}
          >
            {status === 'error' && message}
            {status === 'exporting' && 'Creating your image…'}
            {status === 'downloaded' && `Downloaded ${filename}.`}
          </p>
          <motion.button
            type="button"
            disabled={status === 'exporting'}
            onClick={download}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink hover:opacity-90 disabled:opacity-40"
          >
            {label}
          </motion.button>
          {photos.hasMotion && (
            <>
              <p role={videoStatus === 'error' ? 'alert' : 'status'} className={`min-h-5 text-center text-sm ${videoStatus === 'error' ? 'text-red-700' : 'text-muted'}`}>
                {videoStatus === 'error' && videoMessage}
                {videoStatus === 'exporting' && 'Creating your video…'}
                {videoStatus === 'downloaded' && `Downloaded ${videoFilename}.`}
              </p>
              <motion.button
                type="button"
                disabled={videoStatus === 'exporting'}
                onClick={downloadVideo}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-line bg-surface px-6 py-3 font-medium hover:border-ink disabled:opacity-40"
              >
                {videoStatus === 'exporting' ? 'Preparing video…' : videoStatus === 'error' ? 'Retry video' : videoStatus === 'downloaded' ? 'Download video again' : 'Download video'}
              </motion.button>
            </>
          )}
          <button type="button" onClick={onBack} className="rounded-full px-6 py-2 text-sm font-medium text-muted hover:text-ink">
            Back to Review
          </button>
          <button
            type="button"
            onClick={onStartOver}
            className="rounded-full px-6 py-2 text-sm font-medium text-muted hover:text-ink"
          >
            Start over (clears photos)
          </button>
        </div>
      </div>
    </section>
  )
}
