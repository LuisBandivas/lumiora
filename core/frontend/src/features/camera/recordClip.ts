export const CLIP_SECONDS = 3

export const recordingMimeTypes = () =>
  typeof MediaRecorder === 'undefined'
    ? []
    : ['video/webm;codecs=vp8', 'video/webm', 'video/mp4'].filter((type) => MediaRecorder.isTypeSupported(type))

export const recordingMimeType = () => recordingMimeTypes()[0] ?? null

export function startClip(stream: MediaStream) {
  let recorder: MediaRecorder | null = null
  let mimeType: string | null = null
  for (const candidate of recordingMimeTypes()) {
    try {
      const trial = new MediaRecorder(stream, { mimeType: candidate })
      trial.start()
      recorder = trial
      mimeType = candidate
      break
    } catch {
      // A browser may claim a format but fail when the actual camera track starts.
    }
  }
  if (!recorder || !mimeType) throw new Error('Video recording is unavailable')
  const activeRecorder = recorder
  const activeMimeType = mimeType
  const chunks: BlobPart[] = []
  const startedAt = performance.now()
  let cancelled = false
  const result = new Promise<Blob>((resolve, reject) => {
    activeRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size) chunks.push(event.data)
    })
    activeRecorder.addEventListener('error', () => reject(new Error('Video recording failed')))
    activeRecorder.addEventListener('stop', () => {
      if (cancelled || performance.now() - startedAt < 2500) {
        reject(new Error('Video recording stopped early'))
      } else if (!chunks.length) {
        reject(new Error('Video recording was empty'))
      } else {
        resolve(new Blob(chunks, { type: activeRecorder.mimeType || activeMimeType }))
      }
    }, { once: true })
  })
  // A camera can stop unexpectedly before the shutter asks for the result.
  void result.catch(() => undefined)
  return {
    stop: () => {
      if (activeRecorder.state !== 'inactive') activeRecorder.stop()
      return result
    },
    cancel: () => {
      cancelled = true
      if (activeRecorder.state !== 'inactive') activeRecorder.stop()
    },
  }
}

/** Reject blobs that the current browser cannot even open for playback. */
export function playableClipUrl(blob: Blob): Promise<string | null> {
  const url = URL.createObjectURL(blob)
  return new Promise((resolve) => {
    const video = document.createElement('video')
    let settled = false
    const finish = (valid: boolean) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      video.removeAttribute('src')
      video.load()
      if (!valid) URL.revokeObjectURL(url)
      resolve(valid ? url : null)
    }
    const timeout = window.setTimeout(() => finish(false), 5000)
    video.preload = 'metadata'
    video.onloadedmetadata = () => finish(video.videoWidth > 0 && video.videoHeight > 0)
    video.onerror = () => finish(false)
    video.src = url
    video.load()
  })
}
