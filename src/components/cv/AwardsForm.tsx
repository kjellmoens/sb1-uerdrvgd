import React, { useState, useEffect } from 'react';
import { Award } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Trophy, Building, Calendar, Globe, Tag, Award as AwardIcon, Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';

interface AwardsFormProps {
  awards: Award[];
  onSave: (awards: Award[]) => void;
  cvId: string;
}

const emptyAward: Omit<Award, 'id'> = {
  title: '',
  issuer: '',
  date: '',
  description: '',
  url: '',
  category: '',
  level: ''
};

const AwardsForm: React.FC<AwardsFormProps> = ({ awards, onSave, cvId }) => {
  const [userAwards, setUserAwards] = useState<Award[]>(
    awards.length ? awards : [{ ...emptyAward, id: generateId() }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAwards = async () => {
      if (!cvId) {
        setError('CV ID is not available');
        return;
      }

      try {
        setError(null);
        const data = await api.awards.list(cvId);
        setUserAwards(data.length ? data : [{ ...emptyAward, id: generateId() }]);
      } catch (error) {
        console.error('Error loading awards:', error);
        setError('Failed to load awards');
      }
    };

    loadAwards();
  }, [cvId]);

  const handleChange = (index: number, field: keyof Award, value: string) => {
    setUserAwards(prev => 
      prev.map((award, i) => 
        i === index 
          ? { ...award, [field]: value } 
          : award
      )
    );
  };

  const addAward = () => {
    setUserAwards(prev => [
      ...prev,
      { ...emptyAward, id: generateId() }
    ]);
  };

  const removeAward = async (index: number) => {
    const award = userAwards[index];
    
    try {
      if (award.id) {
        await api.awards.delete(award.id);
      }
      
      setUserAwards(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting award:', error);
      setError('Failed to delete award');
    }
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
      const savedAwards = await Promise.all(
        userAwards.map(async (award) => {
          const awardData = {
            ...award,
            cv_id: cvId
          };

          try {
            if (award.id && award.id.startsWith('new-')) {
              // If it's a new award (has a temporary ID), create it
              const { id, ...newAwardData } = awardData;
              return await api.awards.create(newAwardData);
            } else if (award.id) {
              // If it's an existing award, try to update it
              try {
                const updatedAward = await api.awards.update(award.id, awardData);
                return updatedAward;
              } catch (error) {
                // If the award doesn't exist anymore, create a new one
                if (error.message?.includes('no rows')) {
                  const { id, ...newAwardData } = awardData;
                  return await api.awards.create(newAwardData);
                }
                throw error;
              }
            } else {
              // If there's no ID, create a new award
              return await api.awards.create(awardData);
            }
          } catch (error) {
            console.error(`Error processing award ${award.title}:`, error);
            throw error;
          }
        })
      );

      // Filter out any null values that might have occurred due to errors
      const validAwards = savedAwards.filter((award): award is Award => award != null);
      onSave(validAwards);
    } catch (error) {
      console.error('Error saving awards:', error);
      setError('Failed to save awards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card title="Awards & Recognition">
        <div className="text-red-600 p-4">{error}</div>
      </Card>
    );
  }

  return (
    <Card title="Awards & Recognition">
      <form onSubmit={handleSubmit}>
        {userAwards.map((award, index) => (
          <div 
            key={award.id} 
            className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Award {index + 1}
              </h3>
              {userAwards.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeAward(index)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center md:col-span-2">
                <Trophy className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Award Title"
                  name={`title-${index}`}
                  value={award.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  placeholder="Best Innovation Award"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Building className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Issuing Organization"
                  name={`issuer-${index}`}
                  value={award.issuer}
                  onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                  placeholder="Organization Name"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Date Received"
                  type="date"
                  name={`date-${index}`}
                  value={award.date}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Tag className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Category"
                  name={`category-${index}`}
                  value={award.category || ''}
                  onChange={(e) => handleChange(index, 'category', e.target.value)}
                  placeholder="e.g., Technology, Leadership"
                />
              </div>
              
              <div className="flex items-center">
                <AwardIcon className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Level/Scope"
                  name={`level-${index}`}
                  value={award.level || ''}
                  onChange={(e) => handleChange(index, 'level', e.target.value)}
                  placeholder="e.g., Regional, National, International"
                />
              </div>
              
              <div className="flex items-center md:col-span-2">
                <Globe className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Award URL"
                  type="url"
                  name={`url-${index}`}
                  value={award.url || ''}
                  onChange={(e) => handleChange(index, 'url', e.target.value)}
                  placeholder="https://example.com/award"
                />
              </div>
              
              <div className="md:col-span-2">
                <TextArea
                  label="Description"
                  name={`description-${index}`}
                  value={award.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="Describe the award and its significance..."
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addAward}
            icon={<Plus size={18} />}
          >
            Add Another Award
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Awards'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AwardsForm;