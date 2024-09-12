import { KCPP } from '../kcpp'
import type { Request_message, Response_message } from './types'

let kcpp: KCPP

self.onmessage = function(event: MessageEvent) {
  const { type, id, data } = event.data as Request_message
  switch (type) {
    case 'init':
      kcpp = new KCPP(data)
      break
    case 'k_colors':
      const msg: Response_message = {
        id,
        result: kcpp.k_colors(data).kmpp_result
      }
      postMessage(msg)
      break
    case 'k_colors_pp':
      const pp_msg: Response_message = {
        id,
        result: kcpp.k_colors_pp(data).kmpp_result
      }
      postMessage(pp_msg)
      break
    default:
      throw new Error('unknown message type')
  }
}
