/**
 * Registry that maps project IDs to their explore data.
 * This allows the ProjectSystemView to render the full tabbed explore
 * experience for any project that has data registered here.
 */

import {
  voiceowlOverviewData,
  voiceowlFeatures,
  voiceowlContributions,
  voiceowlBackendLayers,
} from './voiceowlExploreData';
import type {
  CoreProblem,
  ImpactStat,
  FeatureCategory,
  ContributionItem,
  Challenge,
  TechStackCategory,
  BackendLayer,
} from './voiceowlExploreData';
import {
  agrisoftOverviewData,
  agrisoftFeatures,
  agrisoftContributions,
  agrisoftBackendLayers,
} from './agrisoftExploreData';
import {
  digisparshOverviewData,
  digisparshFeatures,
  digisparshContributions,
  digisparshBackendLayers,
} from './digisparshExploreData';

// ─── Explore Data Shape ────────────────────────────────────────────────────────

export interface ProjectOverviewData {
  description: string;
  problems: readonly CoreProblem[];
  impactStats: readonly ImpactStat[];
  systemSummary: string;
}

export interface ProjectContributionsData {
  items: readonly ContributionItem[];
  challenges: readonly Challenge[];
  impactMetrics: readonly ImpactStat[];
  techStack: readonly TechStackCategory[];
}

export interface ProjectExploreData {
  overview: ProjectOverviewData;
  features: readonly FeatureCategory[];
  contributions: ProjectContributionsData;
  backendLayers: readonly BackendLayer[];
}

// ─── Registry ──────────────────────────────────────────────────────────────────

export const projectExploreRegistry: Record<string, ProjectExploreData> = {
  'voiceowl-ai': {
    overview: voiceowlOverviewData,
    features: voiceowlFeatures,
    contributions: voiceowlContributions,
    backendLayers: voiceowlBackendLayers,
  },
  agrisoft: {
    overview: agrisoftOverviewData,
    features: agrisoftFeatures,
    contributions: agrisoftContributions,
    backendLayers: agrisoftBackendLayers,
  },
  digisparsh: {
    overview: digisparshOverviewData,
    features: digisparshFeatures,
    contributions: digisparshContributions,
    backendLayers: digisparshBackendLayers,
  },
};

/**
 * Returns whether a project has full explore data registered.
 */
export function hasExploreData(projectId: string): boolean {
  return projectId in projectExploreRegistry;
}

/**
 * Gets the explore data for a project (or undefined if not registered).
 */
export function getExploreData(projectId: string): ProjectExploreData | undefined {
  return projectExploreRegistry[projectId];
}
