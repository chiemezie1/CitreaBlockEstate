'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Heart, Verified, MapPin, DollarSign, User, Calendar, Home, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { toggleLike, getPropertyInfo, buyProperty, rentProperty, getCurrentAccount } from '@/utils/contractInteractions'
import { formatToCBTC } from '@/utils/formatHelpers'
import { Property } from '@/utils/types'

interface PropertyCardProps {
  property: Property
}

export default function ExplorePropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()
  const [isLiking, setIsLiking] = useState(false)
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [localProperty, setLocalProperty] = useState(property)

  useEffect(() => {
    const fetchCurrentAccount = async () => {
      const currentAccount = await getCurrentAccount()
      setOwnerAddress(currentAccount)
    }
    fetchCurrentAccount()
  }, [])

  const handleToggleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    try {
      await toggleLike(BigInt(localProperty.id))
      const updatedProperty = await getPropertyInfo(BigInt(localProperty.id))
      if (Array.isArray(updatedProperty) && updatedProperty.length > 7) {
        setLocalProperty((prev) => ({ ...prev, likeCount: Number(updatedProperty[7]) }))
      }
      toast({
        title: 'Success',
        description: 'Property like status updated.',
      })
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: 'Error',
        description: 'Failed to update like status. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleBuyProperty = async () => {
    setIsLoading(true)
    try {
      await buyProperty(BigInt(localProperty.id), localProperty.price)
      toast({
        title: 'Success',
        description: 'Property purchased successfully.',
      })
      const updatedProperty = await getPropertyInfo(BigInt(localProperty.id))
      setLocalProperty(updatedProperty as Property)
    } catch (error) {
      console.error('Error buying property:', error)
      toast({
        title: 'Error',
        description: 'Failed to purchase property. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRentProperty = async () => {
    setIsLoading(true)
    try {
      await rentProperty(BigInt(localProperty.id), localProperty.price)
      toast({
        title: 'Success',
        description: 'Property rented successfully.',
      })
      const updatedProperty = await getPropertyInfo(BigInt(localProperty.id))
      setLocalProperty(updatedProperty as Property)
    } catch (error) {
      console.error('Error renting property:', error)
      toast({
        title: 'Error',
        description: 'Failed to rent property. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderActionButtons = () => {
    const buttons = []

    if (ownerAddress && localProperty.owner && ownerAddress.toLowerCase() === localProperty.owner.toLowerCase()) {
      buttons.push(
        <div key="owner-message" className="w-full bg-gray-600 text-gray-300 p-2 rounded text-center">
          You own this property
        </div>
      )
    } else {
      switch (BigInt(localProperty.status)) {
        case BigInt(1): // forSale
          buttons.push(
            <Button
              key="buy"
              onClick={handleBuyProperty}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Processing...' : 'Buy Now'}
            </Button>
          )
          break
        case BigInt(2): // forRent
          buttons.push(
            <Button
              key="rent"
              onClick={handleRentProperty}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? 'Processing...' : 'Rent Now'}
            </Button>
          )
          break
      }
    }

    // See Details button
    buttons.push(
      <Button
        key="details"
        onClick={() => router.push(`/property/${property.id}`)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        See Details
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    )

    return buttons
  }

  return (
    <Card className="bg-gray-800/90 border-gray-700 text-gray-200 backdrop-blur-md shadow-xl overflow-hidden max-w-sm mx-auto">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="relative h-48">
            <Image
              src={`https://gateway.pinata.cloud/ipfs/${localProperty.imageUrl}`}
              alt={localProperty.name || 'Property Image'}
              fill
              className="object-cover"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="text-sm font-medium bg-blue-500/80 px-3 py-1 rounded-full">
                {BigInt(localProperty.status) === BigInt(1) ? 'For Sale' : BigInt(localProperty.status) === BigInt(2) ? 'For Rent' : 'Not Available'}
              </div>
              {localProperty.isVerified && (
                <div className="bg-green-500/80 p-1.5 rounded-full">
                  <Verified className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
          <div className="p-4 space-y-3">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {localProperty.name}
            </h1>
            <PropertyDetails property={localProperty} />
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{localProperty.description}</p>
            <div className="grid grid-cols-1 gap-2 pt-2">
              {renderActionButtons()}
              <Button
                onClick={handleToggleLike}
                variant="outline"
                size="sm"
                className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-colors duration-300"
                disabled={isLiking}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    (localProperty.likeCount ?? 0) > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
                />
                {localProperty.likeCount} likes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PropertyDetails({ property }: { property: Property }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 text-xs">
      <DetailItem icon={MapPin} color="text-blue-400" text={property.location} />
      <DetailItem
        icon={DollarSign}
        color="text-green-400"
        text={`${formatToCBTC(property.price)} cBTC`}
      />
      {property.status === BigInt(2) && (
        <>
          <DetailItem
            icon={User}
            color="text-purple-400"
            text={
              typeof property.currentTenant === 'string'
                ? `${property.currentTenant.slice(0, 6)}...${property.currentTenant.slice(-4)}`
                : 'N/A'
            }
          />
          <DetailItem
            icon={Calendar}
            color="text-yellow-400"
            text={`Until ${new Date(Number(property.rentalEndDate)).toLocaleDateString()}`}
          />
        </>
      )}
      <div className="col-span-2">
        <DetailItem
          icon={Home}
          color="text-blue-400"
          text={`${property.owner.slice(0, 6)}...${property.owner.slice(-4)}`}
          label="Owner"
          className="bg-gray-700/50 p-1.5 rounded-lg transition-colors duration-300 hover:bg-gray-600/50"
        />
      </div>
    </div>
  )
}

function DetailItem({
  icon: Icon,
  color,
  text,
  label,
  className,
}: {
  icon: any
  color: string
  text: string
  label?: string
  className?: string
}) {
  return (
    <div
      className={`flex items-center space-x-2 bg-gray-700/50 p-1.5 rounded-lg transition-colors duration-300 hover:bg-gray-600/50 ${className}`}
    >
      <Icon className={`${color} h-3.5 w-3.5`} />
      <div>
        {label && <span className="font-medium text-xs block text-gray-400">{label}</span>}
        <span className="font-medium truncate block text-xs">{text}</span>
      </div>
    </div>
  )
}

