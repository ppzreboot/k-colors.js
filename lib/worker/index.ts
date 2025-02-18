import type { I_input } from './type'
import { k_colors } from '../k-colors'

self.onmessage = function(event: MessageEvent) {
  const input = event.data as I_input
  postMessage(
    k_colors(input.all_colors, input.k, input.range)
  )
}
