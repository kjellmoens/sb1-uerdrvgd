import React, { useState, useEffect } from 'react';
import { WorkExperience, Position } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CompanySelect from '../ui/CompanySelect';
import TextArea from '../ui/TextArea';
import PositionForm from './PositionForm';
import { Plus } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';

interface WorkExperienceFormProps {
  experiences: WorkExperience[];
  onSave: (experiences: WorkExperience[]) => void;
  cvId: string;
}

const emptyPosition: Omit<Position, 'id'> = {
  title: '',
  startDate: null,
  endDate: null,
  current: false,
  description: '',
  responsibilities: [''],
  achievements: [],
  projects: []
};

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({ experiences, onSave, cvId }) => {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(
    experiences.length ? experiences : [{
      id: generateId(),
      company: '',
      location: '',
      sector: '',
      description: '',
      url: '',
      positions: [{ ...emptyPosition, id: generateId() }]
    }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkExperience();
  }, [cvId]);

  const loadWorkExperience = async () => {
    if (!cvId) {
      setError('CV ID is not available');
      return;
    }

    try {
      setError(null);
      const data = await api.workExperience.list(cvId);
      setWorkExperiences(data.length ? data : [{
        id: generateId(),
        company: '',
        location: '',
        sector: '',
        description: '',
        url: '',
        positions: [{ ...emptyPosition, id: generateId() }]
      }]);
    } catch (error) {
      console.error('Error loading work experience:', error);
      setError('Failed to load work experience');
    }
  };

  const handleCompanySelect = (expIndex: number, company: any) => {
    setWorkExperiences(prev =>
      prev.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              company: company.name,
              location: company.city,
              sector: company.industry,
              description: company.description,
              url: company.website || ''
            }
          : exp
      )
    );
  };

  const handleExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => 
        i === index 
          ? { ...exp, [field]: value } 
          : exp
      )
    );
  };

  const addPosition = (expIndex: number) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => {
        if (i !== expIndex) return exp;
        
        return {
          ...exp,
          positions: [...exp.positions, { ...emptyPosition, id: generateId() }]
        };
      })
    );
  };

  const removePosition = (expIndex: number, posIndex: number) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => {
        if (i !== expIndex) return exp;
        if (exp.positions.length <= 1) return exp;
        
        return {
          ...exp,
          positions: exp.positions.filter((_, index) => index !== posIndex)
        };
      })
    );
  };

  const handlePositionChange = (expIndex: number, posIndex: number, position: Position) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => {
        if (i !== expIndex) return exp;
        
        const newPositions = [...exp.positions];
        newPositions[posIndex] = position;
        
        return {
          ...exp,
          positions: newPositions
        };
      })
    );
  };

  const addExperience = () => {
    setWorkExperiences(prev => [
      ...prev,
      {
        id: generateId(),
        company: '',
        location: '',
        sector: '',
        description: '',
        url: '',
        positions: [{ ...emptyPosition, id: generateId() }]
      }
    ]);
  };

  const removeExperience = (index: number) => {
    setWorkExperiences(prev => prev.filter((_, i) => i !== index));
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
      await api.workExperience.save(cvId, workExperiences);
      onSave(workExperiences);
    } catch (error) {
      console.error('Error saving work experience:', error);
      setError('Failed to save work experience');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card title="Work Experience">
        <div className="text-red-600 p-4">{error}</div>
      </Card>
    );
  }

  return (
    <Card title="Work Experience">
      <form onSubmit={handleSubmit}>
        {workExperiences.map((experience, expIndex) => (
          <div 
            key={experience.id} 
            className={`${expIndex > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Company {expIndex + 1}
              </h3>
              {workExperiences.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeExperience(expIndex)}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <CompanySelect
                  value={null}
                  onChange={(company) => handleCompanySelect(expIndex, company)}
                />
              </div>
              
              <div className="md:col-span-2">
                <TextArea
                  label="Description"
                  name={`description-${expIndex}`}
                  value={experience.description}
                  onChange={(e) => handleExperienceChange(expIndex, 'description', e.target.value)}
                  placeholder="Brief description of the company and its business..."
                  rows={3}
                  required
                />
              </div>
            </div>
            
            {experience.positions.map((position, posIndex) => (
              <PositionForm
                key={position.id}
                position={position}
                onSave={(updatedPosition) => handlePositionChange(expIndex, posIndex, updatedPosition)}
                onRemove={() => removePosition(expIndex, posIndex)}
                isOnly={experience.positions.length === 1}
              />
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => addPosition(expIndex)}
              icon={<Plus size={18} />}
              className="mt-4"
            >
              Add Another Position
            </Button>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addExperience}
            icon={<Plus size={18} />}
          >
            Add Another Company
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Work Experience'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default WorkExperienceForm;