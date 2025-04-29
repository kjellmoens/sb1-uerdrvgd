import React, { useState, useEffect } from 'react';
import { Training } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CompanySelect from '../ui/CompanySelect';
import SkillSelect from '../ui/SkillSelect';
import { Calendar, Trash2, Plus, GraduationCap, Code } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';

interface TrainingsFormProps {
  trainings: Training[];
  onSave: (trainings: Training[]) => void;
  cvId: string;
}

const emptyTraining: Omit<Training, 'id'> = {
  title: '',
  completionDate: '',
  description: '',
  company: undefined,
  skills: []
};

const TrainingsForm: React.FC<TrainingsFormProps> = ({ trainings, onSave, cvId }) => {
  const [userTrainings, setUserTrainings] = useState<Training[]>(
    trainings.length ? trainings : [{ ...emptyTraining, id: generateId() }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrainings = async () => {
      if (!cvId) {
        setError('CV ID is not available');
        return;
      }

      try {
        setError(null);
        const data = await api.trainings.list(cvId);
        setUserTrainings(data.length ? data : [{ ...emptyTraining, id: generateId() }]);
      } catch (error) {
        console.error('Error loading trainings:', error);
        setError('Failed to load trainings');
      }
    };

    loadTrainings();
  }, [cvId]);

  const handleChange = (index: number, field: keyof Training, value: string) => {
    setUserTrainings(prev => 
      prev.map((training, i) => 
        i === index 
          ? { ...training, [field]: value } 
          : training
      )
    );
  };

  const handleCompanySelect = (index: number, company: Training['company']) => {
    setUserTrainings(prev =>
      prev.map((training, i) =>
        i === index
          ? { ...training, company }
          : training
      )
    );
  };

  const handleSkillSelect = (index: number, skill: Training['skills'][0]) => {
    setUserTrainings(prev =>
      prev.map((training, i) =>
        i === index
          ? {
              ...training,
              skills: [...(training.skills || []), skill]
            }
          : training
      )
    );
  };

  const handleRemoveSkill = (trainingIndex: number, skillIndex: number) => {
    setUserTrainings(prev =>
      prev.map((training, i) =>
        i === trainingIndex
          ? {
              ...training,
              skills: training.skills?.filter((_, sIndex) => sIndex !== skillIndex) || []
            }
          : training
      )
    );
  };

  const addTraining = () => {
    setUserTrainings(prev => [
      ...prev,
      { ...emptyTraining, id: generateId() }
    ]);
  };

  const removeTraining = (index: number) => {
    setUserTrainings(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvId) {
      setError('CV ID is not available');
      return;
    }

    // Validate all required fields
    const invalidTrainings = userTrainings.filter(training => 
      !training.title?.trim() ||
      !training.completionDate?.trim() ||
      !training.company
    );

    if (invalidTrainings.length > 0) {
      setError('Please fill in all required fields for all trainings');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedTrainings = await api.trainings.save(cvId, userTrainings);
      onSave(savedTrainings);
    } catch (error) {
      console.error('Error saving trainings:', error);
      setError('Failed to save trainings');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card title="Training & Courses">
        <div className="text-red-600 p-4">{error}</div>
      </Card>
    );
  }

  return (
    <Card title="Training & Courses">
      <form onSubmit={handleSubmit}>
        {userTrainings.map((training, index) => (
          <div 
            key={training.id} 
            className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Training {index + 1}
              </h3>
              {userTrainings.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeTraining(index)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Course/Training Title"
                name={`title-${index}`}
                value={training.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                placeholder="Advanced Web Development"
                required
                className="md:col-span-2"
              />
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Provider
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <CompanySelect
                  value={training.company}
                  onChange={(company) => handleCompanySelect(index, company)}
                />
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Completion Date"
                  type="date"
                  name={`completionDate-${index}`}
                  value={training.completionDate}
                  onChange={(e) => handleChange(index, 'completionDate', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <TextArea
                label="Description"
                name={`description-${index}`}
                value={training.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Describe what you learned, skills gained, etc."
                rows={3}
                required
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
                {training.skills?.map((skill, skillIndex) => (
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
            onClick={addTraining}
            icon={<Plus size={18} />}
          >
            Add Another Training
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Trainings'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TrainingsForm;