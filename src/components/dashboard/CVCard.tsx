import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { CV } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface CVCardProps {
  cv: CV;
  onDelete: (id: string) => void;
}

const CVCard: React.FC<CVCardProps> = ({ cv, onDelete }) => {
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getCVTitle = () => {
    if (cv.personalInfo.firstName && cv.personalInfo.lastName) {
      return `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}'s CV`;
    }
    return `CV - ${getFormattedDate(cv.createdAt)}`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this CV?')) {
      onDelete(cv.id);
    }
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 6; // 6 sections total
    
    // Check personal info
    if (
      cv.personalInfo.firstName && 
      cv.personalInfo.lastName && 
      cv.personalInfo.email && 
      cv.personalInfo.phone
    ) {
      completed++;
    }
    
    // Check other sections
    if (cv.workExperience.length > 0) completed++;
    if (cv.projects.length > 0) completed++;
    if (cv.trainings.length > 0) completed++;
    if (cv.certifications.length > 0) completed++;
    if (cv.education.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <Card hoverable className="h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{getCVTitle()}</h3>
            <p className="text-sm text-gray-500">
              Last updated: {getFormattedDate(cv.updatedAt)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Completion</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full bg-blue-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-auto pt-6 flex gap-2">
        <Link to={`/view/${cv.id}`} className="flex-1">
          <Button variant="outline" className="w-full" icon={<Eye size={16} />}>
            View
          </Button>
        </Link>
        <Link to={`/edit/${cv.id}`} className="flex-1">
          <Button className="w-full" icon={<Edit size={16} />}>
            Edit
          </Button>
        </Link>
        <Button 
          variant="danger" 
          onClick={handleDelete}
          icon={<Trash2 size={16} />}
          className="flex-none"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default CVCard;