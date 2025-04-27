import React, { useState } from 'react';
import { Education } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Calendar, Trash2, Plus, GraduationCap, MapPin } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface EducationFormProps {
  education: Education[];
  onSave: (education: Education[]) => void;
}

const emptyEducation: Omit<Education, 'id'> = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  current: false,
  location: '',
  description: ''
};

const EducationForm: React.FC<EducationFormProps> = ({ education, onSave }) => {
  const [educationList, setEducationList] = useState<Education[]>(
    education.length ? education : [{ ...emptyEducation, id: generateId() }]
  );

  const handleChange = (index: number, field: keyof Education, value: string | boolean) => {
    setEducationList(prev => 
      prev.map((edu, i) => 
        i === index 
          ? { ...edu, [field]: value } 
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(educationList);
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
  };

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
              <div className="flex items-center md:col-span-2">
                <GraduationCap className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Institution"
                  name={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  placeholder="University of California, Berkeley"
                  required
                />
              </div>
              
              <Input
                label="Degree"
                name={`degree-${index}`}
                value={edu.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
                required
              />
              
              <Input
                label="Field of Study"
                name={`fieldOfStudy-${index}`}
                value={edu.fieldOfStudy}
                onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                placeholder="Computer Science"
                required
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
                    value={edu.endDate || ''}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    required={!edu.current}
                    disabled={edu.current}
                  />
                </div>
              )}
              
              <div className="flex items-center">
                <MapPin className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Location"
                  name={`location-${index}`}
                  value={edu.location}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  placeholder="Berkeley, CA, USA"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <TextArea
                label="Description (Optional)"
                name={`description-${index}`}
                value={edu.description || ''}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Additional details, achievements, honors, etc."
                rows={3}
              />
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
          
          <Button type="submit">
            Save Education
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EducationForm;