import { KCPP } from '../'

interface Message_init {
  type: 'init'
  id: undefined
  data: ImageData
}
interface Message_k_means {
  type: 'k_colors'
  id: string
  data: number
}
interface Message_k_means_pp {
  type: 'k_colors_pp'
  id: string
  data: number
}
type Message = Message_init | Message_k_means | Message_k_means_pp

let kcpp: KCPP

self.onmessage = function(event: MessageEvent) {
  const { type, id, data } = event.data as Message
  switch (type) {
    case 'init':
      kcpp = new KCPP(data)
      break
    case 'k_colors':
      postMessage({
        id,
        result: kcpp.k_colors(data)
      })
      break
    case 'k_colors_pp':
      postMessage({
        id,
        result: kcpp.k_colors_pp(data)
      })
      break
    default:
      throw new Error('unknown message type')
  }
}
