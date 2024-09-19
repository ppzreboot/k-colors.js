import type { Result, Points } from 'k-means-pp'

export
type Color = readonly [number, number, number, number]
export
type Colors = readonly Color[]

export
interface I_KCPP_result_data {
  /** the k most prominent colors */
  colors: Colors
  /** the result of k-means++ */
  kmpp_result: Result | Points
}
