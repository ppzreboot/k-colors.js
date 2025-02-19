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
    entryPoints: ['./lib/**/*'],
    bundle: false,
    logLevel: 'debug',
    outdir,

    plugins: [dtsPlugin()],
  })
}

function write_package() {
  const { scripts, devDependencies, ...useful } = pkg
  fs.writeFileSync(outdir + 'package.json', JSON.stringify(useful, null, 2))
}
