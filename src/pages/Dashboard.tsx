import React, { useState, useEffect } from 'react';
import { Plus, FileText, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../contexts/CVContext';
import { Button } from '../components/ui/Button';
import CVCard from '../components/dashboard/CVCard';

const Dashboard: React.FC = () => {
  const { cvs, createCV, deleteCV, loading, error, refreshCVs } = useCV();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    refreshCVs();
  }, []);

  const handleCreateCV = async () => {
    try {
      const id = await createCV();
      navigate(`/edit/${id}`);
    } catch (error) {
      console.error('Error creating CV:', error);
    }
  };

  const handleDeleteCV = async (id: string) => {
    try {
      await deleteCV(id);
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  const filteredCVs = searchTerm 
    ? cvs.filter(cv => {
        const fullName = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
    : cvs;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>Error loading CVs: {error}</p>
          <Button 
            variant="outline" 
            onClick={() => refreshCVs()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My CVs</h1>
          <p className="text-gray-600 mt-1">
            Manage and create your professional CVs
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleCreateCV} icon={<Plus size={18} />}>
            Create New CV
          </Button>
        </div>
      </div>
      
      {cvs.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search CVs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
      
      {filteredCVs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCVs.map(cv => (
            <CVCard key={cv.id} cv={cv} onDelete={handleDeleteCV} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No CVs Found</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {searchTerm
              ? "We couldn't find any CVs matching your search. Try a different term or create a new CV."
              : "You haven't created any CVs yet. Click the button below to create your first CV!"}
          </p>
          <Button onClick={handleCreateCV} icon={<Plus size={18} />}>
            Create Your First CV
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;