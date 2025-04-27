import React, { useState } from 'react';
import { Skill } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Trash2, Plus, Layers, FolderTree, PenTool as Tool } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface SkillsFormProps {
  skills: Skill[];
  onSave: (skills: Skill[]) => void;
}

const emptySkill: Omit<Skill, 'id'> = {
  domain: '',
  subdomain: '',
  name: '',
  description: ''
};

const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onSave }) => {
  const [userSkills, setUserSkills] = useState<Skill[]>(
    skills.length ? skills : [{ ...emptySkill, id: generateId() }]
  );

  const handleChange = (index: number, field: keyof Skill, value: string) => {
    setUserSkills(prev => 
      prev.map((skill, i) => 
        i === index 
          ? { ...skill, [field]: value } 
          : skill
      )
    );
  };

  const addSkill = () => {
    setUserSkills(prev => [
      ...prev,
      { ...emptySkill, id: generateId() }
    ]);
  };

  const removeSkill = (index: number) => {
    setUserSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(userSkills);
  };

  return (
    <Card title="Skills">
      <form onSubmit={handleSubmit}>
        {userSkills.map((skill, index) => (
          <div 
            key={skill.id} 
            className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Skill {index + 1}
              </h3>
              {userSkills.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeSkill(index)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Layers className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Skill Domain"
                  name={`domain-${index}`}
                  value={skill.domain}
                  onChange={(e) => handleChange(index, 'domain', e.target.value)}
                  placeholder="e.g., Programming, Design, Management"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <FolderTree className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Skill Subdomain"
                  name={`subdomain-${index}`}
                  value={skill.subdomain}
                  onChange={(e) => handleChange(index, 'subdomain', e.target.value)}
                  placeholder="e.g., Frontend, UI/UX, Project Management"
                  required
                />
              </div>
              
              <div className="flex items-center md:col-span-2">
                <Tool className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Skill Name"
                  name={`name-${index}`}
                  value={skill.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="e.g., React.js, Figma, Agile Methodologies"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <TextArea
                  label="Description"
                  name={`description-${index}`}
                  value={skill.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="Describe your proficiency and experience with this skill..."
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addSkill}
            icon={<Plus size={18} />}
          >
            Add Another Skill
          </Button>
          
          <Button type="submit">
            Save Skills
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SkillsForm;