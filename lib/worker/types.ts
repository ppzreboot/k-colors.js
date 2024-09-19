import type { Result, Points } from 'k-means-pp'

interface Request_message_init {
  type: 'init'
  id: undefined
  data: ImageData
}
interface Request_message_k_means {
  type: 'k_means'
  id: number
  data: number
}
interface Request_message_k_means_pp {
  type: 'k_means_pp'
  id: number
  data: number
}

export
type T_job_type_id = 'k_means' | 'k_means_pp'
export
type T_job_message = Request_message_k_means | Request_message_k_means_pp

export
type Request_message = Request_message_init | Request_message_k_means | Request_message_k_means_pp

export
interface Response_message {
  id: number
  result: Result | Points
}
