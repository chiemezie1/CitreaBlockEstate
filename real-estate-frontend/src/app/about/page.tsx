import AnimatedSection from '@/components/AnimatedSection'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <AnimatedSection className="container mx-auto px-4 py-12 text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">About RealEstateToken</h1>
      <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
        <div className="prose prose-lg prose-invert">
          <p>
            RealEstateToken is at the forefront of revolutionizing the real estate industry through blockchain technology. Our mission is to democratize real estate investment, making it accessible, transparent, and efficient for everyone.
          </p>
          <p>
            Founded in 2024 by a team of real estate professionals and blockchain enthusiasts, RealEstateToken aims to bridge the gap between traditional real estate markets and the emerging world of decentralized finance (DeFi).
          </p>
        </div>
        <div className="relative h-64 md:h-full">
          <Image 
            src="/placeholder.svg?height=400&width=600" 
            alt="RealEstateToken Team" 
            layout="fill" 
            objectFit="cover" 
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-blue-300">Our Vision</h2>
        <p className="text-xl text-gray-300">
          We envision a future where anyone, anywhere, can invest in real estate with ease, security, and confidence. By tokenizing real estate assets, we're creating a more liquid and accessible market, opening up opportunities that were previously available only to a select few.
        </p>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-6 text-blue-300">What Sets Us Apart</h2>
        <ul className="grid md:grid-cols-2 gap-4">
          {[
            "Blockchain-powered transparency and security",
            "Fractional ownership opportunities",
            "Global access to real estate investments",
            "Streamlined, user-friendly platform",
            "Expert team with deep industry knowledge",
            "Continuous innovation in PropTech"
          ].map((item, index) => (
            <li key={index} className="flex items-center bg-gray-800 p-4 rounded-lg">
              <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  )
}

