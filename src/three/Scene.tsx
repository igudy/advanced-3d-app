import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Basketball } from './Basketball'

export function Scene() {
  return (
    <Canvas
      className="canvas-wrap"
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Lighting per spec */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.2}
        color="#fff0d6"
      />
      <directionalLight position={[-4, 1, 2]} intensity={0.4} color="#9fb4ff" />
      <directionalLight position={[0, -3, -4]} intensity={0.6} color="#ffffff" />

      <Environment preset="studio" environmentIntensity={0.3} />

      <Basketball />
    </Canvas>
  )
}
