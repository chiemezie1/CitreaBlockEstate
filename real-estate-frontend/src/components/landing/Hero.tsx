'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const heroImages = [
  { src: '/hero-image-1.jpg', alt: 'Modern cityscape' },
  { src: '/hero-image-2.jpg', alt: 'Luxurious apartment interior' },
  { src: '/hero-image-3.jpg', alt: 'Scenic suburban houses' },
  { src: '/hero-image-4.jpg', alt: 'Beachfront villa with sunset view' },
  { src: '/hero-image-5.jpg', alt: 'High-rise apartment with skyline view' },
];


const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image 
            src={heroImages[currentImageIndex].src} 
            alt={heroImages[currentImageIndex].alt} 
            layout="fill" 
            objectFit="cover" 
            quality={100} 
            priority
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center text-white"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your Next Property
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl lg:text-2xl mb-8 text-center max-w-2xl text-white"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore and invest in tokenized real estate worldwide
        </motion.p>
        <motion.div
          className="w-full max-w-md mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <Input
              type="text"
              placeholder="Search for properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
          </form>
        </motion.div>
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button asChild variant="default" size="lg" className="rounded-full">
            <Link href="/explore" className="flex items-center">
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
            <Link href="/how-it-works">
              How It Works
            </Link>
          </Button>
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero

