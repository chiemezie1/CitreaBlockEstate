'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllProperties, getPropertyInfo } from '@/utils/contractInteractions'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Property } from '@/utils/types'
import Image from 'next/image'
import { MapPin, DollarSign, ThumbsUp, User } from 'lucide-react'
import { formatToCBTC } from '@/utils/formatHelpers';

type GetAllPropertiesFunction = (start: bigint, end: bigint) => Promise<bigint[]>;
type GetPropertyInfoFunction = (id: bigint) => Promise<[string, string, string, string, bigint, 'none' | 'forSale' | 'forRent', boolean, string[], number, string, bigint, string]>;

const typedGetAllProperties = getAllProperties as GetAllPropertiesFunction;
const typedGetPropertyInfo = getPropertyInfo as GetPropertyInfoFunction;



export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    try {
      const propertyIds = await typedGetAllProperties(BigInt(0), BigInt(10))
      const shuffled = [...propertyIds].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 3)
      const propertyPromises = selected.map((id: bigint) => typedGetPropertyInfo(id))
      const propertyDetails = await Promise.all(propertyPromises)
      setProperties(propertyDetails.map((result, index) => ({
        id: selected[index].toString(),
        name: result[0],
        location: result[1],
        description: result[2],
        imageUrl: result[3],
        price: result[4],
        status: result[5],
        isVerified: result[6],
        reviewCount: Number(result[7]),
        currentTenant: result[8],
        rentalEndDate: BigInt(result[9]),
        owner: result[10].toString(),
      })))
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const shortenAddress = (address: string) => {
    if (address.length > 30) {
      return `${address.slice(0, 15)}...${address.slice(-15)}`
    }
    return address
  }

  return (
    <section className="py-10 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-white"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Featured Properties
        </motion.h2>
        <motion.p
          className="text-xl text-center mb-12 text-gray-300 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover our handpicked selection of premium tokenized real estate
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {properties.map((property) => (
            <motion.div
              key={property.id}
              variants={itemVariants}
            >
              <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-64">
                    <Image
                      src={property.imageUrl
                        ? `https://gateway.pinata.cloud/ipfs/${property.imageUrl}`
                        : '/placeholder.svg'}
                      alt={property.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <Badge
                      className="absolute top-4 right-4"
                      variant={property.status === 'forSale' ? 'default' : 'secondary'}
                    >
                      {property.status === 'forSale' ? 'For Sale' : property.status === 'forRent' ? 'For Rent' : 'Not Available'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="mb-2 text-2xl font-bold text-white">{property.name}</CardTitle>
                  <div className="flex items-center mb-4 text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <p className="truncate">{shortenAddress(property.location)}</p>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center text-gray-300">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                      <span className="font-bold">{formatToCBTC(property.price)} cBTC</span>
                      </div>
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1 text-blue-400" />
                      <span>{property.reviewCount}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-6 bg-gray-700">
                  <div className="flex items-center text-gray-300">
                    <User className="w-4 h-4 mr-2" />
                    {property.owner && property.owner !== '0x0000000000000000000000000000000000000000' && (
                      <span className="text-sm">Owner: {property.owner.slice(0, 6)}...{property.owner.slice(-4)}</span>
                    )}
                  </div>
                  <Button variant="secondary">View Details</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

