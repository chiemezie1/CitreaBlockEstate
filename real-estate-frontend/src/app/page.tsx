import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import FeaturedProperties from '@/components/landing/FeaturedProperties'
import Testimonials from '@/components/landing/Testimonials'
import AboutUs from '@/components/landing/AboutUs'
import CallToAction from '@/components/landing/CallToAction'

export default function LandingPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <FeaturedProperties />
      <Testimonials />
      <AboutUs />
      <CallToAction />
    </div>
  )
}

