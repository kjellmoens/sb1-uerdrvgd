import React from 'react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';
import { CVPreviewFlags, Training } from '../../../types';

interface TrainingsSectionProps {
  trainings: Training[];
  flags: CVPreviewFlags;
}

const TrainingsSection: React.FC<TrainingsSectionProps> = ({ trainings, flags }) => {
  if (trainings.length === 0) return null;

  return (
    <div className="mb-8 page-break">
      <div className="flex items-center mb-4">
        <GraduationCap size={18} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Training & Courses</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trainings.map((training) => (
          <div key={training.id} className="border rounded-lg p-3 border-gray-200 avoid-break">
            <h3 className="font-medium text-gray-900">{training.title}</h3>
            <div className="text-gray-700 text-sm mt-1">{training.company.name}</div>
            
            {training.company.city && (
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{training.company.city}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <Calendar size={14} className="mr-1" />
              <span>Completed: {formatDate(training.completionDate)}</span>
            </div>
            
            {flags.showTrainingDescription && training.description && (
              <p className="mt-2 text-gray-700 text-sm">{training.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingsSection;