export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  website?: string;
  city: string;
  country_code: string;
  type: 'Public' | 'Private' | 'Nonprofit' | 'Government' | 'Other';
}