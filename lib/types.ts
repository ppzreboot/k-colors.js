import type { KMPP } from 'k-means-pp'

export
type Color = readonly [number, number, number, number]
export
type Colors = readonly Color[]

export
type KMPP_result = ReturnType<typeof KMPP.prototype.k_means>

export
interface I_KCPP_result_data {
  /** the k most prominent colors */
  colors: Colors
  /** the result of k-means++ */
  kmpp_result: KMPP_result
}
