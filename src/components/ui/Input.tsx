import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error,
  className = '',
  id,
}) => {
  const inputId = id || name;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} 
          rounded-lg shadow-sm focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export { Input };
export default Input;