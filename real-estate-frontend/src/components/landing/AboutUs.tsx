'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Users, DollarSign, Globe } from 'lucide-react'
import { motion, useInView, useAnimation } from 'framer-motion'

const teamMembers = [
  { name: 'Agbo chiemezie', role: 'CEO & Founder', image: '/Agbo_chiemezie.png?height=400&width=400' },
  { name: 'Bob Smith', role: 'CTO', image: '/placeholder.svg?height=400&width=400' },
  { name: 'Carol Williams', role: 'Head of Operations', image: '/placeholder.svg?height=400&width=400' },
]

const stats = [
  { icon: Users, value: '10,000+', label: 'Active Users' },
  { icon: DollarSign, value: '$500M+', label: 'Total Value Locked' },
  { icon: Globe, value: '50+', label: 'Countries Served' },
]

export default function AboutUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible')
    }
  }, [isInView, mainControls])

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={mainControls}
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h2 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">About Us</h2>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Web3 Estate is revolutionizing the real estate industry by leveraging blockchain technology to create a more transparent, secure, and efficient property management ecosystem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                  whileHover={{ y: -5 }}
                >
                  <stat.icon className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{stat.value}</h3>
                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          initial="hidden"
          animate={mainControls}
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative w-48 h-48 mx-auto mb-6 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h4 className="text-2xl font-semibold mb-2">{member.name}</h4>
                <p className="text-blue-400 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

