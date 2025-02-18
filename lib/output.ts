import { I_cluster } from 'k-means-pp'

export
function clusters_2_img_data(clusters: I_cluster[], width: number, height: number) {
  const px_count = width * height
  const data = new Uint8ClampedArray(px_count * 4)
  for (let i=0; i<px_count; i++) {
    for (const c of clusters)
      if (c.indices.includes(i)) {
        data[i * 4] = c.mean[0]
        data[i * 4 + 1] = c.mean[1]
        data[i * 4 + 2] = c.mean[2]
        data[i * 4 + 3] = c.mean[3] ?? 255
        break
      }
    throw Error('No cluster found for pixel at index ' + i)
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
