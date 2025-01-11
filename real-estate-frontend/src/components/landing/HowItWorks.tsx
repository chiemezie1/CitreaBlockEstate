'use client'

import { motion } from 'framer-motion'
import { Search, Shield, DollarSign, Key, BarChartIcon as ChartBar, Users } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Browse Properties',
    description: 'Explore a diverse range of tokenized real estate opportunities from around the world.',
  },
  {
    icon: Shield,
    title: 'Secure Ownership',
    description: 'Invest in properties using your blockchain wallet, ensuring transparent and secure transactions.',
  },
  {
    icon: Key,
    title: 'Manage Assets',
    description: 'Access your digital property portfolio and manage your assets with ease.',
  },
  {
    icon: DollarSign,
    title: 'Earn Rewards',
    description: 'Benefit from rental income distributions and potential property value appreciation.',
  },
  {
    icon: ChartBar,
    title: 'Track Performance',
    description: 'Monitor your investments in real-time with detailed analytics and market insights.',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    description: 'Participate in property-related decisions through decentralized voting mechanisms.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>
        <motion.p
          className="text-xl text-center mb-12 text-gray-600 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover how easy it is to invest in tokenized real estate with our streamlined process
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-lg p-6 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full z-0"></div>
              <div className="relative z-10">
                <div className="bg-blue-500 rounded-full p-4 inline-block mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
        </motion.div>
      </div>
    </section>
  )
}

