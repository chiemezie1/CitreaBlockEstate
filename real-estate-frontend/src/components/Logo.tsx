import React from 'react'

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="8" fill="#4F46E5" />
        <path
          d="M20 8L32 16V32H8V16L20 8Z"
          fill="white"
        />
        <path
          d="M14 22H26M14 26H26M17 18H23"
          stroke="#4F46E5"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="14" r="2" fill="#4F46E5" />
      </svg>
      <div className="ml-2 flex flex-col">
        <span className="text-xl font-medium text-gray-200">
          Block<span className="text-yellow-500">Estate</span>
        </span>
        <span className="text-xs text-purple-200">Tokenized Real Estate</span>
      </div>
    </div>
  )
}

export default Logo