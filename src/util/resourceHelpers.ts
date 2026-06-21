export function unitVolume(r: {
  width?: number | null;
  height?: number | null;
  length?: number | null;
}) {
  if (r.width == null || r.height == null || r.length == null) {
    return null;
  }
  return r.width * r.height * r.length;
}
