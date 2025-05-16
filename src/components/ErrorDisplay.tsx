import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
  retryFn?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, retryFn }) => {
  if (!error) return null;

  return (
    <div className="bg-[#2a1a1a] border border-red-800 rounded-lg p-4 my-4 text-red-400 flex items-start">
      <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold mb-1">Ошибка загрузки данных</h3>
        <p>{error}</p>
        {retryFn && (
          <button 
            onClick={retryFn}
            className="mt-3 px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-md text-sm transition"
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay; 