import React from 'react';
import { Education, CVPreviewFlags } from '../../../types';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';

interface EducationSectionProps {
  education: Education[];
  flags: CVPreviewFlags;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, flags }) => {
  if (education.length === 0) return null;

  return (
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
              <span className="text-gray-700">{edu.company.name}</span>
              {edu.company.city && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin size={14} className="mr-1 text-gray-500" />
                  <span className="text-gray-700">{edu.company.city}</span>
                </>
              )}
            </div>
            
            {flags.showEducationDescription && edu.description && (
              <p className="mt-2 text-gray-700 whitespace-pre-line">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;