import { KMPP } from 'k-means-pp'
import { get_image_data } from './utils'
import type { Color, Colors, KMPP_Result, KCPP_result } from './types'

/** 计算图片中主要的 k 种颜色 */
export
class KCPP {
  private readonly kmpp: KMPP
  constructor(img_data: HTMLImageElement | OffscreenCanvas | HTMLCanvasElement | ImageData) {
    img_data = get_image_data(img_data)
    this.kmpp = new KMPP({
      data: get_colors(img_data),
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
  k_colors(k: number): KCPP_result {
    return this.ret(this.kmpp.k_means(k))
  }

  /** 使用 k-means++ 算法计算 k 种颜色 */
  k_colors_pp(k: number): KCPP_result {
    return this.ret(this.kmpp.k_means_pp(k))
  }
}

function round_result(raw_colors: Colors) {
  return raw_colors.map(color => color.map(c => Math.round(c))) as unknown as Colors
}

function get_colors(image_data: ImageData): Colors {
  const data = image_data.data
  const colors: Color[]= [] // 次数 Color[] 并非 Colors
  for (let i = 0; i < data.length; i += 4) {
    colors.push([data[i], data[i + 1], data[i + 2], data[i + 3]])
  }
  return colors
}
