import React, { useState } from 'react';
import { PersonalityTest, PersonalityResult } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Brain, Calendar, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../utils/helpers';

interface PersonalityFormProps {
  personality: PersonalityTest[];
  onSave: (personality: PersonalityTest[]) => void;
}

const emptyResult: Omit<PersonalityResult, 'id'> = {
  trait: '',
  score: '',
  description: ''
};

const emptyTest: Omit<PersonalityTest, 'id'> = {
  type: '',
  completionDate: '',
  results: [{ ...emptyResult, id: generateId() }],
  provider: '',
  description: '',
  reportUrl: ''
};

const PersonalityForm: React.FC<PersonalityFormProps> = ({ personality, onSave }) => {
  const [tests, setTests] = useState<PersonalityTest[]>(
    personality.length ? personality : [{ ...emptyTest, id: generateId() }]
  );

  const handleChange = (testIndex: number, field: keyof PersonalityTest, value: string) => {
    setTests(prev => 
      prev.map((test, i) => 
        i === testIndex 
          ? { ...test, [field]: value } 
          : test
      )
    );
  };

  const handleResultChange = (testIndex: number, resultIndex: number, field: keyof PersonalityResult, value: string) => {
    setTests(prev => 
      prev.map((test, i) => {
        if (i !== testIndex) return test;
        
        const newResults = [...test.results];
        newResults[resultIndex] = {
          ...newResults[resultIndex],
          [field]: value
        };
        
        return {
          ...test,
          results: newResults
        };
      })
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

  const addResult = (testIndex: number) => {
    setTests(prev => 
      prev.map((test, i) => {
        if (i !== testIndex) return test;
        
        return {
          ...test,
          results: [...test.results, { ...emptyResult, id: generateId() }]
        };
      })
    );
  };

  const removeResult = (testIndex: number, resultIndex: number) => {
    setTests(prev => 
      prev.map((test, i) => {
        if (i !== testIndex) return test;
        if (test.results.length <= 1) return test;
        
        return {
          ...test,
          results: test.results.filter((_, ri) => ri !== resultIndex)
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tests);
  };

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
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Test Results</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addResult(testIndex)}
                  icon={<Plus size={16} />}
                >
                  Add Result
                </Button>
              </div>
              
              {test.results.map((result, resultIndex) => (
                <div 
                  key={result.id} 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <Input
                    label="Trait/Dimension"
                    name={`trait-${testIndex}-${resultIndex}`}
                    value={result.trait}
                    onChange={(e) => handleResultChange(testIndex, resultIndex, 'trait', e.target.value)}
                    placeholder="Extraversion, Thinking, etc."
                    required
                  />
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Input
                        label="Score/Result"
                        name={`score-${testIndex}-${resultIndex}`}
                        value={result.score}
                        onChange={(e) => handleResultChange(testIndex, resultIndex, 'score', e.target.value)}
                        placeholder="85%, INTJ, etc."
                        required
                      />
                    </div>
                    
                    {test.results.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResult(testIndex, resultIndex)}
                        className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <TextArea
                      label="Description"
                      name={`description-${testIndex}-${resultIndex}`}
                      value={result.description}
                      onChange={(e) => handleResultChange(testIndex, resultIndex, 'description', e.target.value)}
                      placeholder="Explain what this result means..."
                      rows={2}
                      required
                    />
                  </div>
                </div>
              ))}
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
          
          <Button type="submit">
            Save Personality Tests
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PersonalityForm;