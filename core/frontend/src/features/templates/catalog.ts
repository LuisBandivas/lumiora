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
  /** Slot arrangement; placeholder geometry until real template geometry is defined. */
  columns: number
  /** Export aspect ratio (width / height). */
  aspect: number
}

export const categories: Category[] = [
  { id: 'photostrips', label: 'Photostrips' },
  { id: 'single', label: 'Single Photo' },
  { id: 'frames', label: 'Frames' },
  { id: 'create', label: 'Create Your Own' },
]

// Placeholder catalog: the initial template list is an open decision (docs/FEATURES.md).
export const templates: Template[] = [
  { id: '2-cut', name: '2-cut strip', category: 'photostrips', photoCount: 2, columns: 1, aspect: 0.45 },
  { id: '3-cut', name: '3-cut strip', category: 'photostrips', photoCount: 3, columns: 1, aspect: 0.36 },
  { id: '4-cut', name: '4-cut strip', category: 'photostrips', photoCount: 4, columns: 1, aspect: 0.3 },
  { id: 'portrait', name: 'Portrait', category: 'single', photoCount: 1, columns: 1, aspect: 0.8 },
  { id: 'instant-film', name: 'Instant film', category: 'single', photoCount: 1, columns: 1, aspect: 0.82 },
  { id: 'minimal-white', name: 'Minimal white', category: 'frames', photoCount: 3, columns: 1, aspect: 0.36 },
  { id: 'grid-four', name: 'Four grid', category: 'frames', photoCount: 4, columns: 2, aspect: 0.75 },
  { id: 'blank-1', name: 'Blank · 1 photo', category: 'create', photoCount: 1, columns: 1, aspect: 1 },
  { id: 'blank-2', name: 'Blank · 2 photos', category: 'create', photoCount: 2, columns: 2, aspect: 1.2 },
  { id: 'blank-4', name: 'Blank · 4 photos', category: 'create', photoCount: 4, columns: 2, aspect: 1 },
]

export const templatesIn = (category: CategoryId) => templates.filter((t) => t.category === category)

export const findTemplate = (id: string | null) => templates.find((t) => t.id === id)

export const findCategory = (id: string | null) => categories.find((c) => c.id === id)

export const photoCountLabel = (n: number) => (n === 1 ? '1 photo' : `${n} photos`)
