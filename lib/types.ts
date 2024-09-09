import type { KMPP } from 'k-means-pp'

export
type Color = readonly [number, number, number, number]
export
type Colors = readonly Color[]

export
type KMPP_Result = ReturnType<typeof KMPP.prototype.k_means>

export
interface KCPP_result {
  kmpp_result: KMPP_Result
  colors: Colors
}
