import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['scripts/skills-manager.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  minify: false,
  dts: false,
})
