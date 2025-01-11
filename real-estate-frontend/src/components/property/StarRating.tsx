import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;     
  color?: string;    
  onChange?: (rating: number) => void;
}


export const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5, size = 20, color = 'text-yellow-400' }) => {
  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={`${index < rating ? color : 'text-gray-300'}`}
          fill={index < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

