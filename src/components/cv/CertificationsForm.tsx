import React, { useState, useEffect } from 'react';
import { Certification } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Calendar, Trash2, Plus, Award, ExternalLink } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';

interface CertificationsFormProps {
  certifications: Certification[];
  onSave: (certifications: Certification[]) => void;
  cvId: string;
}

const emptyCertification: Omit<Certification, 'id'> = {
  name: '',
  issuingOrganization: '',
  issueDate: '',
  expirationDate: '',
  credentialId: '',
  credentialURL: ''
};

const CertificationsForm: React.FC<CertificationsFormProps> = ({ certifications, onSave, cvId }) => {
  const [userCertifications, setUserCertifications] = useState<Certification[]>(
    certifications.length ? certifications : [{ ...emptyCertification, id: generateId() }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCertifications = async () => {
      if (!cvId) {
        setError('CV ID is not available');
        return;
      }

      try {
        setError(null);
        const data = await api.certifications.list(cvId);
        setUserCertifications(data.length ? data : [{ ...emptyCertification, id: generateId() }]);
      } catch (error) {
        console.error('Error loading certifications:', error);
        setError('Failed to load certifications');
      }
    };

    loadCertifications();
  }, [cvId]);

  const handleChange = (index: number, field: keyof Certification, value: string) => {
    setUserCertifications(prev => 
      prev.map((cert, i) => 
        i === index 
          ? { ...cert, [field]: value } 
          : cert
      )
    );
  };

  const addCertification = () => {
    setUserCertifications(prev => [
      ...prev,
      { ...emptyCertification, id: generateId() }
    ]);
  };

  const removeCertification = (index: number) => {
    setUserCertifications(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvId) {
      setError('CV ID is not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedCertifications = await api.certifications.save(cvId, userCertifications);
      onSave(savedCertifications);
    } catch (error) {
      console.error('Error saving certifications:', error);
      setError('Failed to save certifications');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card title="Certifications">
        <div className="text-red-600 p-4">{error}</div>
      </Card>
    );
  }

  return (
    <Card title="Certifications">
      <form onSubmit={handleSubmit}>
        {userCertifications.map((certification, index) => (
          <div 
            key={certification.id} 
            className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Certification {index + 1}
              </h3>
              {userCertifications.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeCertification(index)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center md:col-span-2">
                <Award className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Certification Name"
                  name={`name-${index}`}
                  value={certification.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  required
                />
              </div>
              
              <Input
                label="Issuing Organization"
                name={`issuingOrganization-${index}`}
                value={certification.issuingOrganization}
                onChange={(e) => handleChange(index, 'issuingOrganization', e.target.value)}
                placeholder="Amazon Web Services"
                required
              />
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Issue Date"
                  type="date"
                  name={`issueDate-${index}`}
                  value={certification.issueDate}
                  onChange={(e) => handleChange(index, 'issueDate', e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Expiration Date (if applicable)"
                  type="date"
                  name={`expirationDate-${index}`}
                  value={certification.expirationDate || ''}
                  onChange={(e) => handleChange(index, 'expirationDate', e.target.value)}
                />
              </div>
              
              <Input
                label="Credential ID (if applicable)"
                name={`credentialId-${index}`}
                value={certification.credentialId || ''}
                onChange={(e) => handleChange(index, 'credentialId', e.target.value)}
                placeholder="ABC123XYZ"
              />
              
              <div className="flex items-center">
                <ExternalLink className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Credential URL (if applicable)"
                  type="url"
                  name={`credentialURL-${index}`}
                  value={certification.credentialURL || ''}
                  onChange={(e) => handleChange(index, 'credentialURL', e.target.value)}
                  placeholder="https://www.yourverification.com/cert/123"
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addCertification}
            icon={<Plus size={18} />}
          >
            Add Another Certification
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Certifications'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CertificationsForm;