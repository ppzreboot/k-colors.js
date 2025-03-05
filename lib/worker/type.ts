import type { k_colors } from '../k-colors'
import type { I_lab, I_lab_range } from '../type'

export
interface I_input {
  all_colors: I_lab[]
  k: number
  range: I_lab_range
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
