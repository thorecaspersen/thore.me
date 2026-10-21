import { defineConfig } from 'vite'
import { readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = import.meta.dirname
const pages = { main: resolve(root, 'index.html') }
for (const dir of readdirSync(resolve(root, 'experience'))) {
  const html = resolve(root, 'experience', dir, 'index.html')
  if (existsSync(html)) pages[`experience-${dir}`] = html
}
if (existsSync(resolve(root, 'cv/index.html'))) pages.cv = resolve(root, 'cv/index.html')

export default defineConfig({
  server: { port: 5300, strictPort: true },
  build: { rollupOptions: { input: pages } },
})
