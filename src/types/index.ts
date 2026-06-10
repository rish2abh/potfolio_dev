export interface PersonalInfo {
  name: string;
  role: string;
  tagline: string;
  github: string;
  linkedin: string;
  resumePath: string;
  profileImage: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  problem: string;
  solution: string;
  techStack: string[];
  contribution: string;
  impact: string;
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  contributions: string[];
  impact: string;
}

export interface Skill {
  name: string;
  category: 'Backend' | 'Database' | 'Cloud' | 'AI/Systems';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  verificationUrl?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
