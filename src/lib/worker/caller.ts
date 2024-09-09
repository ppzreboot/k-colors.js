import K_worker from './worker.ts?worker'
import { KCPP_result } from '../'

interface Response {
  id: number
  result: KCPP_result
}

let id_index = 0

export
class KCPP_worker {
  private worker: Worker
  map = new Map<number, (result: KCPP_result) => void>()

  constructor(img_data: HTMLImageElement | OffscreenCanvas | ImageData) {
    if (img_data instanceof HTMLImageElement) {
      const _img = img_data
      img_data = new OffscreenCanvas(_img.width, _img.height)
      const ctx = img_data.getContext('2d')!
      ctx.drawImage(_img, 0, 0)
      img_data = ctx.getImageData(0, 0, _img.width, _img.height)
    } else if (img_data instanceof OffscreenCanvas) {
      const ctx = img_data.getContext('2d')!
      img_data = ctx.getImageData(0, 0, img_data.width, img_data.height)
    }

    this.worker = new K_worker()

    this.worker.postMessage({
      type: 'init',
      data: img_data,
    })

    this.worker.onmessage = (event: MessageEvent) => {
      const { id, result } = event.data as Response
      console.log({ result })
      this.map.get(id)!(result)
      this.map.delete(id)
    }
  }

  k_colors(k: number) {
    const id = ++id_index
    this.worker.postMessage({
      type: 'k_colors',
      id,
      data: k,
    })
    return new Promise<KCPP_result>(resolve =>
      this.map.set(id, resolve)
    )
  }

  k_colors_pp(k: number) {
    const id = ++id_index
    this.worker.postMessage({
      type: 'k_colors_pp',
      id,
      data: k,
    })
    return new Promise<KCPP_result>(resolve =>
      this.map.set(id, resolve)
    )
  }
}
