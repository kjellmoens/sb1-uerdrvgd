import React, { useState, useEffect } from 'react';
import { Company } from '../../types';
import { api } from '../../lib/api';
import { Plus, Search } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import TextArea from './TextArea';
import CountrySelect from './CountrySelect';

interface CompanySelectProps {
  value?: Company | null;
  onChange: (company: Company | null) => void;
  onCreateNew?: () => void;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ value, onChange }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Company, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    industry: '',
    type: 'Private',
    city: '',
    country_code: '',
    website: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await api.companies.list();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const newCompany = await api.companies.create(formData);
      setCompanies(prev => [...prev, newCompany]);
      onChange(newCompany);
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating company:', error);
      setError('Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = searchTerm
    ? companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : companies;

  if (isAdding) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form onSubmit={handleCreateCompany}>
          <div className="space-y-4">
            <Input
              label="Company Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            
            <Input
              label="Industry"
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Company['type'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="Nonprofit">Nonprofit</option>
                <option value="Government">Government</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />

            <CountrySelect
              label="Country"
              name="country_code"
              value={formData.country_code}
              onChange={(e) => setFormData(prev => ({ ...prev, country_code: e.target.value }))}
              required
            />

            <Input
              label="Website"
              type="url"
              value={formData.website || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />

            <TextArea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Company'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button 
          variant="outline"
          onClick={() => setIsAdding(true)}
          icon={<Plus size={16} />}
        >
          New
        </Button>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-200">
        {value && !searchTerm && (
          <button
            onClick={() => onChange(value)}
            className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 focus:outline-none"
          >
            <div className="font-medium text-gray-900">{value.name}</div>
            <div className="text-sm text-gray-500">{value.industry}</div>
            {value.city && (
              <div className="text-sm text-gray-500 mt-1">{value.city}</div>
            )}
          </button>
        )}

        {(searchTerm ? filteredCompanies : []).map(company => (
          <button
            key={company.id}
            onClick={() => onChange(company)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
              value?.id === company.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="font-medium text-gray-900">{company.name}</div>
            <div className="text-sm text-gray-500">{company.industry}</div>
            {company.city && (
              <div className="text-sm text-gray-500 mt-1">{company.city}</div>
            )}
          </button>
        ))}
        {filteredCompanies.length === 0 && searchTerm && !loading && (
          <div className="px-4 py-3 text-gray-500 text-center">
            No companies found
          </div>
        )}
        {loading && (
          <div className="px-4 py-3 text-gray-500 text-center">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySelect;