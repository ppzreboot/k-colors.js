import { I_rgb_cluster } from './type'

export
function clusters_2_img_data(clusters: I_rgb_cluster[], width: number, height: number) {
  const px_count = width * height
  const data = new Uint8ClampedArray(px_count * 4)
  for (const c of clusters)
    for (const i of c.indices) {
      data[i * 4] = c.mean.r
      data[i * 4 + 1] = c.mean.g
      data[i * 4 + 2] = c.mean.b
      data[i * 4 + 3] = 255
    }
  return new ImageData(data, width, height)
}

export
async function img_data_2_img_blob(img_data: ImageData, opts?: ImageEncodeOptions) {
  const canvas = new OffscreenCanvas(img_data.width, img_data.height)
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(img_data, 0, 0)
  return await canvas.convertToBlob(opts)
}
