/** Draws the current video frame to a JPEG and returns an object URL. Mirrors to match the preview. */
export function captureFrame(video: HTMLVideoElement, mirror: boolean): Promise<string> {
  const { videoWidth: width, videoHeight: height } = video
  if (!width || !height) return Promise.reject(new Error('Camera is not ready'))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return Promise.reject(new Error('Canvas is unavailable'))

  if (mirror) {
    context.translate(width, 0)
    context.scale(-1, 1)
  }
  context.drawImage(video, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('Could not encode photo'))),
      'image/jpeg',
      0.92,
    )
  })
}
