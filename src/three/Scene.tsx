import { Suspense, useEffect, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Environment, useProgress } from '@react-three/drei'
import { Ball3D } from './Ball3D'

function ProgressBroadcast() {
  const { progress, active } = useProgress()
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('scene-assets', {
        detail: { progress, active },
      }),
    )
  }, [progress, active])
  return null
}

/**
 * Stage for the three sport balls.
 *  - Camera at z=5.0 so a ~1.6u ball fills ~45% of viewport.
 *  - Inner <Suspense> for the HDRI; while it streams in, the ball still renders
 *    with explicit lights so nothing pops in/out.
 *  - <Ball3D> has its own <Suspense> so FBX/OBJ/MTL loads do not replace the entire
 *    Canvas (App still wraps <Scene /> in Suspense for the lazy chunk + HDRI).
 */
export function Scene() {
  useLayoutEffect(() => {
    window.dispatchEvent(new CustomEvent('scene-mounted'))
  }, [])

  return (
    <Canvas
      className="scene-canvas"
      camera={{ position: [0, 0, 5.0], fov: 35 }}
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      shadows={false}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <ProgressBroadcast />

      <ambientLight intensity={0.4} color="#fff6dc" />
      <directionalLight position={[5, 6, 4]} intensity={1.5} color="#fff0d6" />
      <directionalLight position={[-4, 2, 2]} intensity={0.6} color="#a5b8ff" />
      <directionalLight position={[0, -3, -2]} intensity={0.5} color="#ffe51f" />
      <hemisphereLight args={['#ffe5cc', '#0a0a0a', 0.3]} />

      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.55} />
      </Suspense>

      {/*
        Ball loads last (FBX + MTL/OBJ + canvas textures). If this suspends at the
        same boundary as <Scene />, the whole Canvas is replaced by App’s fallback
        and nothing draws. Keep suspense local so lights + clear still run.
      */}
      <Suspense fallback={null}>
        <Ball3D />
      </Suspense>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  )
}
