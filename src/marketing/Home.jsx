import { Hero, SocialProof, Features, HowItWorks, Testimonials, FinalCta } from './sections'
import PricingSection from './PricingSection'
import FaqSection from './FaqSection'

export default function Home() {
  return (
    <main>
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </main>
  )
}