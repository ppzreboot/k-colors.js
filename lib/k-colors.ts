import { k_means_pp, calc_range, I_range } from 'k-means-pp'
import { I_color } from './type'
import { img_2_img_data, img_data_2_colors } from './input'
import { clusters_2_img_data, img_data_2_img_blob } from './output'

export
function k_colors(all_colors: I_color[], k: number, range?: I_range) {
  const d = all_colors[0].length
  range = range ?? calc_range(d, all_colors)
  const [clusters] = k_means_pp(d, all_colors, k, range)
  for (const c of clusters) // round the mean values
    c.mean = c.mean.map(n => Math.round(n))
  return clusters
}

/** k_colors Out Of Box */
export default
async function k_colors_oob(source: HTMLImageElement, k: number, opts: ImageEncodeOptions) {
  const { width, height } = source
  const img_data = img_2_img_data(source)
  const all_colors = img_data_2_colors(img_data)
  const clusters = k_colors(all_colors, k)
  const new_img_data = clusters_2_img_data(clusters, width, height)
  const blob = await img_data_2_img_blob(new_img_data, opts)
  const img = new Image()
  return await new Promise<HTMLImageElement>((res, rej) => {
    img.onload = () => res(img)
    img.onerror = rej
    img.src = URL.createObjectURL(blob)
  })
}
