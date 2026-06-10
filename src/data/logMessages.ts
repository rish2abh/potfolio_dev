import { LogEntry } from '@/types/effects';

// Section-specific log messages triggered on scroll/navigation
export const sectionLogs: Record<string, Pick<LogEntry, 'level' | 'message'>> = {
  hero: { level: 'OK', message: 'System initialized. Welcome.' },
  about: { level: 'INFO', message: 'Loading engineer profile module...' },
  skills: { level: 'INFO', message: 'Rendering tech stack graph...' },
  projects: { level: 'AI', message: 'Loading architecture data...' },
  experience: { level: 'INFO', message: 'Traversing engineering timeline...' },
  certifications: { level: 'OK', message: 'Credentials verified.' },
  contact: { level: 'ACTION', message: 'Communication channel ready.' },
};

// Project-specific hover/click logs
export const projectLogs: Record<string, Pick<LogEntry, 'level' | 'message'>> = {
  'voiceowl-ai': { level: 'AI', message: 'Loading VoiceOwl architecture — SSE streams, AI pipelines...' },
  agrisoft: { level: 'INFO', message: 'Fetching AgriSoft data pipeline metrics...' },
  digisparsh: { level: 'INFO', message: 'Loading Digisparsh billing workflow schema...' },
};
