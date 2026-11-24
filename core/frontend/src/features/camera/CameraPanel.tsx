import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { captureFrame } from './captureFrame'
import { useCamera } from './useCamera'
import { playableClipUrl, startClip } from './recordClip'
import type { CameraFacing, TimerSeconds } from './usePhotoSession'

// Capture clips cover the full three-second countdown.

interface Props {
  /** Which slot the next photo goes to, e.g. "photo 2". */
  targetLabel: string
  timer: TimerSeconds
  facing: CameraFacing
  onFacingChange: (facing: CameraFacing) => void
  onCapture: (url: string, clipUrl: string | null, facing: CameraFacing) => void
  onUseUpload: () => void
}

const secondary =
  'rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium hover:border-ink'

export function CameraPanel({ targetLabel, timer, facing: initialFacing, onFacingChange, onCapture, onUseUpload }: Props) {
  const { videoRef, state, facing, start, stop } = useCamera(initialFacing, onFacingChange)
  const [count, setCount] = useState<number | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [captureError, setCaptureError] = useState(false)
  const [clipError, setClipError] = useState(false)
  const recordingRef = useRef<ReturnType<typeof startClip> | null>(null)

  useEffect(() => () => {
    recordingRef.current?.cancel()
    recordingRef.current = null
  }, [])

  // Keep the latest callback without restarting the countdown timer when the parent re-renders.
  const onCaptureRef = useRef(onCapture)
  useEffect(() => {
    onCaptureRef.current = onCapture
  })

  const shoot = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    setCapturing(true)
    const recording = recordingRef.current
    recordingRef.current = null
    const clipResult = recording?.stop().catch(() => null)
    try {
      const photoUrl = await captureFrame(video, facing === 'user')
      const clipBlob = await clipResult
      const clipUrl = clipBlob ? await playableClipUrl(clipBlob) : null
      onCaptureRef.current(photoUrl, clipUrl, facing)
      setClipError(!clipUrl)
      setCaptureError(false)
    } catch {
      setCaptureError(true)
    } finally {
      setCapturing(false)
    }
  }, [videoRef, facing])

  useEffect(() => {
    if (count === null) return
    const id = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1)
      } else {
        setCount(null)
        void shoot()
      }
    }, 1000)
    return () => clearTimeout(id)
  }, [count, shoot])

  const ready = state === 'ready'
  const busy = count !== null || capturing

  const status = capturing
    ? 'Capturing photo…'
    : count !== null
      ? `Taking ${targetLabel} in ${count}`
      : captureError
        ? 'That photo could not be captured. Try again.'
        : clipError
          ? 'Photo saved without a clip. Select that photo slot to retake it.'
        : ready
          ? `Camera ready. Next: ${targetLabel}.`
          : ''

  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-card bg-ink">
        <video
          ref={videoRef}
          playsInline
          muted
          aria-label="Live camera preview"
          className={`size-full object-cover ${facing === 'user' ? '-scale-x-100' : ''} ${ready ? '' : 'hidden'}`}
        />

        {!ready && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center text-surface">
            <CameraMessage state={state} onStart={start} onUseUpload={onUseUpload} />
          </div>
        )}

        <AnimatePresence>
          {count !== null && (
            <motion.div
              key={count}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center text-8xl font-semibold text-surface drop-shadow-lg"
            >
              {count}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p role="status" className="mt-3 min-h-6 text-center text-sm text-muted">
        {status}
      </p>

      {ready && (
        <div className="mt-2 flex items-center justify-center gap-3">
          <label className="text-sm">Camera
            <select aria-label="Camera direction" value={facing} disabled={busy}
              onChange={(event) => void start(event.target.value as CameraFacing)}
              className="ml-2 rounded border border-line bg-surface px-2 py-1">
              <option value="user">Front</option><option value="environment">Back</option>
            </select>
          </label>
          <motion.button
            type="button"
            disabled={busy}
            onClick={() => {
              const stream = videoRef.current?.srcObject
              try {
                recordingRef.current = timer > 0 && stream instanceof MediaStream ? startClip(stream) : null
                setClipError(timer > 0 && !recordingRef.current)
              } catch {
                recordingRef.current = null
                setClipError(timer > 0)
              }
              if (timer === 0) void shoot()
              else setCount(timer)
            }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-accent px-8 py-3 font-medium text-accent-ink hover:opacity-90 disabled:opacity-40"
          >
            Take {targetLabel}
          </motion.button>
          <button type="button" disabled={busy} onClick={stop} className={`${secondary} disabled:opacity-40`}>
            Turn off camera
          </button>
        </div>
      )}
    </div>
  )
}

interface MessageProps {
  state: ReturnType<typeof useCamera>['state']
  onStart: (facing?: CameraFacing) => void
  onUseUpload: () => void
}

function CameraMessage({ state, onStart, onUseUpload }: MessageProps) {
  const button = 'mt-4 rounded-full bg-surface px-5 py-2.5 text-sm font-medium text-ink hover:opacity-90'
  switch (state) {
    case 'requesting':
      return <p>Waiting for camera permission…</p>
    case 'denied':
      return (
        <div>
          <p className="font-medium">Camera access is blocked.</p>
          <p className="mt-1 text-sm opacity-80">
            Allow the camera in your browser's site settings, then try again. You can also upload photos instead.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => onStart()} className={button}>
              Try again
            </button>
            <button type="button" onClick={onUseUpload} className={button}>
              Upload instead
            </button>
          </div>
        </div>
      )
    case 'back-unavailable':
      return <div><p className="font-medium">Back camera unavailable.</p><p className="mt-1 text-sm opacity-80">Choose the front camera or upload photos.</p><div className="flex justify-center gap-2"><button type="button" onClick={() => onStart('user')} className={button}>Use front camera</button><button type="button" onClick={onUseUpload} className={button}>Upload instead</button></div></div>
    case 'unavailable':
      return (
        <div>
          <p className="font-medium">No camera available.</p>
          <p className="mt-1 text-sm opacity-80">
            This device has no usable camera or the browser does not support it. Upload photos instead.
          </p>
          <button type="button" onClick={onUseUpload} className={button}>
            Upload instead
          </button>
        </div>
      )
    case 'error':
      return (
        <div>
          <p className="font-medium">The camera could not start.</p>
          <p className="mt-1 text-sm opacity-80">Another app may be using it. Close it and try again.</p>
            <button type="button" onClick={() => onStart()} className={button}>
            Try again
          </button>
        </div>
      )
    default:
      return (
        <div>
          <p className="font-medium">Use your camera</p>
          <p className="mt-1 text-sm opacity-80">Photos are taken on this device and are not uploaded.</p>
            <button type="button" onClick={() => onStart()} className={button}>
            Turn on camera
          </button>
        </div>
      )
  }
}
