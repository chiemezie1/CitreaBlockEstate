'use client'

import { useState, useEffect } from 'react'
import { setCommissionRate, getCommissionRate } from '@/utils/contractInteractions'
import { toast } from "@/hooks/use-toast"

export default function CommissionSettings() {
  const [commissionRate, setCommissionRateState] = useState<string>('')
  const [currentRate, setCurrentRate] = useState<string>('')

  useEffect(() => {
    fetchCurrentRate()
  }, [])

  async function fetchCurrentRate() {
    try {
      const rate = await getCommissionRate()
           setCurrentRate((rate as BigInt).toString())
    } catch (error) {
      console.error('Error fetching commission rate:', error)
      toast({
        title: "Error",
        description: "Failed to fetch current commission rate.",
        variant: "destructive",
      })
    }
  }

  const handleSetCommissionRate = async () => {
    try {
      // Convert the input commissionRate to BigInt before passing it to the function
      if (commissionRate === '' || isNaN(Number(commissionRate))) {
        toast({
          title: "Error",
          description: "Please enter a valid commission rate.",
          variant: "destructive",
        })
        return
      }
      await setCommissionRate(BigInt(commissionRate))
      toast({
        title: "Success",
        description: `Commission rate set to ${commissionRate}%`,
      })
      fetchCurrentRate()
    } catch (error) {
      console.error('Error setting commission rate:', error)
      toast({
        title: "Error",
        description: "Failed to set commission rate. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Commission Settings</h1>
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <div className="mb-4">
          <p className="text-lg text-gray-300">
            Current Commission Rate: <span className="font-bold text-purple-400">{currentRate}%</span>
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="commissionRate" className="text-sm font-medium text-gray-300">
              New Commission Rate (%)
            </label>
            <input
              id="commissionRate"
              type="number"
              min="0"
              max="100"
              value={commissionRate}
              onChange={(e) => setCommissionRateState(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            />
          </div>
          <button
            onClick={handleSetCommissionRate}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            Set Commission Rate
          </button>
        </div>
      </div>
    </div>
  )
}
