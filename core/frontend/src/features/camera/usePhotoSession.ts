import { useMemo, useState } from 'react'
import type { Template } from '../templates/catalog'

/** A filled slot holds an object URL for a photo that exists only in this browser. */
export type Slots = (string | null)[]

/**
 * Fills the active slot first, then the remaining empty slots in order.
 * `discarded` lists URLs that found no slot; `replaced` lists URLs that were overwritten.
 */
export function placePhotos(slots: Slots, active: number, urls: string[]) {
  const order = [active, ...slots.map((_, i) => i).filter((i) => i !== active && slots[i] === null)]
  const next = [...slots]
  const discarded: string[] = []
  const replaced: string[] = []
  urls.forEach((url, k) => {
    const i = order[k]
    if (i === undefined) {
      discarded.push(url)
      return
    }
    const old = next[i]
    if (old) replaced.push(old)
    next[i] = url
  })
  const nextEmpty = next.findIndex((u) => u === null)
  return {
    next,
    nextActive: nextEmpty === -1 ? active : nextEmpty,
    placed: urls.length - discarded.length,
    discarded,
    replaced,
  }
}

// Photos are stored per template ID, so switching template neither loses photos nor mismatches
// slot counts. How to migrate photos between templates remains an open decision (docs/FEATURES.md).
export function usePhotoSession(template: Template) {
  const [store, setStore] = useState<Record<string, Slots>>({})
  const [clipStore, setClipStore] = useState<Record<string, Slots>>({})
  const [activeRaw, setActive] = useState(0)

  const slots = useMemo<Slots>(
    () => store[template.id] ?? Array.from({ length: template.photoCount }, () => null),
    [store, template],
  )
  const clips = useMemo<Slots>(
    () => clipStore[template.id] ?? Array.from({ length: template.photoCount }, () => null),
    [clipStore, template],
  )
  const active = Math.min(activeRaw, template.photoCount - 1)
  const filled = slots.filter(Boolean).length

  const commit = (next: Slots, nextActive: number) => {
    setStore((s) => ({ ...s, [template.id]: next }))
    setActive(nextActive)
  }

  /** Fills the active slot first, then the remaining empty slots. Returns how many were placed. */
  const place = (urls: string[]) => {
    const result = placePhotos(slots, active, urls)
    ;[...result.discarded, ...result.replaced].forEach((url) => URL.revokeObjectURL(url))
    const nextClips = [...clips]
    result.next.forEach((url, index) => {
      if (url !== slots[index] && nextClips[index]) {
        URL.revokeObjectURL(nextClips[index])
        nextClips[index] = null
      }
    })
    setClipStore((s) => ({ ...s, [template.id]: nextClips }))
    commit(result.next, result.nextActive)
    return result.placed
  }

  const placeCapture = (photoUrl: string, clipUrl: string | null) => {
    const result = placePhotos(slots, active, [photoUrl])
    ;[...result.discarded, ...result.replaced].forEach((url) => URL.revokeObjectURL(url))
    if (!result.placed) {
      if (clipUrl) URL.revokeObjectURL(clipUrl)
      return
    }
    const nextClips = [...clips]
    if (nextClips[active]) URL.revokeObjectURL(nextClips[active])
    nextClips[active] = clipUrl
    setClipStore((s) => ({ ...s, [template.id]: nextClips }))
    commit(result.next, result.nextActive)
  }

  const remove = (index: number) => {
    const old = slots[index]
    if (old) URL.revokeObjectURL(old)
    const oldClip = clips[index]
    if (oldClip) URL.revokeObjectURL(oldClip)
    const next = [...slots]
    next[index] = null
    const nextClips = [...clips]
    nextClips[index] = null
    setClipStore((s) => ({ ...s, [template.id]: nextClips }))
    commit(next, index)
  }

  /** Releases every photo in the session, for all templates. */
  const clearAll = () => {
    Object.values(store).forEach((list) => list.forEach((url) => url && URL.revokeObjectURL(url)))
    Object.values(clipStore).forEach((list) => list.forEach((url) => url && URL.revokeObjectURL(url)))
    setStore({})
    setClipStore({})
    setActive(0)
  }

  return {
    clearAll,
    slots,
    clips,
    hasMotion: clips.some(Boolean),
    active,
    filled,
    complete: filled === slots.length,
    select: setActive,
    place,
    placeCapture,
    remove,
  }
}

export type PhotoSession = ReturnType<typeof usePhotoSession>
