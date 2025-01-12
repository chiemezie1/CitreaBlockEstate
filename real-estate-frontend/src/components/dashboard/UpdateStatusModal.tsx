import { useState } from 'react'
import { cBTCToSatoshi, formatToCBTC } from '@/utils/formatHelpers'

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (status: bigint, price: bigint, rentalEndDate: bigint) => void;
  currentStatus: bigint;
  currentPrice: bigint;
  currentRentalEndDate: bigint;
}

export function UpdateStatusModal({ 
  isOpen, 
  onClose, 
  onUpdate, 
  currentStatus, 
  currentPrice, 
  currentRentalEndDate 
}: UpdateStatusModalProps) {
  const [newStatus, setNewStatus] = useState<bigint>(currentStatus)
  const [price, setPrice] = useState<string>(formatToCBTC(currentPrice))
  const [rentalEndDate, setRentalEndDate] = useState<string>(
    currentRentalEndDate > BigInt(0) 
      ? new Date(Number(currentRentalEndDate) * 1000).toISOString().split('T')[0]
      : ''
  )

  const handleUpdate = () => {
    const endDate = newStatus === BigInt(2) && rentalEndDate 
      ? BigInt(new Date(rentalEndDate).getTime() / 1000) 
      : BigInt(0)
    
    let bigIntPrice: bigint;
    try {
      bigIntPrice = cBTCToSatoshi(price);
    } catch (error) {
      console.error('Error converting price to BigInt:', error);
      bigIntPrice = BigInt(0);
    }
    
    onUpdate(newStatus, bigIntPrice, endDate)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Update Property Status</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              id="status"
              value={newStatus.toString()}
              onChange={(e) => setNewStatus(BigInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            >
              <option value="0">None</option>
              <option value="1">For Sale</option>
              <option value="2">For Rent</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price (in cBTC)</label>
            <input
              id="price"
              type="number"
              step="0.00000001"
              placeholder="Price in cBTC"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>
          {newStatus === BigInt(2) && (
            <div>
              <label htmlFor="rentalEndDate" className="block text-sm font-medium text-gray-300 mb-1">Rental End Date</label>
              <input
                id="rentalEndDate"
                type="date"
                value={rentalEndDate}
                onChange={(e) => setRentalEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}

