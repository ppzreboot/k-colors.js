import { KMPP } from 'k-means-pp'
import { get_image_data } from './utils'
import type { Color, Colors, KMPP_result, I_KCPP_result_data } from './types'

/** 
 * KCPP (K-Colors Plus Plus)
 * 
 * This class provides methods to extract the k most dominant colors from an image
 * using k-means and k-means++ clustering algorithms.
 */
export
class KCPP {
  private readonly kmpp: KMPP
  private readonly img_data: ImageData
  constructor(img_data: HTMLImageElement | OffscreenCanvas | HTMLCanvasElement | ImageData) {
    this.img_data = get_image_data(img_data)
    this.kmpp = new KMPP({
      data: get_colors(this.img_data),
      dimension: 4,
    })
  }

  /** 
   * Calculates k dominant colors using the k-means algorithm
   * @param k The number of colors to extract
   * @returns An object containing the KMPP result and rounded color values
   */
  k_colors(k: number): KCPP_result {
    return new KCPP_result(this.kmpp.k_means(k), this.img_data)
  }

  /** 
   * Calculates k dominant colors using the k-means++ algorithm
   * @param k The number of colors to extract
   * @returns An object containing the KMPP result and rounded color values
   */
  k_colors_pp(k: number): KCPP_result {
    return new KCPP_result(this.kmpp.k_means_pp(k), this.img_data)
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

export
class KCPP_result implements I_KCPP_result_data {
  readonly colors: Colors
  constructor(
    public readonly  kmpp_result: KMPP_result,
    private readonly img_data: ImageData,
  ) {
    const means = kmpp_result instanceof Array ? kmpp_result : kmpp_result.means
    this.colors = round_result(means as Colors)
  }

  /** Returns the image data with the clustered colors */
  get_clustered_image_data(): ImageData {
    if (this.kmpp_result instanceof Array)
      return this.img_data

    const data = new Uint8ClampedArray(this.img_data.width * this.img_data.height * 4)
    this.kmpp_result.clusters.forEach((cluster) => {
      cluster.points.forEach(el => {
        data[el.index * 4] = cluster.mean[0]
        data[el.index * 4 + 1] = cluster.mean[1]
        data[el.index * 4 + 2] = cluster.mean[2]
        data[el.index * 4 + 3] = cluster.mean[3]
      })
    })
    return new ImageData(data, this.img_data.width, this.img_data.height)
  }

  /** Returns the data url of the image with the clustered colors */
  get_clustered_dataurl() {
    const canvas = document.createElement('canvas')
    canvas.width = this.img_data.width
    canvas.height = this.img_data.height
    const ctx = canvas.getContext('2d')!
    ctx.putImageData(this.get_clustered_image_data(), 0, 0)
    return canvas.toDataURL()
  }
}
