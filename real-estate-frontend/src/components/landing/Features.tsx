'use client'

import { motion } from 'framer-motion'
import { Shield, Globe, Repeat, FileText, Zap, PieChart, Users, TrendingUp } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Blockchain-backed security ensures tamper-proof property transactions.',
  },
  {
    icon: FileText,
    title: 'Transparent Ownership',
    description: 'Verify property records instantly on a decentralized ledger.',
  },
  {
    icon: Repeat,
    title: 'Easy Transfers',
    description: 'Simplify property transfers with tokenized assets and smart contracts.',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Invest in properties worldwide, breaking geographical barriers.',
  },
  {
    icon: Zap,
    title: 'Instant Liquidity',
    description: 'Trade property tokens 24/7 with unprecedented market liquidity.',
  },
  {
    icon: PieChart,
    title: 'Fractional Ownership',
    description: 'Own a piece of premium real estate with minimal capital.',
  },
  {
    icon: Users,
    title: 'Community Governance',
    description: 'Participate in property decisions through decentralized voting.',
  },
  {
    icon: TrendingUp,
    title: 'Data-Driven Insights',
    description: 'Access real-time analytics for informed investment decisions.',
  },
]

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg"
    whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Icon className="w-12 h-12 text-blue-400 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function Features() {
  return (
    <AnimatedSection>
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Revolutionizing Real Estate
          </motion.h2>
          <motion.p
            className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience the future of property investment with our cutting-edge blockchain technology
          </motion.p>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </motion.div>
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button asChild size="lg" className="rounded-full">
              <Link href="/explore">
                Start Investing Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </AnimatedSection>
  )
}

