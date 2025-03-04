import type { I_range } from 'k-means-pp'
import type { I_lab } from '../type'
import type { I_output, I_response, I_request } from './type'
export * from './type'

let id = 0

export
function KC_worker_helper(worker: Worker) {
  // map: id -> resolve
  const jobs = new Map<number, (o: I_output) => void>()

  // post and wait
  const post = (req: I_request) => {
    worker.postMessage(req)
    return new Promise<I_output>(res =>
      jobs.set(req.id, res)
    )
  }

  // receive and resolve
  worker.onmessage = (evt: MessageEvent) => {
    const res = evt.data as I_response
    jobs.get(res.id)!(res.message)
  }

  return (all_colors: I_lab[], k: number, range: I_range) =>
    post({
      id: ++id,
      message: { all_colors, k, range },
    })
}
