import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Brain, Calendar, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';

interface PersonalityTest {
  id: string;
  type: string;
  completionDate: string;
  provider?: string;
  description?: string;
  reportUrl?: string;
  trait?: string;
  score?: string;
}

interface PersonalityFormProps {
  personality: PersonalityTest[];
  onSave: (personality: PersonalityTest[]) => void;
  cvId: string;
}

const emptyTest: Omit<PersonalityTest, 'id'> = {
  type: '',
  completionDate: '',
  provider: '',
  description: '',
  reportUrl: '',
  trait: '',
  score: ''
};

const PersonalityForm: React.FC<PersonalityFormProps> = ({ personality, onSave, cvId }) => {
  const [tests, setTests] = useState<PersonalityTest[]>(
    personality.length ? personality : [{ ...emptyTest, id: generateId() }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTests = async () => {
      if (!cvId) {
        setError('CV ID is not available');
        return;
      }

      try {
        setError(null);
        const data = await api.personality.list(cvId);
        setTests(data.length ? data : [{ ...emptyTest, id: generateId() }]);
      } catch (error) {
        console.error('Error loading personality tests:', error);
        setError('Failed to load personality tests');
      }
    };

    loadTests();
  }, [cvId]);

  const handleChange = (testIndex: number, field: keyof PersonalityTest, value: string) => {
    setTests(prev => 
      prev.map((test, i) => 
        i === testIndex 
          ? { ...test, [field]: value } 
          : test
      )
    );
  };

  const addTest = () => {
    setTests(prev => [
      ...prev,
      { ...emptyTest, id: generateId() }
    ]);
  };

  const removeTest = (index: number) => {
    setTests(prev => prev.filter((_, i) => i !== index));
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
      const savedTests = await api.personality.save(cvId, tests);
      onSave(savedTests);
    } catch (error) {
      console.error('Error saving personality tests:', error);
      setError('Failed to save personality tests');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card title="Personality Tests">
        <div className="text-red-600 p-4">{error}</div>
      </Card>
    );
  }

  return (
    <Card title="Personality Tests">
      <form onSubmit={handleSubmit}>
        {tests.map((test, testIndex) => (
          <div 
            key={test.id} 
            className={`${testIndex > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Personality Test {testIndex + 1}
              </h3>
              {tests.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeTest(testIndex)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center md:col-span-2">
                <Brain className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Test Type"
                  name={`type-${testIndex}`}
                  value={test.type}
                  onChange={(e) => handleChange(testIndex, 'type', e.target.value)}
                  placeholder="MBTI, Big Five, DiSC, etc."
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Completion Date"
                  type="date"
                  name={`completionDate-${testIndex}`}
                  value={test.completionDate}
                  onChange={(e) => handleChange(testIndex, 'completionDate', e.target.value)}
                  required
                />
              </div>
              
              <Input
                label="Provider"
                name={`provider-${testIndex}`}
                value={test.provider || ''}
                onChange={(e) => handleChange(testIndex, 'provider', e.target.value)}
                placeholder="16Personalities, DiSC Profile, etc."
              />

              <Input
                label="Trait/Type Result"
                name={`trait-${testIndex}`}
                value={test.trait || ''}
                onChange={(e) => handleChange(testIndex, 'trait', e.target.value)}
                placeholder="e.g., INTJ, Type A, etc."
              />

              <Input
                label="Score/Details"
                name={`score-${testIndex}`}
                value={test.score || ''}
                onChange={(e) => handleChange(testIndex, 'score', e.target.value)}
                placeholder="e.g., 85%, High Extraversion, etc."
              />
              
              <div className="flex items-center md:col-span-2">
                <ExternalLink className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Report URL"
                  type="url"
                  name={`reportUrl-${testIndex}`}
                  value={test.reportUrl || ''}
                  onChange={(e) => handleChange(testIndex, 'reportUrl', e.target.value)}
                  placeholder="https://example.com/your-test-results"
                />
              </div>
              
              <div className="md:col-span-2">
                <TextArea
                  label="Description"
                  name={`description-${testIndex}`}
                  value={test.description || ''}
                  onChange={(e) => handleChange(testIndex, 'description', e.target.value)}
                  placeholder="Brief description of the test and its significance..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addTest}
            icon={<Plus size={18} />}
          >
            Add Another Test
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Personality Tests'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PersonalityForm;