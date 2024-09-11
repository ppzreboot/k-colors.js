# k-colors.js
[demo](https://ppzreboot.github.io/k-colors.js/) | [github](https://github.com/ppzreboot/k-colors.js) | [npm](https://www.npmjs.com/package/k-colors)

A JavaScript library for extracting dominant colors from images using the k-means/k-means++ algorithm.

This lib is based on [k-means-pp.js](https://github.com/ppzreboot/k-means-pp.js).

##### Install
``` bash
npm install k-colors
```

##### basic
``` ts
import { KCPP } from 'k-colors'

// the `img` below is a HTMLImageElement or HTMLCanvasElement or OffscreenCanvas or ImageData
const kcpp = new KCPP(img)
const colors = kcpp.k_colors_pp(3).colors
console.log(colors) // [ [255,255,255,200], [100,200,200,255], [0,10,20,255] ]
```

##### web worker (vite)

``` ts
import KCPP_worker from 'k-colors/worker/worker?worker'
import { KCPP_worker_wrapper } from 'k-colors/worker/wrapper'

const kcpp = new KCPP_worker_wrapper(new KCPP_worker(), img)
const result = await kcpp.k_colors_pp(3)
console.log(result.colors) // [ [255,255,255,200], [100,200,200,255], [0,10,20,255] ]
```
