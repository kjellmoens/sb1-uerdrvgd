import React, { useState } from 'react';
import { PositionProject } from '../../types';
import { Calendar, Plus, Edit, Trash2, Globe } from 'lucide-react';
import Button from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import PositionProjectForm from './PositionProjectForm';

interface PositionProjectsListProps {
  projects: PositionProject[];
  onSave: (projects: PositionProject[]) => void;
}

const PositionProjectsList: React.FC<PositionProjectsListProps> = ({ projects, onSave }) => {
  const [editingProject, setEditingProject] = useState<PositionProject | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSaveProject = (project: PositionProject) => {
    let updatedProjects: PositionProject[];

    if (editingProject) {
      // Update existing project
      updatedProjects = projects.map(p => 
        p.id === editingProject.id ? project : p
      );
    } else {
      // Add new project
      updatedProjects = [...projects, project];
    }

    onSave(updatedProjects);
    setEditingProject(null);
    setIsAdding(false);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    onSave(updatedProjects);
  };

  if (isAdding || editingProject) {
    return (
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {editingProject ? 'Edit Project' : 'Add Project'}
        </h4>
        <PositionProjectForm
          project={editingProject || undefined}
          onSave={handleSaveProject}
          onCancel={() => {
            setEditingProject(null);
            setIsAdding(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900">Projects</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          icon={<Plus size={16} />}
        >
          Add Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900">{project.name}</h5>
                  <p className="text-gray-600">{project.role}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {formatDate(project.startDate)} - {project.current ? 'Present' : formatDate(project.endDate)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-gray-700">{project.description}</p>

              {project.link && (
                <div className="mt-2">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline text-sm inline-flex items-center"
                  >
                    <Globe size={14} className="mr-1" />
                    View Project
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No projects added yet. Click the button above to add your first project.
        </p>
      )}
    </div>
  );
};

export default PositionProjectsList;