import React, { useState, useEffect } from 'react';
import { PersonalInfo } from '../../types';
import { Input } from '../ui/Input';
import TextArea from '../ui/TextArea';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import CountrySelect from '../ui/CountrySelect';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, Flag, Heart, Calendar, Home, Plus, Trash2, RefreshCw } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';
import { getCountries } from '../../utils/countries';

interface PersonalInfoFormProps {
  initialData: PersonalInfo;
  onSave: (data: PersonalInfo) => void;
  cvId: string;
}

const relationshipStatuses = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Prefer not to say'
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ initialData, onSave, cvId }) => {
  const [formData, setFormData] = useState<PersonalInfo>({
    ...initialData,
    profileSummaries: initialData.profileSummaries?.length 
      ? initialData.profileSummaries 
      : [{ id: generateId(), content: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [nationalities, setNationalities] = useState<Array<{ code: string; nationality: string }>>([]);

  useEffect(() => {
    const loadNationalities = async () => {
      try {
        const countries = await getCountries();
        setNationalities(countries.map(country => ({
          code: country.code,
          nationality: country.nationality
        })));
      } catch (error) {
        console.error('Error loading nationalities:', error);
      }
    };

    loadNationalities();
  }, []);

  const loadPersonalInfo = async () => {
    if (!cvId) {
      setError('CV ID is not available');
      return;
    }

    if (!navigator.onLine) {
      setError('You are currently offline. Please check your internet connection and try again.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const data = await api.personalInfo.get(cvId);
      if (data) {
        setFormData({
          ...data,
          profileSummaries: data.profileSummaries?.length > 0 
            ? data.profileSummaries 
            : [{ id: generateId(), content: '' }]
        });
      }
    } catch (error) {
      console.error('Error loading personal info:', error);
      let errorMessage = 'Failed to load personal information. ';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage += 'Please check your internet connection and try again.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonalInfo();
  }, [cvId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSummaryChange = (id: string, content: string) => {
    setFormData(prev => ({
      ...prev,
      profileSummaries: prev.profileSummaries.map(summary =>
        summary.id === id ? { ...summary, content } : summary
      )
    }));
  };

  const addSummary = () => {
    setFormData(prev => ({
      ...prev,
      profileSummaries: [...prev.profileSummaries, { id: generateId(), content: '' }]
    }));
  };

  const removeSummary = (id: string) => {
    if (formData.profileSummaries.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      profileSummaries: prev.profileSummaries.filter(summary => summary.id !== id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvId) {
      setError('CV ID is not available');
      return;
    }

    if (!navigator.onLine) {
      setError('You are currently offline. Please check your internet connection and try again.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const savedData = await api.personalInfo.save(cvId, formData);
      onSave({
        ...formData,
        profileSummaries: savedData.profile_summaries || []
      });
      setSuccess('Personal information saved successfully!');
    } catch (error) {
      console.error('Error saving personal info:', error);
      let errorMessage = 'Failed to save personal information. ';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage += 'Please check your internet connection and try again.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card title="Personal Information">
        <div className="p-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button
              type="button"
              variant="outline"
              onClick={loadPersonalInfo}
              icon={<RefreshCw size={16} />}
              disabled={loading}
            >
              {loading ? 'Retrying...' : 'Try Again'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (loading && !formData.firstName) {
    return (
      <Card title="Personal Information">
        <div className="p-4 text-center text-gray-600">
          Loading personal information...
        </div>
      </Card>
    );
  }

  return (
    <Card title="Personal Information">
      <form onSubmit={handleSubmit}>
        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <User className="text-gray-400 mr-2" size={18} />
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
            />
          </div>
          <div className="flex items-center">
            <User className="text-gray-400 mr-2" size={18} />
            <Input
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="William"
            />
          </div>
          <div className="flex items-center">
            <User className="text-gray-400 mr-2" size={18} />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
          </div>
          <div className="flex items-center">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <Input
              type="date"
              label="Birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center">
            <Flag className="text-gray-400 mr-2" size={18} />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="nationalityCode"
                value={formData.nationalityCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select nationality</option>
                {nationalities.map(({ code, nationality }) => (
                  <option key={code} value={code}>
                    {nationality}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <Heart className="text-gray-400 mr-2" size={18} />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship Status
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="relationshipStatus"
                value={formData.relationshipStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select status</option>
                {relationshipStatuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <Briefcase className="text-gray-400 mr-2" size={18} />
            <Input
              label="Professional Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Software Engineer"
              required
            />
          </div>
          <div className="flex items-center">
            <Mail className="text-gray-400 mr-2" size={18} />
            <Input
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              required
            />
          </div>
          <div className="flex items-center">
            <Phone className="text-gray-400 mr-2" size={18} />
            <Input
              type="tel"
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
          </div>
          
          <div className="flex items-center">
            <Home className="text-gray-400 mr-2" size={18} />
            <Input
              label="Street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Main Street"
              required
            />
          </div>
          <div className="flex items-center">
            <Home className="text-gray-400 mr-2" size={18} />
            <Input
              label="Street Number"
              name="streetNumber"
              value={formData.streetNumber}
              onChange={handleChange}
              placeholder="123"
              required
            />
          </div>
          <div className="flex items-center">
            <MapPin className="text-gray-400 mr-2" size={18} />
            <Input
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="12345"
              required
            />
          </div>
          <div className="flex items-center">
            <MapPin className="text-gray-400 mr-2" size={18} />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
              required
            />
          </div>
          <div className="flex items-center">
            <MapPin className="text-gray-400 mr-2" size={18} />
            <Input
              label="State/Province"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="NY"
            />
          </div>
          <div className="flex items-center">
            <Flag className="text-gray-400 mr-2" size={18} />
            <CountrySelect
              label="Country"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center">
            <Globe className="text-gray-400 mr-2" size={18} />
            <Input
              type="url"
              label="Website"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="flex items-center">
            <Linkedin className="text-gray-400 mr-2" size={18} />
            <Input
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="flex items-center">
            <Github className="text-gray-400 mr-2" size={18} />
            <Input
              label="GitHub"
              name="github"
              value={formData.github || ''}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Professional Summary</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSummary}
              icon={<Plus size={16} />}
            >
              Add Summary
            </Button>
          </div>
          
          {formData.profileSummaries.map((summary, index) => (
            <div key={summary.id} className="mb-4">
              <div className="flex items-start">
                <TextArea
                  label={`Summary ${index + 1}`}
                  value={summary.content}
                  onChange={(e) => handleSummaryChange(summary.id, e.target.value)}
                  placeholder="A brief summary of your professional background, skills, and career goals..."
                  rows={4}
                  required
                  className="flex-1"
                />
                {formData.profileSummaries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSummary(summary.id)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Personal Information'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PersonalInfoForm;