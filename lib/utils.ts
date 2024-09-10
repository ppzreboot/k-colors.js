type CanvasContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export
function get_image_data(canvas: HTMLImageElement | OffscreenCanvas | HTMLCanvasElement | ImageData): ImageData {
  if (canvas instanceof ImageData)
    return canvas

  var ctx: CanvasContext
  if (canvas instanceof HTMLImageElement) {
    const img = canvas
    canvas = new OffscreenCanvas(img.width, img.height)
    ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
  } else {
    ctx = canvas.getContext('2d') as CanvasContext
  }
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}
