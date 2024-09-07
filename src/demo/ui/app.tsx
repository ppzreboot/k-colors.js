import { useState, useMemo, useEffect } from 'react'
import { KCPP, Color } from '../../lib/index'

export
function App() {
  const input_img = useInput_img()
  const input_k = useInput_k()
  const pallet = usePallet(input_img.img, input_k.k)

  return <div>
    <h1>k-colors.js</h1>

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
        <img className='block' src={src} />
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
  const kcpp = useMemo(
    () => img ? new KCPP(img) : null,
    [img],
  )

  const colors = useMemo(
    () => (kcpp && k) ? kcpp.k_colors_pp(k).colors : null,
    [kcpp, k],
  )

  const [focused_color, set_focused_color] = useState<Color | null>(null)
  useEffect(() => {
    if (colors) {
      set_focused_color(colors[0])
    }
  }, [colors])

  return {
    colors,
    el: colors &&
      <div className='block'>
        <ul className='pallet'>
          {colors.map((color, i) =>
            <li
              key={i}
              style={{ backgroundColor: `rgba(${color.join(',')})` }}
              onMouseEnter={() => set_focused_color(color)}
            />
          )}
        </ul>
        <span>{focused_color?.join(',')}</span>
      </div>
  }
}
