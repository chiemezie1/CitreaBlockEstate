import AnimatedSection from '@/components/AnimatedSection'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <AnimatedSection className="container mx-auto px-4 py-12 text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Privacy Policy</h1>
      <div className="prose prose-lg prose-invert max-w-none">
        <p>
          At RealEstateToken, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">1. Information We Collect</h2>
        <p>
          We collect the following types of information:
        </p>
        <ul>
          <li>Personal Information: Name, email address, phone number, and wallet address</li>
          <li>Identity Verification Information: Government-issued ID, proof of address</li>
          <li>Financial Information: Transaction history on our platform</li>
          <li>Usage Data: Information on how you interact with our platform</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">2. How We Use Your Information</h2>
        <p>
          We use your information for the following purposes:
        </p>
        <ul>
          <li>To provide and maintain our services</li>
          <li>To process transactions and send transaction notifications</li>
          <li>To comply with legal and regulatory requirements</li>
          <li>To improve our platform and user experience</li>
          <li>To communicate with you about our services, updates, and promotions</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">3. Data Security</h2>
        <p>
          We implement robust security measures to protect your data, including:
        </p>
        <ul>
          <li>Encryption of sensitive information</li>
          <li>Regular security audits and penetration testing</li>
          <li>Strict access controls for our employees</li>
          <li>Compliance with industry-standard security protocols</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">4. Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information. We may share your data with:
        </p>
        <ul>
          <li>Service providers who assist us in operating our platform</li>
          <li>Legal and regulatory authorities when required by law</li>
          <li>Other users, only with your explicit consent (e.g., for transaction purposes)</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">5. Your Rights and Choices</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access and update your personal information</li>
          <li>Request deletion of your data (subject to legal requirements)</li>
          <li>Opt-out of marketing communications</li>
          <li>Object to the processing of your data in certain circumstances</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your experience on our platform. You can manage your cookie preferences through your browser settings.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-300">8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p>
          Email: <a href="mailto:privacy@realestatetoken.com" className="text-blue-400 hover:underline">privacy@realestatetoken.com</a>
        </p>

        <p className="mt-4">
          Last updated: [Current Date]
        </p>

        <div className="mt-8">
          <Link href="/legal" className="text-blue-400 hover:underline">&larr; Back to Legal Information</Link>
        </div>
      </div>
    </AnimatedSection>
  )
}

