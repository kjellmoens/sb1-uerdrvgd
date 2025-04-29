export interface ProfileSummary {
  id: string;
  content: string;
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
  state: string;
  country: string;
  website: string;
  linkedin: string;
  github: string;
  title: string;
  birthdate: string;
  nationality: string;
  relationshipStatus: string;
  profileSummaries: ProfileSummary[];
}