import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

interface FilterSidebarProps {
  filters: {
    minPrice: string
    maxPrice: string
    location: string
    owner: string
    rating: number
    verified: boolean
  }
  onFilterChange: (key: string, value: string | number | boolean) => void
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 h-full overflow-y-auto">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Filters</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="minPrice" className="text-gray-300">Min Price (cBTC)</Label>
            <Input
              id="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-gray-300">Max Price (cBTC)</Label>
            <Input
              id="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-gray-300">Location</Label>
            <Input
              id="location"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="owner" className="text-gray-300">Owner</Label>
            <Input
              id="owner"
              value={filters.owner}
              onChange={(e) => onFilterChange('owner', e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="rating" className="text-gray-300">Minimum Rating</Label>
            <Slider
              id="rating"
              min={0}
              max={5}
              step={1}
              value={[filters.rating]}
              onValueChange={(value) => onFilterChange('rating', value[0])}
              className="py-4"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="verified"
              checked={filters.verified}
              onCheckedChange={(checked) => onFilterChange('verified', checked)}
            />
            <Label htmlFor="verified" className="text-gray-300">Verified Only</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
