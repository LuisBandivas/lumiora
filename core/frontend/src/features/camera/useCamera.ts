import { useCallback, useEffect, useRef, useState } from 'react'
import type { CameraFacing } from './usePhotoSession'

export type CameraState = 'idle' | 'requesting' | 'ready' | 'denied' | 'unavailable' | 'back-unavailable' | 'error'

function classify(error: unknown): CameraState {
  const name = error instanceof DOMException ? error.name : ''
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied'
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'OverconstrainedError') {
    return 'unavailable'
  }
  return 'error'
}

// Camera access starts only when start() is called, so the permission prompt follows a user choice.
export function useCamera(initialFacing: CameraFacing, onFacingChange: (facing: CameraFacing) => void) {
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

  const [facing, setFacing] = useState<CameraFacing>(initialFacing)
  const start = useCallback(async (requestedFacing: CameraFacing = facing) => {
    release()
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unavailable')
      return
    }
    const request = requestRef.current
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: requestedFacing }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      // The person left or restarted while the permission prompt was open.
      if (request !== requestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      setFacing(requestedFacing)
      onFacingChange(requestedFacing)
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        await video.play().catch(() => undefined)
      }
      setState('ready')
    } catch (error) {
      if (request === requestRef.current) {
        const classified = classify(error)
        setState(requestedFacing === 'environment' && classified === 'unavailable' ? 'back-unavailable' : classified)
      }
    }
  }, [release, facing, onFacingChange])

  // Stop old tracks when leaving the screen.
  useEffect(() => release, [release])

  return { videoRef, state, facing, start, stop }
}
