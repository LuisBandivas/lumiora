import type { Template } from '../templates/catalog'
import { drawCompositionFrame, type FrameSource } from '../editor/drawCompositionFrame'
import { assertCanvasFilter, loadImage } from '../editor/renderComposition'
import type { EditSettings } from '../editor/useEditSettings'
import { CLIP_SECONDS, recordingMimeType } from '../camera/recordClip'

export const VIDEO_WIDTH = 720
export const VIDEO_FPS = 30

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const finish = (error?: Error) => {
      clearTimeout(timeout)
      video.onloadeddata = null
      video.onerror = null
      if (error) {
        video.removeAttribute('src')
        video.load()
        reject(error)
      } else {
        resolve(video)
      }
    }
    const timeout = window.setTimeout(() => finish(new Error('A capture clip did not load')), 5000)
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.onloadeddata = () => finish()
    video.onerror = () => finish(new Error('A capture clip could not be read'))
    video.src = url
    video.load()
  })
}

export async function renderCompositionVideo(
  template: Template,
  photos: (string | null)[],
  clips: (string | null)[],
  edits: EditSettings,
): Promise<Blob> {
  if (!clips.some(Boolean)) throw new Error('No capture clips are available')
  assertCanvasFilter(template, edits)
  const mimeType = recordingMimeType()
  if (!mimeType) throw new Error('Video recording is unavailable in this browser')

  const width = VIDEO_WIDTH
  const height = Math.round(width / template.aspect)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context || !canvas.captureStream) throw new Error('Video rendering is unavailable in this browser')

  const sources: FrameSource[] = await Promise.all(photos.map((photo, index) => {
    if (clips[index]) return loadVideo(clips[index])
    return photo ? loadImage(photo) : Promise.resolve(null)
  }))
  const videos = sources.filter((source): source is HTMLVideoElement => source instanceof HTMLVideoElement)
  const stream = canvas.captureStream(VIDEO_FPS)
  let recorder: MediaRecorder
  try {
    recorder = new MediaRecorder(stream, { mimeType })
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop())
    throw error
  }
  const chunks: BlobPart[] = []
  let frameId = 0
  let timerId = 0
  let settled = false

  const cleanup = () => {
    cancelAnimationFrame(frameId)
    clearTimeout(timerId)
    videos.forEach((video) => video.pause())
    stream.getTracks().forEach((track) => track.stop())
  }

  return new Promise<Blob>((resolve, reject) => {
    const fail = (error: unknown) => {
      if (settled) return
      settled = true
      cleanup()
      if (recorder.state !== 'inactive') recorder.stop()
      reject(error instanceof Error ? error : new Error('Video could not be created'))
    }
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data)
    }
    recorder.onerror = () => fail(new Error('Video encoding failed'))
    recorder.onstop = () => {
      if (settled) return
      settled = true
      cleanup()
      if (!chunks.length) {
        reject(new Error('The video was empty'))
      } else {
        resolve(new Blob(chunks, { type: recorder.mimeType || mimeType }))
      }
    }
    void (async () => {
      try {
        await Promise.all(videos.map((video) => video.play()))
        drawCompositionFrame(context, template, sources, edits, width, height)
        recorder.start()
        const draw = () => {
          try {
            drawCompositionFrame(context, template, sources, edits, width, height)
            frameId = requestAnimationFrame(draw)
          } catch (error) {
            fail(error)
          }
        }
        frameId = requestAnimationFrame(draw)
        timerId = window.setTimeout(() => {
          cancelAnimationFrame(frameId)
          if (recorder.state === 'recording') recorder.stop()
        }, CLIP_SECONDS * 1000)
      } catch (error) {
        fail(error)
      }
    })()
  })
}
