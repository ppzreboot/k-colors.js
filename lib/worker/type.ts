import type { I_range } from 'k-means-pp'
import type { k_colors } from '../k-colors'
import type { I_color } from '../type'

export
interface I_input {
  all_colors: I_color[]
  k: number
  range: I_range
}

export
interface I_request {
  id: number
  message: I_input
}

export
type I_output = ReturnType<typeof k_colors>

export
interface I_response {
  id: number
  message: I_output
}
