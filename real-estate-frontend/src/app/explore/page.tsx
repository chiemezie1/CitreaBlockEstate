'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllProperties, getPropertyInfo } from '@/utils/contractInteractions'
import { Property } from '@/utils/types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { formatEther } from 'viem'
import PropertyGrid from '@/components/explore/PropertyGrid'
import { FilterSidebar } from '@/components/explore/FilterSidebar'
import { Pagination } from '@/components/explore/Pagination'

const ITEMS_PER_PAGE = 15
const MAX_PAGES = 10

export default function ExplorePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({
    minPrice: '0',
    maxPrice: '10',
    location: '',
    owner: '',
    rating: 0,
    verified: false
  })
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertyIds = await getAllProperties(BigInt(0), BigInt(150))
        if (Array.isArray(propertyIds)) {
          const propertyInfoPromises = propertyIds.map(id => getPropertyInfo(id))
          const propertyInfoResults = await Promise.all(propertyInfoPromises)
          const validProperties = propertyInfoResults
            .map((result, index): Property | null => {
              if (Array.isArray(result) && result.length === 11) {
                return {
                  id: propertyIds[index],
                  name: result[0],
                  location: result[1],
                  description: result[2],
                  imageUrl: result[3],
                  price: BigInt(result[4]),
                  status: result[5] as bigint,
                  isVerified: result[6],
                  reviewIds: [],
                  likeCount: Number(result[7]),
                  currentTenant: result[8],
                  rentalEndDate: BigInt(result[9]),
                  owner: result[10],
                }
              }
              return null
            })
            .filter((property): property is Property => property !== null)
          setProperties(validProperties)
          setFilteredProperties(validProperties)
          setTotalPages(Math.min(Math.ceil(validProperties.length / ITEMS_PER_PAGE), MAX_PAGES))
        } else {
          console.error('Expected an array of property IDs, but received:', propertyIds)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    const filtered = properties.filter(property => {
      const priceInEther = Number(formatEther(property.price))
      const matchesSearch = 
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner.toLowerCase().includes(searchTerm.toLowerCase())
      return (
        matchesSearch &&
        priceInEther >= Number(filters.minPrice) &&
        priceInEther <= Number(filters.maxPrice) &&
        property.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        property.owner.toLowerCase().includes(filters.owner.toLowerCase()) &&
        (filters.verified ? property.isVerified : true)
      )
    })
    setFilteredProperties(filtered)
    setTotalPages(Math.min(Math.ceil(filtered.length / ITEMS_PER_PAGE), MAX_PAGES))
    setCurrentPage(1)
  }, [filters, properties, searchTerm])

  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <motion.div
          className="animate-spin h-12 w-12 text-purple-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block w-64 bg-gray-800 shadow-lg overflow-y-auto">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 shadow-lg overflow-y-auto pt-16 md:hidden"
            >
              <div className="p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
                >
                  <X className="h-6 w-6" />
                </Button>
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center w-full md:w-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700 mr-2"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
                <div className="relative flex-grow md:w-64">
                  <Input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-gray-100 pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between w-full md:w-auto">
                <p className="text-gray-400 text-sm mr-4">
                  Showing {paginatedProperties.length} of {filteredProperties.length} properties
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
            <PropertyGrid
              properties={paginatedProperties}
              onPropertyClick={(property) => router.push(`/property/${property.id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

