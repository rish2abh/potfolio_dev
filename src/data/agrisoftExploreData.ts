import {
  CoreProblem,
  ImpactStat,
  FeatureCategory,
  ContributionItem,
  Challenge,
  TechStackCategory,
  BackendLayer,
} from './voiceowlExploreData';

// ─── Overview Data ─────────────────────────────────────────────────────────────

export const agrisoftOverviewData = Object.freeze({
  description:
    'AgriSoft is a centralized automation and data processing platform designed for agricultural enterprises. It replaces fragmented spreadsheet-based workflows with a unified system that processes, validates, and organizes agricultural records at scale — enabling real-time analytics and automated reporting.',
  problems: Object.freeze([
    Object.freeze({
      title: 'Fragmented Data Management',
      description:
        'Agricultural data was scattered across spreadsheets, emails, and paper forms — making it impossible to get a unified view of operations or track records reliably.',
    }),
    Object.freeze({
      title: 'Manual Processing Bottlenecks',
      description:
        'Staff spent 40%+ of time on repetitive data entry, format conversion, and cross-referencing — tasks that were error-prone and didn\'t scale with growing operations.',
    }),
    Object.freeze({
      title: 'Delayed Decision Making',
      description:
        'Without real-time dashboards, management relied on weekly manual reports — meaning decisions were always based on stale data, missing time-critical insights.',
    }),
    Object.freeze({
      title: 'Document Storage Chaos',
      description:
        'Agricultural reports, compliance documents, and field images were stored across local drives with no versioning, search, or access control.',
    }),
  ]) as readonly CoreProblem[],
  impactStats: Object.freeze([
    Object.freeze({ label: 'Monthly Records', value: 200, suffix: 'K+' }),
    Object.freeze({ label: 'Task Reduction', value: 40, suffix: '%' }),
    Object.freeze({ label: 'System Uptime', value: 99.5, suffix: '%' }),
  ]) as readonly ImpactStat[],
  systemSummary:
    'The platform ingests raw agricultural data through automated pipelines, applies validation rules and transformations, stores structured records in MongoDB, and surfaces insights through real-time dashboards — all while maintaining document traceability via AWS S3.',
});

// ─── Features Data ─────────────────────────────────────────────────────────────

export const agrisoftFeatures: readonly FeatureCategory[] = Object.freeze([
  Object.freeze({
    title: 'Data Processing Pipeline',
    items: Object.freeze([
      Object.freeze({ name: 'Automated CSV/Excel ingestion', liveStatus: true, metric: '50K/batch' }),
      Object.freeze({ name: 'Schema validation with custom rules', liveStatus: true, metric: '99.2% pass' }),
      Object.freeze({ name: 'Duplicate detection and deduplication', liveStatus: true }),
      Object.freeze({ name: 'Format normalization across sources', liveStatus: true, metric: '12 formats' }),
      Object.freeze({ name: 'Scheduled batch processing', liveStatus: true, metric: 'Every 6hr' }),
    ]),
  }),
  Object.freeze({
    title: 'Document Management',
    items: Object.freeze([
      Object.freeze({ name: 'S3-backed file storage with versioning', liveStatus: true, metric: '2TB stored' }),
      Object.freeze({ name: 'Pre-signed URL access for secure downloads', liveStatus: true }),
      Object.freeze({ name: 'Automatic file categorization', liveStatus: true }),
      Object.freeze({ name: 'Bulk upload with progress tracking', liveStatus: true, metric: '100 files/min' }),
      Object.freeze({ name: 'Full-text search across documents', liveStatus: false }),
    ]),
  }),
  Object.freeze({
    title: 'Analytics & Reporting',
    items: Object.freeze([
      Object.freeze({ name: 'Real-time dashboard with key metrics', liveStatus: true, metric: '5s refresh' }),
      Object.freeze({ name: 'Custom report builder', liveStatus: true, metric: '25 templates' }),
      Object.freeze({ name: 'Automated email report delivery', liveStatus: true, metric: 'Weekly' }),
      Object.freeze({ name: 'Historical trend analysis', liveStatus: true }),
      Object.freeze({ name: 'Export to PDF/CSV/Excel', liveStatus: true }),
    ]),
  }),
  Object.freeze({
    title: 'Automation Engine',
    items: Object.freeze([
      Object.freeze({ name: 'Rule-based task automation', liveStatus: true, metric: '85 rules' }),
      Object.freeze({ name: 'Scheduled job management with retry', liveStatus: true }),
      Object.freeze({ name: 'Alert triggers on threshold breaches', liveStatus: true, metric: '12 alerts' }),
      Object.freeze({ name: 'Workflow templates for common operations', liveStatus: true }),
      Object.freeze({ name: 'API webhooks for external integrations', liveStatus: true }),
    ]),
  }),
]);

// ─── Contributions Data ────────────────────────────────────────────────────────

export const agrisoftContributions = Object.freeze({
  items: Object.freeze([
    Object.freeze({
      title: 'Automated Data Ingestion Pipeline',
      before: 'Staff manually entered 5,000+ records daily from spreadsheets — taking 4+ hours and introducing 8% error rate',
      after: 'Built automated ingestion pipeline with validation rules — processes 50K records per batch with 99.2% accuracy',
    }),
    Object.freeze({
      title: 'Scalable File Storage Architecture',
      before: 'Documents stored on local network drives with no backup, versioning, or access control',
      after: 'Implemented S3-based storage with pre-signed URLs, automatic versioning, and role-based access — 2TB managed with 99.99% durability',
    }),
    Object.freeze({
      title: 'Real-Time Analytics Dashboard',
      before: 'Management relied on weekly manual Excel reports compiled by 2 staff members over 2 days',
      after: 'Built real-time dashboard with auto-refresh — key metrics available instantly, saving 16 person-hours per week',
    }),
    Object.freeze({
      title: 'Batch Processing Optimization',
      before: 'Processing 200K records took 45+ minutes with frequent timeouts and partial failures',
      after: 'Implemented chunked processing with retry logic and progress tracking — same volume processed in 8 minutes reliably',
    }),
  ]) as readonly ContributionItem[],
  challenges: Object.freeze([
    Object.freeze({
      title: 'Data Quality at Scale',
      before: 'Inconsistent data formats from 15+ sources made aggregation unreliable',
      after: 'Built normalization layer with source-specific parsers and validation schemas — 99.2% data quality score',
    }),
    Object.freeze({
      title: 'Handling Large File Uploads',
      before: 'Uploads over 50MB frequently timed out or corrupted, requiring manual re-upload',
      after: 'Implemented multipart upload with resumable progress — handles files up to 5GB reliably',
    }),
  ]) as readonly Challenge[],
  impactMetrics: Object.freeze([
    Object.freeze({ label: 'Processing Speed', value: 5, suffix: 'x faster' }),
    Object.freeze({ label: 'Error Reduction', value: 92, suffix: '%' }),
    Object.freeze({ label: 'Time Saved/Week', value: 16, suffix: 'hrs' }),
    Object.freeze({ label: 'Records/Month', value: 200, suffix: 'K+' }),
  ]) as readonly ImpactStat[],
  techStack: Object.freeze([
    Object.freeze({
      category: 'Backend Framework',
      technologies: ['Node.js', 'Express', 'TypeScript'],
    }),
    Object.freeze({
      category: 'Database',
      technologies: ['MongoDB', 'Mongoose ODM'],
    }),
    Object.freeze({
      category: 'Cloud Storage',
      technologies: ['AWS S3', 'Pre-signed URLs', 'Multipart Upload'],
    }),
    Object.freeze({
      category: 'Automation',
      technologies: ['Node-cron', 'Bull Queue', 'Custom Rule Engine'],
    }),
    Object.freeze({
      category: 'Monitoring',
      technologies: ['Winston Logger', 'Health Checks', 'Error Tracking'],
    }),
  ]) as readonly TechStackCategory[],
});

// ─── Backend Layers Data ───────────────────────────────────────────────────────

export const agrisoftBackendLayers: readonly BackendLayer[] = Object.freeze([
  Object.freeze({
    name: 'API Gateway',
    description:
      'RESTful API layer handling authentication, request validation, and rate limiting for all client operations.',
  }),
  Object.freeze({
    name: 'Processing Engine',
    description:
      'Batch and real-time data processing with schema validation, deduplication, and format normalization across multiple input sources.',
  }),
  Object.freeze({
    name: 'Storage Manager',
    description:
      'Abstracts MongoDB document storage and AWS S3 file operations behind a unified interface with automatic versioning.',
  }),
  Object.freeze({
    name: 'Automation Scheduler',
    description:
      'Manages scheduled jobs, rule-based triggers, and workflow execution with retry logic and failure alerting.',
  }),
]);
