import React, { useState, useEffect } from 'react';
import { WorkExperience, Position } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Building, MapPin, Calendar, Trash2, Plus, ListChecks, Briefcase, ExternalLink, Code } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';
import { supabase } from '../../lib/db';

interface WorkExperienceFormProps {
  experiences: WorkExperience[];
  onSave: (experiences: WorkExperience[]) => void;
  cvId: string;
}

const emptyPosition: Omit<Position, 'id'> = {
  title: '',
  startDate: '',
  endDate: null,
  current: false,
  description: '',
  responsibilities: [''],
  achievements: [''],
  skills: [],
  projects: []
};

const emptyExperience: Omit<WorkExperience, 'id'> = {
  company: '',
  location: '',
  sector: '',
  description: '',
  url: '',
  positions: [{ ...emptyPosition, id: generateId() }]
};

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({ experiences, onSave, cvId }) => {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(
    experiences.length ? experiences : [{ ...emptyExperience, id: generateId() }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkExperience = async () => {
      if (!cvId) {
        setError('CV ID is not available');
        return;
      }

      try {
        setError(null);
        const { data: workExpData, error: workExpError } = await supabase
          .from('work_experience')
          .select(`
            id,
            company,
            location,
            sector,
            description,
            url,
            positions (
              id,
              title,
              start_date,
              end_date,
              current,
              description,
              position_responsibilities (
                content
              ),
              position_achievements (
                content
              )
            )
          `)
          .eq('cv_id', cvId)
          .order('updated_at', { ascending: false });

        if (workExpError) throw workExpError;

        if (workExpData && workExpData.length > 0) {
          const transformedData = workExpData.map(exp => ({
            id: exp.id,
            company: exp.company,
            location: exp.location,
            sector: exp.sector,
            description: exp.description,
            url: exp.url || '',
            positions: exp.positions.map(pos => ({
              id: pos.id,
              title: pos.title,
              startDate: pos.start_date,
              endDate: pos.end_date || null,
              current: pos.current || false,
              description: pos.description,
              responsibilities: pos.position_responsibilities.map(r => r.content),
              achievements: pos.position_achievements.map(a => a.content),
              skills: [],
              projects: []
            }))
          }));
          setWorkExperiences(transformedData);
        }
      } catch (error) {
        console.error('Error loading work experience:', error);
        setError('Failed to load work experience');
      }
    };

    loadWorkExperience();
  }, [cvId]);

  const handleExperienceChange = (index: number, field: keyof Omit<WorkExperience, 'positions'>, value: string) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => 
        i === index 
          ? { ...exp, [field]: value } 
          : exp
      )
    );
  };

  const handlePositionChange = (expIndex: number, posIndex: number, field: keyof Position, value: string | boolean) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => {
        if (i !== expIndex) return exp;
        
        const newPositions = [...exp.positions];
        newPositions[posIndex] = {
          ...newPositions[posIndex],
          [field]: field === 'endDate' && (value === '' || !value) ? null : value
        };
        
        return {
          ...exp,
          positions: newPositions
        };
      })
    );
  };

  const handleListChange = (
    expIndex: number, 
    posIndex: number,
    listType: 'responsibilities' | 'achievements',
    itemIndex: number, 
    value: string
  ) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => {
        if (i !== expIndex) return exp;
        
        const newPositions = [...exp.positions];
        const newList = [...newPositions[posIndex][listType]];
        newList[itemIndex] = value;
        
        newPositions[posIndex] = {
          ...newPositions[posIndex],
          [listType]: newList
        };
        
        return {
          ...exp,
          positions: newPositions
        };
      })
    );
  };

  const addListItem = (
    expIndex: number, 
    posIndex: number,
    listType: 'responsibilities' | 'achievements'
  ) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => {
        if (i !== expIndex) return exp;
        
        const newPositions = [...exp.positions];
        newPositions[posIndex] = {
          ...newPositions[posIndex],
          [listType]: [...newPositions[posIndex][listType], '']
        };
        
        return {
          ...exp,
          positions: newPositions
        };
      })
    );
  };

  const removeListItem = (
    expIndex: number, 
    posIndex: number,
    listType: 'responsibilities' | 'achievements',
    itemIndex: number
  ) => {
    setWorkExperiences(prev => 
      prev.map((exp, i) => {
        if (i !== expIndex) return exp;
        
        const newPositions = [...exp.positions];
        const newList = newPositions[posIndex][listType].filter((_, index) => index !== itemIndex);
        
        newPositions[posIndex] = {
          ...newPositions[posIndex],
          [listType]: newList.length ? newList : ['']
        };
        
        return {
          ...exp,
          positions: newPositions
        };
      })
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

  const addExperience = () => {
    setWorkExperiences(prev => [
      ...prev,
      { ...emptyExperience, id: generateId() }
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
    setSuccess(null);

    try {
      await api.workExperience.save(cvId, workExperiences);
      onSave(workExperiences);
      setSuccess('Work experience saved successfully!');
    } catch (error) {
      console.error('Error saving work experience:', error);
      setError('Failed to save work experience');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentChange = (expIndex: number, posIndex: number, checked: boolean) => {
    handlePositionChange(expIndex, posIndex, 'current', checked);
    if (checked) {
      handlePositionChange(expIndex, posIndex, 'endDate', null);
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
        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
            {success}
          </div>
        )}

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
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center md:col-span-2">
                <Building className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Company"
                  name={`company-${expIndex}`}
                  value={experience.company}
                  onChange={(e) => handleExperienceChange(expIndex, 'company', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Briefcase className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Industry/Sector"
                  name={`sector-${expIndex}`}
                  value={experience.sector}
                  onChange={(e) => handleExperienceChange(expIndex, 'sector', e.target.value)}
                  placeholder="Technology, Healthcare, etc."
                  required
                />
              </div>
              
              <div className="flex items-center">
                <MapPin className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Location"
                  name={`location-${expIndex}`}
                  value={experience.location}
                  onChange={(e) => handleExperienceChange(expIndex, 'location', e.target.value)}
                  placeholder="City, Country"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <ExternalLink className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Company Website"
                  type="url"
                  name={`url-${expIndex}`}
                  value={experience.url || ''}
                  onChange={(e) => handleExperienceChange(expIndex, 'url', e.target.value)}
                  placeholder="https://company.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <TextArea
                  label="Company Description"
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
              <div 
                key={position.id}
                className="mb-8 pb-8 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Position {posIndex + 1}
                  </h4>
                  {experience.positions.length > 1 && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => removePosition(expIndex, posIndex)}
                      icon={<Trash2 size={16} />}
                    >
                      Remove Position
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Position Title"
                    name={`title-${expIndex}-${posIndex}`}
                    value={position.title}
                    onChange={(e) => handlePositionChange(expIndex, posIndex, 'title', e.target.value)}
                    placeholder="Job Title"
                    required
                  />
                  
                  <div className="flex items-center">
                    <Calendar className="text-gray-400 mr-2" size={18} />
                    <Input
                      label="Start Date"
                      type="date"
                      name={`startDate-${expIndex}-${posIndex}`}
                      value={position.startDate}
                      onChange={(e) => handlePositionChange(expIndex, posIndex, 'startDate', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id={`current-${expIndex}-${posIndex}`}
                      checked={position.current}
                      onChange={(e) => handleCurrentChange(expIndex, posIndex, e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`current-${expIndex}-${posIndex}`} className="text-sm text-gray-700">
                      I currently work in this position
                    </label>
                  </div>
                  
                  {!position.current && (
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2" size={18} />
                      <Input
                        label="End Date"
                        type="date"
                        name={`endDate-${expIndex}-${posIndex}`}
                        value={position.endDate || ''}
                        onChange={(e) => handlePositionChange(expIndex, posIndex, 'endDate', e.target.value)}
                        required={!position.current}
                        disabled={position.current}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <TextArea
                    label="Position Description"
                    name={`description-${expIndex}-${posIndex}`}
                    value={position.description}
                    onChange={(e) => handlePositionChange(expIndex, posIndex, 'description', e.target.value)}
                    placeholder="Describe your role and overall responsibilities..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <ListChecks size={18} className="text-gray-500 mr-2" />
                    <label className="block text-sm font-medium text-gray-700">
                      Key Responsibilities
                    </label>
                  </div>
                  
                  {position.responsibilities.map((responsibility, respIndex) => (
                    <div key={respIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={responsibility}
                        onChange={(e) => handleListChange(expIndex, posIndex, 'responsibilities', respIndex, e.target.value)}
                        placeholder="Describe a key responsibility"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
                        required={respIndex === 0}
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeListItem(expIndex, posIndex, 'responsibilities', respIndex)}
                        disabled={position.responsibilities.length <= 1 && respIndex === 0}
                        className={`p-2 rounded-lg ${
                          position.responsibilities.length <= 1 && respIndex === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addListItem(expIndex, posIndex, 'responsibilities')}
                    icon={<Plus size={16} />}
                    className="mt-2"
                  >
                    Add Responsibility
                  </Button>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <ListChecks size={18} className="text-gray-500 mr-2" />
                    <label className="block text-sm font-medium text-gray-700">
                      Key Achievements
                    </label>
                  </div>
                  
                  {position.achievements.map((achievement, achieveIndex) => (
                    <div key={achieveIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => handleListChange(expIndex, posIndex, 'achievements', achieveIndex, e.target.value)}
                        placeholder="Describe a key achievement"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
                        required={achieveIndex === 0}
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeListItem(expIndex, posIndex, 'achievements', achieveIndex)}
                        disabled={position.achievements.length <= 1 && achieveIndex === 0}
                        className={`p-2 rounded-lg ${
                          position.achievements.length <= 1 && achieveIndex === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addListItem(expIndex, posIndex, 'achievements')}
                    icon={<Plus size={16} />}
                    className="mt-2"
                  >
                    Add Achievement
                  </Button>
                </div>
              </div>
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