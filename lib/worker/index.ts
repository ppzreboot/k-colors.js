import type { I_request } from './type'
import { k_colors } from '../k-colors'

self.onmessage = function(event: MessageEvent) {
  const req = event.data as I_request
  postMessage({
    id: req.id,
    message: k_colors({
      all_colors: req.message.all_colors,
      k: req.message.k,
      range: req.message.range,
    }),
  })
}
