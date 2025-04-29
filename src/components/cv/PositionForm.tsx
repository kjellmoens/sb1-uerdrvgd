import React from 'react';
import { Position } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import PositionProjectsList from './PositionProjectsList';
import { Calendar, Trash2, Plus, ListChecks } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface PositionFormProps {
  position: Position;
  onSave: (position: Position) => void;
  onRemove: () => void;
  isOnly: boolean;
}

const PositionForm: React.FC<PositionFormProps> = ({ position, onSave, onRemove, isOnly }) => {
  const handleChange = (field: keyof Position, value: string | boolean | null) => {
    onSave({
      ...position,
      [field]: value
    });
  };

  const handleListChange = (
    listType: 'responsibilities' | 'achievements',
    itemIndex: number, 
    value: string
  ) => {
    const newList = [...position[listType]];
    newList[itemIndex] = value;
    
    onSave({
      ...position,
      [listType]: newList
    });
  };

  const addListItem = (listType: 'responsibilities' | 'achievements') => {
    onSave({
      ...position,
      [listType]: [...position[listType], '']
    });
  };

  const removeListItem = (listType: 'responsibilities' | 'achievements', itemIndex: number) => {
    onSave({
      ...position,
      [listType]: position[listType].filter((_, index) => index !== itemIndex)
    });
  };

  const handleCurrentChange = (checked: boolean) => {
    onSave({
      ...position,
      current: checked,
      endDate: checked ? null : position.endDate
    });
  };

  const handleProjectsChange = (projects: Position['projects']) => {
    onSave({
      ...position,
      projects
    });
  };

  return (
    <div className="border-l border-gray-200 pl-4 avoid-break">
      <div className="flex justify-between">
        <h4 className="font-medium text-gray-900">Position Details</h4>
        {!isOnly && (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={onRemove}
            icon={<Trash2 size={16} />}
          >
            Remove Position
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          label="Position Title"
          name="title"
          value={position.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Job Title"
          required
        />
        
        <div className="flex items-center">
          <Calendar className="text-gray-400 mr-2" size={18} />
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={position.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />
        </div>
        
        <div className="col-span-1 md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id={`current-${position.id}`}
            checked={position.current}
            onChange={(e) => handleCurrentChange(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={`current-${position.id}`} className="text-sm text-gray-700">
            I currently work in this position
          </label>
        </div>
        
        {!position.current && (
          <div className="flex items-center">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={position.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              required={!position.current}
              disabled={position.current}
            />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <TextArea
          label="Position Description"
          name="description"
          value={position.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe your role and responsibilities..."
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
              onChange={(e) => handleListChange('responsibilities', respIndex, e.target.value)}
              placeholder="Describe a key responsibility"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
              required={respIndex === 0}
            />
            
            <button
              type="button"
              onClick={() => removeListItem('responsibilities', respIndex)}
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
          onClick={() => addListItem('responsibilities')}
          icon={<Plus size={16} />}
          className="mt-2"
        >
          Add Responsibility
        </Button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Key Achievements (Optional)
          </label>
          {position.achievements.length === 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addListItem('achievements')}
              icon={<Plus size={16} />}
            >
              Add Achievements
            </Button>
          )}
        </div>
        
        {position.achievements.map((achievement, achieveIndex) => (
          <div key={achieveIndex} className="flex items-center mb-2">
            <input
              type="text"
              value={achievement}
              onChange={(e) => handleListChange('achievements', achieveIndex, e.target.value)}
              placeholder="Describe a key achievement"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
            />
            
            <button
              type="button"
              onClick={() => removeListItem('achievements', achieveIndex)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        
        {position.achievements.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addListItem('achievements')}
            icon={<Plus size={16} />}
            className="mt-2"
          >
            Add Achievement
          </Button>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <PositionProjectsList
          projects={position.projects}
          onSave={handleProjectsChange}
        />
      </div>
    </div>
  );
};

export default PositionForm;