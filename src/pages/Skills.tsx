import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, FolderTree, PenTool as Tool } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import { supabase } from '../lib/db';

interface Skill {
  id: string;
  domain: string;
  subdomain: string;
  name: string;
  description?: string;
}

const emptySkill = {
  domain: '',
  subdomain: '',
  name: '',
  description: ''
};

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [subdomainFilter, setSubdomainFilter] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState(emptySkill);
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
        .is('cv_id', null) // Only load global skills
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

  const handleChange = (field: keyof typeof emptySkill, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Ensure we're working with global skills (no cv_id)
      const skillData = {
        ...formData,
        cv_id: null // Explicitly set to null for global skills
      };

      if (editingSkill) {
        const { data, error: updateError } = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', editingSkill.id)
          .select()
          .single();

        if (updateError) throw updateError;
        setSkills(prev => prev.map(skill => skill.id === editingSkill.id ? data : skill));
      } else {
        const { data, error: insertError } = await supabase
          .from('skills')
          .insert([skillData])
          .select()
          .single();

        if (insertError) throw insertError;
        setSkills(prev => [...prev, data]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving skill:', error);
      setError('Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptySkill);
    setEditingSkill(null);
    setIsAdding(false);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData(skill);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      setLoading(true);
      const { error: deleteError } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSkills(prev => prev.filter(skill => skill.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to delete skill');
    } finally {
      setLoading(false);
    }
  };

  // Get unique domains and subdomains for filters
  const domains = Array.from(new Set(skills.map(skill => skill.domain))).sort();
  const subdomains = Array.from(
    new Set(skills
      .filter(skill => !domainFilter || skill.domain === domainFilter)
      .map(skill => skill.subdomain))
  ).sort();

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = searchTerm
      ? skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesDomain = domainFilter ? skill.domain === domainFilter : true;
    const matchesSubdomain = subdomainFilter ? skill.subdomain === subdomainFilter : true;

    return matchesSearch && matchesDomain && matchesSubdomain;
  });

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.domain]) {
      acc[skill.domain] = {};
    }
    if (!acc[skill.domain][skill.subdomain]) {
      acc[skill.domain][skill.subdomain] = [];
    }
    acc[skill.domain][skill.subdomain].push(skill);
    return acc;
  }, {} as Record<string, Record<string, Skill[]>>);

  if (loading && !skills.length) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Loading skills...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills Library</h1>
          <p className="text-gray-600 mt-1">
            Manage your global skills library
          </p>
        </div>
        
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            icon={<Plus size={18} />}
          >
            Add Skill
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isAdding ? (
        <Card title={editingSkill ? 'Edit Skill' : 'Add New Skill'}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Layers className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Skill Domain"
                  name="domain"
                  value={formData.domain}
                  onChange={(e) => handleChange('domain', e.target.value)}
                  placeholder="e.g., Programming, Design, Management"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <FolderTree className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Skill Subdomain"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => handleChange('subdomain', e.target.value)}
                  placeholder="e.g., Frontend, UI/UX, Project Management"
                  required
                />
              </div>
              
              <div className="flex items-center md:col-span-2">
                <Tool className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Skill Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., React.js, Figma, Agile Methodologies"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <TextArea
                  label="Description (Optional)"
                  name="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the skill and its proficiency levels..."
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Add Skill')}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <>
          {skills.length > 0 && (
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <select
                  value={domainFilter}
                  onChange={(e) => {
                    setDomainFilter(e.target.value);
                    setSubdomainFilter(''); // Reset subdomain when domain changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Domains</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>

                <select
                  value={subdomainFilter}
                  onChange={(e) => setSubdomainFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!domainFilter}
                >
                  <option value="">All Subdomains</option>
                  {subdomains.map(subdomain => (
                    <option key={subdomain} value={subdomain}>{subdomain}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {Object.keys(groupedSkills).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedSkills).map(([domain, subdomains]) => (
                <div key={domain} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{domain}</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      {Object.entries(subdomains).map(([subdomain, skills]) => (
                        <div key={subdomain}>
                          <h3 className="text-md font-medium text-gray-700 mb-3">{subdomain}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {skills.map(skill => (
                              <div key={skill.id} className="border rounded-lg p-4">
                                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                                {skill.description && (
                                  <p className="mt-1 text-sm text-gray-600">{skill.description}</p>
                                )}
                                <div className="mt-4 flex justify-end space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEdit(skill)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(skill.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="flex justify-center mb-4">
                <Tool className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Skills Found</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm || domainFilter || subdomainFilter
                  ? "We couldn't find any skills matching your filters. Try different search terms or filters."
                  : "You haven't added any skills yet. Click the button below to add your first skill!"}
              </p>
              <Button onClick={() => setIsAdding(true)} icon={<Plus size={18} />}>
                Add Your First Skill
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Skills;