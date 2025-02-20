# k-colors.js
[demo](https://ppzreboot.github.io/k-colors.js/) | [github](https://github.com/ppzreboot/k-colors.js) | [npm](https://www.npmjs.com/package/k-colors)

A JavaScript library for extracting dominant colors from images using the k-means/k-means++ algorithm.

This lib is based on [k-means-pp.js](https://github.com/ppzreboot/k-means-pp.js).

## Usage
#### Install
``` bash
npm install k-colors
```

#### Cases

##### web worker (vite)

``` ts
import KC_workder from 'k-colors/worker?worker'
import { KC_worker_helper } from 'k-colors/worker/helper'

const worker = new KC_workder()
const kwh = new KC_worker_helper(worker)
const colors = [
  [255, 255, 0, 255],
  [0, 255, 255, 255],
  // ...
]
const range = {
  min: [0, 0, 0, 0],
  max: [255, 255, 255, 255],
}
const clusters = await kwh(colors, 6, range)
console.log('clustered colors:',
  clusters.map(c => c.mean)
)
```

### DEV
+ For simplicity, don't use workspace or other monorepo tool chain. Just `esbuild` and `node:fs`.
+ Open another vscode window for the demo app.

##### pack for demo
``` bash
npm run build
cd dist
npm pack
cd ../demo
npm install ../dist/k-colors-xxx.tgz
```

##### publish demo

```bash
cd demo
npm run build
cd ..
npm run publish-demo
```
