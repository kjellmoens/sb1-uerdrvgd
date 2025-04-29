import React from 'react';
import { Languages as LanguagesIcon, Calendar, Globe } from 'lucide-react';
import { Language } from '../../../types';
import { formatDate } from '../../../utils/helpers';

interface LanguagesSectionProps {
  languages: Language[];
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  if (!languages || languages.length === 0) return null;

  return (
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
  );
};

export default LanguagesSection;