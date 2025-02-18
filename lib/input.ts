import { I_color } from './type'

export
function img_2_img_data(img: HTMLImageElement) {
  const canvas = new OffscreenCanvas(img.width, img.height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height)
}

export
function img_data_2_colors(img_data: ImageData): I_color[] {
  const data = img_data.data
  const colors: I_color[]= []
  for (let i = 0; i < data.length; i += 4)
    colors.push([data[i], data[i + 1], data[i + 2], data[i + 3]])
  return colors
}
