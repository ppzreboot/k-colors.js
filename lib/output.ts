import convert from 'color-convert'
import { I_rgb_cluster, I_lab, I_rgb, I_lab_cluster } from './type'

export
function lab_2_rgb(lab: I_lab): I_rgb {
  const rgb = convert.lab.rgb(lab)
  return { r: rgb[0], g: rgb[1], b: rgb[2] }
}

export
function lab_cluster_2_rgb_cluster(cluster: I_lab_cluster): I_rgb_cluster {
  return {
    mean: lab_2_rgb(cluster.mean),
    indices: cluster.indices,
  }
}

export
function lab_clusters_2_rgb_clusters(clusters: I_lab_cluster[]): I_rgb_cluster[] {
  return clusters.map(lab_cluster_2_rgb_cluster)
}

export
function rgb_clusters_2_img_data(clusters: I_rgb_cluster[], width: number, height: number) {
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
