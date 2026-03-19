import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PaymentStatusProps {
  status: 'success' | 'failed' | 'processing' | null;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status }) => {
  if (!status) return null;

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      message: 'Payment successful! You can now start the quiz.',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      message: 'Payment failed. Please try again.',
    },
    processing: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      message: 'Processing payment...',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg z-50 max-w-sm`}>
      <div className="flex items-center space-x-3">
        <Icon 
          className={`w-6 h-6 ${config.color} ${status === 'processing' ? 'animate-spin' : ''}`} 
        />
        <p className={`font-medium ${config.color}`}>
          {config.message}
        </p>
      </div>
    </div>
  );
};