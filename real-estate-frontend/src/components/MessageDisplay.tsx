import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface MessageDisplayProps {
  message: string;
  type: 'success' | 'error';
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, type }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded relative`} role="alert">
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
};

export default MessageDisplay;

