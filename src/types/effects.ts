// Effects system types — used by the dashboard experience layer

export interface ProjectArchitecture {
  nodes: ArchNode[];
  edges: ArchEdge[];
  insights: EngineeringInsight[];
  flowSequence: string[];
}

export interface ArchNode {
  id: string;
  label: string;
  type: 'user' | 'backend' | 'ai' | 'database' | 'external';
  technologies: string[];
  role: string;
  position: { x: number; y: number };
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface EngineeringInsight {
  question: string;
  problem: string;
  decision: string;
  tradeoff: string;
  outcome: string;
}

export interface TechNode {
  id: string;
  name: string;
  category: 'Backend' | 'Frontend' | 'Database' | 'Cloud' | 'AI/Systems' | 'Languages' | 'Architecture' | 'Security' | 'Tools' | 'Concepts' | 'Payments';
  proficiency: 'expert' | 'proficient' | 'familiar';
  yearsOfExperience: number;
  relatedProjects: string[];
  connections: string[];
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'OK' | 'AI' | 'ACTION';
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface QuestionPattern {
  patterns: RegExp[];
  response: string;
  category: 'projects' | 'skills' | 'experience' | 'contact' | 'general';
}

export interface EffectsState {
  reducedMotion: boolean;
  effectsEnabled: boolean;
  quickViewMode: boolean;
  performanceTier: 'high' | 'medium' | 'low';
  bootCompleted: boolean;
  mousePosition: { x: number; y: number };
  activeSection: string;
  overlayActive: boolean;
}

export interface ImpactMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface BootMessage {
  text: string;
  delay: number;
}

export interface FocalState {
  activeSectionId: string | null;
  sections: string[];
}

export interface SystemStatus {
  online: boolean;
  latency: number;
  moduleCount: number;
}

export interface VisualizationNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: string[];
}
