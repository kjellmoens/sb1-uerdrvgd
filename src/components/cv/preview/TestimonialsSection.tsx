import React from 'react';
import { MessageSquare, Linkedin } from 'lucide-react';
import { formatDate } from '../../../utils/helpers';

interface TestimonialsSectionProps {
  testimonials: any[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="mb-8 page-break">
      <div className="flex items-center mb-4">
        <MessageSquare size={18} className="mr-2 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Testimonials</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border rounded-lg p-6 border-gray-200 avoid-break">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-gray-900">{testimonial.author}</h3>
                <div className="text-gray-600 mt-1">{testimonial.role} at {testimonial.company}</div>
                <div className="text-gray-500 text-sm mt-1">
                  {testimonial.relationship} • {formatDate(testimonial.date)}
                </div>
              </div>
              
              {testimonial.linkedinProfile && (
                <a 
                  href={testimonial.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
            
            <blockquote className="text-gray-700 italic">
              "{testimonial.content}"
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;