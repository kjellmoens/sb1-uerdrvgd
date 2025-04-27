import React, { useState, useEffect } from 'react';
import { Testimonial } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Trash2, Plus, MessageSquare, Building, Users, Calendar, Linkedin } from 'lucide-react';
import { generateId } from '../../utils/helpers';
import { api } from '../../lib/api';

interface TestimonialsFormProps {
  testimonials: Testimonial[];
  onSave: (testimonials: Testimonial[]) => void;
  cvId: string;
}

const emptyTestimonial: Omit<Testimonial, 'id'> = {
  author: '',
  role: '',
  company: '',
  relationship: '',
  date: '',
  content: '',
  contactInfo: '',
  linkedinProfile: ''
};

const TestimonialsForm: React.FC<TestimonialsFormProps> = ({ testimonials, onSave, cvId }) => {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>(
    testimonials.length ? testimonials : [{ ...emptyTestimonial, id: generateId() }]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (testimonials.length > 0) {
      setUserTestimonials(testimonials);
    }
  }, [testimonials]);

  const handleChange = (index: number, field: keyof Testimonial, value: string) => {
    setUserTestimonials(prev => 
      prev.map((testimonial, i) => 
        i === index 
          ? { ...testimonial, [field]: value } 
          : testimonial
      )
    );
  };

  const addTestimonial = () => {
    setUserTestimonials(prev => [
      ...prev,
      { ...emptyTestimonial, id: generateId() }
    ]);
  };

  const removeTestimonial = (index: number) => {
    setUserTestimonials(prev => prev.filter((_, i) => i !== index));
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
      const savedTestimonials = await api.testimonials.save(cvId, userTestimonials);
      onSave(savedTestimonials);
    } catch (error) {
      console.error('Error saving testimonials:', error);
      setError('Failed to save testimonials');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card title="Testimonials">
        <div className="text-red-600 p-4">{error}</div>
      </Card>
    );
  }

  return (
    <Card title="Testimonials">
      <form onSubmit={handleSubmit}>
        {userTestimonials.map((testimonial, index) => (
          <div 
            key={testimonial.id} 
            className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Testimonial {index + 1}
              </h3>
              {userTestimonials.length > 1 && (
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeTestimonial(index)}
                  icon={<Trash2 size={16} />}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Users className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Author Name"
                  name={`author-${index}`}
                  value={testimonial.author}
                  onChange={(e) => handleChange(index, 'author', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Building className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Role/Title"
                  name={`role-${index}`}
                  value={testimonial.role}
                  onChange={(e) => handleChange(index, 'role', e.target.value)}
                  placeholder="Senior Manager"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Building className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Company"
                  name={`company-${index}`}
                  value={testimonial.company}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Users className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Professional Relationship"
                  name={`relationship-${index}`}
                  value={testimonial.relationship}
                  onChange={(e) => handleChange(index, 'relationship', e.target.value)}
                  placeholder="Manager, Colleague, Client"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" size={18} />
                <Input
                  label="Date"
                  type="date"
                  name={`date-${index}`}
                  value={testimonial.date}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <Linkedin className="text-gray-400 mr-2" size={18} />
                <Input
                  label="LinkedIn Profile"
                  type="url"
                  name={`linkedinProfile-${index}`}
                  value={testimonial.linkedinProfile || ''}
                  onChange={(e) => handleChange(index, 'linkedinProfile', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div className="md:col-span-2">
                <TextArea
                  label="Testimonial Content"
                  name={`content-${index}`}
                  value={testimonial.content}
                  onChange={(e) => handleChange(index, 'content', e.target.value)}
                  placeholder="Enter the testimonial content..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Input
                  label="Contact Information (Optional)"
                  name={`contactInfo-${index}`}
                  value={testimonial.contactInfo || ''}
                  onChange={(e) => handleChange(index, 'contactInfo', e.target.value)}
                  placeholder="Email or phone number for verification"
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={addTestimonial}
            icon={<Plus size={18} />}
          >
            Add Another Testimonial
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Testimonials'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TestimonialsForm;