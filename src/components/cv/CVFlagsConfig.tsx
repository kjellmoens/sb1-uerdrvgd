import React from 'react';
import { CVPreviewFlags } from '../../types';
import { Settings } from 'lucide-react';

interface CVFlagsConfigProps {
  flags: CVPreviewFlags;
  onChange: (flags: CVPreviewFlags) => void;
}

const CVFlagsConfig: React.FC<CVFlagsConfigProps> = ({ flags, onChange }) => {
  const handleToggle = (key: keyof CVPreviewFlags) => {
    onChange({
      ...flags,
      [key]: !flags[key]
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center mb-4">
        <Settings size={18} className="text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Display Settings</h3>
      </div>

      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showMiddleName}
                onChange={() => handleToggle('showMiddleName')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Middle Name</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showEmail}
                onChange={() => handleToggle('showEmail')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Email</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showPhone}
                onChange={() => handleToggle('showPhone')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Phone Number</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showStreetAddress}
                onChange={() => handleToggle('showStreetAddress')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Street Address</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showBirthdate}
                onChange={() => handleToggle('showBirthdate')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Birthdate</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showNationality}
                onChange={() => handleToggle('showNationality')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Country</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showRelationshipStatus}
                onChange={() => handleToggle('showRelationshipStatus')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Relationship Status</span>
            </label>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Descriptions</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showCompanyDescription}
                onChange={() => handleToggle('showCompanyDescription')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Company Descriptions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showWorkDescription}
                onChange={() => handleToggle('showWorkDescription')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Work Experience Descriptions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showProjectDescription}
                onChange={() => handleToggle('showProjectDescription')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Project Descriptions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showEducationDescription}
                onChange={() => handleToggle('showEducationDescription')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Education Descriptions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={flags.showTrainingDescription}
                onChange={() => handleToggle('showTrainingDescription')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Show Training Descriptions</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVFlagsConfig;