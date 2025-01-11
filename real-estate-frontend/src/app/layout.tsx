import { Inter } from 'next/font/google'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RealEstateToken - Web3 Real Estate Platform',
  description: 'Discover, buy, and sell properties on the blockchain with RealEstateToken.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

            <div className="flex flex-col min-h-screen bg-gray-900 px-1">
              <Header />
              <AnimatePresence mode="wait">
                <main className="flex-grow">{children}</main>
              </AnimatePresence>
              <Footer />
            </div>
      </body>
    </html>
  )
}

