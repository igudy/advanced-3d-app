import { PromoVideo } from '../components/PromoVideo'
import { VerticalText } from '../components/VerticalText'
import { ProductFooter } from '../components/ProductFooter'

export function Hero() {
  return (
    <section id="products" className="relative w-full h-screen overflow-hidden scroll-mt-24">
      <div className="ghost-word">WILSON</div>
      <PromoVideo />
      <VerticalText />
      <ProductFooter />
    </section>
  )
}
