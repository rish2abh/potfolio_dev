import { QuestionPattern } from '@/types/effects';

export const chatPatterns: QuestionPattern[] = [
  // Projects
  {
    patterns: [/voiceowl/i, /voice\s*owl/i, /ai\s*call/i, /calling\s*platform/i],
    response:
      "VoiceOwl AI is the flagship project — an enterprise AI calling and automation platform. I built the real-time backend with NestJS, designed the SSE dashboard streaming, and integrated OpenAI + Deepgram + ElevenLabs for the AI pipeline. It handles 150K+ daily active users and 2M+ API requests daily with 99.9% uptime.",
    category: 'projects',
  },
  {
    patterns: [/agrisoft/i, /agriculture/i, /farming/i, /data\s*process/i],
    response:
      "AgriSoft is an automation and data processing platform for agriculture. I built the backend pipelines that process 200K+ records monthly and automated workflows that reduced manual tasks by 40%. Stack: Node.js, Express, MongoDB, AWS S3.",
    category: 'projects',
  },
  {
    patterns: [/digisparsh/i, /health/i, /billing/i, /healthcare/i],
    response:
      "Digisparsh is a HealthTech workflow and billing platform. I built the billing engine and workflow automation modules that streamline operations for healthcare providers. Stack: Node.js, Express, MongoDB, Cloudinary.",
    category: 'projects',
  },
  {
    patterns: [/project/i, /what.*built/i, /portfolio/i, /work/i],
    response:
      "I've built three major systems: VoiceOwl AI (enterprise AI calling — 2M+ daily requests), AgriSoft (data automation — 200K+ monthly records), and Digisparsh (HealthTech billing platform). VoiceOwl is the flagship — click 'Explore System' on its card to see the full architecture.",
    category: 'projects',
  },

  // Skills
  {
    patterns: [/skill/i, /tech\s*stack/i, /technolog/i, /what.*know/i, /database/i],
    response:
      "Core stack: Node.js, Express, NestJS, MongoDB. Cloud: AWS S3, Cloudinary. AI/Systems: OpenAI integration, Deepgram, ElevenLabs, Server-Sent Events, automation systems. I specialize in backend architecture that handles real-time data at scale.",
    category: 'skills',
  },
  {
    patterns: [/node/i, /backend/i, /server/i],
    response:
      "Node.js is my primary runtime — 3+ years building production backends with Express and NestJS. I focus on real-time systems (SSE), microservices, and AI pipeline integration. Currently powering systems handling 2M+ daily API requests.",
    category: 'skills',
  },

  // Experience
  {
    patterns: [/experience/i, /year/i, /how\s*long/i, /career/i, /company/i],
    response:
      "3+ years of backend engineering. Currently at VoiceOwl AI (Apr 2024–Present) building AI calling infrastructure. Previously at MoreYeahs (Feb 2023–Mar 2024) building data pipelines, and Codesid (Dec 2022–Jan 2023) for foundational API work.",
    category: 'experience',
  },
  {
    patterns: [/current/i, /now/i, /today/i, /role/i],
    response:
      "Currently a Backend Developer at VoiceOwl AI, building scalable AI calling infrastructure. I design the real-time backend, SSE streaming dashboards, and AI pipeline integrations handling enterprise-level traffic.",
    category: 'experience',
  },

  // Contact
  {
    patterns: [/contact/i, /reach/i, /hire/i, /email/i, /connect/i, /available/i],
    response:
      "Best ways to reach me: use the contact form at the bottom of this page, connect on LinkedIn (linkedin.com/in/rishabh-shrivastava-2973671a1), or check out my code on GitHub (github.com/rish2abh). Always open to discussing backend challenges and system design.",
    category: 'contact',
  },

  // General
  {
    patterns: [/who/i, /about/i, /tell\s*me/i, /introduce/i],
    response:
      "I'm Rishabh Shrivastava — a Backend Developer and AI Systems Engineer. I build systems that handle real-world scale, real-time decisions, and AI-driven workflows. Think high-throughput APIs, streaming dashboards, and production AI pipelines.",
    category: 'general',
  },
  {
    patterns: [/hello/i, /hi\b/i, /hey/i, /sup/i],
    response:
      "Hey! I'm Rishabh's portfolio assistant. Ask me anything about the systems I've built, the tech I use, or my engineering philosophy. Try: 'Tell me about VoiceOwl' or 'What's your tech stack?'",
    category: 'general',
  },
];

export const fallbackResponse =
  "I'm not sure about that specific topic. Try asking about my projects (VoiceOwl AI, AgriSoft, Digisparsh), my tech stack, experience, or how to get in touch. You can also scroll down to explore each section directly.";

export const welcomeMessage =
  "Hey! I'm Rishabh's portfolio assistant. Ask me about the systems I've built, the scale I've handled, or what I'm working on next.";

export const suggestedQuestions = [
  'Tell me about VoiceOwl AI',
  "What's your tech stack?",
  'How much experience do you have?',
];
