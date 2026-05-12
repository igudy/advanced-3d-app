import { Suspense } from 'react'
import { Frame } from './components/Frame'
import { Nav } from './components/Nav'
import { PromoVideo } from './components/PromoVideo'
import { VerticalText } from './components/VerticalText'
import { ProductFooter } from './components/ProductFooter'
import { Scene } from './three/Scene'
import './App.css'

function App() {
  return (
    <div className="app">
      <Frame />

      <div className="hero">
        <div className="ghost-word">SPADING</div>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      <div className="stage">
        <Nav />
        <PromoVideo />
        <VerticalText />
        <ProductFooter />
      </div>
    </div>
  )
}

export default App
