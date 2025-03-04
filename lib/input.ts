import { I_rgba, I_rgb } from './type'

export
function img_2_img_data(img: HTMLImageElement) {
  const canvas = new OffscreenCanvas(img.width, img.height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height)
}

export
function img_data_2_rgba(img_data: ImageData): I_rgba[] {
  const data = img_data.data
  const colors: I_rgba[]= []
  for (let i = 0; i < data.length; i += 4)
    colors.push({
      r: data[i], g: data[i + 1],
      b: data[i + 2], a: data[i + 3],
    })
  return colors
}

export
function rgba_2_rgb(fore: I_rgba, back: I_rgb): I_rgb {
  switch(fore.a) {
    case 0: return { r: back.r, g: back.g, b: back.b }
    case 255: return { r: fore.r, g: fore.g, b: fore.b }
  }
  const alpha_f = fore.a / 255
  const alpha_b = 1 - alpha_f

  const new_val = (f: number, b: number) =>
    Math.round((f * alpha_f + b * alpha_b))
  return {
    r: new_val(fore.r, back.r),
    g: new_val(fore.g, back.g),
    b: new_val(fore.b, back.b),
  }
}