import React from 'react';
import { CV, CVPreviewFlags } from '../../types';
import { formatDate } from '../../utils/helpers';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Building,
  Calendar,
  Award,
  GraduationCap,
  Briefcase,
  Flag,
  Heart,
  Brain,
  Languages as LanguagesIcon,
  ExternalLink,
  Layers,
  Code,
  Trophy,
  MessageSquare,
  FolderOpen
} from 'lucide-react';

interface CVPreviewProps {
  cv: CV;
  flags?: CVPreviewFlags;
}

const defaultFlags: CVPreviewFlags = {
  showTrainingDescription: true,
  showEducationDescription: true,
  showWorkDescription: true,
  showCompanyDescription: true,
  showBirthdate: true,
  showNationality: true,
  showRelationshipStatus: true,
  showStreetAddress: true,
  showPhone: true,
  showEmail: true,
  showProjectDescription: true,
  showMiddleName: false
};

const CVPreview: React.FC<CVPreviewProps> = ({ cv, flags = defaultFlags }) => {
  const { personalInfo, workExperience, education, trainings, certifications, personality, languages, awards, testimonials, projects } = cv;
  const previewFlags = { ...defaultFlags, ...flags };

  const formatAddress = () => {
    if (!previewFlags.showStreetAddress) {
      return `${personalInfo.city}, ${personalInfo.country}`;
    }
    if (!personalInfo.street || !personalInfo.streetNumber || !personalInfo.postalCode || !personalInfo.city || !personalInfo.country) {
      return '';
    }
    return `${personalInfo.street} ${personalInfo.streetNumber}, ${personalInfo.postalCode} ${personalInfo.city}, ${personalInfo.country}`;
  };

  const getFullName = () => {
    const parts = [personalInfo.firstName];
    if (previewFlags.showMiddleName && personalInfo.middleName) {
      parts.push(personalInfo.middleName);
    }
    parts.push(personalInfo.lastName);
    return parts.filter(Boolean).join(' ');
  };

  const getSectors = () => {
    const sectors = new Set<string>();
    workExperience.forEach(exp => {
      if (exp.sector) sectors.add(exp.sector);
    });
    return Array.from(sectors);
  };

  const hasData = () => {
    return (
      personalInfo.firstName ||
      personalInfo.lastName ||
      workExperience.length > 0 ||
      education.length > 0 ||
      trainings.length > 0 ||
      certifications.length > 0 ||
      personality?.length > 0 ||
      languages?.length > 0 ||
      awards?.length > 0 ||
      testimonials?.length > 0 ||
      projects?.length > 0
    );
  };

  if (!hasData()) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">Your CV is empty</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Fill out the various sections to start building your CV. Once you've added some information, you'll see a preview here.
        </p>
      </div>
    );
  }

  const sectors = getSectors();

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 max-w-4xl mx-auto">
      {/* Header / Personal Info */}
      <div className="border-b border-gray-200 pb-6 mb-6 avoid-break">
        <h1 className="text-3xl font-bold text-gray-900">
          {getFullName()}
        </h1>
        {personalInfo.title && (
          <h2 className="text-xl text-blue-600 font-medium mt-1">{personalInfo.title}</h2>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {previewFlags.showEmail && personalInfo.email && (
            <div className="flex items-center text-gray-700">
              <Mail size={16} className="mr-2 text-gray-500" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          
          {previewFlags.showPhone && personalInfo.phone && (
            <div className="flex items-center text-gray-700">
              <Phone size={16} className="mr-2 text-gray-500" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {formatAddress() && (
            <div className="flex items-center text-gray-700">
              <MapPin size={16} className="mr-2 text-gray-500" />
              <span>{formatAddress()}</span>
            </div>
          )}
          
          {personalInfo.website && (
            <div className="flex items-center text-gray-700">
              <Globe size={16} className="mr-2 text-gray-500" />
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {personalInfo.linkedin && (
            <div className="flex items-center text-gray-700">
              <Linkedin size={16} className="mr-2 text-gray-500" />
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            </div>
          )}
          
          {personalInfo.github && (
            <div className="flex items-center text-gray-700">
              <Github size={16} className="mr-2 text-gray-500" />
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                GitHub
              </a>
            </div>
          )}

          {previewFlags.showBirthdate && personalInfo.birthdate && (
            <div className="flex items-center text-gray-700">
              <Calendar size={16} className="mr-2 text-gray-500" />
              <span>Born: {formatDate(personalInfo.birthdate)}</span>
            </div>
          )}

          {previewFlags.showNationality && personalInfo.country && (
            <div className="flex items-center text-gray-700">
              <Flag size={16} className="mr-2 text-gray-500" />
              <span>Country: {personalInfo.country}</span>
            </div>
          )}

          {previewFlags.showRelationshipStatus && personalInfo.relationshipStatus && (
            <div className="flex items-center text-gray-700">
              <Heart size={16} className="mr-2 text-gray-500" />
              <span>Status: {personalInfo.relationshipStatus}</span>
            </div>
          )}
        </div>
        
        {personalInfo.profileSummaries && personalInfo.profileSummaries.length > 0 && (
          <div className="mt-6 space-y-4">
            {personalInfo.profileSummaries.map((summary, index) => (
              <p key={summary.id} className="text-gray-700 leading-relaxed">
                {summary.content}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Industry Sectors */}
      {sectors.length > 0 && (
        <div className="mb-8 avoid-break">
          <div className="flex items-center mb-4">
            <Building size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Industry Experience</h2>
          </div>
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

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-8 page-break">
          <div className="flex items-center mb-4">
            <Briefcase size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
          </div>
          
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
                
                {previewFlags.showWorkDescription && job.description && (
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
                            {formatDate(position.startDate)} - {position.current ? 'Present' : formatDate(position.endDate || '')}
                          </span>
                        </div>
                      </div>
                      
                      {previewFlags.showWorkDescription && position.description && (
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8 page-break">
          <div className="flex items-center mb-4">
            <GraduationCap size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          </div>
          
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-gray-200 pl-4 ml-1 py-1 avoid-break">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center mt-1">
                  <span className="text-gray-700">{edu.institution}</span>
                  {edu.location && (
                    <>
                      <span className="mx-2">•</span>
                      <MapPin size={14} className="mr-1 text-gray-500" />
                      <span className="text-gray-700">{edu.location}</span>
                    </>
                  )}
                </div>
                
                {previewFlags.showEducationDescription && edu.description && (
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-8 page-break">
          <div className="flex items-center mb-4">
            <Award size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="border rounded-lg p-3 border-gray-200 avoid-break">
                <h3 className="font-medium text-gray-900">{cert.name}</h3>
                <div className="text-gray-700 text-sm mt-1">{cert.issuingOrganization}</div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    Issued: {formatDate(cert.issueDate)}
                    {cert.expirationDate && ` • Expires: ${formatDate(cert.expirationDate)}`}
                  </span>
                </div>
                
                {cert.credentialId && (
                  <div className="text-gray-600 text-sm mt-1">
                    Credential ID: {cert.credentialId}
                  </div>
                )}
                
                {cert.credentialURL && (
                  <div className="mt-2">
                    <a 
                      href={cert.credentialURL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline text-sm inline-flex items-center"
                    >
                      <Globe size={14} className="mr-1" />
                      View Credential
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Trainings */}
      {trainings.length > 0 && (
        <div className="mb-8 page-break">
          <div className="flex items-center mb-4">
            <GraduationCap size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Training & Courses</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainings.map((training) => (
              <div key={training.id} className="border rounded-lg p-3 border-gray-200 avoid-break">
                <h3 className="font-medium text-gray-900">{training.title}</h3>
                <div className="text-gray-700 text-sm mt-1">{training.provider}</div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>Completed: {formatDate(training.completionDate)}</span>
                </div>
                
                {previewFlags.showTrainingDescription && training.description && (
                  <p className="mt-2 text-gray-700 text-sm">{training.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="mb-8 page-break">
          <div className="flex items-center mb-4">
            <LanguagesIcon size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Languages</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages.map((language) => (
              <div key={language.id} className="border rounded-lg p-4 border-gray-200 avoid-break">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{language.name}</h3>
                    <div className="text-blue-600 font-medium mt-1">{language.proficiency}</div>
                  </div>
                  
                  {language.certificate && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{language.certificate}</div>
                      {language.certificateDate && (
                        <div className="text-sm text-gray-600">
                          {formatDate(language.certificateDate)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {language.notes && (
                  <p className="mt-2 text-sm text-gray-600">{language.notes}</p>
                )}
                
                {language.certificateUrl && (
                  <div className="mt-2">
                    <a 
                      href={language.certificateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm inline-flex items-center"
                    >
                      <Globe size={14} className="mr-1" />
                      View Certificate
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Awards & Recognition */}
      {awards && awards.length > 0 && (
        <div className="mb-8 page-break">
          <div className="flex items-center mb-4">
            <Trophy size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Awards & Recognition</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awards.map((award) => (
              <div key={award.id} className="border rounded-lg p-4 border-gray-200 avoid-break">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{award.title}</h3>
                    <div className="text-gray-600 mt-1">{award.issuer}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(award.date)}
                  </div>
                </div>
                
                {(award.category || award.level) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {award.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {award.category}
                      </span>
                    )}
                    {award.level && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {award.level}
                      </span>
                    )}
                  </div>
                )}
                
                <p className="mt-2 text-gray-700 text-sm">{award.description}</p>
                
                {award.url && (
                  <div className="mt-2">
                    <a 
                      href={award.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline text-sm inline-flex items-center"
                    >
                      <Globe size={14} className="mr-1" />
                      View Award
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <div className="mb-8 page-break">
          <div className="flex items-center mb-4">
            <MessageSquare size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Testimonials</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border rounded-lg p-6 border-gray-200 avoid-break">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{testimonial.author}</h3>
                    <div className="text-gray-600 mt-1">{testimonial.role} at {testimonial.company}</div>
                    <div className="text-gray-500 text-sm mt-1">
                      {testimonial.relationship} • {formatDate(testimonial.date)}
                    </div>
                  </div>
                  
                  {testimonial.linkedinProfile && (
                    <a 
                      href={testimonial.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                </div>
                
                <blockquote className="text-gray-700 italic">
                  "{testimonial.content}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Personality Tests */}
      {personality && personality.length > 0 && (
        <div className="page-break">
          <div className="flex items-center mb-4">
            <Brain size={18} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Personality Tests</h2>
          </div>
          
          <div className="space-y-6">
            {personality.map((test) => (
              <div key={test.id} className="border rounded-lg p-4 border-gray-200 avoid-break">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{test.type}</h3>
                    {test.provider && (
                      <div className="text-gray-600 text-sm mt-1">Provider: {test.provider}</div>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={14} className="mr-1" />
                    <span>Completed: {formatDate(test.completionDate)}</span>
                  </div>
                </div>
                
                {(test.trait || test.score) && (
                  <div className="mt-2">
                    {test.trait && (
                      <div className="font-medium text-gray-900">{test.trait}</div>
                    )}
                    {test.score && (
                      <div className="text-blue-600">{test.score}</div>
                    )}
                  </div>
                )}
                
                {test.description && (
                  <p className="mt-2 text-gray-700">{test.description}</p>
                )}
                
                {test.reportUrl && (
                  <div className="mt-4">
                    <a 
                      href={test.reportUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline text-sm inline-flex items-center"
                    >
                      <Globe size={14} className="mr-1" />
                      View Full Report
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
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

                {previewFlags.showProjectDescription && project.description && (
                  <p className="mt-2 text-gray-700">{project.description}</p>
                )}

                {project.technicalSkills.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {project.technicalSkills.map((skill, index) => (
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
                      {project.nonTechnicalSkills.map((skill, index) => (
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
      )}
    </div>
  );
};

export default CVPreview;