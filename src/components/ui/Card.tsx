import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  footer,
  hoverable = false,
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm overflow-hidden';
  const hoverClasses = hoverable ? 'transition-all duration-300 hover:shadow-md' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;