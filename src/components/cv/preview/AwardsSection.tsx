import React from 'react';
import { Trophy, Globe } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';

interface AwardsSectionProps {
  awards: any[];
}

const AwardsSection: React.FC<AwardsSectionProps> = ({ awards }) => {
  if (!awards || awards.length === 0) return null;

  return (
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
  );
};

export default AwardsSection;