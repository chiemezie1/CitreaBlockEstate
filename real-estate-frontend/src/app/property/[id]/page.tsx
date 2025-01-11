'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getPropertyInfo, getPropertyReviewIds, getReviewDetails } from '@/utils/contractInteractions'
import { Property, Review } from '@/utils/types'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import PropertyCard from '@/components/property/PropertyCard'
import ReviewsCard from '@/components/property/ReviewsCard'



// Define the types for the contract interaction functions
type GetPropertyInfoFunction = (id: bigint) => Promise<[string, string, string, string, bigint, 'none' | 'forSale' | 'forRent', boolean, bigint, string, bigint, string]>;
type GetPropertyReviewIdsFunction = (propertyId: bigint) => Promise<bigint[]>;
type GetReviewDetailsFunction = (reviewId: bigint) => Promise<[bigint, bigint, string, string, bigint]>;

const typedGetPropertyInfo = getPropertyInfo as GetPropertyInfoFunction;
const typedGetPropertyReviewIds = getPropertyReviewIds as GetPropertyReviewIdsFunction;
const typedGetReviewDetails = getReviewDetails as GetReviewDetailsFunction;

export default function PropertyDetailsPage() {
  const { id } = useParams() as { id: string }
  const [property, setProperty] = useState<Property | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  


  useEffect(() => {
    async function fetchPropertyDetails() {
     try {
        const details = await typedGetPropertyInfo(BigInt(id))
        setProperty({
          id,
          name: details[0],
          location: details[1],
          description: details[2],
          imageUrl: details[3],
          price: details[4],
          status: details[5], // 0: none, 1: forSale, 2: forRent
          isVerified: details[6],
          reviewIds: [],
          likeCount: Number(details[7]),
          currentTenant: details[8],
          rentalEndDate: details[9],
          owner: details[10],
        })
        await fetchReviews()
      } catch (error) {
        console.error('Error fetching property details:', error)
        toast({
          title: "Error",
          description: "Failed to fetch property details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPropertyDetails()
    }
  }, [id])

  async function fetchReviews() {
    try {
      const reviewIds = await typedGetPropertyReviewIds(BigInt(id))
      const reviewPromises = reviewIds.map(reviewId => typedGetReviewDetails(reviewId))
      const reviewDetails = await Promise.all(reviewPromises)
      const formattedReviews = reviewDetails.map(review => ({
        id: review[0].toString(),
        propertyId: review[1].toString(),
        reviewer: review[2],
        content: review[3],
        rating: Number(review[4])
      }))
      setReviews(formattedReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-blue-900">
        <Skeleton className="h-16 w-16 rounded-full bg-blue-500/20 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <Link href="/explore" passHref>
          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 mb-8">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Explore
          </Button>
        </Link>
        {property ? (
          <div className="space-y-12">
            <PropertyCard property={property} setProperty={setProperty} />
            <ReviewsCard reviews={reviews} propertyId={id} onReviewAdded={fetchReviews} />
          </div>
        ) : (
          <div className="bg-gray-800/90 border-gray-700 backdrop-blur-md shadow-xl rounded-lg p-12">
            <p className="text-center text-xl text-gray-400">Property not found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

