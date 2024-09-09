import { KCPP_result } from '../types.ts'

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
type Request_message = Request_message_init | Request_message_k_means | Request_message_k_means_pp

export
interface Response_message {
  id: number
  result: KCPP_result
}
