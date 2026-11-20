import { DEFAULT_LAYOUT, aspectFor, type Layout } from './layout'

export type CategoryId = 'photostrips' | 'single' | 'frames' | 'create'

export interface Category {
  id: CategoryId
  label: string
}

export interface Template {
  id: string
  name: string
  category: CategoryId
  photoCount: number
  columns: number
  layout: Layout
  /** Export aspect ratio (width / height), derived from the layout and the photo shape. */
  aspect: number
  /** Starting appearance. The person's own edits override these without changing geometry. */
  defaults: { frameId: string; filterId: string }
}

export const categories: Category[] = [
  { id: 'photostrips', label: 'Photostrips' },
  { id: 'single', label: 'Single Photo' },
  { id: 'frames', label: 'Frames' },
  { id: 'create', label: 'Create Your Own' },
]

interface Definition {
  id: string
  name: string
  category: CategoryId
  photoCount: number
  columns?: number
  /** Photo cell shape, width / height. */
  cellRatio?: number
  layout?: Partial<Layout>
  frameId?: string
  filterId?: string
}

function define(d: Definition): Template {
  const columns = d.columns ?? 1
  const layout = { ...DEFAULT_LAYOUT, ...d.layout }
  return {
    id: d.id,
    name: d.name,
    category: d.category,
    photoCount: d.photoCount,
    columns,
    layout,
    aspect: aspectFor(columns, d.photoCount, d.cellRatio ?? 1.125, layout),
    defaults: { frameId: d.frameId ?? 'white', filterId: d.filterId ?? 'original' },
  }
}

// First-release catalog. Template IDs are stable because they appear in the selection URL.
export const templates: Template[] = [
  define({ id: '2-cut', name: '2-cut strip', category: 'photostrips', photoCount: 2 }),
  define({ id: '3-cut', name: '3-cut strip', category: 'photostrips', photoCount: 3 }),
  define({ id: '4-cut', name: '4-cut strip', category: 'photostrips', photoCount: 4 }),

  define({ id: 'portrait', name: 'Portrait', category: 'single', photoCount: 1, cellRatio: 0.75, layout: { padding: 6, captionHeight: 10 } }),
  define({ id: 'square', name: 'Square', category: 'single', photoCount: 1, cellRatio: 1, layout: { padding: 6, captionHeight: 10 } }),
  define({
    id: 'instant-film',
    name: 'Instant film',
    category: 'single',
    photoCount: 1,
    cellRatio: 1,
    layout: { padding: 7, captionHeight: 22, captionFont: 7 },
    frameId: 'cream',
    filterId: 'vintage',
  }),
  define({ id: 'postcard', name: 'Postcard', category: 'single', photoCount: 1, cellRatio: 1.5, layout: { padding: 4, captionHeight: 9 } }),

  define({ id: 'minimal-white', name: 'Minimal white', category: 'frames', photoCount: 3, layout: { padding: 7, gap: 4 } }),
  define({ id: 'film-noir', name: 'Film noir', category: 'frames', photoCount: 3, frameId: 'black', filterId: 'mono' }),
  define({ id: 'pastel-duo', name: 'Pastel duo', category: 'frames', photoCount: 2, frameId: 'pink', filterId: 'pastel', layout: { padding: 8, gap: 4 } }),
  define({ id: 'retro-grid', name: 'Retro grid', category: 'frames', photoCount: 4, columns: 2, cellRatio: 1, frameId: 'cream', filterId: 'vintage' }),
  define({ id: 'sky-quad', name: 'Sky quad', category: 'frames', photoCount: 4, columns: 2, cellRatio: 1, frameId: 'sky', layout: { padding: 6, gap: 4 } }),
  define({ id: 'sage-pair', name: 'Sage pair', category: 'frames', photoCount: 2, columns: 2, cellRatio: 0.8, frameId: 'sage', filterId: 'warm', layout: { padding: 6, captionHeight: 12 } }),

  define({ id: 'blank-1', name: 'Blank · 1 photo', category: 'create', photoCount: 1, cellRatio: 1 }),
  define({ id: 'blank-2', name: 'Blank · 2 photos', category: 'create', photoCount: 2, columns: 2, cellRatio: 1 }),
  define({ id: 'blank-3', name: 'Blank · 3 photos', category: 'create', photoCount: 3 }),
  define({ id: 'blank-4', name: 'Blank · 4 photos', category: 'create', photoCount: 4, columns: 2, cellRatio: 1 }),
  define({ id: 'blank-6', name: 'Blank · 6 photos', category: 'create', photoCount: 6, columns: 2, cellRatio: 1 }),
]

export const templatesIn = (category: CategoryId) => templates.filter((t) => t.category === category)

export const findTemplate = (id: string | null) => templates.find((t) => t.id === id)

export const findCategory = (id: string | null) => categories.find((c) => c.id === id)

export const photoCountLabel = (n: number) => (n === 1 ? '1 photo' : `${n} photos`)
