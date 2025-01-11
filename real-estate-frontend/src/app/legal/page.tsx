import AnimatedSection from '@/components/AnimatedSection'
import Link from 'next/link'

export default function LegalPage() {
  return (
    <AnimatedSection className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Legal Information</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-blue-300">Privacy Policy</h2>
          <p className="text-gray-300 mb-4">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
          </p>
          <h3 className="text-xl font-semibold mb-2 text-blue-200">What We Collect</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>Personal Information: Name, email, and wallet address</li>
            <li>Usage Data: Information on how you interact with our platform</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2 text-blue-200">How We Use Your Data</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>To improve user experience and provide personalized services</li>
            <li>To process transactions and enhance security</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2 text-blue-200">Sharing Information</h3>
          <p className="text-gray-300 mb-4">
            We do not sell or share your data with third parties, except as required by law or for transaction processing.
          </p>
          <Link href="/privacy-policy" className="text-blue-400 hover:underline">
            Read full Privacy Policy
          </Link>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6 text-blue-300">Terms of Service</h2>
          <p className="text-gray-300 mb-4">
            By using RealEstateToken, you agree to the following terms:
          </p>
          <h3 className="text-xl font-semibold mb-2 text-blue-200">General Terms</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>RealEstateToken provides tools for managing real estate on the blockchain</li>
            <li>Users are responsible for securing their wallet credentials</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2 text-blue-200">Prohibited Activities</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>Misuse of the platform for fraudulent or illegal purposes</li>
            <li>Attempting to breach security or tamper with smart contracts</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2 text-blue-200">Liability</h3>
          <p className="text-gray-300 mb-4">
            RealEstateToken is not responsible for lost keys or misuse of funds caused by user error.
          </p>
          <h3 className="text-xl font-semibold mb-2 text-blue-200">Updates</h3>
          <p className="text-gray-300 mb-4">
            We reserve the right to modify these terms. Users will be notified of any significant changes.
          </p>
          <Link href="/terms-of-service" className="text-blue-400 hover:underline">
            Read full Terms of Service
          </Link>
        </div>
      </div>
    </AnimatedSection>
  )
}

