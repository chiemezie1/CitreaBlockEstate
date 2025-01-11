'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/AnimatedSection'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "What is RealEstateToken?",
    answer: "RealEstateToken is a blockchain-based platform that allows users to tokenize real estate, manage ownership rights, and transfer properties securely. We leverage blockchain technology to make real estate investment more accessible, transparent, and efficient."
  },
  {
    question: "How does tokenized real estate work?",
    answer: "Tokenized real estate refers to the conversion of property ownership into digital tokens on the blockchain. These tokens represent fractional ownership of a property and can be easily bought, sold, or transferred. This allows for increased liquidity and accessibility in real estate investments."
  },
  {
    question: "How do I transfer property using RealEstateToken?",
    answer: "To transfer property on RealEstateToken, you need to connect your blockchain wallet, verify your ownership, and use our secure smart contract system. The process is straightforward: select the property token you wish to transfer, specify the recipient's wallet address, and confirm the transaction."
  },
  {
    question: "What happens if I lose my wallet key?",
    answer: "Your wallet key is crucial for accessing your property tokens. Always store it securely, as RealEstateToken cannot recover lost keys. We recommend using hardware wallets or secure key management solutions to protect your assets."
  },
  {
    question: "Are there any transaction fees?",
    answer: "Yes, there are minimal fees charged to cover blockchain gas costs. These fees are transparently displayed during the transaction process. The exact amount may vary depending on network congestion and the complexity of the transaction."
  },
  {
    question: "How is my data protected?",
    answer: "We take data security very seriously. RealEstateToken uses state-of-the-art encryption and follows strict data protection policies. All personal information is stored securely, and we adhere to best practices in cybersecurity to protect your data and assets."
  }
]

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <AnimatedSection className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
            <button
              className="w-full text-left p-4 focus:outline-none"
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-blue-300">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-blue-400 transform transition-transform duration-200 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="p-4 text-gray-300">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </AnimatedSection>
  )
}

