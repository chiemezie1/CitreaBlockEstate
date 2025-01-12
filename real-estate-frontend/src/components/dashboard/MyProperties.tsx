'use client'

import { useState, useEffect } from 'react'
import { getPropertiesForAddress, getPropertyInfo, updatePropertyStatus, updatePropertyDetails, safeTransfer } from '@/utils/contractInteractions'
import { toast } from "@/hooks/use-toast"
import { UpdateStatusModal } from '@/components/dashboard/UpdateStatusModal'
import Image from 'next/image'
import { Property } from '@/utils/types'

export default function MyProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [transferAddress, setTransferAddress] = useState<string>('')
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    try {
      const propertyIds = await getPropertiesForAddress()
      if (!Array.isArray(propertyIds)) {
        throw new Error('Invalid property IDs returned')
      }
      const propertyPromises = propertyIds.map((id: string) => getPropertyInfo(BigInt(id)))
      const propertyDetails = await Promise.all(propertyPromises)
      setProperties(propertyDetails.map((details: any, index: number) => ({
        id: propertyIds[index],
        name: details[0],
        location: details[1],
        description: details[2],
        imageUrl: details[3],
        status: details[5] as bigint,
        price: BigInt(details[4]),
        owner: details[10],
        isVerified: details[6],
        currentTenant: details[8],
        rentalEndDate: BigInt(details[9]),
        reviewIds: [],
        likeCount: Number(details[7]),
        reviewCount: 0,
      })))
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleUpdateStatus(status: bigint, price: bigint, rentalEndDate: bigint) {
    if (!selectedProperty) return
    if (!selectedProperty.isVerified) {
      toast({
        title: "Error",
        description: "Only verified properties can be updated.",
        variant: "destructive",
      })
      return
    }
    try {
      await updatePropertyStatus(BigInt(selectedProperty.id), status, price, rentalEndDate)
      toast({
        title: "Success",
        description: `Property status updated to ${status}`,
      })
      setStatusDialogOpen(false)
      fetchProperties()
    } catch (error) {
      console.error('Error updating property status:', error)
      toast({
        title: "Error",
        description: "Failed to update property status. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleUpdateDetails() {
    if (!editingProperty) return
    if (!editingProperty.isVerified) {
      toast({
        title: "Error",
        description: "Only verified properties can be updated.",
        variant: "destructive",
      })
      return
    }
    try {
      await updatePropertyDetails(
        BigInt(editingProperty.id),
        editingProperty.name,
        editingProperty.description,
        editingProperty.imageUrl,
        editingProperty.location
      )
      toast({
        title: "Success",
        description: "Property details updated successfully",
      })
      setEditingProperty(null)
      fetchProperties()
    } catch (error) {
      console.error('Error updating property details:', error)
      toast({
        title: "Error",
        description: "Failed to update property details. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleTransfer(id: string) {
    try {
      await safeTransfer(transferAddress as `0x${string}`, BigInt(id))
      toast({
        title: "Success",
        description: `Property transferred to ${transferAddress}`,
      })
      fetchProperties()
    } catch (error) {
      console.error('Error transferring property:', error)
      toast({
        title: "Error",
        description: "Failed to transfer property. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white">My Properties</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div key={property.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={property.imageUrl
                  ? `https://gateway.pinata.cloud/ipfs/${property.imageUrl}`
                  : '/placeholder.svg'}
                alt={property.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              {property.isVerified && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                  Verified
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{property.name}</h3>
              <p className="text-sm text-gray-300 mb-2">{property.location}</p>
              <p className="text-sm text-gray-400 mb-4">{property.description}</p>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setEditingProperty(property)}
                  className={`flex-1 py-2 px-4 rounded-md ${property.isVerified
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 cursor-not-allowed'
                    } text-white transition-colors duration-200`}
                  disabled={!property.isVerified}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (property.isVerified) {
                      setSelectedProperty(property)
                      setStatusDialogOpen(true)
                    } else {
                      toast({
                        title: "Error",
                        description: "Only verified properties can be updated.",
                        variant: "destructive",
                      })
                    }
                  }}
                  className={`flex-1 py-2 px-4 rounded-md ${property.isVerified
                    ? property.status === BigInt(1)
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 cursor-not-allowed'
                    } text-white transition-colors duration-200`}
                  disabled={!property.isVerified}
                >
                  {property.status === BigInt(1) ? 'Remove from Sale' : 'Update Status'}
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Transfer to address (0x...)"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
                <button
                  onClick={() => handleTransfer(property.id)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200"
                >
                  Transfer Property
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Edit Property</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  value={editingProperty.name}
                  onChange={(e) => setEditingProperty({ ...editingProperty, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input
                  id="location"
                  type="text"
                  value={editingProperty.location}
                  onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  id="description"
                  value={editingProperty.description}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input
                  id="imageUrl"
                  type="text"
                  value={editingProperty.imageUrl}
                  onChange={(e) => setEditingProperty({ ...editingProperty, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDetails}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      <UpdateStatusModal
        isOpen={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        onUpdate={handleUpdateStatus}
        currentStatus={selectedProperty?.status ?? BigInt(0)}
        currentPrice={selectedProperty?.price ?? BigInt(0)}
        currentRentalEndDate={selectedProperty?.rentalEndDate ?? BigInt(0)}
      />
    </div>
  )
}

