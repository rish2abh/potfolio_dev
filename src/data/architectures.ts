import { ProjectArchitecture } from '@/types/effects';

/**
 * VoiceOwl AI — Full architecture (flagship project)
 * Represents the complete multi-layer system from frontend to cloud infrastructure.
 * Layout uses a 200x120 viewBox with compact node sizing for readability.
 */
export const voiceowlArchitecture: ProjectArchitecture = {
  nodes: [
    // Layer 1: Frontend
    {
      id: 'frontend',
      label: 'Frontend',
      type: 'user',
      technologies: ['React', 'Dashboard UI'],
      role: 'Admin panel and real-time campaign dashboards',
      position: { x: 88, y: 2 },
    },
    // Layer 2: Gateway
    {
      id: 'nginx',
      label: 'Nginx Gateway',
      type: 'external',
      technologies: ['Load Balancer', 'Routing'],
      role: 'Load balancing, reverse proxy, and request routing',
      position: { x: 88, y: 15 },
    },
    // Layer 3: Backend Services
    {
      id: 'backend',
      label: 'Backend Services',
      type: 'backend',
      technologies: ['Node.js', 'NestJS'],
      role: 'Core API layer handling business logic and orchestration',
      position: { x: 88, y: 28 },
    },
    // Layer 4: Microservices (3 across)
    {
      id: 'auth-service',
      label: 'Auth Service',
      type: 'backend',
      technologies: ['JWT', 'RBAC', 'MFA'],
      role: 'Authentication with JWT, role-based access, MFA, and IP restriction',
      position: { x: 20, y: 41 },
    },
    {
      id: 'campaign-service',
      label: 'Campaign Mgmt',
      type: 'backend',
      technologies: ['Campaigns', 'Scheduling'],
      role: 'Campaign creation, scheduling, and management',
      position: { x: 88, y: 41 },
    },
    {
      id: 'agent-engine',
      label: 'Agent Engine',
      type: 'ai',
      technologies: ['Workflows', 'Routing'],
      role: 'AI agent workflow engine and call routing logic',
      position: { x: 156, y: 41 },
    },
    // Layer 5: Data Stores (3 across)
    {
      id: 'mongodb',
      label: 'MongoDB',
      type: 'database',
      technologies: ['Primary DB', 'Documents'],
      role: 'Primary data store for call records, campaigns, and users',
      position: { x: 20, y: 54 },
    },
    {
      id: 'postgresql',
      label: 'PostgreSQL',
      type: 'database',
      technologies: ['Relational', 'Analytics'],
      role: 'Relational data for reporting and structured analytics',
      position: { x: 88, y: 54 },
    },
    {
      id: 'redis',
      label: 'Redis',
      type: 'database',
      technologies: ['Cache', 'Queue'],
      role: 'Caching layer and real-time queue for async operations',
      position: { x: 156, y: 54 },
    },
    // Layer 6: Async Processing
    {
      id: 'sqs',
      label: 'AWS SQS',
      type: 'external',
      technologies: ['Queue', 'Async Jobs'],
      role: 'Asynchronous job processing and event-driven task orchestration',
      position: { x: 88, y: 67 },
    },
    // Layer 7: Processing Services (3 across)
    {
      id: 'pca-service',
      label: 'PCA Service',
      type: 'ai',
      technologies: ['Post-Call', 'Analytics'],
      role: 'Post-call analytics — sentiment, summary, and quality scoring',
      position: { x: 20, y: 80 },
    },
    {
      id: 'notification-service',
      label: 'Notifications',
      type: 'backend',
      technologies: ['Email', 'SMS'],
      role: 'Multi-channel notification delivery system',
      position: { x: 88, y: 80 },
    },
    {
      id: 'file-processing',
      label: 'File Processing',
      type: 'backend',
      technologies: ['Upload', 'Parse'],
      role: 'Bulk file upload processing and data extraction',
      position: { x: 156, y: 80 },
    },
    // Layer 8: AI Layer
    {
      id: 'ai-layer',
      label: 'AI Layer',
      type: 'ai',
      technologies: ['OpenAI', 'Gemini', 'Groq'],
      role: 'LLM inference for conversation generation and intent recognition',
      position: { x: 88, y: 93 },
    },
    // Layer 9: Voice / Telephony
    {
      id: 'voice-layer',
      label: 'Voice / Telephony',
      type: 'external',
      technologies: ['Azure STT', 'Twilio'],
      role: 'Speech-to-text, telephony connections, and text-to-speech synthesis',
      position: { x: 55, y: 106 },
    },
    // Layer 10: Observability
    {
      id: 'observability',
      label: 'Observability',
      type: 'external',
      technologies: ['SSE', 'DataDog'],
      role: 'Real-time event streaming and centralized logging/metrics',
      position: { x: 122, y: 106 },
    },
    // Layer 11: Cloud & Infra
    {
      id: 'cloud-infra',
      label: 'Cloud & Infra',
      type: 'external',
      technologies: ['AWS S3', 'Docker'],
      role: 'Cloud storage, serverless functions, and containerized deployments',
      position: { x: 88, y: 119 },
    },
  ],
  edges: [
    // Vertical flow
    { from: 'frontend', to: 'nginx', label: 'HTTPS' },
    { from: 'nginx', to: 'backend', label: 'Proxy' },
    // Backend to microservices
    { from: 'backend', to: 'auth-service', label: 'Auth' },
    { from: 'backend', to: 'campaign-service', label: 'Campaigns' },
    { from: 'backend', to: 'agent-engine', label: 'Workflows' },
    // Microservices to data stores
    { from: 'auth-service', to: 'mongodb' },
    { from: 'campaign-service', to: 'postgresql' },
    { from: 'agent-engine', to: 'redis' },
    // Data to queue
    { from: 'postgresql', to: 'sqs', label: 'Events' },
    // Queue to processing
    { from: 'sqs', to: 'pca-service' },
    { from: 'sqs', to: 'notification-service' },
    { from: 'sqs', to: 'file-processing' },
    // PCA to AI
    { from: 'pca-service', to: 'ai-layer', label: 'Inference' },
    // AI to Voice & Observability
    { from: 'ai-layer', to: 'voice-layer', label: 'TTS/STT' },
    { from: 'ai-layer', to: 'observability', label: 'Metrics' },
    // Bottom to Cloud
    { from: 'voice-layer', to: 'cloud-infra', label: 'Storage' },
    { from: 'observability', to: 'cloud-infra', label: 'Logs' },
  ],
  flowSequence: ['frontend', 'nginx', 'backend', 'agent-engine', 'ai-layer', 'voice-layer'],
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
      question: 'Why MongoDB + PostgreSQL?',
      problem: 'Call data needs flexible schemas but analytics require structured relational queries.',
      decision: 'MongoDB for primary ops data, PostgreSQL for relational analytics and reporting.',
      tradeoff: 'Single DB is simpler but forces compromises — either schema flexibility or query power.',
      outcome: 'Best of both worlds: fast iteration on call data, powerful joins for campaign analytics.',
    },
    {
      question: 'Why AWS SQS for async processing?',
      problem: 'Post-call analytics and notifications are slow — must not block the call flow.',
      decision: 'SQS decouples processing from real-time path, enabling retry and backpressure.',
      tradeoff: 'Synchronous processing simpler but creates cascading timeouts under load.',
      outcome: '99.9% uptime maintained even during AI provider outages — graceful fallback paths.',
    },
    {
      question: 'Why separate AI pipeline?',
      problem: 'AI inference calls are slow (200-800ms) and can fail — must not block main request flow.',
      decision: 'Decoupled AI pipeline with multiple LLM providers (OpenAI, Gemini, Groq) and fallback logic.',
      tradeoff: 'Single provider is simpler but creates single point of failure for AI capabilities.',
      outcome: 'Provider-agnostic inference with automatic failover — zero downtime during provider outages.',
    },
    {
      question: 'Why RBAC + MFA + IP Restriction?',
      problem: 'Enterprise clients require strict access controls and audit trails.',
      decision: 'Multi-layered auth: JWT tokens, role-based permissions, MFA, and IP whitelisting.',
      tradeoff: 'Simple API keys are easier to implement but insufficient for enterprise compliance.',
      outcome: 'SOC2-ready auth system, zero unauthorized access incidents, enterprise client trust.',
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
