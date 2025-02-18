import fs from 'node:fs'
import { build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'
import pkg from '../package.json' with { type: 'json' }

const outdir = './dist/'
main()

async function main() {
  // clean dist
  fs.rmSync(outdir, { recursive: true, force: true })
  // create dist
  fs.mkdirSync(outdir)

  // copy readme.md
  fs.copyFileSync('./readme.md', outdir + 'readme.md')
  // write package.json
  write_package()

  // build lib
  await build({
    entryPoints: [
      './lib/**/*',
    ],
    target: 'es2020',
    format: 'esm',
    // external: ['k-means-pp'],
    bundle: false,
    logLevel: 'debug',
    outdir,

    plugins: [dtsPlugin()],
  })
}

function write_package() {
  fs.writeFileSync(outdir + 'package.json', JSON.stringify({
    name: 'k-colors',
    version: pkg.version,
    exports: {
      '.': './mod.js',
      './worker': './worker/index.js',
      './worker/helper': './worker/helper.js'
    },
    keywords: [
      'color',
      'k-means++',
      'k-means',
      'kmeans'
    ],
    author: 'PPz',
    dependencies: pkg.dependencies,
    repository: 'github:ppzreboot/k-colors.js',
    license: 'UNLICENSED',
    bugs: {
      url: 'https://github.com/ppzreboot/k-colors.js/issues'
    },
  }, null, 2))
}
