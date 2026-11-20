import { useEffect, useId, useRef, useState, type DragEvent } from 'react'
import { acceptAttribute, readImageFile } from './readImageFile'
import { createUploadBatch } from './uploadBatch'

interface Props {
  targetLabel: string
  /** Receives validated object URLs; returns how many were placed. */
  onFiles: (urls: string[]) => number
}

export function UploadPanel({ targetLabel, onFiles }: Props) {
  const inputId = useId()
  const [errors, setErrors] = useState<string[]>([])
  const [reading, setReading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [batch] = useState(() => createUploadBatch(readImageFile, URL.revokeObjectURL))
  const onFilesRef = useRef(onFiles)
  useEffect(() => { onFilesRef.current = onFiles }, [onFiles])
  useEffect(() => () => batch.cancel(), [batch])

  const handle = async (files: File[]) => {
    if (files.length === 0 || reading) return
    setReading(true)
    const results = await batch.read(files)
    if (!results) return
    const urls = results.flatMap((r) => ('url' in r ? [r.url] : []))
    const problems = results.flatMap((r) => ('error' in r ? [r.error] : []))
    if (urls.length > 0) {
      const placed = onFilesRef.current(urls)
      if (placed < urls.length) problems.push('Some photos were skipped because every slot is filled.')
    }
    setErrors(problems)
    setReading(false)
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    void handle(Array.from(event.dataTransfer.files))
  }

  return (
    <div aria-busy={reading}>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mx-auto flex aspect-[4/3] w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed p-6 text-center focus-within:outline-2 focus-within:outline-accent ${
          dragging ? 'border-accent bg-surface' : 'border-line bg-surface hover:border-ink'
        }`}
      >
        <span className="font-medium">Choose photos from this device</span>
        <span className="mt-1 text-sm text-muted">
          or drop them here. They fill {targetLabel} first. JPEG, PNG or WebP, up to 15 MB each.
        </span>
        <span className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-surface">
          {reading ? 'Reading…' : 'Browse files'}
        </span>
        <input
          id={inputId}
          type="file"
          multiple
          disabled={reading}
          accept={acceptAttribute}
          className="sr-only"
          onChange={(e) => {
            void handle(Array.from(e.target.files ?? []))
            e.target.value = ''
          }}
        />
      </label>
      <p role="status" className="mt-2 text-center text-sm text-muted">
        {reading ? 'Reading photos. Wait before adding more; the selected slot is filled when reading finishes.' : ''}
      </p>
      <div role="alert" className="mt-3 min-h-6 text-center text-sm text-red-700">
        {errors.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
    </div>
  )
}
