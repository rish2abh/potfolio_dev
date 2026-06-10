import { TechNode } from '@/types/effects';

export const techNodes: TechNode[] = [
  // Backend
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    proficiency: 'expert',
    yearsOfExperience: 3,
    relatedProjects: ['VoiceOwl AI', 'AgriSoft', 'Digisparsh'],
    connections: ['express', 'nestjs', 'hapi', 'mongodb', 'sse', 'aws-s3'],
  },
  {
    id: 'express',
    name: 'Express',
    category: 'Backend',
    proficiency: 'expert',
    yearsOfExperience: 3,
    relatedProjects: ['AgriSoft', 'Digisparsh'],
    connections: ['nodejs', 'mongodb', 'aws-s3'],
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'Backend',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    relatedProjects: ['VoiceOwl AI'],
    connections: ['nodejs', 'mongodb', 'sse'],
  },
  {
    id: 'hapi',
    name: 'Hapi',
    category: 'Backend',
    proficiency: 'familiar',
    yearsOfExperience: 1,
    relatedProjects: [],
    connections: ['nodejs'],
  },

  // Database
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Database',
    proficiency: 'expert',
    yearsOfExperience: 3,
    relatedProjects: ['VoiceOwl AI', 'AgriSoft', 'Digisparsh'],
    connections: ['nodejs', 'express', 'nestjs'],
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'Database',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    relatedProjects: [],
    connections: ['nodejs'],
  },

  // Cloud
  {
    id: 'aws-s3',
    name: 'AWS S3',
    category: 'Cloud',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    relatedProjects: ['AgriSoft'],
    connections: ['nodejs', 'express'],
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    category: 'Cloud',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    relatedProjects: ['Digisparsh'],
    connections: ['nodejs'],
  },

  // AI / Systems
  {
    id: 'prompt-eng',
    name: 'Prompt Engineering',
    category: 'AI/Systems',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    relatedProjects: ['VoiceOwl AI'],
    connections: ['openai', 'nodejs'],
  },
  {
    id: 'sse',
    name: 'Server-Sent Events',
    category: 'AI/Systems',
    proficiency: 'expert',
    yearsOfExperience: 2,
    relatedProjects: ['VoiceOwl AI'],
    connections: ['nodejs', 'nestjs'],
  },
  {
    id: 'automation',
    name: 'Automation Systems',
    category: 'AI/Systems',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    relatedProjects: ['VoiceOwl AI', 'AgriSoft'],
    connections: ['nodejs', 'mongodb'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'AI/Systems',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    relatedProjects: ['VoiceOwl AI'],
    connections: ['prompt-eng', 'nodejs'],
  },
];
