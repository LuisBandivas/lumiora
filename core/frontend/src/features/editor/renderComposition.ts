import type { Template } from '../templates/catalog'
import { drawCompositionFrame } from './drawCompositionFrame'
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

export function assertCanvasFilter(template: Template, edits: EditSettings) {
  const { filter } = resolveEdits(edits, template)
  if (filter.css !== 'none' && !supportsCanvasFilter()) throw new FilterUnsupportedError(filter.label)
}

export function loadImage(url: string) {
  const image = new Image()
  image.src = url
  return image.decode().then(() => image)
}

/** Renders the composition to a PNG from the original photos and edit choices. */
export async function renderComposition(template: Template, slots: (string | null)[], edits: EditSettings): Promise<Blob> {
  await document.fonts.ready
  assertCanvasFilter(template, edits)
  const width = EXPORT_WIDTH
  const height = exportHeight(template)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')
  const images = await Promise.all(slots.map((url) => (url ? loadImage(url) : null)))
  drawCompositionFrame(context, template, images, edits, width, height)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image'))), 'image/png')
  })
}
