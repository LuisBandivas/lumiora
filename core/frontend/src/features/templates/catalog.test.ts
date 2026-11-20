import { describe, expect, it } from 'vitest'
import { filterPresets, framePresets } from '../editor/presets'
import { categories, findTemplate, templates, templatesIn } from './catalog'
import { aspectFor, compositionGeometry, DEFAULT_LAYOUT } from './layout'

describe('template catalog', () => {
  it('has unique, URL-safe template IDs', () => {
    const ids = templates.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/))
  })

  it('offers at least one template in every category', () => {
    categories.forEach((c) => expect(templatesIn(c.id).length).toBeGreaterThan(0))
  })

  it('only references frame and filter presets that exist', () => {
    templates.forEach((t) => {
      expect(framePresets.map((f) => f.id)).toContain(t.defaults.frameId)
      expect(filterPresets.map((f) => f.id)).toContain(t.defaults.filterId)
    })
  })

  it('has usable geometry for every template', () => {
    templates.forEach((t) => {
      expect(t.photoCount).toBeGreaterThan(0)
      expect(t.columns).toBeGreaterThan(0)
      expect(Number.isFinite(t.aspect)).toBe(true)
      expect(t.aspect).toBeGreaterThan(0.2)
      expect(t.aspect).toBeLessThan(2)
    })
  })

  it('finds a template by ID and returns undefined for unknown IDs', () => {
    expect(findTemplate('3-cut')?.photoCount).toBe(3)
    expect(findTemplate('nope')).toBeUndefined()
    expect(findTemplate(null)).toBeUndefined()
  })
})

describe('composition geometry', () => {
  it('derives an aspect ratio that gives photos the requested shape', () => {
    const aspect = aspectFor(1, 1, 1, DEFAULT_LAYOUT)
    const g = compositionGeometry(
      { columns: 1, photoCount: 1, layout: DEFAULT_LAYOUT },
      1200,
      1200 / aspect,
    )
    expect(g.cellWidth / g.cellHeight).toBeCloseTo(1, 5)
  })

  it('tiles padding, photos, gaps and caption exactly to the full height for every template', () => {
    templates.forEach((t) => {
      const width = 1200
      const height = width / t.aspect
      const g = compositionGeometry(t, width, height)
      const used =
        2 * g.padding + g.rows * g.cellHeight + (g.rows - 1) * g.gap + g.gap + g.captionHeight
      expect(used).toBeCloseTo(height, 5)
      const usedWidth = 2 * g.padding + g.columns * g.cellWidth + (g.columns - 1) * g.gap
      expect(usedWidth).toBeCloseTo(width, 5)
    })
  })

  it('gives the 3-cut strip the default 9:8 photo shape', () => {
    const t = findTemplate('3-cut')!
    const g = compositionGeometry(t, 1200, 1200 / t.aspect)
    expect(g.cellWidth / g.cellHeight).toBeCloseTo(1.125, 5)
  })
})
