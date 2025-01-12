'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Wallet, ChevronDown } from 'lucide-react'
import Logo from './Logo'
import { publicClient } from '@/utils/contractInteractions'
import { formatEther, createWalletClient, custom } from 'viem'
import { citrea } from '@/utils/citreaChain'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const sessionWalletAddress = sessionStorage.getItem('walletAddress')
          if (sessionWalletAddress) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if (accounts.length > 0 && accounts[0].toLowerCase() === sessionWalletAddress.toLowerCase()) {
              await connectWallet(true)
            } else {
              sessionStorage.removeItem('walletAddress')
            }
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error)
        }
      }
    }

    checkWalletConnection()

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== walletAddress) {
        connectWallet()
      }
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [walletAddress])

  const connectWallet = async (isReconnecting = false) => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('MetaMask is not installed. Please install it to use this feature.')
      return
    }

    setIsConnecting(true)

    try {
      const walletClient = createWalletClient({
        chain: citrea,
        transport: custom(window.ethereum)
      })

      let accounts
      if (!isReconnecting) {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      } else {
        accounts = await window.ethereum.request({ method: 'eth_accounts' })
      }

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]
      setWalletAddress(address)
      sessionStorage.setItem('walletAddress', address)

      const chainId = await walletClient.getChainId()

      if (chainId !== citrea.id) {
        try {
          await walletClient.switchChain({ id: citrea.id })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await walletClient.addChain({ chain: citrea })
            } catch (addError) {
              console.error('Failed to add Citrea Testnet:', addError)
              alert('Please manually add the Citrea Testnet to MetaMask.')
              return
            }
          } else {
            throw switchError
          }
        }
      }

      const balance = await publicClient.getBalance({ address })
      setBalance(formatEther(balance))

    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert('Failed to connect wallet. Please make sure your MetaMask is unlocked and try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setBalance(null)
    setIsWalletMenuOpen(false)
    sessionStorage.removeItem('walletAddress')
  }

  return (
    <header className="bg-gradient-to-r from-purple-900 to-blue-900 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <div className="hidden md:flex space-x-6">
            <NavLink href="/explore">Explore</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {walletAddress ? (
              <div className="relative">
                <button
                  onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                  className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-full transition duration-300 shadow-md"
                >
                  <Wallet size={20} />
                  <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  <ChevronDown size={20} />
                </button>
                {isWalletMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p>Balance: {balance ? `${parseFloat(balance).toFixed(4)} cBTC` : 'Loading...'}</p>
                      <p>Network: Citrea Testnet</p>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 transition duration-300"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => connectWallet()}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-600 transition duration-300 shadow-md flex items-center space-x-2 disabled:opacity-50"
              >
                <Wallet size={20} />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
          <button
            className="md:hidden text-white hover:text-gray-300 transition duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 space-y-2 bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NavLink href="/explore" mobile>Explore</NavLink>
              <NavLink href="/dashboard" mobile>Dashboard</NavLink>
              <NavLink href="/about" mobile>About</NavLink>
              <div className="px-4 py-2">
                {walletAddress ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Balance: {balance ? `${parseFloat(balance).toFixed(4)} cBTC` : 'Loading...'}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Network: Citrea Testnet
                    </p>
                    <button
                      onClick={disconnectWallet}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 shadow-md"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => connectWallet()}
                    disabled={isConnecting}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-blue-600 transition duration-300 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Wallet size={20} />
                    <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  mobile?: boolean
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, mobile }) => {
  return (
    <Link
      href={href}
      className={`${
        mobile
          ? 'block py-3 px-4 text-lg text-gray-700 hover:bg-gray-50'
          : 'text-white hover:text-purple-300'
      } transition duration-200`}
    >
      {children}
    </Link>
  )
}

export default Header

