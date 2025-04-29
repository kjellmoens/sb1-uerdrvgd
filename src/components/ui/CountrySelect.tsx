import React, { useEffect, useState } from 'react';
import { Country, getCountries } from '../../utils/countries';

interface CountrySelectProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled || loading}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} 
          rounded-lg shadow-sm focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200
          ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
      >
        <option value="">Select country</option>
        {countries.map(country => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CountrySelect;