import { I_cluster } from 'k-means-pp'

export
interface I_rgb {
  r: number
  g: number
  b: number
}
export
interface I_rgba extends I_rgb {
  a: number
}

export
type I_lab = [number, number, number]

export
interface I_lab_cluster extends I_cluster {
  mean: I_lab
}

export
interface I_rgb_cluster  {
  mean: I_rgb
  indices: number[]
}

export
interface I_lab_range {
  min: I_lab
  max: I_lab
}
