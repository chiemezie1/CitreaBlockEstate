'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Twitter, DiscIcon as Discord, Send, ChevronUp } from 'lucide-react'

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Explore Properties', href: '/explore' },
      { name: 'List a Property', href: '/dashboard' },
      { name: 'My Properties', href: '/dashboard' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
]

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Discord', icon: Discord, href: '#' },
  { name: 'Telegram', icon: Send, href: '#' },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup logic here
    console.log('Signed up with:', email)
    setEmail('')
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800 relative">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition duration-300">
              RealEstateToken
            </Link>
            <p className="mt-4 text-gray-400 max-w-xs">
              Revolutionizing real estate with blockchain technology.
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
              <label htmlFor="email-input" className="sr-only">Email address</label>
              <div className="flex items-center">
                <input
                  id="email-input"
                  type="email"
                  required
                  className="w-full px-4 py-2 text-gray-900 bg-white border-0 rounded-l-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-semibold text-white mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} RealEstateToken. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-blue-400 transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{link.name}</span>
                <link.icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <motion.button
        className="absolute bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="h-6 w-6" />
      </motion.button>
    </footer>
  )
}

