import { Property } from '@/utils/types'
import ExplorePropertyCard from './ExplorePropertyCard'
import { motion } from 'framer-motion'

interface PropertyGridProps {
  properties: Property[]
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="w-full"
        >
          <ExplorePropertyCard property={property} />
        </motion.div>
      ))}
    </div>
  )
}

export default PropertyGrid

