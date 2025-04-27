import React, { useState, useEffect } from 'react';
import { Building, Plus, Search, Globe, MapPin, Users, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import { Company } from '../types';
import { api } from '../lib/api';

const emptyCompany: Omit<Company, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  description: '',
  industry: '',
  type: 'Private',
  headquarters: {
    city: '',
    state: '',
    country: ''
  },
  socialMedia: {
    linkedin: '',
    twitter: '',
    facebook: ''
  }
};

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Omit<Company, 'id' | 'created_at' | 'updated_at'>>(emptyCompany);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await api.companies.list();
        setCompanies(data);
      } catch (error) {
        console.error('Error loading companies:', error);
      }
    };

    loadCompanies();
  }, []);

  const handleChange = (field: keyof Company | 'city' | 'state' | 'country' | 'linkedin' | 'twitter' | 'facebook', value: string) => {
    setFormData(prev => {
      if (field === 'city' || field === 'state' || field === 'country') {
        return {
          ...prev,
          headquarters: {
            ...prev.headquarters,
            [field]: value
          }
        };
      }
      
      if (field === 'linkedin' || field === 'twitter' || field === 'facebook') {
        return {
          ...prev,
          socialMedia: {
            ...prev.socialMedia,
            [field]: value || null
          }
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
    
    try {
      if (editingCompany) {
        const updated = await api.companies.update(editingCompany.id, formData);
        setCompanies(prev => 
          prev.map(company => 
            company.id === editingCompany.id ? updated : company
          )
        );
      } else {
        const created = await api.companies.create(formData);
        setCompanies(prev => [...prev, created]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const resetForm = () => {
    setFormData(emptyCompany);
    setEditingCompany(null);
    setIsAdding(false);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData(company);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await api.companies.delete(id);
        setCompanies(prev => prev.filter(company => company.id !== id));
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const filteredCompanies = searchTerm
    ? companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : companies;

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
                <Input
                  label="Founded Year"
                  type="number"
                  name="founded"
                  value={formData.founded || ''}
                  onChange={(e) => handleChange('founded', e.target.value)}
                  placeholder="e.g., 1990"
                />
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Headquarters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-2" size={18} />
                    <Input
                      label="City"
                      name="city"
                      value={formData.headquarters.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-2" size={18} />
                    <Input
                      label="State/Province"
                      name="state"
                      value={formData.headquarters.state || ''}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-2" size={18} />
                    <Input
                      label="Country"
                      name="country"
                      value={formData.headquarters.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="LinkedIn"
                    type="url"
                    name="linkedin"
                    value={formData.socialMedia?.linkedin || ''}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder="LinkedIn URL"
                  />
                  
                  <Input
                    label="Twitter"
                    type="url"
                    name="twitter"
                    value={formData.socialMedia?.twitter || ''}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    placeholder="Twitter URL"
                  />
                  
                  <Input
                    label="Facebook"
                    type="url"
                    name="facebook"
                    value={formData.socialMedia?.facebook || ''}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    placeholder="Facebook URL"
                  />
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
              <Button type="submit">
                {editingCompany ? 'Update Company' : 'Add Company'}
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
                  
                  <div className="mt-4 flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span>
                      {company.headquarters.city}, {company.headquarters.country}
                    </span>
                  </div>
                  
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