import { useState, useMemo, useEffect } from 'react'
import { KC_worker_helper } from 'k-colors/worker/helper'
import {
  calc_range,
  clusters_2_img_data,
  img_2_img_data,
  img_data_2_colors,
  img_data_2_img_blob,
  type I_color,
} from 'k-colors'
import KC_worker from 'k-colors/worker?worker'

const img_style = {
  maxWidth: 'min(500px, 100%)',
}

export
function App() {
  const input_img = useInput_img()
  const input_k = useInput_k()
  const pallet = usePallet(input_img.img, input_k.k)

  return <div>
    <hgroup>
      <h1>k-colors.js</h1>
      <p>Extract dominant colors from images using the k-means/k-means++ algorithm.</p>
      <p>
        links: <a
          href='https://github.com/ppzreboot/k-colors.js'>k-colors.js</a> | <a
          href='https://github.com/ppzreboot/k-means-pp.js'>k-means-pp.js</a>
      </p>
    </hgroup>

    {input_img.el}
    {input_k.el}
    {pallet.el}
  </div>
}

function useInput_img() {
  const [src, set_src] = useState<string | null>(null)
  const [img, set_img] = useState<HTMLImageElement | null>(null)
  return {
    img,
    el: <div className='block'>
      <input
        type='file'
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            const img = new Image()
            const src = URL.createObjectURL(file)
            img.src = src
            img.onload = () => {
              set_src(src)
              set_img(img)
            }
          }
        }}
      />
      {src &&
        <img className='block' src={src} style={img_style} />
      }
    </div>
  }
}

function useInput_k() {
  const [k, set_k] = useState('6')
  const [valid, set_valid] = useState(true)
  return {
    k: valid ? Number(k) : null,
    el: <div className='block'>
      <label>k: </label>
      <input
        type='number'
        value={k ?? ''}
        onChange={e => {
          const k_str = e.target.value
          set_k(k_str)

          const k = Number(k_str)
          set_valid(Number.isInteger(k) && k > 0)
        }}
      />
      <div style={{ color: 'red' }}></div>
    </div>
  }
}

function usePallet(img: HTMLImageElement | null, k: number | null) {
  const [working, set_working] = useState(false)
  const [time, set_time] = useState<number | null>(null)

  const kc = useMemo(() =>
    KC_worker_helper(new KC_worker())
  , [])

  const [colors, set_colors] = useState<I_color[] | null>(null)
  const [clustered_img, set_clustered_img] = useState<string | null>(null)

  useEffect(() => {
    if (img === null || k === null)
      return

    set_working(true)
    const start = performance.now()
    work(img, k)
      .then(() => {
        set_working(false)
        set_time(performance.now() - start)
      })

    async function work(img: HTMLImageElement, k: number) {
      const all_colors = img_data_2_colors(
        img_2_img_data(img)
      )
      const range = calc_range(4, all_colors)
      const clusters = await kc(all_colors, k, range)
      set_colors(clusters.map(cluster => cluster.mean))
      const img_blob = await img_data_2_img_blob(
        clusters_2_img_data(
          clusters, img.width, img.height
        )
      )
      set_clustered_img(
        URL.createObjectURL(img_blob)
      )
    }
  }, [img, k])

  const [focused_color, set_focused_color] = useState<I_color | null>(null)
  useEffect(() => {
    if (colors) {
      set_focused_color(colors[0])
    }
  }, [colors])

  return {
    colors,
    el: working
      ? 'working...'
      : 
        <>
          {colors &&
            <div className='block'>
              <h2>Pallet</h2>
              <ul className='pallet'>
                {colors.map((color, i) =>
                  <li
                    key={i}
                    style={{ backgroundColor: `rgba(${color.join(',')})` }}
                    onMouseEnter={() => set_focused_color(color)}
                  />
                )}
              </ul>
              <span>rgba({focused_color?.join(',')})</span>
            </div>
          }
          {time &&
            <div>time: {time}ms</div>
          }
          {clustered_img &&
            <>
              <h2>Clustered Image</h2>
              <img src={clustered_img} className='block' style={img_style} />
              <a href={clustered_img} download='clustered.png'>download</a>
            </>
          }
        </>
  }
}
