import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraState = 'idle' | 'requesting' | 'ready' | 'denied' | 'unavailable' | 'error'

function classify(error: unknown): CameraState {
  const name = error instanceof DOMException ? error.name : ''
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied'
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'OverconstrainedError') {
    return 'unavailable'
  }
  return 'error'
}

// Camera access starts only when start() is called, so the permission prompt follows a user choice.
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const requestRef = useRef(0)
  const [state, setState] = useState<CameraState>('idle')

  const release = useCallback(() => {
    requestRef.current++
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const stop = useCallback(() => {
    release()
    setState('idle')
  }, [release])

  const start = useCallback(async () => {
    release()
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unavailable')
      return
    }
    const request = requestRef.current
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      // The person left or restarted while the permission prompt was open.
      if (request !== requestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        await video.play().catch(() => undefined)
      }
      setState('ready')
    } catch (error) {
      if (request === requestRef.current) setState(classify(error))
    }
  }, [release])

  // Stop old tracks when leaving the screen.
  useEffect(() => release, [release])

  return { videoRef, state, start, stop }
}
