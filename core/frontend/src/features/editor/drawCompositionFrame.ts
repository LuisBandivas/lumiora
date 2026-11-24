import type { Template } from '../templates/catalog'
import { compositionGeometry } from '../templates/layout'
import { PLACEHOLDER_ALPHA } from './presets'
import { findSticker, type OverlayItem } from './overlays'
import { resolveEdits, type EditSettings } from './useEditSettings'
import type { CameraFacing } from '../camera/usePhotoSession'
import { fontFamilyFor } from './fonts'

export type FrameSource = HTMLImageElement | HTMLVideoElement | null

function drawOverlay(context: CanvasRenderingContext2D, item: OverlayItem, width: number, height: number) {
  const unit = width / 100
  context.save()
  context.filter = 'none'
  context.translate(item.x * width, item.y * height)
  context.rotate((item.rotation * Math.PI) / 180)
  context.fillStyle = item.color
  if (item.kind === 'sticker') {
    const sticker = findSticker(item.stickerId)
    if (sticker) {
      const scale = (item.size * unit) / 24
      context.scale(scale, scale)
      context.translate(-12, -12)
      context.fill(new Path2D(sticker.path), sticker.evenodd ? 'evenodd' : 'nonzero')
    }
  } else {
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `600 ${item.size * unit}px ${fontFamilyFor(item.fontId)}`
    context.fillText(item.text, 0, 0)
  }
  context.restore()
}

/** One frame of both PNG and video export, using the same geometry and edits. */
export function drawCompositionFrame(context: CanvasRenderingContext2D, template: Template, sources: FrameSource[], edits: EditSettings, width: number, height: number, cameras: (CameraFacing | null)[] = []) {
  const { frame, filter, caption, overlays } = resolveEdits(edits, template)
  context.filter = 'none'
  context.fillStyle = frame.background
  context.fillRect(0, 0, width, height)

  const { layout } = template
  const { unit, padding, gap, captionHeight, columns, gridWidth, cellWidth, cellHeight } =
    compositionGeometry(template, width, height)

  sources.forEach((source, i) => {
    const x = padding + (i % columns) * (cellWidth + gap)
    const y = padding + Math.floor(i / columns) * (cellHeight + gap)
    if (!source) {
      context.filter = 'none'
      context.globalAlpha = PLACEHOLDER_ALPHA
      context.fillStyle = frame.ink
      context.fillRect(x, y, cellWidth, cellHeight)
      context.globalAlpha = 1
      return
    }
    const sourceWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth
    const sourceHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight
    if (!sourceWidth || !sourceHeight) return
    const scale = Math.max(cellWidth / sourceWidth, cellHeight / sourceHeight)
    const cropWidth = cellWidth / scale
    const cropHeight = cellHeight / scale
    context.filter = filter.css
    if (source instanceof HTMLVideoElement && cameras[i] === 'user') {
      context.save()
      context.translate(x + cellWidth, y)
      context.scale(-1, 1)
      context.drawImage(source, (sourceWidth - cropWidth) / 2, (sourceHeight - cropHeight) / 2,
        cropWidth, cropHeight, 0, 0, cellWidth, cellHeight)
      context.restore()
    } else {
      context.drawImage(source, (sourceWidth - cropWidth) / 2, (sourceHeight - cropHeight) / 2,
        cropWidth, cropHeight, x, y, cellWidth, cellHeight)
    }
  })

  if (caption) {
    context.filter = 'none'
    context.fillStyle = frame.ink
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `500 ${layout.captionFont * unit}px ${fontFamilyFor(edits.captionFontId)}`
    let captionText = caption
    while (captionText.length > 1 && context.measureText(captionText).width > gridWidth) {
      captionText = `${captionText.slice(0, -2)}…`
    }
    context.fillText(captionText, width / 2, height - padding - captionHeight / 2)
  }
  overlays.forEach((item) => drawOverlay(context, item, width, height))
}
