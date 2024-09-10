import fs from 'node:fs'
import { build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'

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
    version: '0.0.2',
    main: 'kcpp.js',
    keywords: [
      'color',
      'k-means++',
      'k-means',
      'kmeans'
    ],
    author: 'ppz',
    dependencies: {
      'k-means-pp': '>=2.1.0',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/ppzreboot/k-colors.js.git'
    },
    license: 'Unlicense',
    bugs: {
      url: 'https://github.com/ppzreboot/k-colors.js/issues'
    },
  }, null, 2))
}
