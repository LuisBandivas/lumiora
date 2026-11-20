/** Composition proportions, in percent of composition width. Shared by previews and the export renderer. */
export interface Layout {
  padding: number
  gap: number
  captionHeight: number
  captionFont: number
}

export const DEFAULT_LAYOUT: Layout = { padding: 5, gap: 3, captionHeight: 8, captionFont: 5 }

export const gridOf = (columns: number, photoCount: number) => ({
  columns,
  rows: Math.ceil(photoCount / columns),
})

/** Composition aspect ratio (width / height) that gives each photo cell the requested shape. */
export function aspectFor(columns: number, photoCount: number, cellRatio: number, layout: Layout) {
  const { rows } = gridOf(columns, photoCount)
  const cellWidth = (100 - 2 * layout.padding - layout.gap * (columns - 1)) / columns
  const cellHeight = cellWidth / cellRatio
  const height =
    rows * cellHeight + layout.gap * (rows - 1) + 2 * layout.padding + layout.gap + layout.captionHeight
  return 100 / height
}
