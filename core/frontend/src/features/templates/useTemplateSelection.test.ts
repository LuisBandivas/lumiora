import { describe, expect, it } from 'vitest'
import { resolveSelection } from './useTemplateSelection'

describe('resolveSelection', () => {
  it('restores a valid category and template', () => {
    const s = resolveSelection('?category=frames&template=film-noir')
    expect(s.category).toBe('frames')
    expect(s.template.id).toBe('film-noir')
    expect(s.notice).toBeNull()
  })

  it('defaults to the blank category and first blank template with no notice for an empty URL', () => {
    const s = resolveSelection('')
    expect(s.category).toBe('create')
    expect(s.template.id).toBe('blank-1')
    expect(s.notice).toBeNull()
  })

  it('falls back with a notice for an unknown template', () => {
    const s = resolveSelection('?category=frames&template=gone')
    expect(s.category).toBe('frames')
    expect(s.template.category).toBe('frames')
    expect(s.notice).not.toBeNull()
  })

  it('falls back with a notice for an unknown category', () => {
    const s = resolveSelection('?category=gone&template=3-cut')
    expect(s.category).toBe('create')
    expect(s.notice).not.toBeNull()
  })

  it('does not accept a template from a different category', () => {
    const s = resolveSelection('?category=single&template=3-cut')
    expect(s.category).toBe('single')
    expect(s.template.category).toBe('single')
    expect(s.notice).not.toBeNull()
  })
})
