import { describe, expect, it } from 'vitest'
import { framePresets, filterPresets } from './presets'
import {
  SIZE_RANGE,
  clamp01,
  createSticker,
  createText,
  findSticker,
  overlayLabel,
  stickerPresets,
} from './overlays'
import { defaultEdits, resolveEdits } from './useEditSettings'
import { findTemplate } from '../templates/catalog'

describe('overlays', () => {
  it('clamps positions into the composition', () => {
    expect(clamp01(-0.4)).toBe(0)
    expect(clamp01(1.7)).toBe(1)
    expect(clamp01(0.3)).toBe(0.3)
  })

  it('creates items inside the composition with unique IDs', () => {
    const items = Array.from({ length: 12 }, (_, i) => createSticker('heart', i))
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length)
    items.forEach((i) => {
      expect(i.x).toBeGreaterThanOrEqual(0)
      expect(i.x).toBeLessThanOrEqual(1)
      expect(i.y).toBeGreaterThanOrEqual(0)
      expect(i.y).toBeLessThanOrEqual(1)
    })
  })

  it('starts new items within their size range', () => {
    const sticker = createSticker('star', 0)
    const text = createText('#000', 0)
    expect(sticker.size).toBeGreaterThanOrEqual(SIZE_RANGE.sticker.min)
    expect(sticker.size).toBeLessThanOrEqual(SIZE_RANGE.sticker.max)
    expect(text.size).toBeGreaterThanOrEqual(SIZE_RANGE.text.min)
    expect(text.size).toBeLessThanOrEqual(SIZE_RANGE.text.max)
  })

  it('has valid, unique sticker presets', () => {
    expect(new Set(stickerPresets.map((s) => s.id)).size).toBe(stickerPresets.length)
    stickerPresets.forEach((s) => {
      expect(s.path.startsWith('M')).toBe(true)
      expect(findSticker(s.id)).toBe(s)
    })
  })

  it('labels items for assistive technology', () => {
    expect(overlayLabel(createSticker('heart', 0))).toBe('Heart sticker')
    expect(overlayLabel(createText('#000', 0))).toBe('Text: Your text')
  })
})

describe('resolveEdits', () => {
  it('uses the template defaults until the person chooses', () => {
    const noir = findTemplate('film-noir')!
    const r = resolveEdits(defaultEdits, noir)
    expect(r.frame.id).toBe('black')
    expect(r.filter.id).toBe('mono')
  })

  it('lets an explicit choice override the template default', () => {
    const noir = findTemplate('film-noir')!
    const r = resolveEdits({ ...defaultEdits, frameId: 'white', filterId: 'original' }, noir)
    expect(r.frame.id).toBe('white')
    expect(r.filter.id).toBe('original')
  })

  it('falls back to the first preset for an unknown ID', () => {
    const t = findTemplate('2-cut')!
    const r = resolveEdits({ ...defaultEdits, frameId: 'gone', filterId: 'gone' }, t)
    expect(r.frame).toBe(framePresets[0])
    expect(r.filter).toBe(filterPresets[0])
  })

  it('trims the caption', () => {
    const t = findTemplate('2-cut')!
    expect(resolveEdits({ ...defaultEdits, caption: '  hi  ' }, t).caption).toBe('hi')
  })
})
