export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // Revoke after the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
