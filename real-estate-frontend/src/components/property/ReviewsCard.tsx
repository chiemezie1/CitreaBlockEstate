'use client'

import { useState } from 'react'
import { Review } from '@/utils/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarRating } from './StarRating'
import { toast } from "@/hooks/use-toast"
import { addReview } from '@/utils/contractInteractions'

interface ReviewsCardProps {
  reviews: Review[]
  propertyId: string
  onReviewAdded: () => Promise<void>
}

export default function ReviewsCard({ reviews, propertyId, onReviewAdded }: ReviewsCardProps) {
  const [newReview, setNewReview] = useState({ content: '', rating: 0 })
  const [submitting, setSubmitting] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleAddReview = async () => {
    setSubmitting(true)
    try {
      await addReview(BigInt(propertyId), newReview.content, newReview.rating)
      await onReviewAdded()
      setNewReview({ content: '', rating: 0 })
      toast({
        title: "Success",
        description: "Your review has been added successfully.",
      })
    } catch (error) {
      console.error('Error adding review:', error)
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="bg-gray-800/90 border-gray-700 text-gray-200 backdrop-blur-md shadow-xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 pt-3">Reviews ({reviews.length})</h2>
        <div className="space-y-6">
          <AnimatePresence>
            {reviews.slice(0, expanded ? reviews.length : 1).map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </AnimatePresence>
        </div>
        {reviews.length > 1 && (
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="ghost"
            className="mt-4 w-full text-blue-400 hover:text-blue-300"
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show All Reviews
              </>
            )}
          </Button>
        )}
        <AddReviewForm 
          newReview={newReview}
          setNewReview={setNewReview}
          onAddReview={handleAddReview}
          submitting={submitting}
        />
      </CardContent>
    </Card>
  )
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-gray-700 pb-4"
    >
      <div className="flex items-center space-x-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-500 text-white text-sm">{review.reviewer.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-blue-400 text-sm">{review.reviewer.slice(0, 6)}...{review.reviewer.slice(-4)}</p>
          <StarRating rating={review.rating} size={16} color="text-yellow-400" />
        </div>
      </div>
      <p className="text-gray-300 italic text-sm">&ldquo;{review.content}&rdquo;</p>
    </motion.div>
  )
}

interface AddReviewFormProps {
  newReview: { content: string; rating: number }
  setNewReview: React.Dispatch<React.SetStateAction<{ content: string; rating: number }>>
  onAddReview: () => Promise<void>
  submitting: boolean
}

function AddReviewForm({ newReview, setNewReview, onAddReview, submitting }: AddReviewFormProps) {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Add a Review</h3>
      <div className="flex items-center space-x-2">
        <span className="text-gray-400 text-sm">Rating:</span>
        <StarRating
          rating={newReview.rating}
          maxRating={5}
          size={20}
          color="text-yellow-400"
          onChange={(rating) => setNewReview({ ...newReview, rating })}
        />
        <Input
          type="number"
          min="1"
          max="5"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
          className="w-16 bg-gray-700/50 border-gray-600 text-gray-100"
        />
      </div>
      <Textarea
        value={newReview.content}
        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
        placeholder="Share your experience..."
        className="bg-gray-700/50 border-gray-600 text-gray-100 min-h-[80px]"
      />
      <Button onClick={onAddReview} disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2 transition-colors duration-300">
        {submitting ? 'Submitting...' : 'Submit Review'}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

