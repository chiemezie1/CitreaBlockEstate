'use client'

import { useState, useEffect } from 'react'
import { getAllProperties, getPropertyInfo, verifyProperty } from '@/utils/contractInteractions'
import { toast } from "@/hooks/use-toast"
import { Property } from '@/utils/types'
import Image from 'next/image'

interface PropertyDetails extends Property {
  id: string;
}

export default function VerifyProperties() {
  const [properties, setProperties] = useState<PropertyDetails[]>([])

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    try {
      const propertyIds = await getAllProperties(BigInt(0), BigInt(100))
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

  async function handleVerify(id: string, verified: boolean) {
    try {
      await verifyProperty(BigInt(id), verified)
      toast({
        title: "Success",
        description: `Property ${id} ${verified ? 'verified' : 'unverified'} successfully`,
      })
      fetchProperties()
    } catch (error) {
      console.error('Error verifying property:', error)
      toast({
        title: "Error",
        description: "Failed to verify property. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white">Verify Properties</h1>
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
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{property.name}</h3>
              <p className="text-sm text-gray-300 mb-2">{property.location}</p>
              <p className="text-sm text-gray-400 mb-4">{property.description}</p>
              <button
                onClick={() => handleVerify(property.id, !property.isVerified)}
                className={`w-full py-2 px-4 rounded-md ${property.isVerified
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                  } text-white transition-colors duration-200`}
              >
                {property.isVerified ? 'Unverify' : 'Verify'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

