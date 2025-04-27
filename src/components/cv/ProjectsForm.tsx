import React, { useState } from 'react';
import { Project } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Calendar, Trash2, Plus, ExternalLink, Code, Building, MapPin } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface ProjectsFormProps {
  projects: Project[];
  onSave: (projects: Project[]) => void;
}

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  current: false,
  company: '',
  location: '',
  technicalSkills: [],
  nonTechnicalSkills: [],
  link: ''
};

const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onSave }) => {
  const [userProjects, setUserProjects] = useState<Project[]>(
    projects.length ? projects : [{ ...emptyProject, id: generateId() }]
  );

  const handleChange = (index: number, field: keyof Project, value: string | boolean) => {
    setUserProjects(prev => 
      prev.map((project, i) => 
        i === index 
          ? { ...project, [field]: value } 
          : project
      )
    );
  };

  const handleSkillsChange = (index: number, type: 'technicalSkills' | 'nonTechnicalSkills', skillIndex: number, value: string) => {
    setUserProjects(prev => 
      prev.map((project, i) => {
        if (i !== index) return project;
        
        const newSkills = [...project[type]];
        newSkills[skillIndex] = value;
        
        return {
          ...project,
          [type]: newSkills
        };
      })
    );
  };

  const addSkill = (index: number, type: 'technicalSkills' | 'nonTechnicalSkills') => {
    setUserProjects(prev => 
      prev.map((project, i) => 
        i === index 
          ? { ...project, [type]: [...project[type], ''] } 
          : project
      )
    );
  };

  const removeSkill = (index: number, type: 'technicalSkills' | 'nonTechnicalSkills', skillIndex: number) => {
    setUserProjects(prev => 
      prev.map((project, i) => {
        if (i !== index) return project;
        
        const newSkills = project[type].filter((_, idx) => idx !== skillIndex);
        return {
          ...project,
          [type]: newSkills.length ? newSkills : ['']
        };
      })
    );
  };

  const addProject = () => {
    setUserProjects(prev => [
      ...prev,
      { ...emptyProject, id: generateId(), technicalSkills: [''], nonTechnicalSkills: [''] }
    ]);
  };

  const removeProject = (index: number) => {
    setUserProjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(userProjects);
  };

  const handleCurrentChange = (index: number, checked: boolean) => {
    setUserProjects(prev => 
      prev.map((project, i) => 
        i === index 
          ? { 
              ...project, 
              current: checked,
              endDate: checked ? '' : project.endDate
            } 
          : project
      )
    );
  };

  return (
    <Card title="Projects">
      <form onSubmit={handleSubmit}>
        {userProjects.map((project, index) => (
          <div 
            key={project.id} 
            className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Project {index + 1}
              </h3>
              {userProjects.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeProject(index)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Title"
                name={`title-${index}`}
                value={project.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                placeholder="My Awesome Project"
                required
                className="md:col-span-2"
              />
              
              <div className="flex items-center">
                <Building className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Company"
                  name={`company-${index}`}
                  value={project.company}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <MapPin className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Location"
                  name={`location-${index}`}
                  value={project.location}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  placeholder="City, Country"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Start Date"
                  type="date"
                  name={`startDate-${index}`}
                  value={project.startDate}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={project.current}
                  onChange={(e) => handleCurrentChange(index, e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`current-${index}`} className="text-sm text-gray-700">
                  This is an ongoing project
                </label>
              </div>
              
              {!project.current && (
                <div className="flex items-center">
                  <Calendar className="text-gray-400 mr-2" size={18} />
                  <Input
                    label="End Date"
                    type="date"
                    name={`endDate-${index}`}
                    value={project.endDate || ''}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    required={!project.current}
                    disabled={project.current}
                  />
                </div>
              )}
              
              <div className="flex items-center md:col-span-2">
                <ExternalLink className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Project Link (optional)"
                  type="url"
                  name={`link-${index}`}
                  value={project.link || ''}
                  onChange={(e) => handleChange(index, 'link', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <TextArea
                label="Project Description"
                name={`description-${index}`}
                value={project.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Describe the project, your role, and its impact..."
                rows={4}
                required
              />
            </div>
            
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Code size={18} className="text-gray-500 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Technical Skills
                </label>
              </div>
              
              {project.technicalSkills.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillsChange(index, 'technicalSkills', skillIndex, e.target.value)}
                    placeholder="Add a technical skill (e.g., React, Node.js, Python)"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
                    required={skillIndex === 0}
                  />
                  
                  <button
                    type="button"
                    onClick={() => removeSkill(index, 'technicalSkills', skillIndex)}
                    disabled={project.technicalSkills.length <= 1 && skillIndex === 0}
                    className={`p-2 rounded-lg ${
                      project.technicalSkills.length <= 1 && skillIndex === 0
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
                onClick={() => addSkill(index, 'technicalSkills')}
                icon={<Plus size={16} />}
                className="mt-2"
              >
                Add Technical Skill
              </Button>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Code size={18} className="text-gray-500 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Non-Technical Skills
                </label>
              </div>
              
              {project.nonTechnicalSkills.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillsChange(index, 'nonTechnicalSkills', skillIndex, e.target.value)}
                    placeholder="Add a non-technical skill (e.g., Project Management, Team Leadership)"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg mr-2"
                    required={skillIndex === 0}
                  />
                  
                  <button
                    type="button"
                    onClick={() => removeSkill(index, 'nonTechnicalSkills', skillIndex)}
                    disabled={project.nonTechnicalSkills.length <= 1 && skillIndex === 0}
                    className={`p-2 rounded-lg ${
                      project.nonTechnicalSkills.length <= 1 && skillIndex === 0
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
                onClick={() => addSkill(index, 'nonTechnicalSkills')}
                icon={<Plus size={16} />}
                className="mt-2"
              >
                Add Non-Technical Skill
              </Button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addProject}
            icon={<Plus size={18} />}
          >
            Add Another Project
          </Button>
          
          <Button type="submit">
            Save Projects
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProjectsForm;