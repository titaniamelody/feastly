/** DB may store "1777975092271food_1.png"; static files are food_1.png */
export function resolveImageFileName(imageName) {
  if (!imageName) return ''
  const match = String(imageName).match(/((?:food|menu)_\d+\.png)$/i)
  return match ? match[1] : imageName
}

export function getImageUrl(imageName, baseUrl = '') {
  const file = resolveImageFileName(imageName)
  if (!file) return ''
  const prefix = baseUrl.replace(/\/$/, '')
  return `${prefix}/images/${file}`
}
