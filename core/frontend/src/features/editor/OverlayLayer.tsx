import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { clamp01, findSticker, overlayLabel, type OverlayItem, type OverlayPatch } from './overlays'

export interface OverlayControls {
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (id: string, patch: OverlayPatch) => void
  onRemove: (id: string) => void
}

interface Props {
  items: OverlayItem[]
  /** When present, items can be selected, dragged and nudged with the keyboard. */
  controls?: OverlayControls
}

interface Drag {
  id: string
  startX: number
  startY: number
  originX: number
  originY: number
}

export function OverlayLayer({ items, controls }: Props) {
  const layerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<Drag | null>(null)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>, item: OverlayItem) => {
    if (!controls) return
    event.stopPropagation()
    controls.onSelect(item.id)
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      id: item.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: item.x,
      originY: item.y,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>, item: OverlayItem) => {
    const drag = dragRef.current
    const rect = layerRef.current?.getBoundingClientRect()
    if (!controls || !drag || drag.id !== item.id || !rect) return
    controls.onChange(item.id, {
      x: clamp01(drag.originX + (event.clientX - drag.startX) / rect.width),
      y: clamp01(drag.originY + (event.clientY - drag.startY) / rect.height),
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, item: OverlayItem) => {
    if (!controls) return
    const step = event.shiftKey ? 0.05 : 0.01
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const move = moves[event.key]
    if (move) {
      event.preventDefault()
      controls.onChange(item.id, { x: clamp01(item.x + move[0]), y: clamp01(item.y + move[1]) })
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      controls.onRemove(item.id)
    }
  }

  return (
    <div
      ref={layerRef}
      className="absolute inset-0"
      onPointerDown={(event) => {
        if (controls && event.target === event.currentTarget) controls.onSelect(null)
      }}
    >
      {items.map((item) => {
        const selected = controls?.selectedId === item.id
        const sticker = item.kind === 'sticker' ? findSticker(item.stickerId) : undefined
        return (
          <div
            key={item.id}
            role={controls ? 'button' : undefined}
            tabIndex={controls ? 0 : undefined}
            aria-label={controls ? `${overlayLabel(item)}. Drag or use arrow keys to move, Delete to remove.` : undefined}
            aria-pressed={controls ? selected : undefined}
            onPointerDown={(e) => onPointerDown(e, item)}
            onPointerMove={(e) => onPointerMove(e, item)}
            onPointerUp={() => (dragRef.current = null)}
            onPointerCancel={() => (dragRef.current = null)}
            onKeyDown={(e) => onKeyDown(e, item)}
            className={`absolute select-none ${controls ? 'cursor-grab touch-none active:cursor-grabbing' : ''}`}
            style={{
              left: `${item.x * 100}%`,
              top: `${item.y * 100}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              outline: selected ? '2px dashed var(--color-accent)' : undefined,
              outlineOffset: '2px',
            }}
          >
            {item.kind === 'sticker' && sticker ? (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{ width: `${item.size}cqw`, height: `${item.size}cqw`, display: 'block' }}
              >
                <path d={sticker.path} fill={item.color} fillRule={sticker.evenodd ? 'evenodd' : 'nonzero'} />
              </svg>
            ) : item.kind === 'text' ? (
              <span
                style={{
                  display: 'block',
                  fontSize: `${item.size}cqw`,
                  lineHeight: 1,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  color: item.color,
                }}
              >
                {item.text}
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
