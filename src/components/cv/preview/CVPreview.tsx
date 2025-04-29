import React from 'react';
import { CV, CVPreviewFlags } from '../../../types';
import PersonalInfoSection from './PersonalInfoSection';
import WorkExperienceSection from './WorkExperienceSection';
import EducationSection from './EducationSection';
import CertificationsSection from './CertificationsSection';
import TrainingsSection from './TrainingsSection';
import LanguagesSection from './LanguagesSection';
import AwardsSection from './AwardsSection';
import TestimonialsSection from './TestimonialsSection';
import PersonalitySection from './PersonalitySection';
import ProjectsSection from './ProjectsSection';

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

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 max-w-4xl mx-auto">
      <PersonalInfoSection personalInfo={personalInfo} flags={previewFlags} />
      <PersonalitySection personality={personality} />
      <WorkExperienceSection workExperience={workExperience} flags={previewFlags} />
      <EducationSection education={education} flags={previewFlags} />
      <CertificationsSection certifications={certifications} />
      <TrainingsSection trainings={trainings} flags={previewFlags} />
      <LanguagesSection languages={languages} />
      <AwardsSection awards={awards} />
      <TestimonialsSection testimonials={testimonials} />
      <ProjectsSection projects={projects} flags={previewFlags} />
    </div>
  );
};

export default CVPreview;