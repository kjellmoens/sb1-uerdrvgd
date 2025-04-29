import React from 'react';
import { PersonalInfo, CVPreviewFlags } from '../../../types';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar, Flag, Heart } from 'lucide-react';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  flags: CVPreviewFlags;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ personalInfo, flags }) => {
  const getFullName = () => {
    const parts = [personalInfo.firstName];
    if (flags.showMiddleName && personalInfo.middleName) {
      parts.push(personalInfo.middleName);
    }
    parts.push(personalInfo.lastName);
    return parts.filter(Boolean).join(' ');
  };

  const formatAddress = () => {
    if (!flags.showStreetAddress) {
      return `${personalInfo.city}, ${personalInfo.countries?.name || personalInfo.country}`;
    }
    if (!personalInfo.street || !personalInfo.streetNumber || !personalInfo.postalCode || !personalInfo.city) {
      return '';
    }
    return `${personalInfo.street} ${personalInfo.streetNumber}, ${personalInfo.postalCode} ${personalInfo.city}, ${personalInfo.countries?.name || personalInfo.country}`;
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 avoid-break">
      <h1 className="text-3xl font-bold text-gray-900">
        {getFullName()}
      </h1>
      {personalInfo.title && (
        <h2 className="text-xl text-blue-600 font-medium mt-1">{personalInfo.title}</h2>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {flags.showEmail && personalInfo.email && (
          <div className="flex items-center text-gray-700">
            <Mail size={16} className="mr-2 text-gray-500" />
            <span>{personalInfo.email}</span>
          </div>
        )}
        
        {flags.showPhone && personalInfo.phone && (
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

        {flags.showBirthdate && personalInfo.birthdate && (
          <div className="flex items-center text-gray-700">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span>Born: {personalInfo.birthdate}</span>
          </div>
        )}

        {flags.showNationality && personalInfo.countries?.nationality && (
          <div className="flex items-center text-gray-700">
            <Flag size={16} className="mr-2 text-gray-500" />
            <span>Nationality: {personalInfo.countries.nationality}</span>
          </div>
        )}

        {flags.showRelationshipStatus && personalInfo.relationshipStatus && (
          <div className="flex items-center text-gray-700">
            <Heart size={16} className="mr-2 text-gray-500" />
            <span>Status: {personalInfo.relationshipStatus}</span>
          </div>
        )}
      </div>
      
      {personalInfo.profileSummaries && personalInfo.profileSummaries.length > 0 && (
        <div className="mt-6 space-y-4">
          {personalInfo.profileSummaries.map((summary) => (
            <p key={summary.id} className="text-gray-700 leading-relaxed">
              {summary.content}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;