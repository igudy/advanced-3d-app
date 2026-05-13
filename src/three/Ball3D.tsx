import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useFBX, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { scroll } from '../hooks/scrollSignal'
import { easeInOutCubic, sampleScrollPath } from '../lib/ballChoreography'
import { pickFocalSurfaceKey } from '../lib/focalSurface'
import { BasketballOBJLoader } from './BasketballOBJLoader'

/**
 * Seamless sport ball morph.
 *
 * Cross-fade curves (global scroll progress `p`):
 *   0.00–0.35 soccer
 *   0.32–0.62 basketball
 *   0.62–1.00 tennis
 *
 * **The Greats beat:** while `#the-greats` is the focal band, all three balls
 * unify to full opacity and spread in a shallow arc; scrolling into
 * `#football-prelude` merges them back to the soccer-only state, then the
 * normal cross-fade resumes — no hard cuts.
 *
 * Position / spin follow `sampleScrollPath(scroll.progress)`; per-ball offsets
 * are layered only during the Greats / merge window.
 */

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

/**
 * Global `scroll.progress` is document fraction — it often runs ahead of the
 * visible narrative band. Cross-fade opacities follow the focal surface so we
 * do not flash basketball/tennis behind soccer after the Greats triple merges.
 */
function morphProgressForBallOpacity(p: number, surfaceKey: string | null): number {
  switch (surfaceKey) {
    case 'hero':
    case 'football':
      return Math.min(p, 0.31)
    case 'basketball':
      return Math.min(Math.max(p, 0.28), 0.68)
    case 'tennis':
      return Math.max(p, 0.58)
    case 'stats':
    case 'outro':
    default:
      return p
  }
}

/** Focal line vs #the-greats + #football-prelude — triple showcase + merge to soccer. */
function readGreatsScrollState(): { triple: number; merge: number } {
  const greatsEl = document.getElementById('the-greats')
  const preludeEl = document.getElementById('football-prelude')
  if (!greatsEl || !preludeEl || typeof window === 'undefined') {
    return { triple: 0, merge: 0 }
  }

  const vh = window.innerHeight
  const fy = vh * 0.42
  const gr = greatsEl.getBoundingClientRect()
  const pr = preludeEl.getBoundingClientRect()

  const mergeStart = gr.bottom - vh * 0.1
  const mergeEnd = pr.top + vh * 0.46
  let mergeT = 0
  if (fy >= mergeStart) {
    mergeT = smoothstep(mergeStart, mergeEnd, fy)
  }
  mergeT = Math.min(1, Math.max(0, mergeT))
  const mergeE = easeInOutCubic(mergeT)

  let tripleT = 0
  const inGreatsBand = fy >= gr.top - vh * 0.1 && fy <= gr.bottom + vh * 0.14
  if (inGreatsBand) {
    const mid = (gr.top + gr.bottom) * 0.5
    const denom = Math.max(gr.height * 0.52, vh * 0.14)
    const d = Math.abs(fy - mid) / denom
    tripleT = (1 - smoothstep(0.22, 1.02, d)) * (1 - mergeE * 0.94)
  } else if (fy > gr.bottom - vh * 0.08 && mergeT > 0 && mergeT < 1) {
    tripleT = (1 - mergeE) * 0.88
  }

  tripleT = Math.min(1, Math.max(0, tripleT))
  return { triple: tripleT, merge: mergeT }
}

function damp(current: number, target: number, lambda: number, delta: number) {
  const k = 1 - Math.exp(-lambda * delta)
  return current + (target - current) * Math.min(1, k)
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

function cloneTex(t: THREE.Texture): THREE.Texture {
  const c = t.clone()
  c.needsUpdate = true
  return c
}

/**
 * GLTF tennis (Sketchfab) — clone maps per mesh like soccer/basketball so
 * disposals / cross-fades never share loader-owned textures.
 */
function buildTennisFromGltf(scene: THREE.Object3D) {
  const model = scene.clone(true)
  model.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh) return
    const raw = mesh.material
    const list = Array.isArray(raw) ? raw : [raw]
    const next: THREE.Material[] = []
    for (const m of list) {
      if (!m) continue
      const std = m as THREE.MeshStandardMaterial
      if (!std.isMeshStandardMaterial && !(m as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial) {
        next.push(m as THREE.Material)
        continue
      }
      const mat = m as THREE.MeshStandardMaterial
      const nm = mat.clone()
      if (nm.map) {
        nm.map = cloneTex(nm.map)
        nm.map.colorSpace = THREE.SRGBColorSpace
        nm.map.anisotropy = 8
      }
      if (nm.normalMap) {
        nm.normalMap = cloneTex(nm.normalMap)
        nm.normalMap.colorSpace = THREE.NoColorSpace
        nm.normalMap.anisotropy = 8
      }
      const orm = nm.metalnessMap ?? nm.roughnessMap
      if (orm) {
        const t = cloneTex(orm)
        t.colorSpace = THREE.NoColorSpace
        t.anisotropy = 8
        nm.metalnessMap = t
        nm.roughnessMap = t
      }
      if (nm.aoMap) {
        nm.aoMap = cloneTex(nm.aoMap)
        nm.aoMap.colorSpace = THREE.NoColorSpace
        nm.aoMap.anisotropy = 8
      }
      nm.metalness = Math.min(1, nm.metalness)
      nm.roughness = Math.min(1, Math.max(0, nm.roughness))
      nm.envMapIntensity = 0.48
      nm.transparent = true
      nm.depthWrite = true
      next.push(nm)
    }
    mesh.material = next.length === 1 ? next[0]! : next
  })
  normalize(model, 1.46)
  return model
}

function useTennis() {
  const gltf = useGLTF('/models/tennis_ball/scene.gltf')
  return useMemo(() => buildTennisFromGltf(gltf.scene), [gltf.scene])
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
  const hitRef = useRef<THREE.Mesh>(null!)
  const spinRef = useRef(0)
  const rollImpulse = useRef(0)
  const dragging = useRef(false)
  const lastClientX = useRef(0)
  const tripleSm = useRef(0)
  const mergeSm = useRef(0)
  const { viewport, gl } = useThree()
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const soccer = useSoccer()
  const basket = useBasketball()
  const tennis = useTennis()

  useEffect(() => {
    const el = gl.domElement
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - lastClientX.current
      lastClientX.current = e.clientX
      rollImpulse.current += dx * 0.012
      rollImpulse.current = Math.max(-0.32, Math.min(0.32, rollImpulse.current))
    }
    const onUp = () => {
      dragging.current = false
      el.style.cursor = ''
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [gl])

  useFrame((state, delta) => {
    if (!group.current) return

    const p = scroll.progress
    const wp = sampleScrollPath(p)

    const { triple: tripleTarget, merge: mergeTarget } = readGreatsScrollState()
    tripleSm.current = damp(tripleSm.current, tripleTarget, 11, delta)
    mergeSm.current = damp(mergeSm.current, mergeTarget, 13, delta)
    const triple = tripleSm.current
    const merge = mergeSm.current
    const mergeE = easeInOutCubic(merge)
    let spread = triple * (1 - mergeE)
    /** Kill damped tail once merge intent is done — avoids one-frame ghost stack */
    if (mergeTarget > 0.97 && spread < 0.05) spread = 0

    const surfaceKey = pickFocalSurfaceKey()
    const pOpacity = morphProgressForBallOpacity(p, surfaceKey)

    const halfW = (viewport.width / 2) * 0.85
    const halfH = (viewport.height / 2) * 0.85
    const zScale = halfW * 0.55

    /** Sit the triple cluster over the left “visual” column on the Greats screen */
    const tripleBiasX = -spread * halfW * 0.05 * Math.min(1, viewport.width / 9)
    tmp.set(wp.pos[0] * halfW + tripleBiasX, wp.pos[1] * halfH, wp.pos[2] * zScale)
    group.current.position.lerp(tmp, 0.14)
    group.current.position.y += Math.sin(state.clock.elapsedTime * 1.25) * 0.025 * (1 - spread * 0.55)

    rollImpulse.current *= Math.exp(-delta * 5.2)
    const roll = rollImpulse.current
    spinRef.current += delta * 0.5 + scroll.velocity * 18 + roll * 38 * delta

    const r = group.current.rotation
    r.x += (wp.rot[0] - r.x) * 0.1
    r.y = wp.rot[1] + spinRef.current
    r.z += (wp.rot[2] - r.z) * 0.1

    const parallax = dragging.current ? 0 : 1
    r.x += state.pointer.y * 0.004 * parallax * (1 - spread * 0.45)
    r.z += -state.pointer.x * 0.004 * parallax * (1 - spread * 0.45)

    const fit = Math.min(1, viewport.width / 3.5)
    /** Pull parent scale down a bit when triple is wide so the row fits the viewport */
    const triplePack = 1 - spread * 0.22
    const s = wp.scale * fit * triplePack
    group.current.scale.setScalar(s)

    const baseSoc = soccerOpacity(pOpacity)
    const baseBas = basketOpacity(pOpacity)
    const baseTen = tennisOpacity(pOpacity)
    const showAll = spread
    const oSoc = baseSoc + (1 - baseSoc) * showAll
    const oBas = baseBas + (1 - baseBas) * showAll
    const oTen = baseTen + (1 - baseTen) * showAll

    setOpacity(soccerRef.current, oSoc)
    setOpacity(basketRef.current, oBas)
    setOpacity(tennisRef.current, oTen)

    /**
     * Center-to-center spacing in **parent local space** (before parent scale).
     * Balls are ~1.5–1.7 units wide after normalize — old ~0.34 offset kept them
     * stacked as one blob; ~1.2+ reads as three distinct spheres.
     */
    const row = spread * (1.22 + Math.min(0.5, viewport.width * 0.024))
    if (soccerRef.current && basketRef.current && tennisRef.current) {
      soccerRef.current.position.set(-row, 0.08 * spread, -0.22 * spread)
      basketRef.current.position.set(0, -0.06 * spread, 0.08 * spread)
      tennisRef.current.position.set(row, 0.05 * spread, 0.24 * spread)

      const sway = Math.sin(state.clock.elapsedTime * 1.05) * 0.028 * spread
      soccerRef.current.rotation.set(sway * 0.45, 0.14 * spread, -sway * 0.28)
      basketRef.current.rotation.set(-sway * 0.35, -0.1 * spread, sway * 0.18)
      tennisRef.current.rotation.set(sway * 0.38, 0.12 * spread, sway * 0.32)

      const eachSc = 0.56 + 0.44 * (1 - spread * 0.9)
      soccerRef.current.scale.setScalar(eachSc)
      basketRef.current.scale.setScalar(eachSc)
      tennisRef.current.scale.setScalar(eachSc)
    }

    if (hitRef.current) {
      const hitScale = 0.98 + 0.55 * spread * (1 - mergeE * 0.82)
      hitRef.current.scale.setScalar(hitScale)
    }
  })

  return (
    <group ref={group}>
      <mesh
        ref={hitRef}
        onPointerDown={(e) => {
          e.stopPropagation()
          dragging.current = true
          lastClientX.current = e.clientX
          gl.domElement.style.cursor = 'grabbing'
          try {
            gl.domElement.setPointerCapture(e.pointerId)
          } catch {
            /* ignore */
          }
        }}
        onPointerUp={(e) => {
          dragging.current = false
          gl.domElement.style.cursor = ''
          try {
            gl.domElement.releasePointerCapture(e.pointerId)
          } catch {
            /* ignore */
          }
        }}
        onPointerOver={() => {
          if (!dragging.current) gl.domElement.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          if (!dragging.current) gl.domElement.style.cursor = ''
        }}
      >
        <sphereGeometry args={[0.98, 56, 56]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
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
useGLTF.preload('/models/tennis_ball/scene.gltf')
