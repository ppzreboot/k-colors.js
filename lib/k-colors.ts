import convert from 'color-convert'
import delta_e from 'delta-e'
import { k_means_pp, has_enough_unique_points, calc_range } from 'k-means-pp'
import { I_rgb_cluster, I_lab_range, I_rgb, I_lab, I_lab_cluster } from './type'

export
function calc_lab_range(lab_colors: I_lab[]): I_lab_range {
  return calc_range(3, lab_colors) as I_lab_range
}

export
function has_enough_unique_colors(all_colors: I_rgb[], k: number): boolean {
  if (all_colors.length < k)
    return false
  const colors = all_colors.map(rgb => [rgb.r, rgb.g, rgb.b])
  return has_enough_unique_points(3, colors, k)[0]
}

interface I_k_colors_opts {
  all_colors: I_lab[]
  k: number
  range?: I_lab_range
}

export
function k_colors(opts: I_k_colors_opts): I_lab_cluster[] {
  const [clusters] = k_means_pp({
    dimension: 3,
    points: opts.all_colors,
    k: opts.k,
    range: opts.range,
    quantify: (_, X, Y) =>
      delta_e.getDeltaE00(
        { L: X[0], A: X[1], B: X[2] },
        { L: Y[0], A: Y[1], B: Y[2] },
      )
  })
  return clusters.map(item => ({
    mean: item.mean.map(n => Math.round(n)) as I_lab,
    indices: item.indices,
  }))
}

interface I_k_colors_rgb_opts {
  all_colors: I_rgb[]
  k: number
  range?: I_lab_range
}

export
function k_colors_rgb(opts: I_k_colors_rgb_opts): I_rgb_cluster[] {
  // convert all colors to lab
  const lab_colors = opts.all_colors.map(rgb =>
    convert.rgb.lab([rgb.r, rgb.g, rgb.b])
  )
  // run k-means
  const clusters = k_colors({
    all_colors: lab_colors,
    k: opts.k,
    range: opts.range,
  })
  // convert the mean values back to rgba
  return clusters.map(c => {
    const rgb = convert.lab.rgb(c.mean)
    return {
      mean: { r: rgb[0], g: rgb[1], b: rgb[2] },
      indices: c.indices,
    } 
  })
}
