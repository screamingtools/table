import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/table/index.ts',
    mini: 'src/mini-table/index.ts'
  },
  outDir: './',
  format: ['esm'],
  dts: true,
  clean: false, // DO NOT SET TO `true`
  minify: false,
  splitting: false
})
