import { KMPP } from 'k-means-pp'

export
type Color = readonly [number, number, number, number]
export
type Colors = readonly Color[]

type KMPP_Result = ReturnType<typeof KMPP.prototype.k_means>

/** 计算图片中主要的 k 种颜色 */
export
class KCPP {
  private readonly kmpp: KMPP
  constructor(img: HTMLImageElement) {
    const image_data = get_image_data(img)
    this.kmpp = new KMPP({
      data: get_colors(image_data),
      dimension: 4,
    })
  }

  private ret(result: KMPP_Result) {
    const means = result instanceof Array ? result : result.means
    return {
      kmpp_result: result,
      colors: round_result(means as Colors),
    }
  }

  /** 使用 k-means 算法计算 k 种颜色 */
  k_colors(k: number) {
    return this.ret(this.kmpp.k_means(k))
  }

  /** 使用 k-means++ 算法计算 k 种颜色 */
  k_colors_pp(k: number) {
    return this.ret(this.kmpp.k_means_pp(k))
  }
}

function round_result(raw_colors: Colors) {
  return raw_colors.map(color => color.map(c => Math.round(c))) as unknown as Colors
}

function get_image_data(img: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function get_colors(image_data: ImageData): Colors {
  const data = image_data.data
  const colors: Color[]= [] // 次数 Color[] 并非 Colors
  for (let i = 0; i < data.length; i += 4) {
    colors.push([data[i], data[i + 1], data[i + 2], data[i + 3]])
  }
  return colors
}
