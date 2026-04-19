export const LIGHTBOX_MAX_EDGE = 2500

export function cloudinaryDeliveredDims(
  width: number,
  height: number
): { width: number, height: number } {
  const longEdge = Math.max(width, height)
  if (longEdge <= LIGHTBOX_MAX_EDGE) return { width, height }
  const scale = LIGHTBOX_MAX_EDGE / longEdge
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale)
  }
}
