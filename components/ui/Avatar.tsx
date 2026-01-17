import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  fallbackColor?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  fallbackColor = 'bg-gray-200',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  };

  return (
    <div className={`relative inline-block rounded-full overflow-hidden ${sizeClasses[size]} ${className} border-2 border-white shadow-sm shrink-0`}>
      {src && !imgError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-bold text-gray-600 ${fallbackColor}`}>
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};