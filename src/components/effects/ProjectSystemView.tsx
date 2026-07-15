'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { ProjectArchitecture } from '@/types/effects';
import { fluctuateLatency } from '@/lib/layout-utils';
import { useEffects } from '@/contexts/EffectsContext';
import { useLog } from '@/contexts/LogContext';
import { projectArchitectures } from '@/data/architectures';
import { getExploreData } from '@/data/projectExploreRegistry';
import type { ProjectExploreData } from '@/data/projectExploreRegistry';

// ─── Tab Types & Configuration ─────────────────────────────────────────────────

export type TabId = 'overview' | 'architecture' | 'features' | 'contributions';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

export const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'architecture', label: 'Architecture', icon: '🏗️' },
  { id: 'features', label: 'Features', icon: '⚡' },
  { id: 'contributions', label: 'Contributions', icon: '🚀' },
];

// ─── TabBar Sub-Component ──────────────────────────────────────────────────────

export interface TabBarProps {
  tabs: TabConfig[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabCount = tabs.length;
    let newIndex: number | null = null;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (index + 1) % tabCount;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (index - 1 + tabCount) % tabCount;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabCount - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onTabChange(tabs[index].id);
        return;
      default:
        return;
    }

    if (newIndex !== null) {
      tabRefs.current[newIndex]?.focus();
      onTabChange(tabs[newIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Project details"
      className="sticky top-0 z-10 flex gap-1 p-1 bg-white/5 rounded-lg border border-white/10 overflow-x-auto scrollbar-hide"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff] ${
              isActive
                ? 'bg-white/10 text-white border-b-2 border-[#00d4ff]'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Stub Panel Components (lazy-rendered, only active panel is mounted) ───────

export interface OverviewPanelProps {
  isActive: boolean;
  heavyAnimationsEnabled: boolean;
  exploreData: ProjectExploreData;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function OverviewPanel({ isActive, heavyAnimationsEnabled, exploreData }: OverviewPanelProps) {
  const { description, problems, impactStats, systemSummary } = exploreData.overview;

  // Animated counters — when heavyAnimationsEnabled is false, show final values instantly
  const shouldAnimate = isActive && heavyAnimationsEnabled;
  const dailyActiveUsers = useAnimatedCounter(impactStats[0].value, 2000, shouldAnimate);
  const dailyApiRequests = useAnimatedCounter(impactStats[1].value, 2000, shouldAnimate);
  const uptime = useAnimatedCounter(impactStats[2].value, 2000, shouldAnimate);

  const counterValues = [dailyActiveUsers, dailyApiRequests, uptime];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Description */}
      <motion.div
        className="text-white/80 text-sm md:text-base leading-relaxed"
        variants={itemVariants}
      >
        <p>{description}</p>
      </motion.div>

      {/* Core Problems 2×2 Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
      >
        {problems.map((problem) => (
          <motion.div
            key={problem.title}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
            variants={itemVariants}
          >
            <h4 className="text-white font-semibold text-sm mb-2">{problem.title}</h4>
            <p className="text-white/60 text-xs leading-relaxed">{problem.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* System Summary */}
      <motion.div
        className="text-white/70 text-sm leading-relaxed"
        variants={itemVariants}
      >
        <p>{systemSummary}</p>
      </motion.div>

      {/* Impact Stats - 3 Animated Counter Blocks */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {impactStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-5 bg-white/5 border border-white/10 rounded-xl text-center"
            variants={itemVariants}
          >
            <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">
              {heavyAnimationsEnabled ? counterValues[index] : stat.value}
              <span className="text-lg text-white/60">{stat.suffix}</span>
            </p>
            <p className="text-white/60 text-xs mt-2 uppercase tracking-wider font-mono">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export interface ArchitecturePanelProps {
  architecture: ProjectArchitecture;
  heavyAnimationsEnabled: boolean;
  exploreData: ProjectExploreData;
}

// ─── HLD (High-Level Design) Diagram ────────────────────────────────────────────

/** A single block in the HLD diagram */
function HLDBlock({ label, techs, color, isSmall }: {
  label: string;
  techs: string[];
  color: string;
  isSmall?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-[#0f172a]/90 backdrop-blur-sm text-center ${
        isSmall ? 'px-2 py-2' : 'px-3 py-3'
      }`}
      style={{ borderColor: `${color}50` }}
    >
      <p className={`text-white font-semibold ${isSmall ? 'text-[10px]' : 'text-xs'}`}>{label}</p>
      <p className="text-white/40 text-[9px] mt-0.5 font-mono">{techs.join(' · ')}</p>
    </div>
  );
}

/** Vertical arrow connector */
function DownArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-4 bg-white/20" />
      {label && <span className="text-[8px] text-white/30 font-mono my-0.5">{label}</span>}
      <svg width="8" height="5" viewBox="0 0 8 5" className="text-white/30">
        <path d="M0 0 L4 5 L8 0" fill="currentColor" />
      </svg>
    </div>
  );
}

/** Horizontal connector with branching */
function BranchConnector() {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex items-center w-full max-w-md">
        <div className="flex-1 h-px bg-white/15" />
        <div className="w-px h-3 bg-white/15" />
        <div className="flex-1 h-px bg-white/15" />
        <div className="w-px h-3 bg-white/15" />
        <div className="flex-1 h-px bg-white/15" />
      </div>
    </div>
  );
}

function ArchitecturePanel({ architecture, exploreData }: ArchitecturePanelProps) {
  return (
    <div className="space-y-4">
      {/* HLD Diagram */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 md:p-6 overflow-x-auto">
        <h4 className="text-white/40 text-[10px] uppercase tracking-wider font-mono mb-5 text-center">
          High-Level Design — VoiceOwl AI Platform
        </h4>

        <div className="min-w-[320px] max-w-2xl mx-auto">
          {/* Layer 1: Frontend */}
          <div className="flex justify-center">
            <HLDBlock label="Frontend (React)" techs={['Admin', 'Dashboard UI']} color="#3b82f6" />
          </div>
          <DownArrow label="HTTPS" />

          {/* Layer 2: Nginx */}
          <div className="flex justify-center">
            <HLDBlock label="Nginx (LB + Gateway)" techs={['Load Balancer', 'Routing']} color="#6b7280" />
          </div>
          <DownArrow label="Proxy" />

          {/* Layer 3: Backend */}
          <div className="flex justify-center">
            <HLDBlock label="Backend Services (Node.js)" techs={['NestJS', 'Express']} color="#22c55e" />
          </div>

          {/* Branch to 3 services */}
          <BranchConnector />
          <div className="grid grid-cols-3 gap-2">
            <HLDBlock label="Auth Service" techs={['JWT', 'RBAC', 'MFA']} color="#22c55e" isSmall />
            <HLDBlock label="Campaign Mgmt" techs={['Scheduling']} color="#22c55e" isSmall />
            <HLDBlock label="Agent Engine" techs={['Workflows']} color="#a855f7" isSmall />
          </div>

          {/* Down to data stores */}
          <div className="flex items-center justify-center py-1">
            <div className="flex items-center w-full">
              <div className="flex-1 flex flex-col items-center">
                <svg width="8" height="5" viewBox="0 0 8 5" className="text-white/30"><path d="M0 0 L4 5 L8 0" fill="currentColor" /></svg>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <svg width="8" height="5" viewBox="0 0 8 5" className="text-white/30"><path d="M0 0 L4 5 L8 0" fill="currentColor" /></svg>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <svg width="8" height="5" viewBox="0 0 8 5" className="text-white/30"><path d="M0 0 L4 5 L8 0" fill="currentColor" /></svg>
              </div>
            </div>
          </div>

          {/* Layer 5: Data Stores */}
          <div className="grid grid-cols-3 gap-2">
            <HLDBlock label="MongoDB" techs={['Primary DB']} color="#f59e0b" isSmall />
            <HLDBlock label="PostgreSQL" techs={['Relational']} color="#f59e0b" isSmall />
            <HLDBlock label="Redis" techs={['Cache', 'Queue']} color="#f59e0b" isSmall />
          </div>
          <DownArrow label="Events" />

          {/* Layer 6: Queue */}
          <div className="flex justify-center">
            <HLDBlock label="AWS SQS (Async Queue)" techs={['Job Processing']} color="#6b7280" />
          </div>

          {/* Branch to processing services */}
          <BranchConnector />
          <div className="grid grid-cols-3 gap-2">
            <HLDBlock label="PCA Service" techs={['Post-Call Analytics']} color="#a855f7" isSmall />
            <HLDBlock label="Notifications" techs={['Email', 'SMS']} color="#22c55e" isSmall />
            <HLDBlock label="File Processing" techs={['Upload', 'Parse']} color="#22c55e" isSmall />
          </div>
          <DownArrow label="Inference" />

          {/* Layer 8: AI */}
          <div className="flex justify-center">
            <HLDBlock label="AI Layer" techs={['OpenAI', 'Gemini', 'Groq']} color="#a855f7" />
          </div>
          <DownArrow label="TTS / STT" />

          {/* Layer 9: Voice */}
          <div className="flex justify-center">
            <HLDBlock label="Voice / Telephony" techs={['Azure STT', 'Twilio', 'ElevenLabs']} color="#6b7280" />
          </div>
          <DownArrow label="Events" />

          {/* Layer 10: Observability */}
          <div className="flex justify-center">
            <HLDBlock label="Real-time & Observability" techs={['SSE', 'DataDog']} color="#6b7280" />
          </div>
          <DownArrow label="Logs" />

          {/* Layer 11: Cloud */}
          <div className="flex justify-center">
            <HLDBlock label="Cloud & Infra (AWS)" techs={['S3', 'Lambda', 'Docker', 'CI/CD']} color="#6b7280" />
          </div>
        </div>
      </div>
      {/* Backend Architecture Layers Section */}
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <h4 className="text-white/70 text-xs uppercase tracking-wider font-mono">Backend Architecture Layers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {exploreData.backendLayers.map((layer) => (
            <motion.div
              key={layer.name}
              variants={itemVariants}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <h5 className="text-white font-semibold text-sm mb-1">{layer.name}</h5>
              <p className="text-white/60 text-xs leading-relaxed">{layer.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Engineering Insights Section */}
      <EngineeringInsightsSection insights={architecture.insights} />
    </div>
  );
}

// ─── Engineering Insights Section (collapsible cards) ───────────────────────────

interface EngineeringInsightsSectionProps {
  insights: ProjectArchitecture['insights'];
}

function EngineeringInsightsSection({ insights }: EngineeringInsightsSectionProps) {
  const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set());

  const toggleInsight = (index: number) => {
    setExpandedInsights((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <h4 className="text-white/70 text-xs uppercase tracking-wider font-mono">Engineering Insights</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, index) => {
          const isExpanded = expandedInsights.has(index);
          return (
            <motion.div
              key={insight.question}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 cursor-pointer transition-colors hover:border-white/20"
              onClick={() => toggleInsight(index)}
              role="button"
              aria-expanded={isExpanded}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleInsight(index);
                }
              }}
            >
              {/* Always visible: question + decision */}
              <div className="flex items-start justify-between gap-2">
                <h5 className="text-white/90 font-medium text-sm">{insight.question}</h5>
                <span
                  className={`text-white/40 text-xs flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </div>
              <p className="text-white/70 text-xs leading-relaxed mt-2">{insight.decision}</p>

              {/* Expanded: tradeoff + outcome */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <p className="text-amber-400/80 text-xs leading-relaxed">
                        <span className="font-semibold text-amber-400/90">Tradeoff: </span>
                        {insight.tradeoff}
                      </p>
                      <p className="text-green-400/80 text-xs leading-relaxed">
                        <span className="font-semibold text-green-400/90">Outcome: </span>
                        {insight.outcome}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function FeaturesPanel({ exploreData }: { exploreData: ProjectExploreData }) {
  return (
    <motion.div
      className="space-y-4"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      animate="show"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exploreData.features.map((category) => (
          <motion.div
            key={category.title}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
            variants={itemVariants}
          >
            <h4 className="text-white font-semibold text-sm mb-3">{category.title}</h4>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li key={item.name} className="flex items-start gap-2">
                  {/* Live status indicator */}
                  {item.liveStatus ? (
                    <span className="flex-shrink-0 mt-1 relative">
                      <span className="block w-2 h-2 bg-green-400 rounded-full" />
                      <span className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
                    </span>
                  ) : (
                    <span className="flex-shrink-0 mt-1 block w-2 h-2 bg-gray-500 rounded-full" />
                  )}
                  <div className="flex-1">
                    <span className="text-white/80 text-xs">{item.name}</span>
                    {item.liveStatus && (
                      <span className="ml-2 text-[10px] text-green-400 font-mono uppercase">ACTIVE</span>
                    )}
                    {item.metric && (
                      <span className="block text-white/40 text-[10px] font-mono mt-0.5">{item.metric}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export interface ContributionsPanelProps {
  isActive: boolean;
  heavyAnimationsEnabled: boolean;
  exploreData: ProjectExploreData;
}

const contributionsContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

function ContributionsPanel({ isActive, heavyAnimationsEnabled, exploreData }: ContributionsPanelProps) {
  const { items, challenges, impactMetrics, techStack } = exploreData.contributions;

  // Animated counters for impact metrics
  const shouldAnimate = isActive && heavyAnimationsEnabled;
  const counter0 = useAnimatedCounter(impactMetrics[0].value, 2000, shouldAnimate);
  const counter1 = useAnimatedCounter(impactMetrics[1].value, 2000, shouldAnimate);
  const counter2 = useAnimatedCounter(impactMetrics[2].value, 2000, shouldAnimate);
  const counter3 = useAnimatedCounter(impactMetrics[3].value, 2000, shouldAnimate);
  const counterValues = [counter0, counter1, counter2, counter3];

  return (
    <motion.div
      className="space-y-8"
      variants={contributionsContainerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Contributions Section */}
      <motion.div className="space-y-3" variants={contributionsContainerVariants}>
        <h4 className="text-white/70 text-xs uppercase tracking-wider font-mono">Key Contributions</h4>
        <div className="space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.title}
              className="space-y-2"
              variants={itemVariants}
            >
              <h5 className="text-white font-semibold text-sm">{item.title}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Before */}
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-red-400/80 text-[10px] uppercase font-mono">Before</span>
                  <p className="text-white/60 text-xs mt-1">{item.before}</p>
                </div>
                {/* Arrow separator (visible on md+ between the two cards) */}
                <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center pointer-events-none" aria-hidden="true">
                </div>
                {/* After */}
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-green-400/80 text-[10px] uppercase font-mono">After</span>
                  <p className="text-white/90 text-xs mt-1">{item.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Challenges Section */}
      <motion.div className="space-y-3" variants={contributionsContainerVariants}>
        <h4 className="text-white/70 text-xs uppercase tracking-wider font-mono">Technical Challenges</h4>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.title}
              className="space-y-2"
              variants={itemVariants}
            >
              <h5 className="text-white font-semibold text-sm">{challenge.title}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Before */}
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-red-400/80 text-[10px] uppercase font-mono">Before</span>
                  <p className="text-white/60 text-xs mt-1">{challenge.before}</p>
                </div>
                {/* After */}
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-green-400/80 text-[10px] uppercase font-mono">After</span>
                  <p className="text-white/90 text-xs mt-1">{challenge.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Impact Metrics Section */}
      <motion.div className="space-y-3" variants={contributionsContainerVariants}>
        <h4 className="text-white/70 text-xs uppercase tracking-wider font-mono">Impact Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="p-4 bg-white/5 border border-white/10 rounded-xl text-center"
              variants={itemVariants}
            >
              <p className="text-2xl font-bold text-white tabular-nums">
                {heavyAnimationsEnabled ? counterValues[index] : metric.value}
                <span className="text-sm text-white/60">{metric.suffix}</span>
              </p>
              <p className="text-white/60 text-[10px] mt-1.5 uppercase tracking-wider font-mono">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack Section */}
      <motion.div className="space-y-3" variants={contributionsContainerVariants}>
        <h4 className="text-white/70 text-xs uppercase tracking-wider font-mono">Tech Stack</h4>
        <div className="space-y-4">
          {techStack.map((group) => (
            <motion.div
              key={group.category}
              className="space-y-2"
              variants={itemVariants}
            >
              <h5 className="text-white/80 text-xs font-semibold">{group.category}</h5>
              <div className="flex flex-wrap gap-2">
                {group.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-[10px] font-mono bg-white/5 border border-white/10 rounded text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Loading Shimmer Sub-Component ─────────────────────────────────────────────

/** Subtle loading shimmer line shown during micro-delay on tab change */
export function LoadingShimmer() {
  return (
    <div className="w-full h-0.5 overflow-hidden rounded-full">
      <div className="h-full w-full bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent animate-pulse" />
    </div>
  );
}

// ─── Tab Change Handler Hook ───────────────────────────────────────────────────

/**
 * Hook that manages system log integration and micro-delay realism on tab change.
 * - Logs tab change to system log via LogContext
 * - Manages `contentReady` state with a ~150ms artificial delay
 * - When `skipDelay` is true (e.g. reducedMotion), skips the delay entirely and shows content instantly
 * - Returns `contentReady` boolean and a `handleTabChange` callback
 */
export function useTabChangeHandler(tabs: TabConfig[], skipDelay: boolean = false) {
  const { addEntry } = useLog();
  const [contentReady, setContentReady] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = useCallback(
    (tabId: TabId) => {
      const tab = tabs.find((t) => t.id === tabId);
      const tabLabel = tab?.label ?? tabId;

      // Log the tab change to system log
      addEntry('AI', `[AI] Switching to ${tabLabel} view...`);

      // When reducedMotion/skipDelay is active, skip the micro-delay entirely
      if (skipDelay) {
        return;
      }

      // Start micro-delay: content not ready
      setContentReady(false);

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // After 150ms delay, mark content as ready
      timerRef.current = setTimeout(() => {
        setContentReady(true);
        timerRef.current = null;
      }, 150);
    },
    [addEntry, tabs, skipDelay]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { contentReady, handleTabChange };
}

// ─── ProjectSystemView Types ───────────────────────────────────────────────────

export interface ProjectSystemViewProps {
  project: Project;
  onClose: () => void;
}

/** Animated counter that counts from 0 to target over duration ms */
function useAnimatedCounter(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, active]);

  return value;
}

/** Architecture flow node */
function FlowNode({ label, isFirst }: { label: string; isFirst?: boolean; isLast?: boolean }) {
  return (
    <div className="flex items-center">
      {!isFirst && (
        <div className="flex items-center mx-2 md:mx-4">
          <div className="w-6 md:w-10 h-px bg-[#00d4ff]/40" />
          <svg width="8" height="12" viewBox="0 0 8 12" className="text-[#00d4ff]/60">
            <path d="M1 1 L7 6 L1 11" stroke="currentColor" fill="none" strokeWidth="1.5" />
          </svg>
        </div>
      )}
      <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg font-mono text-xs md:text-sm text-white/90 whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

/** Main ProjectSystemView Component */
export default function ProjectSystemView({
  project,
  onClose,
}: ProjectSystemViewProps) {
  const { setOverlayActive, performanceTier, reducedMotion, effectsEnabled } = useEffects();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen] = useState(true);

  // Tab state management
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { contentReady, handleTabChange } = useTabChangeHandler(TABS, reducedMotion);

  // Combined tab change handler: updates state + fires log/delay
  const onTabChange = useCallback(
    (tabId: TabId) => {
      setActiveTab(tabId);
      handleTabChange(tabId);
    },
    [handleTabChange]
  );

  // Check if this project has full explore data
  const exploreData = getExploreData(project.id);
  const hasFullExplore = !!exploreData;

  // Performance-aware animation control
  const heavyAnimationsEnabled = performanceTier === 'high' && effectsEnabled && !reducedMotion;

  // Live metrics state
  const apiRequests = useAnimatedCounter(2847391, 2000, isOpen);
  const [latency, setLatency] = useState(42);

  // Set overlay active to pause lower-tier animations
  useEffect(() => {
    setOverlayActive(true);
    return () => {
      setOverlayActive(false);
    };
  }, [setOverlayActive]);

  // Fluctuate latency every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.round(fluctuateLatency(42)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} system dashboard`}
          className="fixed inset-0 z-[60] bg-[#020617]/95 backdrop-blur-xl overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header Bar */}
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-3">
              {/* Blinking green status dot */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-green-400">
                System Active
              </span>
              <span className="hidden md:inline-block text-white/30 mx-2">|</span>
              <span className="hidden md:inline-block text-white font-semibold text-sm">
                {project.name}
              </span>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close system view"
              className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors focus-visible:ring-2 focus-visible:ring-[#00d4ff] outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          {/* Live Metrics Panel */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8" aria-label="Live metrics">
            {/* API Requests */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                API Requests
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {formatNumber(apiRequests)}
              </p>
              <p className="text-xs text-white/40 mt-1">Total processed</p>
            </div>

            {/* Avg Latency */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                Avg Latency
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {latency}<span className="text-lg text-white/60">ms</span>
              </p>
              <p className="text-xs text-white/40 mt-1">Response time</p>
            </div>

            {/* Uptime */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
                Uptime
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white">
                99.97<span className="text-lg text-white/60">%</span>
              </p>
              <p className="text-xs text-white/40 mt-1">Last 30 days</p>
            </div>
          </section>

          {hasFullExplore && exploreData ? (
            /* Full tabbed explore system for projects with explore data */
            <section className="p-6 md:p-8 space-y-4" aria-label={`${project.name} project details`}>
              <TabBar tabs={TABS} activeTab={activeTab} onTabChange={onTabChange} />

              {/* Tab panel area */}
              {!contentReady && <LoadingShimmer />}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  role="tabpanel"
                  id={`panel-${activeTab}`}
                  aria-labelledby={`tab-${activeTab}`}
                  tabIndex={0}
                >
                  {contentReady && (
                    (() => {
                      switch (activeTab) {
                        case 'overview':
                          return <OverviewPanel isActive={activeTab === 'overview'} heavyAnimationsEnabled={heavyAnimationsEnabled} exploreData={exploreData} />;
                        case 'architecture':
                          return <ArchitecturePanel architecture={projectArchitectures[project.id]} heavyAnimationsEnabled={heavyAnimationsEnabled} exploreData={exploreData} />;
                        case 'features':
                          return <FeaturesPanel exploreData={exploreData} />;
                        case 'contributions':
                          return <ContributionsPanel isActive={activeTab === 'contributions'} heavyAnimationsEnabled={heavyAnimationsEnabled} exploreData={exploreData} />;
                      }
                    })()
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          ) : (
            /* Non-VoiceOwl: existing architecture + tech/links layout */
            <>
              {/* Architecture Diagram */}
              <section className="p-6 md:p-8" aria-label="System architecture">
                <h3 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                  System Architecture
                </h3>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
                  <div className="flex items-center justify-center min-w-[400px]">
                    <FlowNode label="Input" isFirst />
                    <FlowNode label="AI Router" />
                    <FlowNode label="Voice Engine" />
                    <FlowNode label="Output" isLast />
                  </div>
                </div>
              </section>

              {/* Tech Stack + Action Links */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8" aria-label="Technology and links">
                {/* Tech Stack Pills */}
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white/50 mb-4">
                    Links
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white/80 hover:text-white hover:border-white/30 transition-colors"
                    >
                      GitHub
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00d4ff]/30 bg-[#00d4ff]/10 text-sm text-[#00d4ff] hover:bg-[#00d4ff]/20 transition-colors"
                      >
                        Live Demo
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
