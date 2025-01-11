'use client'

import { useState, useEffect } from 'react'
import { hasRole, getWalletClient } from '@/utils/contractInteractions'
import Sidebar from './Sidebar'
import MyProperties from '@/components/dashboard/MyProperties'
import UserManagement from '@/components/dashboard/UserManagement'
import VerifyProperties from '@/components/dashboard/VerifyProperties'
import AddProperty from '@/components/dashboard/AddProperty'
import Withdrawals from '@/components/dashboard/Withdrawals'
import CommissionSettings from '@/components/dashboard/CommissionSettings'

export default function Dashboard() {
  const [userRole, setUserRole] = useState<'ADMIN' | 'VERIFIER' | 'USER' | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [activeView, setActiveView] = useState('myProperties')

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    try {
      const client = await getWalletClient()
      const [account] = await client.getAddresses()
      if (account) {
        setIsConnected(true)
        const role = await hasRole()
        setUserRole(role as 'ADMIN' | 'VERIFIER' | 'USER')
      } else {
        setIsConnected(false)
        setUserRole(null)
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error)
      setIsConnected(false)
      setUserRole(null)
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'myProperties':
        return <MyProperties />
      case 'userManagement':
        return <UserManagement />
      case 'verifyProperties':
        return <VerifyProperties />
      case 'addProperty':
        return <AddProperty />
      case 'withdrawals':
        return <Withdrawals />
      case 'commissionSettings':
        return <CommissionSettings />
      default:
        return <MyProperties />
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar userRole={userRole} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

