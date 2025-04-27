export interface CV {
  id: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  projects: Project[];
  trainings: Training[];
  certifications: Certification[];
  education: Education[];
  personality?: PersonalityTest[];
  languages?: Language[];
  skills?: Skill[];
  awards?: Award[];
  testimonials?: Testimonial[];
}

export interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  state?: string;
  country: string;
  website?: string;
  linkedin?: string;
  github?: string;
  profileSummaries: ProfileSummary[];
  title: string;
  birthdate: string;
  nationality: string;
  relationshipStatus: string;
}

export interface ProfileSummary {
  id: string;
  content: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  location: string;
  sector: string;
  description: string;
  url?: string;
  positions: Position[];
}

export interface Position {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  skills: SkillScore[];
  projects: PositionProject[];
}

export interface PositionProject {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technicalSkills: SkillScore[];
  nonTechnicalSkills: SkillScore[];
  link?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  company: string;
  location: string;
  technicalSkills: SkillScore[];
  nonTechnicalSkills: SkillScore[];
  link?: string;
}

export interface SkillScore {
  name: string;
  score: number;
}

export interface Training {
  id: string;
  title: string;
  provider: string;
  completionDate: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialURL?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location: string;
  description?: string;
}

export interface PersonalityTest {
  id: string;
  type: string;
  completionDate: string;
  results: PersonalityResult[];
  provider?: string;
  description?: string;
  reportUrl?: string;
}

export interface PersonalityResult {
  id: string;
  trait: string;
  score: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
  certificate?: string;
  certificateDate?: string;
  certificateUrl?: string;
  notes?: string;
}

export enum LanguageProficiency {
  Native = "Native",
  Fluent = "Fluent (C2)",
  Advanced = "Advanced (C1)",
  UpperIntermediate = "Upper Intermediate (B2)",
  Intermediate = "Intermediate (B1)",
  Elementary = "Elementary (A2)",
  Beginner = "Beginner (A1)"
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  url?: string;
  category?: string;
  level?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  relationship: string;
  date: string;
  content: string;
  contactInfo?: string;
  linkedinProfile?: string;
}

export interface Skill {
  id: string;
  domain: string;
  subdomain: string;
  name: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  website?: string;
  logo?: string;
  headquarters: {
    city: string;
    state?: string;
    country: string;
  };
  founded?: string;
  size?: string;
  type: 'Public' | 'Private' | 'Nonprofit' | 'Government' | 'Other';
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CVPreviewFlags {
  showTrainingDescription?: boolean;
  showProjectDescription?: boolean;
  showEducationDescription?: boolean;
  showWorkDescription?: boolean;
  showCompanyDescription?: boolean;
  showBirthdate?: boolean;
  showNationality?: boolean;
  showRelationshipStatus?: boolean;
  showStreetAddress?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
}