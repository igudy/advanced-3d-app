import * as THREE from 'three'

/**
 * Catmull–Rom scroll path for the hero ball (same `t` as global `scroll.progress`).
 * Shared with `Ball3D` so position / rotation stay on one curve.
 */

type Waypoint = {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: number
}

type ScrollKey = { t: number } & Waypoint

const SCROLL_KEYS: ScrollKey[] = [
  { t: 0.0, pos: [0.0, 0.0, 0.06], rot: [0.12, 0.35, -0.04], scale: 1.0 },
  { t: 0.1, pos: [0.32, 0.08, 0.18], rot: [0.16, 0.95, -0.07], scale: 0.99 },
  { t: 0.22, pos: [0.02, 0.22, 0.34], rot: [0.22, 2.05, 0.02], scale: 0.98 },
  { t: 0.32, pos: [-0.32, 0.16, 0.28], rot: [0.2, 2.95, 0.06], scale: 0.96 },
  { t: 0.38, pos: [0.06, 0.12, 0.18], rot: [0.24, 3.55, -0.04], scale: 0.95 },
  { t: 0.5, pos: [0.46, -0.2, 0.12], rot: [0.28, 4.45, 0.08], scale: 0.93 },
  { t: 0.58, pos: [0.08, -0.34, 0.04], rot: [0.22, 5.35, -0.05], scale: 0.91 },
  { t: 0.68, pos: [-0.4, 0.02, -0.06], rot: [0.2, 6.35, 0.09], scale: 0.89 },
  { t: 0.78, pos: [0.28, 0.2, -0.12], rot: [0.16, 7.25, -0.04], scale: 0.87 },
  { t: 0.88, pos: [-0.12, -0.38, 0.02], rot: [0.18, 8.35, 0.03], scale: 0.85 },
  { t: 1.0, pos: [0.0, -1.12, 0.0], rot: [0.12, 9.25, 0.0], scale: 0.84 },
]

const POSITION_CURVE = new THREE.CatmullRomCurve3(
  SCROLL_KEYS.map((k) => new THREE.Vector3(k.pos[0], k.pos[1], k.pos[2])),
  false,
  'centripetal',
  0.42,
)

export function easeInOutCubic(local: number): number {
  return local < 0.5
    ? 4 * local * local * local
    : 1 - Math.pow(-2 * local + 2, 3) / 2
}

function sampleRotScale(t: number): Pick<Waypoint, 'rot' | 'scale'> {
  const keys = SCROLL_KEYS
  if (t <= keys[0].t) {
    return { rot: keys[0].rot, scale: keys[0].scale }
  }
  const last = keys[keys.length - 1]
  if (t >= last.t) {
    return { rot: last.rot, scale: last.scale }
  }
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t
      const u = span > 0 ? (t - a.t) / span : 0
      const e = easeInOutCubic(u)
      return {
        rot: [
          a.rot[0] + (b.rot[0] - a.rot[0]) * e,
          a.rot[1] + (b.rot[1] - a.rot[1]) * e,
          a.rot[2] + (b.rot[2] - a.rot[2]) * e,
        ],
        scale: a.scale + (b.scale - a.scale) * e,
      }
    }
  }
  return { rot: last.rot, scale: last.scale }
}

/** Waypoint on the scroll path at normalized progress `t` (0..1). */
export function sampleScrollPath(t: number): Waypoint {
  const u = Math.min(1, Math.max(0, t))
  const p = POSITION_CURVE.getPoint(u)
  const { rot, scale } = sampleRotScale(u)
  return {
    pos: [p.x, p.y, p.z],
    rot,
    scale,
  }
}
