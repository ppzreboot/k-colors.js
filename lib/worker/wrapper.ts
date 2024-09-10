import type { KCPP_result } from '../types'
import { get_image_data } from '../utils.js'
import type { Response_message, T_job_type_id, T_job_message } from './types'

let id_index = 0

export
class KCPP_worker_wrapper {
  map = new Map<number, (result: KCPP_result) => void>()

  constructor(
    private worker: Worker,
    img_data: HTMLImageElement | OffscreenCanvas | ImageData,
  ) {
    this.worker.postMessage({
      type: 'init',
      data: get_image_data(img_data),
    })

    this.worker.onmessage = (event: MessageEvent) => {
      const { id, result } = event.data as Response_message
      this.map.get(id)!(result)
      this.map.delete(id)
    }
  }

  private post(k: number, type: T_job_type_id) {
    const id = ++id_index
    const msg: T_job_message = {
      type,
      id,
      data: k,
    }
    this.worker.postMessage(msg)
    return new Promise<KCPP_result>(resolve =>
      this.map.set(id, resolve)
    )
  }

  k_colors(k: number) {
    return this.post(k, 'k_colors')
  }
  k_colors_pp(k: number) {
    return this.post(k, 'k_colors_pp')
  }
}
