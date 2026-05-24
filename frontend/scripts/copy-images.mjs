import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(__dirname, '../src/assets/frontend_assets')
const outDir = path.join(__dirname, '../public/images')

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(assetsDir).filter((f) => /^(food|menu)_\d+\.png$/i.test(f))

for (const file of files) {
  fs.copyFileSync(path.join(assetsDir, file), path.join(outDir, file))
}

console.log(`Copied ${files.length} images to public/images`)
