import { useEffect, useState, type SyntheticEvent } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useMotionPlayback() {
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setPlaying(!query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return {
    playing: playing && !failed,
    failed,
    toggle: () => {
      setFailed(false)
      setPlaying((value) => !value || failed)
    },
    fail: () => {
      setFailed(true)
      setPlaying(false)
    },
  }
}

export function pauseOnSustainedStall(event: SyntheticEvent<HTMLVideoElement>, onFailure: () => void) {
  const video = event.currentTarget
  // A short wait while the first frame decodes is normal; only treat later stalls as failure.
  if (video.currentTime < 0.2) return
  window.setTimeout(() => {
    if (video.isConnected && !video.paused && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) onFailure()
  }, 1500)
}

export function pauseOnDroppedFrames(event: SyntheticEvent<HTMLVideoElement>, onFailure: () => void) {
  const quality = event.currentTarget.getVideoPlaybackQuality?.()
  if (quality && quality.totalVideoFrames >= 60 && quality.droppedVideoFrames / quality.totalVideoFrames > 0.3) {
    onFailure()
  }
}
