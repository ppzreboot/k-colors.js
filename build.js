import fs from 'node:fs'
import { build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'

const outdir = './dist/'

async function main() {
  // clean dist
  fs.rmSync(outdir, { recursive: true, force: true })

  // create dist
  fs.mkdirSync(outdir)
  // copy readme.md
  fs.copyFileSync('./readme.md', outdir + 'readme.md')
  // write package.json
  write_package()

  // build core
  await build({
    entryPoints: ['./lib/kcpp.ts'],
    target: 'es2020',
    format: 'esm',
    external: ['k-means-pp'],
    bundle: true,
    outdir,

    plugins: [dtsPlugin()],
  })

}

main()

function write_package() {
  write_json({
    name: 'k-colors',
    version: '0.0.0',
    main: 'kcpp.js',
  }, 'package.json')
}

function write_json(data, path) {
  fs.writeFileSync(outdir + path, JSON.stringify(data, null, 2))
}
