import React, { useState, useEffect } from 'react';
import { Building, Plus, Search, Globe, MapPin, Users, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import { Company, Country } from '../types';
import { api } from '../lib/api';
import { getCountries } from '../utils/countries';

const emptyCompany: Omit<Company, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  description: '',
  industry: '',
  type: 'Private',
  city: '',
  website: '',
  founded: '',
  size: '',
  country_code: ''
};

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Omit<Company, 'id' | 'created_at' | 'updated_at'>>(emptyCompany);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundedError, setFoundedError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [companiesData, countriesData] = await Promise.all([
          api.companies.list(),
          getCountries()
        ]);
        setCompanies(companiesData);
        setCountries(countriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const validateFounded = (value: string): boolean => {
    if (!value) return true; // Empty is valid, will be converted to null
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(value)) return false;
    
    const year = parseInt(value, 10);
    const currentYear = new Date().getFullYear();
    return year >= 1800 && year <= currentYear;
  };

  const handleChange = (field: keyof Company | 'country', value: string) => {
    if (field === 'founded') {
      // Clear previous founded error when the field changes
      setFoundedError(null);
      
      // Validate the year as the user types
      if (value && !validateFounded(value)) {
        setFoundedError('Please enter a valid year between 1800 and present');
      }
    }

    setFormData(prev => {
      if (field === 'country') {
        const country = countries.find(c => c.name === value);
        return {
          ...prev,
          country_code: country?.code || ''
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate founded year before submission
    if (formData.founded && !validateFounded(formData.founded)) {
      setFoundedError('Please enter a valid year between 1800 and present');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create a copy of the form data to modify
      const submissionData = {
        ...formData,
        // Convert empty founded string to null, otherwise keep the valid year
        founded: formData.founded || null
      };

      if (editingCompany) {
        const updated = await api.companies.update(editingCompany.id, submissionData);
        setCompanies(prev => 
          prev.map(company => 
            company.id === editingCompany.id ? updated : company
          )
        );
      } else {
        const created = await api.companies.create(submissionData);
        setCompanies(prev => [...prev, created]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving company:', error);
      setError('Failed to save company. Please check all fields are valid.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyCompany);
    setEditingCompany(null);
    setIsAdding(false);
    setError(null);
    setFoundedError(null);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData(company);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company? This will also delete all associated work experience entries.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, update all work experience entries to remove the company reference
      await api.workExperience.removeCompanyReference(id);
      
      // Then delete the company
      await api.companies.delete(id);
      
      setCompanies(prev => prev.filter(company => company.id !== id));
    } catch (error) {
      console.error('Error deleting company:', error);
      setError('Failed to delete company. Please ensure all associated data is removed first.');
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

  if (loading && !companies.length) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Loading companies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage your company database
          </p>
        </div>
        
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            icon={<Plus size={18} />}
          >
            Add Company
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {isAdding ? (
        <Card title={editingCompany ? 'Edit Company' : 'Add New Company'}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center md:col-span-2">
                <Building className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Company Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Globe className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  placeholder="e.g., Technology, Healthcare"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value as Company['type'])}
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

              <div className="flex items-center">
                <Globe className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Website"
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://company.com"
                />
              </div>

              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <div className="w-full">
                  <Input
                    label="Founded Year"
                    type="number"
                    name="founded"
                    value={formData.founded || ''}
                    onChange={(e) => handleChange('founded', e.target.value)}
                    placeholder="e.g., 1990"
                    min="1800"
                    max={new Date().getFullYear()}
                    error={foundedError}
                  />
                  {!foundedError && (
                    <p className="mt-1 text-sm text-gray-500">
                      Leave empty if unknown
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <Users className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Company Size"
                  name="size"
                  value={formData.size || ''}
                  onChange={(e) => handleChange('size', e.target.value)}
                  placeholder="e.g., 1-50, 51-200, 201-500"
                />
              </div>

              <div className="md:col-span-2">
                <TextArea
                  label="Company Description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of the company..."
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-2" size={18} />
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={formData.country_code}
                      onChange={(e) => handleChange('country_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !!foundedError}
              >
                {loading ? 'Saving...' : (editingCompany ? 'Update Company' : 'Add Company')}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <>
          {companies.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map(company => (
                <Card key={company.id} hoverable>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {company.type}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-gray-700 line-clamp-2">{company.description}</p>
                  
                  {company.city && (
                    <div className="mt-4 flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-1" />
                      <span>{company.city}</span>
                    </div>
                  )}
                  
                  {company.website && (
                    <div className="mt-2">
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm inline-flex items-center"
                      >
                        <Globe size={16} className="mr-1" />
                        Website
                      </a>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(company)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDelete(company.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="flex justify-center mb-4">
                <Building className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Companies Found</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm
                  ? "We couldn't find any companies matching your search. Try a different term or add a new company."
                  : "You haven't added any companies yet. Click the button below to add your first company!"}
              </p>
              <Button onClick={() => setIsAdding(true)} icon={<Plus size={18} />}>
                Add Your First Company
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Companies;