import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import Button from './Button';
import { supabase } from '../../lib/db';

interface Skill {
  id: string;
  domain: string;
  subdomain: string;
  name: string;
  description: string;
}

interface SkillSelectProps {
  value?: Skill | null;
  onChange: (skill: Skill | null) => void;
  type?: 'technical' | 'non_technical';
  label?: string;
  required?: boolean;
}

const SkillSelect: React.FC<SkillSelectProps> = ({ 
  value, 
  onChange, 
  type,
  label = "Skill",
  required = false
}) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const { data, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('domain', { ascending: true });

      if (skillsError) throw skillsError;
      setSkills(data || []);
    } catch (error) {
      console.error('Error loading skills:', error);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = searchTerm
    ? skills.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : skills;

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/skills'}
          icon={<Plus size={16} />}
        >
          New
        </Button>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-200">
        {value && !searchTerm && (
          <button
            onClick={() => onChange(value)}
            className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 focus:outline-none"
          >
            <div className="font-medium text-gray-900">{value.name}</div>
            <div className="text-sm text-gray-500">{value.domain} • {value.subdomain}</div>
          </button>
        )}

        {(searchTerm ? filteredSkills : []).map(skill => (
          <button
            key={skill.id}
            onClick={() => onChange(skill)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
              value?.id === skill.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="font-medium text-gray-900">{skill.name}</div>
            <div className="text-sm text-gray-500">{skill.domain} • {skill.subdomain}</div>
          </button>
        ))}
        {filteredSkills.length === 0 && searchTerm && !loading && (
          <div className="px-4 py-3 text-gray-500 text-center">
            No skills found
          </div>
        )}
        {loading && (
          <div className="px-4 py-3 text-gray-500 text-center">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillSelect;