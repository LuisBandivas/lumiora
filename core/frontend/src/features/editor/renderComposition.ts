import type { Template } from '../templates/catalog'
import { gridOf } from '../templates/layout'
import { findSticker, type OverlayItem } from './overlays'
import { resolveEdits, type EditSettings } from './useEditSettings'

export const EXPORT_WIDTH = 1200

export const exportHeight = (template: Template) => Math.round(EXPORT_WIDTH / template.aspect)

export class FilterUnsupportedError extends Error {
  constructor(label: string) {
    super(`This browser cannot apply the ${label} filter to a download.`)
  }
}

let filterSupport: boolean | undefined

// Safari accepts `ctx.filter = ...` without applying it, so test by drawing a pixel.
function supportsCanvasFilter() {
  if (filterSupport !== undefined) return filterSupport
  const probe = document.createElement('canvas')
  probe.width = probe.height = 1
  const context = probe.getContext('2d', { willReadFrequently: true })
  if (!context) return (filterSupport = false)
  context.filter = 'grayscale(1)'
  context.fillStyle = 'rgb(255, 0, 0)'
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return (filterSupport = r === g && g === b)
}

function loadImage(url: string) {
  const image = new Image()
  image.src = url
  return image.decode().then(() => image)
}

function drawOverlay(
  context: CanvasRenderingContext2D,
  item: OverlayItem,
  width: number,
  height: number,
  fontFamily: string,
) {
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
    context.font = `600 ${item.size * unit}px ${fontFamily}`
    context.fillText(item.text, 0, 0)
  }
  context.restore()
}

/** Renders the composition to a PNG from the original photos and edit choices. Runs in the browser. */
export async function renderComposition(
  template: Template,
  slots: (string | null)[],
  edits: EditSettings,
): Promise<Blob> {
  const { frame, filter, caption, overlays } = resolveEdits(edits, template)
  if (filter.css !== 'none' && !supportsCanvasFilter()) throw new FilterUnsupportedError(filter.label)

  const width = EXPORT_WIDTH
  const height = exportHeight(template)
  const unit = width / 100
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')

  context.fillStyle = frame.background
  context.fillRect(0, 0, width, height)

  // Same arithmetic as the CSS grid in CompositionPreview.
  const { layout } = template
  const padding = layout.padding * unit
  const gap = layout.gap * unit
  const captionHeight = layout.captionHeight * unit
  const { columns, rows } = gridOf(template.columns, template.photoCount)
  const gridWidth = width - 2 * padding
  const gridHeight = height - 2 * padding - gap - captionHeight
  const cellWidth = (gridWidth - gap * (columns - 1)) / columns
  const cellHeight = (gridHeight - gap * (rows - 1)) / rows
  const fontFamily = getComputedStyle(document.body).fontFamily

  const images = await Promise.all(slots.map((url) => (url ? loadImage(url) : null)))
  images.forEach((image, i) => {
    const x = padding + (i % columns) * (cellWidth + gap)
    const y = padding + Math.floor(i / columns) * (cellHeight + gap)
    if (!image) {
      context.filter = 'none'
      context.fillStyle = 'rgba(0, 0, 0, 0.1)'
      context.fillRect(x, y, cellWidth, cellHeight)
      return
    }
    // Equivalent of object-fit: cover.
    const scale = Math.max(cellWidth / image.naturalWidth, cellHeight / image.naturalHeight)
    const sourceWidth = cellWidth / scale
    const sourceHeight = cellHeight / scale
    context.filter = filter.css
    context.drawImage(
      image,
      (image.naturalWidth - sourceWidth) / 2,
      (image.naturalHeight - sourceHeight) / 2,
      sourceWidth,
      sourceHeight,
      x,
      y,
      cellWidth,
      cellHeight,
    )
  })

  if (caption) {
    context.filter = 'none'
    context.fillStyle = frame.ink
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `500 ${layout.captionFont * unit}px ${fontFamily}`
    let text = caption
    while (text.length > 1 && context.measureText(text).width > gridWidth) {
      text = `${text.slice(0, -2)}…`
    }
    context.fillText(text, width / 2, height - padding - captionHeight / 2)
  }

  // Stickers and text sit above photos and caption, in the order they were added.
  overlays.forEach((item) => drawOverlay(context, item, width, height, fontFamily))

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image'))), 'image/png')
  })
}
