import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Eye } from 'lucide-react';
import { useCV } from '../contexts/CVContext';
import Button from '../components/ui/Button';
import PersonalInfoForm from '../components/cv/PersonalInfoForm';
import WorkExperienceForm from '../components/cv/WorkExperienceForm';
import ProjectsForm from '../components/cv/ProjectsForm';
import TrainingsForm from '../components/cv/TrainingsForm';
import CertificationsForm from '../components/cv/CertificationsForm';
import EducationForm from '../components/cv/EducationForm';
import PersonalityForm from '../components/cv/PersonalityForm';
import LanguagesForm from '../components/cv/LanguagesForm';
import SkillsForm from '../components/cv/SkillsForm';
import TestimonialsForm from '../components/cv/TestimonialsForm';
import AwardsForm from '../components/cv/AwardsForm';

const EditCV: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCV, updateCV } = useCV();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<string>('');
  
  const cv = getCV(id || '');
  
  useEffect(() => {
    if (!cv) {
      navigate('/');
    }
  }, [cv, navigate]);
  
  if (!cv) return null;

  const sections = [
    { id: 'personal', name: 'Personal Information' },
    { id: 'work', name: 'Work Experience' },
    { id: 'education', name: 'Education' },
    { id: 'projects', name: 'Projects' },
    { id: 'skills', name: 'Skills' },
    { id: 'certifications', name: 'Certifications' },
    { id: 'awards', name: 'Awards' },
    { id: 'trainings', name: 'Training & Courses' },
    { id: 'languages', name: 'Languages' },
    { id: 'personality', name: 'Personality Tests' },
    { id: 'testimonials', name: 'Testimonials' },
  ];

  const getCompletionStatus = (sectionId: string): 'complete' | 'incomplete' | 'empty' => {
    switch (sectionId) {
      case 'personal':
        return cv.personalInfo.firstName && cv.personalInfo.lastName ? 'complete' : 'incomplete';
      case 'work':
        return cv.workExperience.length > 0 ? 'complete' : 'empty';
      case 'education':
        return cv.education.length > 0 ? 'complete' : 'empty';
      case 'projects':
        return cv.projects.length > 0 ? 'complete' : 'empty';
      case 'skills':
        return cv.skills?.length > 0 ? 'complete' : 'empty';
      case 'certifications':
        return cv.certifications.length > 0 ? 'complete' : 'empty';
      case 'awards':
        return cv.awards?.length > 0 ? 'complete' : 'empty';
      case 'trainings':
        return cv.trainings.length > 0 ? 'complete' : 'empty';
      case 'personality':
        return cv.personality?.length > 0 ? 'complete' : 'empty';
      case 'languages':
        return cv.languages?.length > 0 ? 'complete' : 'empty';
      case 'testimonials':
        return cv.testimonials?.length > 0 ? 'complete' : 'empty';
      default:
        return 'empty';
    }
  };

  const handleSavePersonalInfo = (data: typeof cv.personalInfo) => {
    setSaving(true);
    updateCV(cv.id, { personalInfo: data });
    showSavedMessage();
  };

  const handleSaveWorkExperience = (data: typeof cv.workExperience) => {
    setSaving(true);
    updateCV(cv.id, { workExperience: data });
    showSavedMessage();
  };

  const handleSaveProjects = (data: typeof cv.projects) => {
    setSaving(true);
    updateCV(cv.id, { projects: data });
    showSavedMessage();
  };

  const handleSaveTrainings = (data: typeof cv.trainings) => {
    setSaving(true);
    updateCV(cv.id, { trainings: data });
    showSavedMessage();
  };

  const handleSaveCertifications = (data: typeof cv.certifications) => {
    setSaving(true);
    updateCV(cv.id, { certifications: data });
    showSavedMessage();
  };

  const handleSaveEducation = (data: typeof cv.education) => {
    setSaving(true);
    updateCV(cv.id, { education: data });
    showSavedMessage();
  };

  const handleSavePersonality = (data: typeof cv.personality) => {
    setSaving(true);
    updateCV(cv.id, { personality: data });
    showSavedMessage();
  };

  const handleSaveLanguages = (data: typeof cv.languages) => {
    setSaving(true);
    updateCV(cv.id, { languages: data });
    showSavedMessage();
  };

  const handleSaveSkills = (data: typeof cv.skills) => {
    setSaving(true);
    updateCV(cv.id, { skills: data });
    showSavedMessage();
  };

  const handleSaveTestimonials = (data: typeof cv.testimonials) => {
    setSaving(true);
    updateCV(cv.id, { testimonials: data });
    showSavedMessage();
  };

  const handleSaveAwards = (data: typeof cv.awards) => {
    setSaving(true);
    updateCV(cv.id, { awards: data });
    showSavedMessage();
  };

  const showSavedMessage = () => {
    setSavedMessage('Changes saved!');
    setSaving(false);
    
    setTimeout(() => {
      setSavedMessage('');
    }, 3000);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm initialData={cv.personalInfo} onSave={handleSavePersonalInfo} cvId={cv.id} />;
      case 'work':
        return <WorkExperienceForm experiences={cv.workExperience} onSave={handleSaveWorkExperience} cvId={cv.id} />;
      case 'projects':
        return <ProjectsForm projects={cv.projects} onSave={handleSaveProjects} />;
      case 'trainings':
        return <TrainingsForm trainings={cv.trainings} onSave={handleSaveTrainings} cvId={cv.id} />;
      case 'certifications':
        return <CertificationsForm certifications={cv.certifications} onSave={handleSaveCertifications} cvId={cv.id} />;
      case 'education':
        return <EducationForm education={cv.education} onSave={handleSaveEducation} />;
      case 'personality':
        return <PersonalityForm personality={cv.personality || []} onSave={handleSavePersonality} />;
      case 'languages':
        return <LanguagesForm languages={cv.languages || []} onSave={handleSaveLanguages} cvId={cv.id} />;
      case 'skills':
        return <SkillsForm skills={cv.skills || []} onSave={handleSaveSkills} />;
      case 'testimonials':
        return <TestimonialsForm testimonials={cv.testimonials || []} onSave={handleSaveTestimonials} cvId={cv.id} />;
      case 'awards':
        return <AwardsForm awards={cv.awards || []} onSave={handleSaveAwards} cvId={cv.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            icon={<ChevronLeft size={18} />}
            className="mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {cv.personalInfo.firstName && cv.personalInfo.lastName
                ? `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}'s CV`
                : 'Edit CV'
              }
            </h1>
            <p className="text-gray-600 mt-1">
              Fill out the sections below to create your CV
            </p>
          </div>
        </div>
        
        <div className="flex items-center mt-4 sm:mt-0 space-x-2">
          {savedMessage && (
            <span className="text-green-600 animate-fade-in-out bg-green-50 py-1 px-3 rounded-lg">
              {savedMessage}
            </span>
          )}
          <Button 
            variant="outline" 
            onClick={() => navigate(`/view/${cv.id}`)}
            icon={<Eye size={18} />}
          >
            Preview
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <ul className="divide-y divide-gray-200">
              {sections.map(section => {
                const status = getCompletionStatus(section.id);
                return (
                  <li key={section.id}>
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 ${
                        activeSection === section.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <span className="font-medium">{section.name}</span>
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === 'complete'
                            ? 'bg-green-100 text-green-800'
                            : status === 'incomplete'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {status === 'complete' ? 'Complete' : status === 'incomplete' ? 'Incomplete' : 'Empty'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default EditCV;