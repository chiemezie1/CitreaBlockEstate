import AnimatedSection from '@/components/AnimatedSection'
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <AnimatedSection className="container mx-auto px-4 py-12 text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Terms of Service</h1>
      <div className="prose prose-lg prose-invert max-w-none">
        <p>
          Welcome to RealEstateToken. By using our services, you agree to be bound by the following Terms of Service. Please read them carefully.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the RealEstateToken platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">2. Description of Service</h2>
        <p>
          RealEstateToken provides a blockchain-based platform for tokenizing, managing, and transferring real estate assets. Our services include, but are not limited to:
        </p>
        <ul>
          <li>Property tokenization</li>
          <li>Token transfers and management</li>
          <li>Real estate investment opportunities</li>
          <li>Market analytics and insights</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">3. User Responsibilities</h2>
        <p>
          As a user of RealEstateToken, you are responsible for:
        </p>
        <ul>
          <li>Maintaining the security of your account and wallet</li>
          <li>Ensuring the accuracy of information provided</li>
          <li>Complying with all applicable laws and regulations</li>
          <li>Using the platform in good faith and not for any illegal or prohibited purposes</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">4. Intellectual Property</h2>
        <p>
          All content, features, and functionality of the RealEstateToken platform are owned by RealEstateToken and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">5. Limitation of Liability</h2>
        <p>
          RealEstateToken shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">6. Governing Law</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms of Service at any time. We will provide notice of any significant changes by posting the new Terms of Service on this page.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">8. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <p>
          Email: <a href="mailto:legal@realestatetoken.com" className="text-blue-400 hover:underline">legal@realestatetoken.com</a>
        </p>

        <div className="mt-8">
          <Link href="/legal" className="text-blue-400 hover:underline">&larr; Back to Legal Information</Link>
        </div>
      </div>
    </AnimatedSection>
  )
}

