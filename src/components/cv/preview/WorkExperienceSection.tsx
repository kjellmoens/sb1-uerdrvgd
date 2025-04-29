import React from 'react';
import { WorkExperience, CVPreviewFlags } from '../../../types';
import { Briefcase, Building, MapPin, Calendar, ExternalLink, Globe } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
  flags: CVPreviewFlags;
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ workExperience, flags }) => {
  if (workExperience.length === 0) return null;

  const getSectors = () => {
    const sectors = new Set<string>();
    workExperience.forEach(exp => {
      if (exp.sector) sectors.add(exp.sector);
    });
    return Array.from(sectors);
  };

  const sectors = getSectors();

  return (
    <div className="mb-8 page-break">
      <div className="flex items-center mb-4">
        <Briefcase size={18} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
      </div>

      {sectors.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {workExperience.map((job) => (
          <div key={job.id} className="border-l-2 border-gray-200 pl-4 ml-1 py-1 avoid-break">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {job.company}
                  {job.url && (
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-blue-600 hover:underline text-sm inline-flex items-center"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Website
                    </a>
                  )}
                </h3>
                <div className="flex items-center mt-1 text-gray-700">
                  <Building size={14} className="mr-1 text-gray-500" />
                  <span>{job.sector}</span>
                  <span className="mx-2">•</span>
                  <MapPin size={14} className="mr-1 text-gray-500" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
            
            {flags.showWorkDescription && job.description && (
              <p className="mt-2 text-gray-700">{job.description}</p>
            )}
            
            <div className="mt-4 space-y-4">
              {job.positions.map((position) => (
                <div key={position.id} className="border-l border-gray-200 pl-4 avoid-break">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{position.title}</h4>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        {formatDate(position.startDate || '')} - {position.current ? 'Present' : formatDate(position.endDate || '')}
                      </span>
                    </div>
                  </div>
                  
                  {flags.showWorkDescription && position.description && (
                    <p className="mt-2 text-gray-700">{position.description}</p>
                  )}
                  
                  {position.responsibilities.length > 0 && position.responsibilities[0] !== '' && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">Key Responsibilities:</h5>
                      <ul className="list-disc list-inside mt-1 text-gray-700">
                        {position.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {position.achievements.length > 0 && position.achievements[0] !== '' && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">Key Achievements:</h5>
                      <ul className="list-disc list-inside mt-1 text-gray-700">
                        {position.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Projects Section */}
                  {position.projects && position.projects.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Projects:</h5>
                      <div className="space-y-3">
                        {position.projects.map((project) => (
                          <div key={project.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h6 className="font-medium text-gray-900">{project.name}</h6>
                                <p className="text-sm text-gray-600">{project.role}</p>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(project.startDate || '')} - {project.current ? 'Present' : formatDate(project.endDate || '')}
                              </div>
                            </div>

                            {flags.showProjectDescription && project.description && (
                              <p className="mt-2 text-sm text-gray-700">{project.description}</p>
                            )}

                            {project.technicalSkills && project.technicalSkills.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {project.technicalSkills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {skill.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {project.nonTechnicalSkills && project.nonTechnicalSkills.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {project.nonTechnicalSkills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                  >
                                    {skill.name}
                                  </span>
                                ))}
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
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperienceSection;