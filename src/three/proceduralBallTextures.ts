import * as THREE from 'three'

/** Equirectangular aspect (matches SphereGeometry default UVs). */
const W = 1024
const H = 512

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** Deterministic 0–1 noise for felt grain (stable across frames / remounts). */
function hash2(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
  return n - Math.floor(n)
}

function makeCanvasTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  /** No mips — thin seam + felt grain smear into mush with trilinear minification. */
  tex.generateMipmaps = false
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

function makeDataTexture(data: Uint8Array): THREE.DataTexture {
  const tex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat)
  tex.colorSpace = THREE.NoColorSpace
  tex.needsUpdate = true
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

/**
 * Optic-yellow felt + curved seam, authored in the same UV space as
 * `SphereGeometry` (equirectangular). Albedo, roughness, and bump stay aligned.
 */
export function createTennisTextures() {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(W, H)
  const roughData = new Uint8Array(W * H * 4)
  const bumpData = new Uint8Array(W * H * 4)

  for (let y = 0; y < H; y++) {
    const v = y / Math.max(1, H - 1)
    for (let x = 0; x < W; x++) {
      const u = x / Math.max(1, W - 1)
      const i = (y * W + x) * 4

      const grain = (hash2(x * 0.31, y * 0.29) - 0.5) * 11
      const lat = (v - 0.5) * 2
      const latShade = (1 - Math.cos(lat * Math.PI)) * 0.5 * 0.14

      // Curved seam (sinusoid in u) — reads as a Wilson-style loop on the sphere
      const phase = 2 * Math.PI * (u * 1.06 + 0.02)
      const seamCenter = 0.5 + 0.27 * Math.sin(phase) + 0.04 * Math.sin(phase * 2 + v * Math.PI * 3)
      const d = Math.abs(v - seamCenter)
      const inner = 1 - smoothstep(0.008, 0.024, d)
      const outer = 1 - smoothstep(0.018, 0.048, d)
      const groove = Math.max(0, outer - inner * 0.92)
      const seamMix = Math.min(1, inner + groove * 0.35)

      // Optic yellow felt
      let r = 255 - latShade * 40 + grain
      let g = 248 - latShade * 32 + grain * 0.85
      let b = 46 + latShade * 22 + grain * 0.15

      // Groove: slightly cooler / darker
      r -= groove * 38
      g -= groove * 32
      b -= groove * 8

      // Seam tape: warm off-white
      const wr = 254
      const wg = 252
      const wb = 238
      const s = seamMix
      r = r * (1 - s) + wr * s
      g = g * (1 - s) + wg * s
      b = b * (1 - s) + wb * s

      img.data[i] = Math.max(0, Math.min(255, Math.round(r)))
      img.data[i + 1] = Math.max(0, Math.min(255, Math.round(g)))
      img.data[i + 2] = Math.max(0, Math.min(255, Math.round(b)))
      img.data[i + 3] = 255

      // Roughness: matte felt vs slightly smoother tape
      const feltRough = 0.94 + (hash2(x, y) - 0.5) * 0.05
      const tapeRough = 0.56 + groove * 0.12
      const rough = feltRough * (1 - inner) + tapeRough * inner + (1 - outer) * 0.02
      const roughByte = Math.max(0, Math.min(255, Math.round(rough * 255)))
      roughData[i] = roughByte
      roughData[i + 1] = roughByte
      roughData[i + 2] = roughByte
      roughData[i + 3] = 255

      // Bump: fuzzy felt + raised seam / shallow groove
      const feltBump = 0.42 + hash2(x * 1.7, y * 1.9) * 0.28
      let bumpVal = feltBump * (1 - outer) + 0.78 * inner + 0.22 * groove
      bumpVal = Math.max(0, Math.min(1, bumpVal))
      const bumpByte = Math.round(bumpVal * 255)
      bumpData[i] = bumpByte
      bumpData[i + 1] = bumpByte
      bumpData[i + 2] = bumpByte
      bumpData[i + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)
  const map = makeCanvasTexture(canvas)
  const roughnessMap = makeDataTexture(roughData)
  const bumpMap = makeDataTexture(bumpData)

  return { map, roughnessMap, bumpMap }
}
