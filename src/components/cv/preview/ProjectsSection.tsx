import React from 'react';
import { FolderOpen, Building, MapPin, Calendar, Globe, Code } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';
import { CVPreviewFlags } from '../../../types';

interface ProjectsSectionProps {
  projects: any[];
  flags: CVPreviewFlags;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, flags }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="mb-8 page-break">
      <div className="flex items-center mb-4">
        <FolderOpen size={18} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
      </div>
      
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                {project.company && (
                  <div className="flex items-center mt-1 text-gray-600 text-sm">
                    <Building size={14} className="mr-1" />
                    <span>{project.company}</span>
                    {(project.location || project.country) && (
                      <>
                        <span className="mx-2">•</span>
                        <MapPin size={14} className="mr-1" />
                        <span>
                          {project.location}
                          {project.location && project.country && ', '}
                          {project.country}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>
                  {formatDate(project.startDate)} - {project.current ? 'Present' : formatDate(project.endDate || '')}
                </span>
              </div>
            </div>

            {flags.showProjectDescription && project.description && (
              <p className="mt-2 text-gray-700">{project.description}</p>
            )}

            {project.technicalSkills.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {project.technicalSkills.map((skill: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.nonTechnicalSkills.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {project.nonTechnicalSkills.map((skill: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
    </div>
  );
};

export default ProjectsSection;