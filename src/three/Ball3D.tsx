import { useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useFBX, useTexture } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'
import { scroll } from '../hooks/scrollSignal'
import { BasketballOBJLoader } from './BasketballOBJLoader'
import { createTennisTextures } from './proceduralBallTextures'

/**
 * Seamless sport ball morph.
 *
 * Three GLTF/OBJ/FBX models live at the same world position. Their material
 * opacity is driven by scroll progress so one fades out exactly as the next
 * fades in — a smooth handoff with no jump-cuts.
 *
 *   progress  ball
 *   ───────── ────────────
 *   0.00–0.35 soccer
 *   0.32–0.62 basketball
 *   0.62–1.00 tennis
 *
 * Position / rotation / spin follow a single choreographed path (not ping‑pong X).
 */

/* ------------------------------------------------------------------
   Scroll choreography — one continuous story in screen space
   ------------------------------------------------------------------
   Rough beats vs scroll progress:
     0.00–0.32  Football — enter from deep right, arc up‑field, hold high read
     0.32–0.62  Basketball — dive to the paint, pocket under the rim, push up
     0.62–0.92  Tennis — open stance left, topspin apex, cross‑court fade
     0.92–1.00  Outro — fall to footer

   Position uses a centripetal Catmull–Rom curve (smooth, no hard zig‑zags).
   Rotation / scale still key off the same milestones for readable silhouettes.
   ------------------------------------------------------------------ */

type Waypoint = {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: number
}

type ScrollKey = { t: number } & Waypoint

const SCROLL_KEYS: ScrollKey[] = [
  /* Hero — ball rides in from the wing, low, then climbs */
  { t: 0.0, pos: [0.62, -0.04, 0.08], rot: [0.14, 0.42, -0.06], scale: 1.0 },
  { t: 0.1, pos: [0.38, 0.12, 0.22], rot: [0.2, 1.05, -0.09], scale: 0.99 },
  /* Football chapter — long carry toward upper field, slight drift toward camera */
  { t: 0.22, pos: [0.02, 0.22, 0.34], rot: [0.22, 2.05, 0.02], scale: 0.98 },
  { t: 0.32, pos: [-0.32, 0.16, 0.28], rot: [0.2, 2.95, 0.06], scale: 0.96 },
  /* Handoff — settle center‑high before the hardwood drop */
  { t: 0.38, pos: [0.06, 0.12, 0.18], rot: [0.24, 3.55, -0.04], scale: 0.95 },
  /* Basketball — drive baseline right, sink into the paint */
  { t: 0.5, pos: [0.46, -0.2, 0.12], rot: [0.28, 4.45, 0.08], scale: 0.93 },
  { t: 0.58, pos: [0.08, -0.34, 0.04], rot: [0.22, 5.35, -0.05], scale: 0.91 },
  /* Tennis — open on the ad side, lob apex, then cut across */
  { t: 0.68, pos: [-0.4, 0.02, -0.06], rot: [0.2, 6.35, 0.09], scale: 0.89 },
  { t: 0.78, pos: [0.28, 0.2, -0.12], rot: [0.16, 7.25, -0.04], scale: 0.87 },
  { t: 0.88, pos: [-0.12, -0.38, 0.02], rot: [0.18, 8.35, 0.03], scale: 0.85 },
  /* Footer — rest on the baseline */
  { t: 1.0, pos: [0.0, -1.12, 0.0], rot: [0.12, 9.25, 0.0], scale: 0.84 },
]

const POSITION_CURVE = new THREE.CatmullRomCurve3(
  SCROLL_KEYS.map((k) => new THREE.Vector3(k.pos[0], k.pos[1], k.pos[2])),
  false,
  'centripetal',
  0.42,
)

function easeInOutCubic(local: number): number {
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

function sample(t: number): Waypoint {
  const u = Math.min(1, Math.max(0, t))
  const p = POSITION_CURVE.getPoint(u)
  const { rot, scale } = sampleRotScale(u)
  return {
    pos: [p.x, p.y, p.z],
    rot,
    scale,
  }
}

/* ------------------------------------------------------------------
   Cross-fade curves
   ------------------------------------------------------------------ */

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function soccerOpacity(p: number): number {
  return 1 - smoothstep(0.3, 0.4, p)
}
function basketOpacity(p: number): number {
  return smoothstep(0.3, 0.4, p) * (1 - smoothstep(0.58, 0.66, p))
}
function tennisOpacity(p: number): number {
  return smoothstep(0.58, 0.66, p)
}

/* ------------------------------------------------------------------
   Model loaders — center, scale, swap materials
   ------------------------------------------------------------------ */

const TARGET_SIZE = 1.6

function normalize(obj: THREE.Object3D, target = TARGET_SIZE) {
  const box = new THREE.Box3().setFromObject(obj)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const k = target / maxDim
  obj.scale.setScalar(k)
  obj.position.set(-center.x * k, -center.y * k, -center.z * k)
}

function useSoccer() {
  const fbx = useFBX('/models/soccer_ball/football.fbx')
  const baseColor = useTexture('/models/soccer_ball/textures/football_ball_BaseColor.png')
  const normalMap = useTexture('/models/soccer_ball/textures/football_ball_Normal.png')
  const roughnessMap = useTexture('/models/soccer_ball/textures/football_ball_Roughness.png')

  return useMemo(() => {
    const model = fbx.clone(true)

    /**
     * Clone texture instances per material build. When R3F / three dispose an
     * older primitive’s materials (e.g. StrictMode remount or dependency churn),
     * disposing a shared loader texture nukes every active material — maps vanish.
     */
    const map = baseColor.clone()
    const normal = normalMap.clone()
    const rough = roughnessMap.clone()

    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    map.needsUpdate = true

    normal.colorSpace = THREE.NoColorSpace
    normal.anisotropy = 8
    normal.needsUpdate = true

    rough.colorSpace = THREE.NoColorSpace
    rough.anisotropy = 8
    rough.needsUpdate = true

    model.traverse((c) => {
      const m = c as THREE.Mesh
      if (m.isMesh) {
        m.material = new THREE.MeshPhysicalMaterial({
          map,
          normalMap: normal,
          roughnessMap: rough,
          roughness: 1.0,
          metalness: 0.0,
          clearcoat: 0.2,
          clearcoatRoughness: 0.45,
          envMapIntensity: 0.7,
          transparent: true,
          depthWrite: true,
        })
      }
    })

    normalize(model, 1.7)
    return model
  }, [fbx, baseColor, normalMap, roughnessMap])
}

function useBasketball() {
  const obj = useLoader(BasketballOBJLoader, '/models/basketball/basketball.obj') as THREE.Object3D

  return useMemo(() => {
    const model = obj.clone(true)
    normalize(model, 1.55)
    return model
  }, [obj])
}

function useTennis() {
  const obj = useLoader(OBJLoader, '/models/tennis_ball/tennisball.obj')

  return useMemo(() => {
    const { map, roughnessMap, bumpMap } = createTennisTextures()
    const model = obj.clone(true)
    model.traverse((c) => {
      const m = c as THREE.Mesh
      if (m.isMesh) {
        m.material = new THREE.MeshPhysicalMaterial({
          map,
          roughnessMap,
          bumpMap,
          bumpScale: 0.022,
          color: '#ffffff',
          roughness: 1.0,
          metalness: 0,
          sheen: 1,
          sheenColor: '#fff8c8',
          sheenRoughness: 0.82,
          clearcoat: 0.08,
          clearcoatRoughness: 0.55,
          envMapIntensity: 0.58,
          transparent: true,
          depthWrite: true,
        })
      }
    })
    normalize(model, 1.4)
    return model
  }, [obj])
}

/* ------------------------------------------------------------------
   Opacity helper — sets material.opacity recursively
   ------------------------------------------------------------------ */

function setOpacity(group: THREE.Object3D | null, opacity: number) {
  if (!group) return
  group.visible = opacity > 0.01
  group.traverse((c) => {
    const m = (c as THREE.Mesh).material
    if (!m) return
    if (Array.isArray(m)) {
      for (const mat of m) (mat as THREE.Material & { opacity: number }).opacity = opacity
    } else {
      ;(m as THREE.Material & { opacity: number }).opacity = opacity
    }
  })
}

/* ------------------------------------------------------------------
   Main component
   ------------------------------------------------------------------ */

export function Ball3D() {
  const group = useRef<THREE.Group>(null!)
  const soccerRef = useRef<THREE.Group>(null!)
  const basketRef = useRef<THREE.Group>(null!)
  const tennisRef = useRef<THREE.Group>(null!)
  const spinRef = useRef(0)
  const { viewport } = useThree()
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const soccer = useSoccer()
  const basket = useBasketball()
  const tennis = useTennis()

  useFrame((state, delta) => {
    if (!group.current) return

    const p = scroll.progress
    const wp = sample(p)

    const halfW = (viewport.width / 2) * 0.85
    const halfH = (viewport.height / 2) * 0.85
    const zScale = halfW * 0.55

    tmp.set(wp.pos[0] * halfW, wp.pos[1] * halfH, wp.pos[2] * zScale)
    group.current.position.lerp(tmp, 0.14)
    group.current.position.y += Math.sin(state.clock.elapsedTime * 1.25) * 0.025

    // Spin: continuous + scroll-velocity boost
    spinRef.current += delta * 0.5 + scroll.velocity * 18

    const r = group.current.rotation
    r.x += (wp.rot[0] - r.x) * 0.1
    r.y = wp.rot[1] + spinRef.current
    r.z += (wp.rot[2] - r.z) * 0.1

    // Pointer parallax
    r.x += state.pointer.y * 0.004
    r.z += -state.pointer.x * 0.004

    const fit = Math.min(1, viewport.width / 3.5)
    const s = wp.scale * fit
    group.current.scale.setScalar(s)

    // Cross-fade between balls
    setOpacity(soccerRef.current, soccerOpacity(p))
    setOpacity(basketRef.current, basketOpacity(p))
    setOpacity(tennisRef.current, tennisOpacity(p))
  })

  return (
    <group ref={group}>
      <group ref={soccerRef}>
        <primitive object={soccer} />
      </group>
      <group ref={basketRef}>
        <primitive object={basket} />
      </group>
      <group ref={tennisRef}>
        <primitive object={tennis} />
      </group>
    </group>
  )
}

/* Preload so the network requests start as soon as Scene is mounted. */
useFBX.preload('/models/soccer_ball/football.fbx')
useTexture.preload('/models/soccer_ball/textures/football_ball_BaseColor.png')
useTexture.preload('/models/soccer_ball/textures/football_ball_Normal.png')
useTexture.preload('/models/soccer_ball/textures/football_ball_Roughness.png')
