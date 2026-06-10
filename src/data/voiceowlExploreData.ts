// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface CoreProblem {
  title: string;
  description: string;
}

export interface ImpactStat {
  label: string;
  value: number;
  suffix: string;
}

export interface FeatureItem {
  name: string;
  liveStatus: boolean;
  metric?: string;
}

export interface FeatureCategory {
  title: string;
  items: readonly FeatureItem[];
}

export interface ContributionItem {
  title: string;
  before: string;
  after: string;
}

export interface Challenge {
  title: string;
  before: string;
  after: string;
}

export interface TechStackCategory {
  category: string;
  technologies: readonly string[];
}

export interface BackendLayer {
  name: string;
  description: string;
}

export interface MetricData {
  feature: string;
  latency: string;
  usage: string;
  status: 'active' | 'stable' | 'optimizing';
}

// ─── Overview Data ─────────────────────────────────────────────────────────────

export const voiceowlOverviewData = Object.freeze({
  description:
    'VoiceOwl AI is an enterprise-grade real-time voice AI platform that automates outbound and inbound call operations using advanced speech recognition, natural language processing, and voice synthesis. The system handles thousands of concurrent calls while maintaining sub-second response latency and human-like conversational quality.',
  problems: Object.freeze([
    Object.freeze({
      title: 'Manual Call Operations at Scale',
      description:
        'Enterprise call centers struggled with 10,000+ daily outbound calls requiring human agents, leading to high labor costs and inconsistent quality across shifts.',
    }),
    Object.freeze({
      title: 'Real-Time Voice Processing Latency',
      description:
        'Existing voice bots introduced 2-3 second response delays due to sequential STT → NLP → TTS pipelines, causing unnatural conversation flow and caller drop-offs.',
    }),
    Object.freeze({
      title: 'Dynamic Conversation Context Loss',
      description:
        'Traditional IVR systems lost context mid-conversation, forcing callers to repeat information and creating fragmented interaction logs across multiple systems.',
    }),
    Object.freeze({
      title: 'System Reliability Under Peak Load',
      description:
        'Previous platforms experienced cascading failures during peak hours when concurrent call volume exceeded capacity, resulting in dropped calls and data loss.',
    }),
  ]) as readonly CoreProblem[],
  impactStats: Object.freeze([
    Object.freeze({ label: 'Daily Active Users', value: 150, suffix: 'K+' }),
    Object.freeze({ label: 'Daily API Requests', value: 2, suffix: 'M+' }),
    Object.freeze({ label: 'System Uptime', value: 99.9, suffix: '%' }),
  ]) as readonly ImpactStat[],
  systemSummary:
    'The platform processes voice interactions end-to-end: from telephony ingestion through real-time transcription, intent classification, response generation, and voice synthesis — all within a 200ms latency budget per conversational turn.',
});

// ─── Features Data ─────────────────────────────────────────────────────────────

export const voiceowlFeatures: readonly FeatureCategory[] = Object.freeze([
  Object.freeze({
    title: 'AI Conversation Engine',
    items: Object.freeze([
      Object.freeze({ name: 'Multi-turn dialogue management', liveStatus: true, metric: '12ms avg' }),
      Object.freeze({ name: 'Intent classification with fallback routing', liveStatus: true, metric: '98.2% accuracy' }),
      Object.freeze({ name: 'Dynamic prompt injection based on caller context', liveStatus: true }),
      Object.freeze({ name: 'Sentiment-aware response generation', liveStatus: true, metric: '45K/day' }),
      Object.freeze({ name: 'Multilingual support (8 languages)', liveStatus: false }),
    ]),
  }),
  Object.freeze({
    title: 'Real-Time Call Processing',
    items: Object.freeze([
      Object.freeze({ name: 'Concurrent call handling (5000+ simultaneous)', liveStatus: true, metric: '5.2K peak' }),
      Object.freeze({ name: 'Sub-200ms end-to-end voice latency', liveStatus: true, metric: '142ms p95' }),
      Object.freeze({ name: 'Real-time transcription streaming via WebSocket', liveStatus: true }),
      Object.freeze({ name: 'Automatic call recording and archival', liveStatus: true, metric: '2.1TB/month' }),
      Object.freeze({ name: 'Live call monitoring dashboard', liveStatus: true }),
    ]),
  }),
  Object.freeze({
    title: 'Intelligent Call Routing',
    items: Object.freeze([
      Object.freeze({ name: 'Skills-based agent routing', liveStatus: true, metric: '8ms routing' }),
      Object.freeze({ name: 'Priority queue management', liveStatus: true }),
      Object.freeze({ name: 'Overflow handling with graceful degradation', liveStatus: true }),
      Object.freeze({ name: 'Geographic and timezone-aware distribution', liveStatus: true, metric: '23 regions' }),
      Object.freeze({ name: 'AI-to-human handoff with context transfer', liveStatus: true }),
    ]),
  }),
  Object.freeze({
    title: 'Real-Time Dashboard',
    items: Object.freeze([
      Object.freeze({ name: 'Server-Sent Events for live metric streaming', liveStatus: true, metric: '150K users' }),
      Object.freeze({ name: 'Call volume heatmaps and trend analysis', liveStatus: true }),
      Object.freeze({ name: 'Agent performance scorecards', liveStatus: true, metric: '1s refresh' }),
      Object.freeze({ name: 'Custom alert thresholds and notifications', liveStatus: true }),
      Object.freeze({ name: 'Historical analytics with 90-day retention', liveStatus: true }),
    ]),
  }),
  Object.freeze({
    title: 'Advanced Authentication & Security',
    items: Object.freeze([
      Object.freeze({ name: 'Role-based access control (RBAC)', liveStatus: true }),
      Object.freeze({ name: 'JWT + refresh token rotation', liveStatus: true, metric: '0 breaches' }),
      Object.freeze({ name: 'API rate limiting per tenant', liveStatus: true, metric: '10K req/min' }),
      Object.freeze({ name: 'Audit logging for compliance (SOC2)', liveStatus: true }),
      Object.freeze({ name: 'SSO integration (SAML, OAuth2)', liveStatus: false }),
    ]),
  }),
  Object.freeze({
    title: 'Customizable Bot Builder',
    items: Object.freeze([
      Object.freeze({ name: 'Visual flow editor for conversation design', liveStatus: true, metric: '320 bots' }),
      Object.freeze({ name: 'Template library with industry presets', liveStatus: true }),
      Object.freeze({ name: 'A/B testing for conversation variants', liveStatus: true, metric: '12% lift' }),
      Object.freeze({ name: 'Webhook integration for external actions', liveStatus: true }),
      Object.freeze({ name: 'Version control with rollback support', liveStatus: true }),
    ]),
  }),
]);

// ─── Contributions Data ────────────────────────────────────────────────────────

export const voiceowlContributions = Object.freeze({
  items: Object.freeze([
    Object.freeze({
      title: 'Real-Time SSE Dashboard Architecture',
      before: 'Dashboard used polling every 5s, causing stale data and 40% unnecessary API load',
      after: 'Implemented Server-Sent Events with smart reconnection, delivering sub-second updates to 150K+ daily users with 60% less server load',
    }),
    Object.freeze({
      title: 'AI Pipeline Decoupling',
      before: 'AI inference calls blocked the main request thread, causing cascading timeouts during peak load',
      after: 'Architected async AI pipeline with queue-based processing and retry logic, maintaining 99.9% uptime during provider outages',
    }),
    Object.freeze({
      title: 'Call Processing Optimization',
      before: 'Sequential STT → NLP → TTS pipeline added 800ms+ latency per turn',
      after: 'Redesigned as parallel streaming pipeline with speculative execution, reducing end-to-end latency to 142ms p95',
    }),
    Object.freeze({
      title: 'Database Query Optimization',
      before: 'Complex aggregation queries took 3-5s on call history collections with 50M+ documents',
      after: 'Implemented compound indexes, query plan optimization, and read replicas — reduced p99 query time to 45ms',
    }),
    Object.freeze({
      title: 'Microservices Migration',
      before: 'Monolithic Node.js application with 200K+ LOC, 15-minute deploy cycles, and coupled failure domains',
      after: 'Decomposed into 12 NestJS microservices with independent deployment, reducing deploy time to 90s and isolating failures',
    }),
    Object.freeze({
      title: 'Automated Testing Infrastructure',
      before: 'Manual QA process with 2-day regression cycles and 30% bug escape rate to production',
      after: 'Built CI/CD pipeline with 2,400+ automated tests, contract testing between services, achieving 94% code coverage',
    }),
    Object.freeze({
      title: 'Telephony Integration Layer',
      before: 'Direct Twilio SDK coupling made provider switching impossible and testing required live calls',
      after: 'Designed abstraction layer supporting multiple telephony providers with mock interfaces for local testing',
    }),
  ]) as readonly ContributionItem[],
  challenges: Object.freeze([
    Object.freeze({
      title: 'Scaling WebSocket Connections',
      before: 'Single server limited to 10K concurrent WebSocket connections, creating a hard ceiling on active calls',
      after: 'Implemented Redis-backed pub/sub with horizontal pod scaling, supporting 50K+ concurrent connections across the cluster',
    }),
    Object.freeze({
      title: 'Voice Latency Budget',
      before: 'Users perceived AI responses as robotic due to 2s+ response delay breaking conversational flow',
      after: 'Achieved sub-200ms response latency through edge caching, streaming inference, and predictive pre-computation',
    }),
    Object.freeze({
      title: 'Data Consistency Across Services',
      before: 'Eventual consistency bugs caused duplicate call records and billing discrepancies across microservices',
      after: 'Implemented saga pattern with compensating transactions, reducing data inconsistencies to near-zero with full audit trail',
    }),
    Object.freeze({
      title: 'Zero-Downtime Deployments',
      before: 'Deployments caused 30-60s service interruption, dropping active calls and losing in-progress transcriptions',
      after: 'Built rolling deployment with connection draining and state migration, achieving true zero-downtime releases',
    }),
  ]) as readonly Challenge[],
  impactMetrics: Object.freeze([
    Object.freeze({ label: 'Latency Reduction', value: 80, suffix: '%' }),
    Object.freeze({ label: 'Server Load Reduction', value: 60, suffix: '%' }),
    Object.freeze({ label: 'Test Coverage', value: 94, suffix: '%' }),
    Object.freeze({ label: 'Deploy Time Reduction', value: 90, suffix: 's' }),
  ]) as readonly ImpactStat[],
  techStack: Object.freeze([
    Object.freeze({
      category: 'Backend Framework',
      technologies: ['Node.js', 'NestJS', 'Express', 'TypeScript'],
    }),
    Object.freeze({
      category: 'AI & ML Services',
      technologies: ['OpenAI GPT-4', 'Deepgram STT', 'ElevenLabs TTS', 'Custom NLP Models'],
    }),
    Object.freeze({
      category: 'Database & Caching',
      technologies: ['MongoDB', 'Redis', 'Elasticsearch'],
    }),
    Object.freeze({
      category: 'Telephony & Communication',
      technologies: ['Twilio', 'SIP Trunking', 'WebRTC', 'WebSocket'],
    }),
    Object.freeze({
      category: 'Infrastructure & DevOps',
      technologies: ['AWS ECS', 'Docker', 'GitHub Actions', 'Terraform'],
    }),
    Object.freeze({
      category: 'Monitoring & Observability',
      technologies: ['Datadog', 'PagerDuty', 'Sentry', 'Custom Metrics'],
    }),
    Object.freeze({
      category: 'Frontend & Dashboard',
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'D3.js'],
    }),
  ]) as readonly TechStackCategory[],
});

// ─── Backend Layers Data ───────────────────────────────────────────────────────

export const voiceowlBackendLayers: readonly BackendLayer[] = Object.freeze([
  Object.freeze({
    name: 'API Gateway Layer',
    description:
      'Request routing, rate limiting, and authentication. Handles 2M+ daily requests with JWT validation, tenant isolation, and request deduplication before forwarding to downstream services.',
  }),
  Object.freeze({
    name: 'Orchestration Layer',
    description:
      'Call flow state management and service coordination. Manages the lifecycle of each call through configurable state machines, handling transitions between AI, human agents, and IVR flows.',
  }),
  Object.freeze({
    name: 'AI Processing Layer',
    description:
      'Speech-to-text, NLP intent classification, and response generation. Processes audio streams through parallel pipelines with model fallback chains ensuring sub-200ms inference latency.',
  }),
  Object.freeze({
    name: 'Voice Synthesis Layer',
    description:
      'Text-to-speech generation with voice cloning and prosody control. Streams synthesized audio in real-time with buffer management to prevent playback gaps during network jitter.',
  }),
  Object.freeze({
    name: 'Data Persistence Layer',
    description:
      'Call records, conversation histories, and analytics storage. Uses MongoDB for flexible document storage with Redis caching for hot data and Elasticsearch for full-text search across transcripts.',
  }),
  Object.freeze({
    name: 'Event Streaming Layer',
    description:
      'Real-time event distribution via Server-Sent Events and WebSocket. Publishes call state changes, metric updates, and system alerts to connected dashboards with guaranteed delivery ordering.',
  }),
]);

// ─── Per-Feature Metrics Data ──────────────────────────────────────────────────

export const voiceowlMetrics: readonly MetricData[] = Object.freeze([
  Object.freeze({
    feature: 'AI Conversation Engine',
    latency: '12ms',
    usage: '45K/day',
    status: 'active' as const,
  }),
  Object.freeze({
    feature: 'Real-Time Call Processing',
    latency: '142ms',
    usage: '5.2K concurrent',
    status: 'active' as const,
  }),
  Object.freeze({
    feature: 'Intelligent Call Routing',
    latency: '8ms',
    usage: '23 regions',
    status: 'active' as const,
  }),
  Object.freeze({
    feature: 'Real-Time Dashboard',
    latency: '< 1s',
    usage: '150K users',
    status: 'stable' as const,
  }),
  Object.freeze({
    feature: 'Advanced Auth & Security',
    latency: '3ms',
    usage: '10K req/min',
    status: 'stable' as const,
  }),
  Object.freeze({
    feature: 'Customizable Bot Builder',
    latency: '25ms',
    usage: '320 bots',
    status: 'optimizing' as const,
  }),
]);
