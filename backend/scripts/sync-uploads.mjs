import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(__dirname, '../../frontend/src/assets/frontend_assets')
const uploadsDir = path.join(__dirname, '../uploads')

fs.mkdirSync(uploadsDir, { recursive: true })

const files = fs.readdirSync(assetsDir).filter((f) => /^(food|menu)_\d+\.png$/i.test(f))

for (const file of files) {
  fs.copyFileSync(path.join(assetsDir, file), path.join(uploadsDir, file))
}

console.log(`Synced ${files.length} images to backend/uploads`)
