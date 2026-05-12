import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Placeholder basketball — a smooth PBR sphere with two perpendicular seams.
 * Replace with procedural pebbled-leather shader via a follow-up prompt:
 *
 *   "Replace the placeholder MeshPhysicalMaterial in Basketball.tsx with a
 *    custom shader that adds FBM-noise-driven pebble displacement, normal,
 *    and roughness maps. ~2mm pebble scale on a 24cm ball. Fix only this."
 */
export function Basketball() {
  const group = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (!group.current) return
    // Idle Y rotation
    group.current.rotation.y += delta * 0.15
    // Subtle bob
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.05

    // Cursor parallax (±5°)
    const { x, y } = state.mouse
    const targetX = y * 0.087 // ~5deg
    const targetZ = -x * 0.087
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.05
  })

  return (
    <group ref={group}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhysicalMaterial
          color="#c8442a"
          roughness={0.72}
          metalness={0.05}
          clearcoat={0.15}
          clearcoatRoughness={0.6}
        />
      </mesh>

      {/* Seam — equator */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.001, 0.008, 16, 256]} />
        <meshStandardMaterial color="#1a0a06" roughness={0.9} />
      </mesh>

      {/* Seam — meridian */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.001, 0.008, 16, 256]} />
        <meshStandardMaterial color="#1a0a06" roughness={0.9} />
      </mesh>
    </group>
  )
}
