import { I_rgb } from './type'
import { has_enough_unique_colors, k_colors_rgb } from './k-colors'
import { img_2_img_data, img_data_2_rgba, rgba_2_rgb } from './input'
import { rgb_clusters_2_img_data, img_data_2_img_blob } from './output'

export
interface I_k_colors_oob_opts {
  source: HTMLImageElement
  base_color?: I_rgb
  k: number
  img_encode_opts?: ImageEncodeOptions
}

/** k_colors Out Of Box */
export default
async function k_colors_oob(opts: I_k_colors_oob_opts) {
  const base_color = opts.base_color ?? { r: 255, g: 255, b: 255 }

  const { width, height } = opts.source
  const img_data = img_2_img_data(opts.source)
  const all_colors = img_data_2_rgba(img_data)
  
  if (!has_enough_unique_colors(all_colors, opts.k))
    return opts.source

  const clusters = k_colors_rgb({
    all_colors: all_colors.map(rgba =>
      rgba_2_rgb(rgba, base_color)
    ),
    k: opts.k,
  })
  const new_img_data = rgb_clusters_2_img_data(clusters, width, height)
  const blob = await img_data_2_img_blob(new_img_data, opts.img_encode_opts)
  const img = new Image()
  return await new Promise<HTMLImageElement>((res, rej) => {
    img.onload = () => res(img)
    img.onerror = rej
    img.src = URL.createObjectURL(blob)
  })
}
