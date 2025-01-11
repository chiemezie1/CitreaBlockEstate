'use client'

import { useState, useEffect } from 'react'
import { getUserBalance, withdraw } from '@/utils/contractInteractions'
import { toast } from "@/hooks/use-toast"
import { formatToCBTC } from '@/utils/formatHelpers';

export default function Withdrawals() {
  const [balance, setBalance] = useState<bigint>(BigInt(0))

  useEffect(() => {
    fetchBalance()
  }, [])

  async function fetchBalance() {
    try {
      const userBalance = await getUserBalance()
      setBalance(BigInt(userBalance as string))
    } catch (error) {
      console.error('Error fetching balance:', error)
      toast({
        title: "Error",
        description: "Failed to fetch balance. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleWithdraw() {
    try {
      await withdraw()
      toast({
        title: "Success",
        description: "Withdrawal successful",
      })
      fetchBalance()
    } catch (error) {
      console.error('Error withdrawing funds:', error)
      toast({
        title: "Error",
        description: "Failed to withdraw funds. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Withdrawals</h1>
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-purple-400">{formatToCBTC(balance)} cBTC</p>
          <p className="text-sm text-gray-400 mt-2">Available Balance</p>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={balance <= 0}
          className="w-full mt-6 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Withdraw
        </button>
      </div>
    </div>
  )
}
