import React, { useState, useEffect } from 'react';
import { Education } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CompanySelect from '../ui/CompanySelect';
import SkillSelect from '../ui/SkillSelect';
import { Calendar, Trash2, Plus, GraduationCap, Code } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';

interface EducationFormProps {
  education: Education[];
  onSave: (education: Education[]) => void;
  cvId: string;
}

const emptyEducation: Omit<Education, 'id'> = {
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  company: undefined,
  skills: []
};

const EducationForm: React.FC<EducationFormProps> = ({ education, onSave, cvId }) => {
  const [educationList, setEducationList] = useState<Education[]>(
    education.length ? education : [{ ...emptyEducation, id: generateId() }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const loadEducation = async () => {
      if (!cvId) {
        setError('CV ID is not available');
        return;
      }

      try {
        setError(null);
        const data = await api.education.list(cvId);
        setEducationList(data.length ? data : [{ ...emptyEducation, id: generateId() }]);
      } catch (error) {
        console.error('Error loading education:', error);
        setError('Failed to load education');
      }
    };

    loadEducation();
  }, [cvId]);

  const handleChange = (index: number, field: keyof Education, value: string | boolean) => {
    setEducationList(prev => 
      prev.map((edu, i) => 
        i === index 
          ? { ...edu, [field]: value } 
          : edu
      )
    );
    
    // Clear validation errors for the changed field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${index}-${field}`];
      return newErrors;
    });
  };

  const handleCompanySelect = (index: number, company: Education['company']) => {
    setEducationList(prev =>
      prev.map((edu, i) =>
        i === index
          ? { ...edu, company }
          : edu
      )
    );
    
    // Clear company validation error
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${index}-company`];
      return newErrors;
    });
  };

  const handleSkillSelect = (index: number, skill: Education['skills'][0]) => {
    setEducationList(prev =>
      prev.map((edu, i) =>
        i === index
          ? {
              ...edu,
              skills: [...(edu.skills || []), skill]
            }
          : edu
      )
    );
  };

  const handleRemoveSkill = (eduIndex: number, skillIndex: number) => {
    setEducationList(prev =>
      prev.map((edu, i) =>
        i === eduIndex
          ? {
              ...edu,
              skills: edu.skills?.filter((_, sIndex) => sIndex !== skillIndex) || []
            }
          : edu
      )
    );
  };

  const addEducation = () => {
    setEducationList(prev => [
      ...prev,
      { ...emptyEducation, id: generateId() }
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList(prev => prev.filter((_, i) => i !== index));
    
    // Remove validation errors for the removed education
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${index}-`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleCurrentChange = (index: number, checked: boolean) => {
    setEducationList(prev => 
      prev.map((edu, i) => 
        i === index 
          ? { 
              ...edu, 
              current: checked,
              endDate: checked ? '' : edu.endDate
            } 
          : edu
      )
    );
    
    // Clear end date validation error if current is checked
    if (checked) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${index}-endDate`];
        return newErrors;
      });
    }
  };

  const validateEducation = (edu: Education, index: number): boolean => {
    const errors: Record<string, string[]> = {};

    if (!edu.company) {
      errors[`${index}-company`] = ['Institution is required'];
    }

    if (!edu.degree?.trim()) {
      errors[`${index}-degree`] = ['Degree is required'];
    }

    if (!edu.fieldOfStudy?.trim()) {
      errors[`${index}-fieldOfStudy`] = ['Field of study is required'];
    }

    if (!edu.startDate) {
      errors[`${index}-startDate`] = ['Start date is required'];
    }

    if (!edu.current && !edu.endDate) {
      errors[`${index}-endDate`] = ['End date is required for non-current education'];
    }

    if (edu.startDate && edu.endDate && !edu.current) {
      const start = new Date(edu.startDate);
      const end = new Date(edu.endDate);
      if (end < start) {
        errors[`${index}-endDate`] = ['End date must be after start date'];
      }
    }

    setValidationErrors(prev => ({
      ...prev,
      ...errors
    }));

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvId) {
      setError('CV ID is not available');
      return;
    }

    // Clear previous errors
    setError(null);
    setValidationErrors({});

    // Validate all education entries
    const isValid = educationList.every((edu, index) => validateEducation(edu, index));

    if (!isValid) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // Preserve line breaks in description by replacing \n with <br>
      const formattedEducationList = educationList.map(edu => ({
        ...edu,
        description: edu.description?.replace(/\r\n/g, '\n') || ''
      }));

      const savedEducation = await api.education.save(cvId, formattedEducationList);
      onSave(savedEducation);
    } catch (error) {
      console.error('Error saving education:', error);
      setError('Failed to save education. Please ensure all required fields are filled out correctly.');
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (index: number, field: string): string | undefined => {
    const errors = validationErrors[`${index}-${field}`];
    return errors ? errors[0] : undefined;
  };

  if (error) {
    return (
      <Card title="Education">
        <div className="text-red-600 p-4">{error}</div>
        <div className="mt-4">
          <Button onClick={() => setError(null)}>Dismiss Error</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Education">
      <form onSubmit={handleSubmit}>
        {educationList.map((edu, index) => (
          <div 
            key={edu.id} 
            className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Education {index + 1}
              </h3>
              {educationList.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeEducation(index)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <CompanySelect
                  value={edu.company}
                  onChange={(company) => handleCompanySelect(index, company)}
                  error={getFieldError(index, 'company')}
                />
              </div>
              
              <Input
                label="Degree"
                name={`degree-${index}`}
                value={edu.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
                required
                error={getFieldError(index, 'degree')}
              />
              
              <Input
                label="Field of Study"
                name={`fieldOfStudy-${index}`}
                value={edu.fieldOfStudy}
                onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                placeholder="Computer Science"
                required
                error={getFieldError(index, 'fieldOfStudy')}
              />
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Start Date"
                  type="date"
                  name={`startDate-${index}`}
                  value={edu.startDate}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  required
                  error={getFieldError(index, 'startDate')}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={edu.current}
                  onChange={(e) => handleCurrentChange(index, e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`current-${index}`} className="text-sm text-gray-700">
                  I am currently studying here
                </label>
              </div>
              
              {!edu.current && (
                <div className="flex items-center">
                  <Calendar className="text-gray-400 mr-2" size={18} />
                  <Input
                    label="End Date"
                    type="date"
                    name={`endDate-${index}`}
                    value={edu.endDate}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    required={!edu.current}
                    disabled={edu.current}
                    error={getFieldError(index, 'endDate')}
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <TextArea
                label="Description (Optional)"
                name={`description-${index}`}
                value={edu.description || ''}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Additional details, achievements, honors, etc."
                rows={3}
                className="whitespace-pre-wrap"
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Code className="text-gray-400 mr-2" size={18} />
                <label className="block text-sm font-medium text-gray-700">
                  Related Skills
                </label>
              </div>
              
              <div className="space-y-2">
                {edu.skills?.map((skill, skillIndex) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                      <div className="font-medium text-gray-900">{skill.name}</div>
                      <div className="text-sm text-gray-500">{skill.domain} • {skill.subdomain}</div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveSkill(index, skillIndex)}
                      icon={<Trash2 size={16} />}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                <SkillSelect
                  onChange={(skill) => skill && handleSkillSelect(index, skill)}
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addEducation}
            icon={<Plus size={18} />}
          >
            Add Another Education
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Education'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EducationForm;