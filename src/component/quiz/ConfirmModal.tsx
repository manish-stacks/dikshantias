import React from 'react';
import { X, Clock, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quiz: any;
  remainingAttempts: number | null;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  quiz,
  remainingAttempts,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Start Quiz</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3 text-gray-700">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Duration: {quiz?.duration} minutes</span>
          </div>

          {remainingAttempts !== null && (
            <div className="flex items-center space-x-3 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Remaining attempts: {remainingAttempts}</span>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Instructions:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Once started, the timer cannot be paused</li>
              <li>• Make sure you have a stable internet connection</li>
              <li>• Do not refresh or close the browser tab</li>
              <li>• Submit before time runs out</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};