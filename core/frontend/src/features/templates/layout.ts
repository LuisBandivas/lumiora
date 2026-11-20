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

interface Shape {
  columns: number
  photoCount: number
  layout: Layout
}

/** Pixel geometry of a composition of the given size. The export renderer draws from this. */
export function compositionGeometry(template: Shape, width: number, height: number) {
  const unit = width / 100
  const padding = template.layout.padding * unit
  const gap = template.layout.gap * unit
  const captionHeight = template.layout.captionHeight * unit
  const { columns, rows } = gridOf(template.columns, template.photoCount)
  const gridWidth = width - 2 * padding
  const gridHeight = height - 2 * padding - gap - captionHeight
  return {
    unit,
    padding,
    gap,
    captionHeight,
    columns,
    rows,
    gridWidth,
    gridHeight,
    cellWidth: (gridWidth - gap * (columns - 1)) / columns,
    cellHeight: (gridHeight - gap * (rows - 1)) / rows,
  }
}

/** Composition aspect ratio (width / height) that gives each photo cell the requested shape. */
export function aspectFor(columns: number, photoCount: number, cellRatio: number, layout: Layout) {
  const { rows } = gridOf(columns, photoCount)
  const cellWidth = (100 - 2 * layout.padding - layout.gap * (columns - 1)) / columns
  const cellHeight = cellWidth / cellRatio
  const height =
    rows * cellHeight + layout.gap * (rows - 1) + 2 * layout.padding + layout.gap + layout.captionHeight
  return 100 / height
}
