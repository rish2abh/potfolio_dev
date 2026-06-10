import { ProjectArchitecture } from '@/types/effects';

/**
 * VoiceOwl AI — Full architecture (flagship project)
 */
export const voiceowlArchitecture: ProjectArchitecture = {
  nodes: [
    {
      id: 'user',
      label: 'User / Client',
      type: 'user',
      technologies: ['Browser', 'Mobile App'],
      role: 'Initiates calls and views real-time dashboards',
      position: { x: 10, y: 50 },
    },
    {
      id: 'backend',
      label: 'Backend API',
      type: 'backend',
      technologies: ['Node.js', 'NestJS', 'Express'],
      role: 'Orchestrates call flows, handles SSE streams, manages state',
      position: { x: 35, y: 30 },
    },
    {
      id: 'ai-engine',
      label: 'AI Engine',
      type: 'ai',
      technologies: ['OpenAI', 'Deepgram', 'ElevenLabs'],
      role: 'Processes speech-to-text, generates responses, synthesizes voice',
      position: { x: 60, y: 20 },
    },
    {
      id: 'database',
      label: 'Database',
      type: 'database',
      technologies: ['MongoDB', 'Redis'],
      role: 'Stores call records, user sessions, and conversation history',
      position: { x: 60, y: 70 },
    },
    {
      id: 'telephony',
      label: 'Telephony',
      type: 'external',
      technologies: ['Twilio', 'SIP Trunking'],
      role: 'Manages outbound/inbound phone connections',
      position: { x: 85, y: 50 },
    },
  ],
  edges: [
    { from: 'user', to: 'backend', label: 'SSE + REST' },
    { from: 'backend', to: 'ai-engine', label: 'AI Pipeline' },
    { from: 'backend', to: 'database', label: 'Read/Write' },
    { from: 'backend', to: 'telephony', label: 'Call Control' },
    { from: 'ai-engine', to: 'backend', label: 'Transcription + Response' },
    { from: 'telephony', to: 'backend', label: 'Call Events' },
  ],
  flowSequence: ['user', 'backend', 'ai-engine', 'backend', 'telephony'],
  insights: [
    {
      question: 'Why Server-Sent Events?',
      problem: 'Needed real-time dashboard updates without heavy infra.',
      decision: 'Server-Sent Events chosen for unidirectional streaming from server to client.',
      tradeoff: 'WebSockets considered but overkill for one-way data — adds connection management complexity.',
      outcome: 'Reduced complexity, stable streaming for 150K+ daily active users with minimal overhead.',
    },
    {
      question: 'Why NestJS over Express?',
      problem: 'Growing codebase needed modular structure and dependency injection.',
      decision: 'NestJS chosen for its opinionated architecture and built-in module system.',
      tradeoff: 'Express is lighter but lacks enforced patterns — leads to tech debt at scale.',
      outcome: 'Clean separation of concerns, faster onboarding, maintainable microservices.',
    },
    {
      question: 'Why MongoDB?',
      problem: 'Call records and conversation data have dynamic schemas that evolve frequently.',
      decision: 'MongoDB chosen for schema flexibility and native JSON handling.',
      tradeoff: 'SQL databases offer better joins but require migrations for every schema change.',
      outcome: 'Rapid iteration on data models, 2M+ daily documents written without schema migration overhead.',
    },
    {
      question: 'Why separate AI pipeline?',
      problem: 'AI inference calls are slow (200-800ms) and can fail — must not block main request flow.',
      decision: 'Decoupled AI pipeline with async processing and retry logic.',
      tradeoff: 'Synchronous processing simpler but creates cascading timeouts under load.',
      outcome: '99.9% uptime maintained even during AI provider outages — graceful fallback paths.',
    },
  ],
};

/**
 * AgriSoft — Simplified architecture (3 nodes, 2 insights)
 */
export const agrisoftArchitecture: ProjectArchitecture = {
  nodes: [
    {
      id: 'user',
      label: 'Admin Panel',
      type: 'user',
      technologies: ['React', 'REST Client'],
      role: 'Manages agricultural data records and triggers automation',
      position: { x: 15, y: 50 },
    },
    {
      id: 'backend',
      label: 'Backend API',
      type: 'backend',
      technologies: ['Node.js', 'Express'],
      role: 'Handles CRUD operations, automation scheduling, and data pipelines',
      position: { x: 50, y: 50 },
    },
    {
      id: 'storage',
      label: 'Data Layer',
      type: 'database',
      technologies: ['MongoDB', 'AWS S3'],
      role: 'Stores structured records and file uploads',
      position: { x: 85, y: 50 },
    },
  ],
  edges: [
    { from: 'user', to: 'backend', label: 'REST API' },
    { from: 'backend', to: 'storage', label: 'Data + Files' },
  ],
  flowSequence: ['user', 'backend', 'storage'],
  insights: [
    {
      question: 'Why automation over manual processing?',
      problem: 'Manual data entry for 200K+ records was error-prone and slow.',
      decision: 'Built scheduled pipelines with validation rules for auto-processing.',
      tradeoff: "Fully manual gives flexibility but doesn't scale — 40% time wasted on repetition.",
      outcome: '40% reduction in manual tasks, consistent data quality across 200K+ monthly records.',
    },
    {
      question: 'Why AWS S3 for file storage?',
      problem: 'Agricultural reports and documents needed durable, scalable storage.',
      decision: 'AWS S3 chosen for reliability and pre-signed URL access patterns.',
      tradeoff: 'Local storage is simpler but creates single point of failure and limits scalability.',
      outcome: 'Unlimited document storage with 99.99% durability, direct client uploads.',
    },
  ],
};

/**
 * Digisparsh — Simplified architecture (3 nodes, 2 insights)
 */
export const digisparshArchitecture: ProjectArchitecture = {
  nodes: [
    {
      id: 'user',
      label: 'Healthcare Staff',
      type: 'user',
      technologies: ['Web Portal'],
      role: 'Manages patient billing, workflow approvals',
      position: { x: 15, y: 50 },
    },
    {
      id: 'backend',
      label: 'Workflow Engine',
      type: 'backend',
      technologies: ['Node.js', 'Express'],
      role: 'Processes billing logic, enforces workflow rules',
      position: { x: 50, y: 50 },
    },
    {
      id: 'database',
      label: 'Data Store',
      type: 'database',
      technologies: ['MongoDB', 'Cloudinary'],
      role: 'Persists patient records, billing data, and document images',
      position: { x: 85, y: 50 },
    },
  ],
  edges: [
    { from: 'user', to: 'backend', label: 'REST + Webhooks' },
    { from: 'backend', to: 'database', label: 'Read/Write' },
  ],
  flowSequence: ['user', 'backend', 'database'],
  insights: [
    {
      question: 'Why rule-based workflow engine?',
      problem: 'Billing approvals had complex conditional logic that differed per provider.',
      decision: 'Built configurable rule engine with JSON-defined workflow steps.',
      tradeoff: 'Hardcoded logic is faster to ship but impossible to customize per client.',
      outcome: 'Each healthcare provider configures their own billing flow — zero code changes needed.',
    },
    {
      question: 'Why Cloudinary for document storage?',
      problem: 'Medical documents needed image optimization and secure access.',
      decision: 'Cloudinary chosen for built-in transformations and signed URL delivery.',
      tradeoff: 'S3 is cheaper at scale but lacks built-in image processing pipeline.',
      outcome: 'Automatic document compression, on-the-fly format conversion, secure access control.',
    },
  ],
};

// Map project IDs to their architecture data
export const projectArchitectures: Record<string, ProjectArchitecture> = {
  'voiceowl-ai': voiceowlArchitecture,
  agrisoft: agrisoftArchitecture,
  digisparsh: digisparshArchitecture,
};
