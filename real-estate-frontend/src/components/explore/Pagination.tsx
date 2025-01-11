import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
