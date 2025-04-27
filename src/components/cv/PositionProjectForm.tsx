import React, { useState } from 'react';
import { PositionProject, SkillScore } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import { Calendar, Trash2, Plus, ExternalLink, Code } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface PositionProjectFormProps {
  project: PositionProject;
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
  responsibilities: [''],
  achievements: [''],
  technicalSkills: [],
  nonTechnicalSkills: []
};

const PositionProjectForm: React.FC<PositionProjectFormProps> = ({ project = { ...emptyProject, id: generateId() }, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PositionProject>(project);

  const handleChange = (field: keyof PositionProject, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (type: 'technicalSkills' | 'nonTechnicalSkills', skillIndex: number, value: string) => {
    setFormData(prev => {
      const newSkills = [...prev[type]];
      newSkills[skillIndex] = { name: value, score: 0 };
      return {
        ...prev,
        [type]: newSkills
      };
    });
  };

  const addSkill = (type: 'technicalSkills' | 'nonTechnicalSkills') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { name: '', score: 0 }]
    }));
  };

  const removeSkill = (type: 'technicalSkills' | 'nonTechnicalSkills', skillIndex: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== skillIndex)
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
      [listType]: prev[listType].filter((_, i) => i !== itemIndex)
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
    onSave(formData);
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
        <div className="flex items-center mb-2">
          <Code size={18} className="text-gray-500 mr-2" />
          <label className="block text-sm font-medium text-gray-700">
            Technical Skills
          </label>
        </div>

        {formData.technicalSkills.map((skill, skillIndex) => (
          <div key={skillIndex} className="flex items-center mb-2">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => handleSkillsChange('technicalSkills', skillIndex, e.target.value)}
              placeholder="Add a technical skill (e.g., React, Node.js, Python)"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
              required
            />

            <button
              type="button"
              onClick={() => removeSkill('technicalSkills', skillIndex)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addSkill('technicalSkills')}
          icon={<Plus size={16} />}
          className="mt-2"
        >
          Add Technical Skill
        </Button>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Code size={18} className="text-gray-500 mr-2" />
          <label className="block text-sm font-medium text-gray-700">
            Non-Technical Skills
          </label>
        </div>

        {formData.nonTechnicalSkills.map((skill, skillIndex) => (
          <div key={skillIndex} className="flex items-center mb-2">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => handleSkillsChange('nonTechnicalSkills', skillIndex, e.target.value)}
              placeholder="Add a non-technical skill (e.g., Project Management, Team Leadership)"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
              required
            />

            <button
              type="button"
              onClick={() => removeSkill('nonTechnicalSkills', skillIndex)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addSkill('nonTechnicalSkills')}
          icon={<Plus size={16} />}
          className="mt-2"
        >
          Add Non-Technical Skill
        </Button>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <Code size={18} className="text-gray-500 mr-2" />
          <label className="block text-sm font-medium text-gray-700">
            Key Responsibilities
          </label>
        </div>

        {formData.responsibilities.map((responsibility, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={responsibility}
              onChange={(e) => handleListChange('responsibilities', index, e.target.value)}
              placeholder="Describe a key responsibility"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
              required
            />

            <button
              type="button"
              onClick={() => removeListItem('responsibilities', index)}
              disabled={formData.responsibilities.length <= 1}
              className={`p-2 rounded-lg ${
                formData.responsibilities.length <= 1
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

      <div>
        <div className="flex items-center mb-2">
          <Code size={18} className="text-gray-500 mr-2" />
          <label className="block text-sm font-medium text-gray-700">
            Key Achievements
          </label>
        </div>

        {formData.achievements.map((achievement, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={achievement}
              onChange={(e) => handleListChange('achievements', index, e.target.value)}
              placeholder="Describe a key achievement"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
              required
            />

            <button
              type="button"
              onClick={() => removeListItem('achievements', index)}
              disabled={formData.achievements.length <= 1}
              className={`p-2 rounded-lg ${
                formData.achievements.length <= 1
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
          onClick={() => addListItem('achievements')}
          icon={<Plus size={16} />}
          className="mt-2"
        >
          Add Achievement
        </Button>
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