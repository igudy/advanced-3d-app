import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { Football } from './Football'

/**
 * Performance + reliability:
 *   - NO <Environment> HDRI: avoided to prevent Suspense flicker (HDR
 *     fetched from a CDN can suspend the canvas and unmount the football
 *     mid-flight). Lighting is fully explicit below.
 *   - DPR capped at 1.5 (Retina at 3.0 is fragment-shader expensive).
 *   - AdaptiveDpr drops resolution under sustained load and recovers.
 *   - AdaptiveEvents throttles raycasting on movement.
 *   - shadows OFF — neubrutalist is flat; shadows would conflict aesthetically.
 *   - Fixed full-viewport — the canvas stays put while sections scroll past.
 */
export function Scene() {
  return (
    <Canvas
      className="scene-canvas"
      camera={{ position: [0, 0, 3.8], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      shadows={false}
    >
      <ambientLight intensity={0.5} color="#fff4d6" />

      {/* Key — warm top-right */}
      <directionalLight position={[5, 6, 4]} intensity={1.6} color="#fff0d6" />
      {/* Fill — cool left */}
      <directionalLight position={[-4, 1, 2]} intensity={0.6} color="#a5b8ff" />
      {/* Rim — yellow back to pop against orange bg */}
      <directionalLight position={[0, -2, -5]} intensity={0.9} color="#ffe51f" />

      <Football />

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  )
}
