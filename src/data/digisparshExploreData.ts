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

export const digisparshOverviewData = Object.freeze({
  description:
    'Digisparsh is an integrated HealthTech platform that streamlines clinical workflows and billing operations for healthcare providers. It replaces disconnected manual processes with a unified system that handles patient management, billing automation, and document processing — reducing errors and accelerating revenue cycles.',
  problems: Object.freeze([
    Object.freeze({
      title: 'Disconnected Billing Systems',
      description:
        'Healthcare providers used separate tools for patient records, billing, and insurance claims — leading to data inconsistencies and revenue leakage from uncaptured charges.',
    }),
    Object.freeze({
      title: 'Manual Workflow Bottlenecks',
      description:
        'Approval workflows required physical signatures and paper routing, causing 3-5 day delays in billing cycles and missed submission deadlines.',
    }),
    Object.freeze({
      title: 'Document Management Overhead',
      description:
        'Medical documents, prescriptions, and reports were stored as physical copies or unorganized digital files — making retrieval slow and compliance audits painful.',
    }),
    Object.freeze({
      title: 'Billing Error Rates',
      description:
        'Manual billing entry resulted in 12%+ error rates — causing claim rejections, delayed payments, and time-consuming correction cycles.',
    }),
  ]) as readonly CoreProblem[],
  impactStats: Object.freeze([
    Object.freeze({ label: 'Error Reduction', value: 85, suffix: '%' }),
    Object.freeze({ label: 'Billing Cycle', value: 2, suffix: 'days' }),
    Object.freeze({ label: 'Providers Served', value: 15, suffix: '+' }),
  ]) as readonly ImpactStat[],
  systemSummary:
    'The platform manages the complete healthcare billing lifecycle — from patient registration through service documentation, billing code assignment, claim generation, and payment tracking — with configurable workflow rules per provider.',
});

// ─── Features Data ─────────────────────────────────────────────────────────────

export const digisparshFeatures: readonly FeatureCategory[] = Object.freeze([
  Object.freeze({
    title: 'Billing Automation',
    items: Object.freeze([
      Object.freeze({ name: 'Auto-assignment of billing codes (ICD/CPT)', liveStatus: true, metric: '95% accuracy' }),
      Object.freeze({ name: 'Claim generation with validation', liveStatus: true, metric: '500/day' }),
      Object.freeze({ name: 'Insurance eligibility verification', liveStatus: true }),
      Object.freeze({ name: 'Payment tracking and reconciliation', liveStatus: true, metric: 'Real-time' }),
      Object.freeze({ name: 'Denial management and resubmission', liveStatus: true, metric: '40% recovery' }),
    ]),
  }),
  Object.freeze({
    title: 'Workflow Engine',
    items: Object.freeze([
      Object.freeze({ name: 'Configurable approval chains per provider', liveStatus: true, metric: '15 configs' }),
      Object.freeze({ name: 'Role-based task assignment', liveStatus: true }),
      Object.freeze({ name: 'Deadline tracking with escalation', liveStatus: true, metric: '24hr SLA' }),
      Object.freeze({ name: 'Status notifications via email/SMS', liveStatus: true }),
      Object.freeze({ name: 'Audit trail for compliance', liveStatus: true, metric: '100% logged' }),
    ]),
  }),
  Object.freeze({
    title: 'Document Processing',
    items: Object.freeze([
      Object.freeze({ name: 'Cloud document storage with Cloudinary', liveStatus: true, metric: '50K docs' }),
      Object.freeze({ name: 'Auto image optimization for medical scans', liveStatus: true }),
      Object.freeze({ name: 'Secure signed URL access', liveStatus: true }),
      Object.freeze({ name: 'Document categorization and tagging', liveStatus: true }),
      Object.freeze({ name: 'Bulk upload with metadata extraction', liveStatus: false }),
    ]),
  }),
  Object.freeze({
    title: 'Patient Management',
    items: Object.freeze([
      Object.freeze({ name: 'Patient registration and records', liveStatus: true, metric: '10K+ records' }),
      Object.freeze({ name: 'Visit history and service tracking', liveStatus: true }),
      Object.freeze({ name: 'Insurance profile management', liveStatus: true }),
      Object.freeze({ name: 'Referral tracking across providers', liveStatus: true }),
      Object.freeze({ name: 'Patient portal for billing inquiries', liveStatus: false }),
    ]),
  }),
]);

// ─── Contributions Data ────────────────────────────────────────────────────────

export const digisparshContributions = Object.freeze({
  items: Object.freeze([
    Object.freeze({
      title: 'Configurable Billing Rule Engine',
      before: 'Billing logic was hardcoded per provider — every new client required 2+ weeks of custom development',
      after: 'Built JSON-configurable rule engine where providers define their own billing workflows — new client setup takes 2 hours',
    }),
    Object.freeze({
      title: 'Automated Claim Generation',
      before: 'Staff manually created insurance claims from service records — 500 claims/day took 3 full-time employees',
      after: 'Automated claim generation with validation rules catches errors before submission — same volume handled by system with human review only',
    }),
    Object.freeze({
      title: 'Document Processing Pipeline',
      before: 'Medical documents stored as unorganized files — finding a specific document took 10-15 minutes per request',
      after: 'Implemented Cloudinary-based storage with auto-categorization and search — document retrieval under 3 seconds',
    }),
    Object.freeze({
      title: 'Workflow Approval Automation',
      before: 'Billing approvals required 3-5 days of physical paper routing between departments',
      after: 'Digital workflow with parallel approvals and auto-escalation — average approval cycle reduced to 4 hours',
    }),
  ]) as readonly ContributionItem[],
  challenges: Object.freeze([
    Object.freeze({
      title: 'Healthcare Compliance Requirements',
      before: 'No audit trail or access logging — failed compliance audits and risked regulatory penalties',
      after: 'Implemented comprehensive audit logging with role-based access control — 100% action traceability',
    }),
    Object.freeze({
      title: 'Multi-Provider Configuration',
      before: 'Each healthcare provider had unique billing rules — maintaining separate codebases was unsustainable',
      after: 'Designed tenant-aware architecture with provider-specific configuration overlays — single codebase serves all providers',
    }),
  ]) as readonly Challenge[],
  impactMetrics: Object.freeze([
    Object.freeze({ label: 'Error Reduction', value: 85, suffix: '%' }),
    Object.freeze({ label: 'Cycle Time', value: 75, suffix: '% faster' }),
    Object.freeze({ label: 'Claim Recovery', value: 40, suffix: '%' }),
    Object.freeze({ label: 'Setup Time', value: 2, suffix: 'hrs' }),
  ]) as readonly ImpactStat[],
  techStack: Object.freeze([
    Object.freeze({
      category: 'Backend Framework',
      technologies: ['Node.js', 'Express', 'TypeScript'],
    }),
    Object.freeze({
      category: 'Database',
      technologies: ['MongoDB', 'Mongoose ODM', 'Aggregation Pipelines'],
    }),
    Object.freeze({
      category: 'Document Storage',
      technologies: ['Cloudinary', 'Image Optimization', 'Signed URLs'],
    }),
    Object.freeze({
      category: 'Workflow Engine',
      technologies: ['Custom Rule Engine', 'JSON Config', 'State Machine'],
    }),
    Object.freeze({
      category: 'Notifications',
      technologies: ['Email (Nodemailer)', 'SMS Gateway', 'In-app Alerts'],
    }),
  ]) as readonly TechStackCategory[],
});

// ─── Backend Layers Data ───────────────────────────────────────────────────────

export const digisparshBackendLayers: readonly BackendLayer[] = Object.freeze([
  Object.freeze({
    name: 'API Layer',
    description:
      'RESTful API with JWT authentication, role-based access control, and request validation for all clinical and billing operations.',
  }),
  Object.freeze({
    name: 'Workflow Engine',
    description:
      'Configurable state machine that manages billing approvals, task routing, and escalation rules based on provider-specific JSON configurations.',
  }),
  Object.freeze({
    name: 'Billing Processor',
    description:
      'Handles claim generation, code assignment, validation against payer rules, and submission tracking with automatic retry on rejections.',
  }),
  Object.freeze({
    name: 'Document Service',
    description:
      'Manages medical document uploads via Cloudinary with auto-optimization, categorization, and secure access through signed URLs.',
  }),
]);
