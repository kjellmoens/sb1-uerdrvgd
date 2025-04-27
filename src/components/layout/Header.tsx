import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FileText, Plus, Building, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCV } from '../../contexts/CVContext';
import { supabase } from '../../lib/db';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createCV } = useCV();

  const handleCreateCV = async () => {
    try {
      const id = await createCV();
      navigate(`/edit/${id}`);
    } catch (error) {
      console.error('Error creating CV:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">CV Builder</h1>
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/companies"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/companies'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center">
                <Building size={16} className="mr-1" />
                Companies
              </span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleCreateCV}
            icon={<Plus size={18} />}
          >
            New CV
          </Button>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            icon={<LogOut size={18} />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;