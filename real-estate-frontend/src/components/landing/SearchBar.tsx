'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, Users } from 'lucide-react'

const SearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      className="bg-white rounded-full shadow-lg"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between p-2">
        <button
          className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Search size={20} />
          <span className="font-medium">Search properties</span>
        </button>
        {isExpanded && (
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-200">
              <MapPin size={20} />
              <span>Location</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-200">
              <Calendar size={20} />
              <span>Check-in</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-200">
              <Users size={20} />
              <span>Guests</span>
            </button>
          </motion.div>
        )}
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200">
          Search
        </button>
      </div>
    </motion.div>
  )
}

export default SearchBar

