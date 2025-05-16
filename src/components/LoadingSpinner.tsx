import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Загрузка...', 
  fullPage = false 
}) => {
  const spinnerSizes = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-2',
    large: 'h-16 w-16 border-3',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${spinnerSizes[size]} border-t-[#ffcc00] border-b-[#ffcc00] border-r-transparent border-l-transparent`}></div>
      {text && <p className="mt-4 text-gray-400">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner; 