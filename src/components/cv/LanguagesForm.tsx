import React, { useState, useEffect } from 'react';
import { Language, LanguageProficiency } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Languages, Calendar, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';

interface LanguagesFormProps {
  languages: Language[];
  onSave: (languages: Language[]) => void;
  cvId: string;
}

const emptyLanguage: Omit<Language, 'id'> = {
  name: '',
  proficiency: LanguageProficiency.Beginner,
  certificate: '',
  certificateDate: '',
  certificateUrl: '',
  notes: ''
};

const LanguagesForm: React.FC<LanguagesFormProps> = ({ languages, onSave, cvId }) => {
  const [userLanguages, setUserLanguages] = useState<Language[]>(
    languages.length ? languages : [{ ...emptyLanguage, id: generateId() }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguages = async () => {
      if (!cvId) {
        setError('CV ID is not available');
        return;
      }

      try {
        setError(null);
        const data = await api.languages.list(cvId);
        setUserLanguages(data.length ? data : [{ ...emptyLanguage, id: generateId() }]);
      } catch (error) {
        console.error('Error loading languages:', error);
        setError('Failed to load languages');
      }
    };

    loadLanguages();
  }, [cvId]);

  const handleChange = (index: number, field: keyof Language, value: string | LanguageProficiency) => {
    setUserLanguages(prev => 
      prev.map((lang, i) => 
        i === index 
          ? { ...lang, [field]: value } 
          : lang
      )
    );
  };

  const addLanguage = () => {
    setUserLanguages(prev => [
      ...prev,
      { ...emptyLanguage, id: generateId() }
    ]);
  };

  const removeLanguage = (index: number) => {
    setUserLanguages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvId) {
      setError('CV ID is not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedLanguages = await api.languages.save(cvId, userLanguages);
      onSave(savedLanguages);
    } catch (error) {
      console.error('Error saving languages:', error);
      setError('Failed to save languages');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card title="Languages">
        <div className="text-red-600 p-4">{error}</div>
      </Card>
    );
  }

  return (
    <Card title="Languages">
      <form onSubmit={handleSubmit}>
        {userLanguages.map((language, index) => (
          <div 
            key={language.id} 
            className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Language {index + 1}
              </h3>
              {userLanguages.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeLanguage(index)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Languages className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Language"
                  name={`name-${index}`}
                  value={language.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="English, Spanish, etc."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={language.proficiency}
                  onChange={(e) => handleChange(index, 'proficiency', e.target.value as LanguageProficiency)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {Object.values(LanguageProficiency).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Certificate (if any)"
                name={`certificate-${index}`}
                value={language.certificate || ''}
                onChange={(e) => handleChange(index, 'certificate', e.target.value)}
                placeholder="TOEFL, IELTS, DELF, etc."
              />
              
              {language.certificate && (
                <>
                  <div className="flex items-center">
                    <Calendar className="text-gray-400 mr-2" size={18} />
                    <Input
                      label="Certificate Date"
                      type="date"
                      name={`certificateDate-${index}`}
                      value={language.certificateDate || ''}
                      onChange={(e) => handleChange(index, 'certificateDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center md:col-span-2">
                    <ExternalLink className="text-gray-400 mr-2" size={18} />
                    <Input
                      label="Certificate URL"
                      type="url"
                      name={`certificateUrl-${index}`}
                      value={language.certificateUrl || ''}
                      onChange={(e) => handleChange(index, 'certificateUrl', e.target.value)}
                      placeholder="https://example.com/certificate"
                    />
                  </div>
                </>
              )}
              
              <div className="md:col-span-2">
                <TextArea
                  label="Additional Notes"
                  name={`notes-${index}`}
                  value={language.notes || ''}
                  onChange={(e) => handleChange(index, 'notes', e.target.value)}
                  placeholder="Additional information about your language skills..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addLanguage}
            icon={<Plus size={18} />}
          >
            Add Another Language
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Languages'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LanguagesForm;