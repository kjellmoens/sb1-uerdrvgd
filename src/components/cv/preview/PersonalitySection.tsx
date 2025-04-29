import React from 'react';
import { Brain, Calendar, Globe } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';

interface PersonalitySectionProps {
  personality: any[];
}

const PersonalitySection: React.FC<PersonalitySectionProps> = ({ personality }) => {
  if (!personality || personality.length === 0) return null;

  return (
    <div className="mb-8 page-break">
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
            
            {test.description && (
              <p className="mt-2 text-gray-700">{test.description}</p>
            )}

            {(test.trait || test.score) && (
              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  {test.trait && (
                    <span className="font-medium text-gray-900">{test.trait}</span>
                  )}
                  {test.score && (
                    <span className="text-blue-600 font-medium">{test.score}</span>
                  )}
                </div>
              </div>
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
  );
};

export default PersonalitySection;