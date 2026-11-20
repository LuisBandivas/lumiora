import type { Template } from '../templates/catalog'
import { LAYOUT } from './compositionLayout'
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

/** Renders the composition to a PNG from the original photos and edit choices. Runs in the browser. */
export async function renderComposition(
  template: Template,
  slots: (string | null)[],
  edits: EditSettings,
): Promise<Blob> {
  const { frame, filter, caption } = resolveEdits(edits)
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
  const padding = LAYOUT.padding * unit
  const gap = LAYOUT.gap * unit
  const captionHeight = LAYOUT.captionHeight * unit
  const columns = template.columns
  const rows = Math.ceil(template.photoCount / columns)
  const gridWidth = width - 2 * padding
  const gridHeight = height - 2 * padding - gap - captionHeight
  const cellWidth = (gridWidth - gap * (columns - 1)) / columns
  const cellHeight = (gridHeight - gap * (rows - 1)) / rows

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
    context.font = `500 ${LAYOUT.captionFont * unit}px ${getComputedStyle(document.body).fontFamily}`
    let text = caption
    while (text.length > 1 && context.measureText(text).width > gridWidth) {
      text = `${text.slice(0, -2)}…`
    }
    context.fillText(text, width / 2, height - padding - captionHeight / 2)
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image'))), 'image/png')
  })
}
