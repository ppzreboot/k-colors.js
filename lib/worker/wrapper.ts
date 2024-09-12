import type { KMPP_result } from '../types'
import { get_image_data } from '../utils.js'
import type { Response_message, T_job_type_id, T_job_message } from './types'
import { KCPP_result } from '../kcpp'

let id_index = 0

export
class KCPP_worker_wrapper {
  private readonly img_data: ImageData
  map = new Map<number, (result: KMPP_result) => void>()

  constructor(
    private worker: Worker,
    img_data: HTMLImageElement | OffscreenCanvas | ImageData,
  ) {
    this.img_data = get_image_data(img_data)
    this.worker.postMessage({
      type: 'init',
      data: this.img_data,
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
    return new Promise<KMPP_result>(resolve =>
      this.map.set(id, resolve)
    )
  }

  async k_colors(k: number): Promise<KCPP_result> {
    return new KCPP_result(await this.post(k, 'k_colors'), this.img_data)
  }
  async k_colors_pp(k: number): Promise<KCPP_result> {
    return new KCPP_result(await this.post(k, 'k_colors_pp'), this.img_data)
  }
}
