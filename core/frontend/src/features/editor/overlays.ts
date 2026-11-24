// Stickers and movable text. Items are data: position and size are fractions of the composition,
// so the preview and the export render the same arrangement at any pixel size.

export interface StickerPreset {
  id: string
  label: string
  /** Path data in a 24 x 24 box, drawn identically by SVG and by canvas Path2D. */
  path: string
  evenodd?: boolean
}

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`

// Original shapes drawn for Ephemora.
export const stickerPresets: StickerPreset[] = [
  {
    id: 'heart',
    label: 'Heart',
    path: 'M12 21s-7.5-4.6-9.5-9.2C1 8 3.2 4.5 6.7 4.5c2 0 3.6 1.1 5.3 3 1.7-1.9 3.3-3 5.3-3 3.5 0 5.7 3.5 4.2 7.3C19.5 16.4 12 21 12 21z',
  },
  { id: 'star', label: 'Star', path: 'M12 2l2.9 6.6 7.1.7-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.3l7.1-.7L12 2z' },
  {
    id: 'sparkle',
    label: 'Sparkle',
    path: 'M12 2c.6 4.8 2.2 8.4 10 10-7.8 1.6-9.4 5.2-10 10-.6-4.8-2.2-8.4-10-10 7.8-1.6 9.4-5.2 10-10z',
  },
  { id: 'bolt', label: 'Bolt', path: 'M13 2L4 14h6l-1 8 9-12h-6l1-8z' },
  {
    id: 'flower',
    label: 'Flower',
    path: [
      circle(12, 6.4, 3.8),
      circle(17.2, 10.2, 3.8),
      circle(15.2, 16.4, 3.8),
      circle(8.8, 16.4, 3.8),
      circle(6.8, 10.2, 3.8),
      circle(12, 12, 3.2),
    ].join(''),
  },
  {
    id: 'smile',
    label: 'Smile',
    path: `${circle(12, 12, 10)}${circle(8.6, 10, 1.5)}${circle(15.4, 10, 1.5)}M7.5 14.5c1 2.6 3 3.8 4.5 3.8s3.5-1.2 4.5-3.8c-1.4.9-2.9 1.3-4.5 1.3s-3.1-.4-4.5-1.3z`,
    evenodd: true,
  },
]

export const findSticker = (id: string) => stickerPresets.find((s) => s.id === id)

export interface OverlayColor {
  id: string
  label: string
  value: string
}

export const overlayColors: OverlayColor[] = [
  { id: 'ink', label: 'Black', value: '#16161a' },
  { id: 'white', label: 'White', value: '#ffffff' },
  { id: 'pink', label: 'Pink', value: '#e879a9' },
  { id: 'red', label: 'Red', value: '#e5484d' },
  { id: 'amber', label: 'Amber', value: '#f5a524' },
  { id: 'green', label: 'Green', value: '#3d9970' },
  { id: 'blue', label: 'Blue', value: '#2b2bd9' },
]

type Base = {
  id: string
  /** Center position as a fraction of composition width and height. */
  x: number
  y: number
  /** Sticker width or text height, in percent of composition width. */
  size: number
  rotation: number
  color: string
}

export type OverlayItem = Base & ({ kind: 'sticker'; stickerId: string } | { kind: 'text'; text: string; fontId: string })

export type OverlayPatch = Partial<Pick<Base, 'x' | 'y' | 'size' | 'rotation' | 'color'> & { text: string; fontId: string }>

export const SIZE_RANGE = { sticker: { min: 8, max: 60 }, text: { min: 4, max: 16 } } as const
export const TEXT_MAX_LENGTH = 24
export const MAX_OVERLAYS = 20

let counter = 0
const nextId = () => `overlay-${Date.now().toString(36)}-${counter++}`

// New items are nudged so repeated additions do not stack exactly.
const spot = (count: number) => ({ x: 0.5 + ((count % 3) - 1) * 0.08, y: 0.35 + (count % 5) * 0.06 })

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export const createSticker = (stickerId: string, count: number): OverlayItem => ({
  id: nextId(),
  kind: 'sticker',
  stickerId,
  ...spot(count),
  size: 18,
  rotation: 0,
  color: overlayColors[2].value,
})

export const createText = (color: string, count: number): OverlayItem => ({
  id: nextId(),
  kind: 'text',
  text: 'Your text',
  fontId: 'default',
  ...spot(count),
  size: 8,
  rotation: 0,
  color,
})

export const overlayLabel = (item: OverlayItem) =>
  item.kind === 'sticker' ? `${findSticker(item.stickerId)?.label ?? 'Sticker'} sticker` : `Text: ${item.text}`
