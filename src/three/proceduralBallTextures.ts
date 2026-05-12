import * as THREE from 'three'

const CANVAS_W = 640
const CANVAS_H = 320

function makeCanvasTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

/** Single-channel linear texture for roughness / bump (linear color space). */
function makeDataRoughness(width: number, height: number, fill: (x: number, y: number) => number) {
  const data = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1)
      const v = y / (height - 1)
      const g = Math.max(0, Math.min(255, Math.round(fill(u, v) * 255)))
      const i = (y * width + x) * 4
      data[i] = g
      data[i + 1] = g
      data[i + 2] = g
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat)
  tex.colorSpace = THREE.NoColorSpace
  tex.needsUpdate = true
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

/**
 * Fuzzy felt + Wilson-style curved seam on a tennis UV shell.
 */
export function createTennisTextures() {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(
    CANVAS_W * 0.35,
    CANVAS_H * 0.35,
    20,
    CANVAS_W * 0.55,
    CANVAS_H * 0.55,
    CANVAS_W * 0.75,
  )
  g.addColorStop(0, '#f0ff7a')
  g.addColorStop(0.35, '#dce63a')
  g.addColorStop(0.75, '#b8c41a')
  g.addColorStop(1, '#9aa818')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Felt micro-grain
  const img = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n))
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n * 0.9))
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n * 0.35))
  }
  ctx.putImageData(img, 0, 0)

  // White seam curve
  ctx.strokeStyle = '#f8fff0'
  ctx.lineWidth = 10
  ctx.shadowColor = 'rgba(0,0,0,0.25)'
  ctx.shadowBlur = 6
  ctx.beginPath()
  ctx.moveTo(CANVAS_W * 0.08, CANVAS_H * 0.72)
  ctx.bezierCurveTo(
    CANVAS_W * 0.32,
    CANVAS_H * 0.18,
    CANVAS_W * 0.58,
    CANVAS_H * 0.12,
    CANVAS_W * 0.92,
    CANVAS_H * 0.55,
  )
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.lineWidth = 4
  ctx.globalAlpha = 0.85
  ctx.strokeStyle = '#dfe8c8'
  ctx.stroke()
  ctx.globalAlpha = 1

  const map = makeCanvasTexture(canvas)

  const rough = makeDataRoughness(256, 128, (u, v) => {
    const fuzz = 0.78 + 0.18 * Math.sin(u * 180 + v * 90)
    const seamCurve = Math.abs(Math.sin((u * 0.9 + v * 0.55) * Math.PI * 2.1)) > 0.965 ? 0.35 : fuzz
    return seamCurve
  })

  const bump = makeDataRoughness(256, 128, (u, v) => {
    const felt = 0.52 + 0.38 * Math.sin(u * 200 + v * 130)
    const seamCurve = Math.abs(Math.sin((u * 0.9 + v * 0.55) * Math.PI * 2.1)) > 0.965 ? 0.08 : felt
    return seamCurve
  })

  return { map, roughnessMap: rough, bumpMap: bump }
}
