import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scroll } from '../hooks/scrollSignal'
import { ballState } from '../store/ballSignal'

/**
 * American football — prolate spheroid w/ glossy+rough PBR (clearcoat on
 * roughened leather). Travels through scroll-driven waypoints.
 *
 * Waypoint coordinates are **normalized** to [-1, 1]:
 *   x = -1 (left edge), +1 (right edge of visible canvas)
 *   y = -1 (bottom edge), +1 (top edge)
 * The Football multiplies these by viewport.width/2 and viewport.height/2 at
 * runtime so the ball always lands at the *relative* edge regardless of
 * aspect ratio (mobile portrait, tablet, desktop).
 */

type Waypoint = {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: number
}

// 6 sections, each ≈ 1/6 of scroll. Waypoints anchored at the *center* of
// each section's scroll range so the ball settles when the section is in view.
const WAYPOINTS: Array<{ t: number } & Waypoint> = [
  { t: 0.00, pos: [ 0.08,  0.18, 0], rot: [0.35, 0.55, -0.15], scale: 1.00 }, // Hero
  { t: 0.18, pos: [ 0.72,  0.04, 0], rot: [0.55, 1.10, -0.30], scale: 0.95 }, // Specs (right)
  { t: 0.36, pos: [-0.68, -0.08, 0], rot: [0.30, 2.10, -0.05], scale: 0.92 }, // Customize (left)
  { t: 0.55, pos: [-0.62, -0.30, 0], rot: [0.65, 3.20, -0.45], scale: 0.92 }, // Materials (left)
  { t: 0.75, pos: [ 0.00,  0.55, 0], rot: [0.40, 4.10,  0.10], scale: 0.88 }, // Contacts (top center, between heading + form)
  { t: 1.00, pos: [ 0.00, -1.10, 0], rot: [0.20, 4.90,  0.00], scale: 0.85 }, // CTA (drops out)
]

function sampleWaypoints(t: number): Waypoint {
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const a = WAYPOINTS[i]
    const b = WAYPOINTS[i + 1]
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t
      const local = span > 0 ? (t - a.t) / span : 0
      // easeInOutCubic for smooth section-to-section transitions
      const e =
        local < 0.5
          ? 4 * local * local * local
          : 1 - Math.pow(-2 * local + 2, 3) / 2
      return {
        pos: [
          a.pos[0] + (b.pos[0] - a.pos[0]) * e,
          a.pos[1] + (b.pos[1] - a.pos[1]) * e,
          a.pos[2] + (b.pos[2] - a.pos[2]) * e,
        ],
        rot: [
          a.rot[0] + (b.rot[0] - a.rot[0]) * e,
          a.rot[1] + (b.rot[1] - a.rot[1]) * e,
          a.rot[2] + (b.rot[2] - a.rot[2]) * e,
        ],
        scale: a.scale + (b.scale - a.scale) * e,
      }
    }
  }
  return WAYPOINTS[WAYPOINTS.length - 1]
}

export function Football() {
  const group = useRef<THREE.Group>(null!)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!)
  const spinRef = useRef(0)
  const { viewport } = useThree()

  // Pre-allocated to avoid GC churn each frame.
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const targetColor = useMemo(() => new THREE.Color('#4a1f10'), [])

  useFrame((state, delta) => {
    if (!group.current) return

    const wp = sampleWaypoints(scroll.progress)

    // Remap normalized waypoint (-1..1) into world units using current viewport.
    // Pull edges in slightly so the ball never clips into the orange frame.
    const halfW = (viewport.width / 2) * 0.85
    const halfH = (viewport.height / 2) * 0.85

    tmp.set(wp.pos[0] * halfW, wp.pos[1] * halfH, wp.pos[2])
    group.current.position.lerp(tmp, 0.12)

    // Idle bob layered on top
    group.current.position.y += Math.sin(state.clock.elapsedTime * 1.4) * 0.04

    // Spin: continuous + scroll-velocity boost
    spinRef.current += delta * 0.45 + scroll.velocity * 18

    // Rotation — lerp toward waypoint and add continuous spin on Y
    const r = group.current.rotation
    r.x += (wp.rot[0] - r.x) * 0.1
    r.y = wp.rot[1] + spinRef.current
    r.z += (wp.rot[2] - r.z) * 0.1

    // Pointer parallax — tiny, layered on top
    const mx = state.pointer.x * 0.08
    const my = state.pointer.y * 0.08
    r.x += my * 0.05
    r.z += -mx * 0.05

    // Scale: shrink with narrow viewports so the football never dominates.
    // viewport.width on a 1440px desktop ≈ 4.3 units; on a 375px phone ≈ 1.1.
    const fit = Math.min(1, viewport.width / 3.5)
    const s = wp.scale * fit
    group.current.scale.set(s, s, s)

    // Color lerp — driven by Customize swatches / variant carousel
    if (materialRef.current) {
      targetColor.set(ballState.color)
      materialRef.current.color.lerp(targetColor, 0.08)
    }
  })

  return (
    <group ref={group}>
      {/* Body — sphere scaled into a prolate spheroid */}
      <mesh scale={[0.78, 0.78, 1.25]}>
        <sphereGeometry args={[1, 96, 64]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#4a1f10"
          roughness={0.78}
          metalness={0.02}
          clearcoat={0.9}
          clearcoatRoughness={0.18}
          sheen={0.5}
          sheenColor="#8a3a1c"
          sheenRoughness={0.55}
          envMapIntensity={0}
        />
      </mesh>

      {/* Long-axis seam */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.014, 12, 200]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>

      {/* White laces — 4 cross-stitches at top */}
      {[-0.18, -0.06, 0.06, 0.18].map((z) => (
        <mesh key={z} position={[0, 0.79, z]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.02, 0.16, 6, 12]} />
          <meshPhysicalMaterial
            color="#fff8e7"
            roughness={0.55}
            clearcoat={0.4}
            clearcoatRoughness={0.5}
          />
        </mesh>
      ))}

      {/* Laces center spine */}
      <mesh position={[0, 0.79, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.013, 0.52, 6, 12]} />
        <meshStandardMaterial color="#fff8e7" roughness={0.6} />
      </mesh>
    </group>
  )
}
