import { Experience } from '@/types';

export const experience: Experience[] = [
  {
    id: 'voiceowl',
    company: 'VoiceOwl AI',
    role: 'Backend Developer',
    startDate: 'Apr 2024',
    endDate: 'Present',
    description: 'Built scalable AI calling infrastructure handling enterprise-level traffic with real-time data streaming',
    contributions: [
      'Real-time SSE dashboards for live call monitoring',
      'AI pipeline integration with OpenAI, Deepgram, and ElevenLabs',
      'Microservices architecture supporting 2M+ daily requests',
    ],
    impact: '99.9% uptime, 2M+ daily requests handled, 150K+ daily active users',
  },
  {
    id: 'moreyeahs',
    company: 'MoreYeahs',
    role: 'Backend Developer',
    startDate: 'Feb 2023',
    endDate: 'Mar 2024',
    description: 'Developed backend systems for automation and data processing platforms serving agricultural and healthcare domains',
    contributions: [
      'Data processing pipelines for 200K+ monthly records',
      'REST API development with Express and NestJS',
      'Cloud storage integration with AWS S3 and Cloudinary',
    ],
    impact: '40% reduction in manual tasks, 200K+ monthly records processed',
  },
  {
    id: 'codesid',
    company: 'Codesid',
    role: 'Backend Developer',
    startDate: 'May 2022',
    endDate: 'Jan 2023',
    description: 'Built foundational backend services and APIs for web applications, gaining hands-on experience with Node.js ecosystem',
    contributions: [
      'RESTful API development with Node.js and Express',
      'Database design and management with MongoDB',
      'Authentication and authorization implementation',
    ],
    impact: 'Delivered production-ready APIs supporting multiple client applications',
  },
];
