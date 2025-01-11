'use client'

import { useState } from 'react'
import { assignRole, revokeRole } from '@/utils/contractInteractions'
import { toast } from "@/hooks/use-toast"

export default function UserManagement() {
  const [address, setAddress] = useState('')
  const [role, setRole] = useState('')

  const handleAssignRole = async () => {
    try {
      await assignRole(role, address as `0x${string}`)
      toast({
        title: "Success",
        description: `Role ${role} assigned to ${address}`,
      })
    } catch (error) {
      console.error('Error assigning role:', error)
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRevokeRole = async () => {
    try {
      await revokeRole(role, address as `0x${string}`)
      toast({
        title: "Success",
        description: `Role ${role} revoked from ${address}`,
      })
    } catch (error) {
      console.error('Error revoking role:', error)
      toast({
        title: "Error",
        description: "Failed to revoke role. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">User Management</h1>
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-300">User Address</label>
            <input
              id="address"
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="role" className="text-sm font-medium text-gray-300">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            >
              <option value="">Select a role</option>
              <option value="ADMIN_ROLE">Admin</option>
              <option value="VERIFIER_ROLE">Verifier</option>
              <option value="USER_ROLE">User</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleAssignRole}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200"
            >
              Assign Role
            </button>
            <button
              onClick={handleRevokeRole}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Revoke Role
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

