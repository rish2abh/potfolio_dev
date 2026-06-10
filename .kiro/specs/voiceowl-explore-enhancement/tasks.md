# Implementation Plan: VoiceOwl Explore Enhancement

## Overview

Implement a sophisticated tabbed content interface for the VoiceOwl AI project overlay with: interactive node graph (hover/click), animated data flow on edges, live status indicators, impact metrics with animated counters, system log integration on tab changes, micro-delay realism, lazy panel rendering, and performance-aware animation disabling. All panels use Framer Motion 300ms transitions with staggered content appearance.

## Tasks

- [x] 1. Create enhanced data layer
  - [x] 1.1 Create `src/data/voiceowlExploreData.ts` with all tab content data
    - Define and export interfaces: `CoreProblem`, `ImpactStat`, `FeatureItem`, `FeatureCategory`, `ContributionItem`, `Challenge`, `TechStackCategory`, `BackendLayer`, `MetricData`
    - Export `voiceowlOverviewData` with description, 4 core problems, 3 impact stats (daily active users 150K+, daily API requests 2M+, uptime 99.9%), and system summary text
    - Export `voiceowlFeatures` with 6 feature categories, each containing sub-items with `liveStatus` field (boolean) and optional `metric` field (e.g., latency: "12ms", usage: "45K/day")
    - Export `voiceowlContributions` with 7 contribution items (each with before/after text), 4 challenges (before/after with distinct styling hints), impact metrics (animated counter targets for each contribution area), and 7 tech stack categories
    - Export `voiceowlBackendLayers` with 6 backend layer descriptions
    - Export `voiceowlMetrics` with per-feature metric data (latency, usage numbers, status)
    - Memoize all static data exports using `Object.freeze()` for performance
    - _Requirements: 3.1, 3.2, 3.5, 4.4, 5.1, 5.2, 6.1, 6.2, 6.3_

  - [ ]* 1.2 Write property tests for data structure completeness
    - **Property 6: Feature Sub-Items Rendering Completeness** — verify every feature category has at least 1 sub-item and each item has a valid `liveStatus` boolean
    - **Property 5: Insight Rendering Completeness** — verify all insight objects have non-empty question, decision, tradeoff, outcome
    - **Validates: Requirements 4.5, 5.2**

- [x] 2. Implement TabBar component with accessibility and system integration
  - [x] 2.1 Add `TabBar` sub-component to `ProjectSystemView.tsx`
    - Define `TabId` type and `TABS` config array with icons per tab
    - Render horizontal tab list with `role="tablist"`, each button with `role="tab"`
    - Implement roving tabindex: active tab `tabIndex={0}`, others `tabIndex={-1}`
    - Set `aria-selected`, `aria-controls`, and `id` attributes per tab
    - Style active tab with `bg-white/10 text-white border-b-2 border-[#00d4ff]`
    - Style inactive tabs with `text-white/50 hover:text-white/80`
    - Make tab bar sticky below metrics section
    - On mobile: add `overflow-x-auto` with `scrollbar-hide` utility, buttons use `whitespace-nowrap flex-shrink-0`
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6, 8.1, 9.1, 9.4_

  - [x] 2.2 Implement keyboard navigation in TabBar
    - Arrow Left/Right moves focus between tabs with wrapping
    - Enter/Space activates the focused tab
    - Home/End jump to first/last tab
    - Focus follows activation pattern
    - _Requirements: 9.2, 9.3_

  - [x] 2.3 Add system log integration on tab change
    - Import `useLog` from LogContext
    - On every tab change, call `addEntry('info', '[AI] Switching to ${tabLabel} view...')`
    - Add 100-200ms artificial delay before showing panel content (use `setTimeout` + state flag `contentReady`)
    - During delay, show a subtle loading shimmer (thin animated line at top of panel area)
    - _Requirements: System Integration Layer_

  - [ ]* 2.4 Write property test for keyboard arrow navigation
    - **Property 9: Keyboard Arrow Navigation** — for any focused tab at position i in list of length N, right arrow moves to (i+1) mod N, left arrow moves to (i-1+N) mod N
    - **Validates: Requirements 9.2**

  - [ ]* 2.5 Write property test for ARIA semantics invariant
    - **Property 8: ARIA Semantics Invariant** — for any tab state: tablist role exists, all buttons have role="tab", exactly one has aria-selected="true", panels have role="tabpanel" with correct aria-labelledby
    - **Validates: Requirements 9.1, 9.4, 9.5**

- [x] 3. Implement conditional rendering, lazy panel loading, and tab state management
  - [x] 3.1 Add conditional VoiceOwl tab section to `ProjectSystemView.tsx`
    - Add `activeTab` state defaulting to `'overview'`
    - Add `contentReady` state (boolean) that resets to `false` on tab change, set to `true` after 150ms delay
    - Gate tab UI with `project.id === 'voiceowl-ai'` check
    - When VoiceOwl: render TabBar + lazy-loaded tab panels below metrics, hide existing architecture/tech sections
    - When non-VoiceOwl: render existing layout unchanged (architecture diagram + tech/links)
    - _Requirements: 1.2, 2.1, 2.2, 2.3_

  - [x] 3.2 Implement lazy panel rendering
    - Only mount the active panel's component (do NOT render all 4 panels with `display:none`)
    - Use a `switch` statement on `activeTab` to render only the current panel
    - Wrap panel in `AnimatePresence mode="popLayout"` with `key={activeTab}`
    - Conditionally render panel content only when `contentReady` is true (micro-delay gate)
    - _Requirements: Performance Layer_

  - [x] 3.3 Add performance-aware animation control
    - Import `useEffects` and destructure `performanceTier`, `reducedMotion`, `effectsEnabled`, `overlayActive`
    - Create `const heavyAnimationsEnabled = performanceTier === 'high' && effectsEnabled && !reducedMotion`
    - Pass `heavyAnimationsEnabled` down to Architecture and Overview panels to control node graph animation and flow animation
    - When `heavyAnimationsEnabled` is false: disable animated flow on edges, disable node hover scale effects, use instant counters instead of animated
    - _Requirements: Performance Layer_

  - [ ]* 3.4 Write property test for tab selection exclusivity
    - **Property 1: Tab Selection Exclusivity** — for any sequence of tab selections, exactly one panel is visible corresponding to the most recently selected tab
    - **Validates: Requirements 1.3, 9.3**

  - [ ]* 3.5 Write property test for non-VoiceOwl projects
    - **Property 2: Non-VoiceOwl Projects Have No Tabs** — for any project with id !== 'voiceowl-ai', rendered output contains no tablist, no tab buttons, no tabpanels
    - **Validates: Requirements 2.2**

  - [ ]* 3.6 Write property test for core layout preservation
    - **Property 3: Core Layout Preservation** — for any project and any active tab state, header bar, metrics panel, and close button remain present
    - **Validates: Requirements 2.3**

- [x] 4. Checkpoint - Verify tab infrastructure and system integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Overview Panel with animated counters
  - [x] 5.1 Implement `OverviewPanel` sub-component
    - Accept `isActive` and `heavyAnimationsEnabled` props
    - Render project description paragraph with fade-in
    - Render 2×2 grid of core problems cards (title + description) with staggered appearance (50ms delay between each card)
    - Render system summary section below problems
    - Render 3 animated counter stat blocks using `useAnimatedCounter` with `isActive` prop
    - Counter stats: daily active users (150K+), daily API requests (2M+), uptime (99.9%)
    - When `heavyAnimationsEnabled` is false: show final values instantly without animation
    - Counters restart animation when tab is re-selected
    - Use Framer Motion `staggerChildren: 0.05` for card reveal
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 5.2 Write property test for animated counter monotonic progression
    - **Property 4: Animated Counter Monotonic Progression** — for any target > 0 and duration > 0, counter starts at 0, produces monotonically non-decreasing values, reaches target by end
    - **Validates: Requirements 3.4**

- [x] 6. Implement interactive Architecture Panel
  - [x] 6.1 Implement `ArchitecturePanel` sub-component with interactive node graph
    - Accept `architecture` (from `voiceowlArchitecture`) and `heavyAnimationsEnabled` props
    - Render SVG container with viewBox scaled to node positions (0-100 coordinate space)
    - Render each node as a rounded-rect group: label text, technology pills, subtle glow on type color
    - Color-code nodes by type: user (`#3b82f6`), backend (`#22c55e`), ai (`#a855f7`), database (`#f59e0b`), external (`#6b7280`)
    - **Interactive hover**: on node hover, scale node to 1.05x, increase border glow, show tooltip with node `role` text
    - **Interactive click**: on node click, expand an info card below the graph showing full node details (technologies, role description)
    - Track `selectedNodeId` state — clicking the same node again deselects it
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 6.2 Implement animated data flow on edges
    - Render edges as SVG `<path>` elements between node positions
    - Add animated dash-offset on each edge path to simulate data flowing along the edge direction
    - Use CSS `@keyframes` for the dash animation (stroke-dasharray + stroke-dashoffset cycling)
    - Edge labels rendered as `<text>` elements at midpoint of each path
    - When `heavyAnimationsEnabled` is false: render static edges without dash animation (simple lines)
    - Support horizontal scroll on narrow viewports with `overflow-x-auto` wrapper
    - _Requirements: 4.2, 8.3_

  - [x] 6.3 Implement backend layers and engineering insights sections
    - Render 6 backend layer description cards in a responsive grid (3 cols desktop, 2 tablet, 1 mobile)
    - Render 4 engineering insight cards from `voiceowlArchitecture.insights` showing question, decision, tradeoff, outcome
    - Each insight card uses collapsible expand on click (show question + decision by default, expand to reveal tradeoff + outcome)
    - Use staggered entrance animation (50ms per card) when panel first mounts
    - _Requirements: 4.4, 4.5_

  - [ ]* 6.4 Write property test for insight rendering completeness
    - **Property 5: Insight Rendering Completeness** — for any engineering insight with non-empty fields, all four values are rendered
    - **Validates: Requirements 4.5**

- [x] 7. Implement Features Panel with live status indicators
  - [x] 7.1 Implement `FeaturesPanel` sub-component with live status and metrics
    - Render 6 feature category cards in responsive grid (3 cols desktop, 2 tablet, 1 mobile)
    - Each card: title, list of sub-items, and a **live status indicator**
    - Live status indicator: green pulsing dot + "ACTIVE" badge for features with `liveStatus: true`
    - Per-feature metrics display: small text showing latency, usage numbers from data (e.g., "12ms avg", "45K/day")
    - Cards use glassmorphism styling: `bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl`
    - Staggered card entrance animation (80ms between each card)
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 7.2 Write property test for feature sub-items rendering
    - **Property 6: Feature Sub-Items Rendering Completeness** — for any feature category with N sub-items, exactly N entries rendered
    - **Validates: Requirements 5.2**

- [x] 8. Implement Contributions Panel with impact metrics
  - [x] 8.1 Implement `ContributionsPanel` sub-component with before/after cards and impact metrics
    - Accept `isActive` and `heavyAnimationsEnabled` props
    - Render 7 contribution items as **before → after cards** with distinct styling:
      - Before side: `bg-red-500/10 border-red-500/20` tint, muted text
      - After side: `bg-green-500/10 border-green-500/20` tint, bright text
      - Arrow/separator between before and after
    - Render challenges section with 4 challenge cards (same before/after pattern)
    - Render **impact metrics section** with animated counters for each contribution area (e.g., "40% faster", "99.9% uptime", "2M+ requests/day")
    - When `heavyAnimationsEnabled` is false: show final counter values instantly
    - Animated counters activate when `isActive` is true (restarts on tab re-entry)
    - Render tech stack section with 7 category groups and technology pills
    - Use staggered entrance for contribution cards (60ms between each)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 8.2 Write property test for challenge before/after rendering
    - **Property 7: Challenge Before/After Rendering** — for any challenge with non-empty before/after fields, both texts are rendered with distinct styling
    - **Validates: Requirements 6.2**

- [x] 9. Checkpoint - Verify all panels render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Add tab transition animations and micro-delays
  - [x] 10.1 Wire AnimatePresence with Framer Motion transitions and staggered content
    - Wrap tab content in `AnimatePresence mode="popLayout"`
    - Key motion.div by `activeTab`
    - Apply `initial={{ opacity: 0, y: 8 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: -8 }}`
    - Set `transition={{ duration: 0.3, ease: 'easeOut' }}`
    - Inside each panel, use `motion.div` with `variants` and `staggerChildren` for staggered content appearance
    - Ensure tab bar remains interactive during transitions (no disabled state)
    - Support interruption: clicking new tab mid-transition starts new animation immediately
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 10.2 Implement micro-delay realism for panel content loading
    - On tab change: set `contentReady = false`, fire log entry, start 150ms timer
    - During the 150ms: show a subtle `h-0.5 bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent animate-pulse` loading indicator
    - After timer: set `contentReady = true`, render panel content with staggered fade-in
    - When `reducedMotion` is true: skip the micro-delay entirely, show content instantly
    - _Requirements: Animation Layer, Performance Layer_

- [x] 11. Implement responsive layout and final polish
  - [x] 11.1 Add responsive styles for all panels
    - TabBar: horizontal with `overflow-x-auto` and `scrollbar-hide` on mobile
    - Content grids: single column below 768px, multi-column above
    - Architecture node-graph: `overflow-x-auto` wrapper for horizontal scroll on narrow viewports
    - Tab buttons: `whitespace-nowrap` and `flex-shrink-0`
    - Feature cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
    - Contribution before/after cards: stack vertically on mobile, side-by-side on desktop
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 11.2 Wire HUD module count update on tab change
    - On each tab change, increment or update the module count via `useEffects` context if applicable
    - Ensure the SystemLogPanel receives the log entries fired during tab switches
    - Verify log messages appear with format: `[AI] Switching to ${tabLabel} view...`
    - _Requirements: System Integration Layer_

- [x] 12. Final checkpoint - Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The project uses Vitest + React Testing Library + fast-check (already in devDependencies)
- All new panel components are sub-components within `ProjectSystemView.tsx` (co-located, share state)
- Tab content data lives in `src/data/voiceowlExploreData.ts` for separation of concerns
- Architecture panel is INTERACTIVE — not a static SVG. Nodes respond to hover and click.
- System integration: every tab change fires a log entry and introduces micro-delay for realism
- Performance-aware: `heavyAnimationsEnabled` flag disables node graph animation, edge flow, and animated counters on low-tier devices
- Lazy rendering: only the active panel is mounted (no hidden panels in DOM)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4", "2.5", "3.1"] },
    { "id": 4, "tasks": ["3.2", "3.3"] },
    { "id": 5, "tasks": ["3.4", "3.5", "3.6", "5.1"] },
    { "id": 6, "tasks": ["5.2", "6.1"] },
    { "id": 7, "tasks": ["6.2", "6.3", "7.1"] },
    { "id": 8, "tasks": ["6.4", "7.2", "8.1"] },
    { "id": 9, "tasks": ["8.2", "10.1"] },
    { "id": 10, "tasks": ["10.2", "11.1"] },
    { "id": 11, "tasks": ["11.2"] }
  ]
}
```
