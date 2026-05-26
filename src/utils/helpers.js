export function getInitials(name, fallback = '?') {
  return (name || fallback)
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
