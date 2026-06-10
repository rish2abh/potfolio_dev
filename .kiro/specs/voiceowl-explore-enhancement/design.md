# Design Document: VoiceOwl Explore Enhancement

## Overview

This design adds a tabbed content interface to the existing `ProjectSystemView` overlay, exclusively for the VoiceOwl AI project (`voiceowl-ai`). The enhancement inserts four content tabs (Overview, Architecture, Features, Contributions) below the existing metrics panel, providing deep-dive project information with smooth Framer Motion transitions between tabs.

**Key Design Decisions:**

- **Inline tab components**: Tab content panels are defined as sub-components within the same file (`ProjectSystemView.tsx`) since they share state (animated counters, project data) and are exclusively used here. This avoids prop-drilling and keeps related code co-located.
- **Static data file**: A new `src/data/voiceowlExploreData.ts` file holds all tab content (problems, features, contributions, challenges, tech stack). This separates content from rendering logic and makes updates easy.
- **Custom node-graph for Architecture**: A purpose-built SVG node-graph using the existing `voiceowlArchitecture` data from `architectures.ts`. The existing `FlowNode` component is too simplistic (linear flow). The new graph renders positioned nodes with edges based on `ArchNode.position` coordinates.
- **Reuse `useAnimatedCounter` hook**: The existing hook in `ProjectSystemView.tsx` is reused for Overview tab stats. No new animation hook needed.
- **Conditional rendering by project ID**: A simple `project.id === 'voiceowl-ai'` check gates the tab UI. Other projects render the existing layout unchanged.

---

## Architecture

```
ProjectSystemView (existing)
├── Header Bar (unchanged)
├── Live Metrics Panel (unchanged)
├── [NEW] VoiceOwl Tab Section (conditional: project.id === 'voiceowl-ai')
│   ├── TabBar (role="tablist")
│   │   ├── Tab: Overview
│   │   ├── Tab: Architecture
│   │   ├── Tab: Features
│   │   └── Tab: Contributions
│   └── AnimatePresence
│       └── TabPanel (role="tabpanel", keyed by activeTab)
│           ├── OverviewPanel
│           ├── ArchitecturePanel
│           ├── FeaturesPanel
│           └── ContributionsPanel
├── Architecture Diagram (existing, hidden when tabs active)
└── Tech Stack + Links (existing, hidden when tabs active)
```

**Data Flow:**

```
architectures.ts (voiceowlArchitecture)
       │
       ▼
ProjectSystemView
       │
       ├── nodes, edges, insights → ArchitecturePanel
       │
voiceowlExploreData.ts
       │
       ├── problems, impactStats → OverviewPanel
       ├── featureCategories → FeaturesPanel
       └── contributions, challenges, techStack → ContributionsPanel
```

---

## Components and Interfaces

### Modified Component: `ProjectSystemView.tsx`

The existing component gains tab state management and conditional rendering:

```typescript
// New state for tab management
type TabId = 'overview' | 'architecture' | 'features' | 'contributions';

interface TabConfig {
  id: TabId;
  label: string;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'features', label: 'Features' },
  { id: 'contributions', label: 'Contributions' },
];
```

**Conditional logic:**
```typescript
const isVoiceOwl = project.id === 'voiceowl-ai';
// When isVoiceOwl: render TabBar + TabPanels below metrics
// When !isVoiceOwl: render existing Architecture Diagram + Tech/Links sections
```

### New Sub-Component: `TabBar`

Renders the horizontal tab navigation with keyboard support.

```typescript
interface TabBarProps {
  tabs: TabConfig[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}
```

**Keyboard handling:**
- Arrow Left/Right cycles focus between tabs (wraps around)
- Enter/Space activates the focused tab
- Uses `roving tabindex` pattern: active tab has `tabIndex={0}`, others `tabIndex={-1}`

**Styling:**
- Container: `flex gap-1 p-1 bg-white/5 rounded-lg border border-white/10`
- Active tab: `bg-white/10 text-white border-b-2 border-[#00d4ff]`
- Inactive tab: `text-white/50 hover:text-white/80`
- Position: sticky below metrics so it remains visible during content scroll

### New Sub-Component: `OverviewPanel`

```typescript
interface OverviewPanelProps {
  isActive: boolean; // controls animated counter activation
}
```

**Layout:**
- Project description paragraph
- 2×2 grid of "Core Problems Solved" cards
- 3 Animated_Counter stat blocks (daily active users, daily API requests, uptime %)

**Animated counters** reuse the existing `useAnimatedCounter` hook with `active` tied to `isActive` prop so counters restart when the tab is re-selected.

### New Sub-Component: `ArchitecturePanel`

```typescript
interface ArchitecturePanelProps {
  architecture: ProjectArchitecture;
}
```

**Node-Graph Visualization:**
- SVG with viewBox matching the node position coordinate space (0-100 scaled to container)
- Each `ArchNode` rendered as a rounded rect with label and technology pills
- Edges rendered as SVG `<line>` or `<path>` elements with labels
- Color-coded by node type: user (blue), backend (green), ai (purple), database (amber), external (gray)

**Backend Layers Section:**
- 6 layer description cards in a 2×3 grid (static data from `voiceowlExploreData.ts`)

**Engineering Insights:**
- Accordion-style or card list showing question, decision, tradeoff, outcome per insight
- Sourced from `voiceowlArchitecture.insights`

### New Sub-Component: `FeaturesPanel`

```typescript
// No props needed — reads from static data
```

**Layout:**
- 2×3 grid of feature category cards (3 cols on desktop, 2 on tablet, 1 on mobile)
- Each card: title, icon indicator, list of sub-items

### New Sub-Component: `ContributionsPanel`

```typescript
// No props needed — reads from static data
```

**Layout:**
- **Contributions section**: numbered list of 7 contribution items
- **Challenges section**: 4 cards with distinct before/after styling
  - Before: red-tinted label, muted text
  - After: green-tinted label, bright text
- **Tech Stack section**: 7 category groups with technology pills

### New Data File: `src/data/voiceowlExploreData.ts`

```typescript
export interface CoreProblem {
  title: string;
  description: string;
}

export interface ImpactStat {
  label: string;
  value: number;
  suffix: string;
}

export interface FeatureCategory {
  title: string;
  items: string[];
}

export interface Challenge {
  title: string;
  before: string;
  after: string;
}

export interface TechStackCategory {
  category: string;
  technologies: string[];
}

export const voiceowlOverviewData: {
  description: string;
  problems: CoreProblem[];
  impactStats: ImpactStat[];
};

export const voiceowlFeatures: FeatureCategory[];

export const voiceowlContributions: {
  items: string[];
  challenges: Challenge[];
  techStack: TechStackCategory[];
};

export const voiceowlBackendLayers: {
  name: string;
  description: string;
}[];
```

---

## Tab Transition Animation

**AnimatePresence configuration:**

```typescript
<AnimatePresence mode="popLayout">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    role="tabpanel"
    aria-labelledby={`tab-${activeTab}`}
    id={`panel-${activeTab}`}
  >
    {/* Tab content */}
  </motion.div>
</AnimatePresence>
```

- `mode="popLayout"`: Allows the exiting element to animate out while the new one enters, enabling interruption if user clicks another tab mid-transition.
- Duration: 300ms (0.3s) matches requirement.
- Tab bar remains fully interactive during transitions (no disabled state).

---

## Responsive Behavior

| Viewport | Tab Bar | Content Grid | Node Graph |
|----------|---------|--------------|------------|
| ≥1024px (desktop) | Horizontal, full labels | Multi-column grids | Full width, all nodes visible |
| 768–1023px (tablet) | Horizontal, full labels | 2-column grids | Full width |
| <768px (mobile) | Horizontal, compact labels (truncated or icon+text) | Single column | `overflow-x-auto` for horizontal scroll |

The Tab_Bar uses `flex` with `overflow-x-auto` and `scrollbar-hide` on mobile to prevent overflow while allowing scroll if needed. Tab buttons use `whitespace-nowrap` and `min-w-0 flex-shrink-0`.

---

## Accessibility

**ARIA structure:**
```html
<div role="tablist" aria-label="VoiceOwl project details">
  <button role="tab" id="tab-overview" aria-selected="true" aria-controls="panel-overview" tabindex="0">Overview</button>
  <button role="tab" id="tab-architecture" aria-selected="false" aria-controls="panel-architecture" tabindex="-1">Architecture</button>
  <!-- ... -->
</div>

<div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" tabindex="0">
  <!-- Content -->
</div>
```

**Keyboard pattern (roving tabindex):**
- Only the active tab is in the tab order (`tabIndex={0}`)
- Arrow keys move focus within the tab list
- Home/End jump to first/last tab
- Focus follows activation (clicking or pressing Enter/Space both activates and moves focus)

---

## Data Models

### Tab State Model

```typescript
type TabId = 'overview' | 'architecture' | 'features' | 'contributions';

interface TabState {
  activeTab: TabId;
  focusedTab: TabId; // for roving tabindex (may differ from active during keyboard nav)
}
```

### VoiceOwl Explore Data Models

```typescript
interface CoreProblem {
  title: string;
  description: string;
}

interface ImpactStat {
  label: string;
  value: number;
  suffix: string; // e.g., "K+", "M+", "%"
}

interface FeatureCategory {
  title: string;
  items: string[];
}

interface Challenge {
  title: string;
  before: string;
  after: string;
}

interface TechStackCategory {
  category: string;
  technologies: string[];
}

interface BackendLayer {
  name: string;
  description: string;
}
```

### Architecture Visualization Data (existing types from `effects.ts`)

```typescript
// Already defined — reused directly
interface ArchNode {
  id: string;
  label: string;
  type: 'user' | 'backend' | 'ai' | 'database' | 'external';
  technologies: string[];
  role: string;
  position: { x: number; y: number };
}

interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

interface EngineeringInsight {
  question: string;
  problem: string;
  decision: string;
  tradeoff: string;
  outcome: string;
}
```

---

## Error Handling

- **Missing architecture data**: If `projectArchitectures['voiceowl-ai']` returns undefined, the Architecture tab renders a "Data unavailable" message rather than crashing.
- **Missing explore data**: Each panel handles undefined/empty data gracefully by showing a placeholder.
- **Animation cleanup**: `useAnimatedCounter` already cancels `requestAnimationFrame` on unmount. Tab switches properly clean up by toggling `active` to false on the outgoing panel.

---

## Testing Strategy

**Dual testing approach:**

- **Unit tests (example-based):** Verify specific rendering outputs for each tab, default state, and visual structure. Cover fixed content (4 tabs with correct labels, 6 feature categories, 7 contributions, etc.) and integration between components.
- **Property-based tests:** Verify universal invariants that hold across all valid inputs — tab exclusivity, ARIA correctness, keyboard navigation, data rendering completeness, and conditional activation logic.

**Framework:** Vitest + React Testing Library for component tests. `fast-check` for property-based test generation.

**Property test configuration:** Minimum 100 iterations per property test to cover input variations (random tab sequences, random project IDs, random data shapes).

**Key test files:**
- `src/components/effects/ProjectSystemView.test.tsx` — extend existing test file with new tab behavior tests
- `src/data/voiceowlExploreData.test.ts` — property tests for data structure completeness

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tab Selection Exclusivity

*For any* sequence of tab selections (via click, Enter, or Space), exactly one content panel SHALL be visible at any time, and it SHALL correspond to the most recently selected tab.

**Validates: Requirements 1.3, 9.3**

### Property 2: Non-VoiceOwl Projects Have No Tabs

*For any* project with an id that is not `voiceowl-ai`, the rendered ProjectSystemView SHALL contain no tab bar, no tab buttons, and no tabbed content panels.

**Validates: Requirements 2.2**

### Property 3: Core Layout Preservation

*For any* project (voiceowl-ai or otherwise) and *for any* active tab state, the header bar, live metrics panel, and close button SHALL remain present and functional in the rendered output.

**Validates: Requirements 2.3**

### Property 4: Animated Counter Monotonic Progression

*For any* target value > 0 and any duration > 0, the animated counter SHALL start at 0, produce monotonically non-decreasing values over time, and reach exactly the target value by the end of the specified duration.

**Validates: Requirements 3.4**

### Property 5: Insight Rendering Completeness

*For any* engineering insight object with non-empty question, decision, tradeoff, and outcome fields, the rendered Architecture panel output SHALL contain all four field values.

**Validates: Requirements 4.5**

### Property 6: Feature Sub-Items Rendering Completeness

*For any* feature category with N sub-items (N ≥ 1), the rendered Features panel SHALL display exactly N sub-item entries for that category.

**Validates: Requirements 5.2**

### Property 7: Challenge Before/After Rendering

*For any* challenge data object with non-empty before and after fields, the rendered Contributions panel SHALL display both the before-state text and the after-state text, and they SHALL have distinct visual styling.

**Validates: Requirements 6.2**

### Property 8: ARIA Semantics Invariant

*For any* tab state, the following SHALL hold simultaneously: (a) the tab container has `role="tablist"`, (b) each tab button has `role="tab"`, (c) exactly one tab has `aria-selected="true"` and all others have `aria-selected="false"`, (d) each content panel has `role="tabpanel"`, and (e) each panel's `aria-labelledby` matches its associated tab's `id`.

**Validates: Requirements 9.1, 9.4, 9.5**

### Property 9: Keyboard Arrow Navigation

*For any* focused tab at position i in the tab list of length N, pressing the right arrow key SHALL move focus to position (i+1) mod N, and pressing the left arrow key SHALL move focus to position (i-1+N) mod N.

**Validates: Requirements 9.2**
