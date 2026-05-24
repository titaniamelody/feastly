export const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://feastly-5o8wz9i0.b4a.run'

/** DB may store "1777975092271food_1.png"; files on disk are food_1.png */
export function resolveImageFileName(imageName) {
  if (!imageName) return ''
  const match = String(imageName).match(/((?:food|menu)_\d+\.png)$/i)
  return match ? match[1] : imageName
}

export function getImageUrl(imageName, baseUrl = BACKEND_URL) {
  const file = resolveImageFileName(imageName)
  if (!file) return ''
  const prefix = baseUrl.replace(/\/$/, '')
  return `${prefix}/images/${file}`
}
