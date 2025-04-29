import React from 'react';
import { Award, Globe, Calendar } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';
import { Certification } from '../../../types';

interface CertificationsSectionProps {
  certifications: Certification[];
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  if (certifications.length === 0) return null;

  return (
    <div className="mb-8 page-break">
      <div className="flex items-center mb-4">
        <Award size={18} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="border rounded-lg p-3 border-gray-200 avoid-break">
            <h3 className="font-medium text-gray-900">{cert.name}</h3>
            <div className="text-gray-700 text-sm mt-1">{cert.company.name}</div>
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
  );
};

export default CertificationsSection;