import { KCPP_result } from '../types'

interface Request_message_init {
  type: 'init'
  id: undefined
  data: ImageData
}
interface Request_message_k_means {
  type: 'k_colors'
  id: number
  data: number
}
interface Request_message_k_means_pp {
  type: 'k_colors_pp'
  id: number
  data: number
}

export
type T_job_type_id = 'k_colors' | 'k_colors_pp'
export
type T_job_message = Request_message_k_means | Request_message_k_means_pp

export
type Request_message = Request_message_init | Request_message_k_means | Request_message_k_means_pp

export
interface Response_message {
  id: number
  result: KCPP_result
}
