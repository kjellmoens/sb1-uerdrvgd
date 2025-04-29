import React, { useState } from 'react';
import { PositionProject, Company } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import CompanySelect from '../ui/CompanySelect';
import { Calendar, Trash2, Plus, ExternalLink, Building, MapPin, Flag } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface PositionProjectFormProps {
  project?: PositionProject;
  onSave: (project: PositionProject) => void;
  onCancel: () => void;
}

const emptyProject: Omit<PositionProject, 'id'> = {
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  company: '',
  location: '',
  country: '',
  link: '',
  responsibilities: [''],
  achievements: []
};

const PositionProjectForm: React.FC<PositionProjectFormProps> = ({ project = { ...emptyProject, id: generateId() }, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PositionProject>(project);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleChange = (field: keyof PositionProject, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleListChange = (
    listType: 'responsibilities' | 'achievements',
    itemIndex: number,
    value: string
  ) => {
    setFormData(prev => {
      const newList = [...prev[listType]];
      newList[itemIndex] = value;
      return {
        ...prev,
        [listType]: newList
      };
    });
  };

  const addListItem = (listType: 'responsibilities' | 'achievements') => {
    setFormData(prev => ({
      ...prev,
      [listType]: [...prev[listType], '']
    }));
  };

  const removeListItem = (listType: 'responsibilities' | 'achievements', itemIndex: number) => {
    setFormData(prev => ({
      ...prev,
      [listType]: prev[listType].filter((_, index) => index !== itemIndex)
    }));
  };

  const handleCurrentChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      current: checked,
      endDate: checked ? '' : prev.endDate
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update project data with selected company info
    const updatedProject = {
      ...formData,
      company: selectedCompany?.name || '',
      location: selectedCompany?.city || '',
      country: selectedCompany?.country_code || ''
    };

    onSave(updatedProject);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Project Name"
          required
          className="md:col-span-2"
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
          <CompanySelect
            value={selectedCompany}
            onChange={setSelectedCompany}
          />
        </div>

        <Input
          label="Your Role"
          name="role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="Project Role"
          required
        />

        <div className="flex items-center">
          <Calendar className="text-gray-400 mr-2" size={18} />
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="current"
            checked={formData.current}
            onChange={(e) => handleCurrentChange(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="current" className="text-sm text-gray-700">
            This is an ongoing project
          </label>
        </div>

        {!formData.current && (
          <div className="flex items-center">
            <Calendar className="text-gray-400 mr-2" size={18} />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              required={!formData.current}
              disabled={formData.current}
            />
          </div>
        )}

        <div className="flex items-center md:col-span-2">
          <ExternalLink className="text-gray-400 mr-2" size={18} />
          <Input
            label="Project Link (optional)"
            type="url"
            name="link"
            value={formData.link || ''}
            onChange={(e) => handleChange('link', e.target.value)}
            placeholder="https://github.com/username/project"
          />
        </div>
      </div>

      <div>
        <TextArea
          label="Project Description"
          name="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the project, its goals, and impact..."
          rows={4}
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Key Responsibilities (Optional)
          </label>
          {formData.responsibilities.length === 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addListItem('responsibilities')}
              icon={<Plus size={16} />}
            >
              Add Responsibilities
            </Button>
          )}
        </div>

        {formData.responsibilities.map((responsibility, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={responsibility}
              onChange={(e) => handleListChange('responsibilities', index, e.target.value)}
              placeholder="Describe a key responsibility"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
            />

            <button
              type="button"
              onClick={() => removeListItem('responsibilities', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {formData.responsibilities.length > 0 && (
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
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Key Achievements (Optional)
          </label>
          {formData.achievements.length === 0 && (
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

        {formData.achievements.map((achievement, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={achievement}
              onChange={(e) => handleListChange('achievements', index, e.target.value)}
              placeholder="Describe a key achievement"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
            />

            <button
              type="button"
              onClick={() => removeListItem('achievements', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {formData.achievements.length > 0 && (
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

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Project
        </Button>
      </div>
    </form>
  );
};

export default PositionProjectForm;