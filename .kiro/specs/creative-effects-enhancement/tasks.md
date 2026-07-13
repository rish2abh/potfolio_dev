# Implementation Plan: Creative Effects Enhancement

## Overview

Transform the portfolio into a "live AI system dashboard" experience using progressive enhancement. Implementation follows the priority layers from requirements: Primary WOW items (Project System View, Boot Sequence) first, then Secondary Enhancers (Log Panel, Tech Graph), then Support Effects (Cursor, Particles, Borders, AI Assistant). All effects build on existing TypeScript/Next.js/Tailwind stack with dynamic imports and performance monitoring.

## Tasks

- [x] 1. Foundation — Effect orchestration, types, and utilities
  - [x] 1.1 Implement core utility functions (typewriter, character-scramble, boot scheduler, bounded queue)
    - Create `src/lib/effects-utils.ts` with pure functions: `typewriter(str, elapsed, rate)`, `characterScramble(target, progress)`, `calculateBootSchedule(messages)`, `BoundedQueue` class
    - `typewriter` returns prefix of string based on elapsed time and rate (30-50 chars/sec)
    - `characterScramble` returns string of same length, converging to target at progress=1
    - `calculateBootSchedule` distributes timing so total is 1500-2000ms
    - `BoundedQueue` enforces max capacity (8 for logs, 20 for chat) with FIFO eviction
    - _Requirements: 1.1, 1.2, 1.3, 2.4, 5.7_

  - [ ]* 1.2 Write property tests for typewriter function
    - **Property 1: Typewriter function character output**
    - Test that for any string, elapsed time, and rate (20-50), output length equals `min(floor(elapsed * rate / 1000), string.length)` and output is a prefix of input
    - **Validates: Requirements 1.1, 5.4**

  - [ ]* 1.3 Write property test for boot scheduler duration budget
    - **Property 2: Boot scheduler duration budget**
    - Test that for any array of 1-10 messages (10-60 chars each), total animation duration falls between 1500ms and 2000ms inclusive
    - **Validates: Requirements 1.2**

  - [ ]* 1.4 Write property test for character-scramble length preservation
    - **Property 3: Character-scramble length preservation and convergence**
    - Test that output length always equals input length, and at progress=1 output equals target
    - **Validates: Requirements 1.3**

  - [ ]* 1.5 Write property test for bounded queue invariant
    - **Property 6: Bounded queue invariant**
    - Test that queue never exceeds capacity C and most recent items are always present
    - **Validates: Requirements 2.4, 5.7**

  - [x] 1.6 Implement physics utility functions (particle repulsion, magnetic translation, tilt calculation, line distance)
    - Create `src/lib/physics-utils.ts` with: `calculateRepulsion(particle, mouse, radius=150)`, `calculateMagneticTranslation(elemCenter, cursor, radius=60, strength=8)`, `shouldDrawLine(p1, p2, threshold=120)`, `calculateTilt(cardDims, pointerPos, maxRotation=12)`
    - Each function is pure and testable independently of DOM
    - _Requirements: 1.7, 6.5, 7.2, 9.2_

  - [ ]* 1.7 Write property test for particle repulsion force geometry
    - **Property 4: Particle repulsion force geometry**
    - Test that force points away from mouse when distance < 150px, and is zero when >= 150px
    - **Validates: Requirements 1.7**

  - [ ]* 1.8 Write property test for magnetic element translation
    - **Property 17: Magnetic element translation calculation**
    - Test that translation points toward cursor with magnitude ≤ 8px when within 60px, and is (0,0) otherwise
    - **Validates: Requirements 6.5**

  - [ ]* 1.9 Write property test for particle connection line distance
    - **Property 18: Particle connection line distance threshold**
    - Test that shouldDrawLine returns true iff Euclidean distance < 120px
    - **Validates: Requirements 7.2**

  - [ ]* 1.10 Write property test for tilt angle calculator
    - **Property 22: Tilt angle calculator — proportional and bounded**
    - Test that |rotateX| ≤ maxRotation and |rotateY| ≤ maxRotation, proportional to pointer offset
    - **Validates: Requirements 9.2**

  - [x] 1.11 Implement performance and layout utility functions
    - Create `src/lib/layout-utils.ts` with: `calculateStaggerDelays(count, maxDuration=1200, baseDelay=80)`, `calculateScrollDuration(distance)`, `getLogColor(level)`, `assessDeviceCapabilities(cores)`, `resolveCursorState(elementType)`
    - Stagger delays proportionally reduce for groups > maxDuration/baseDelay items
    - Scroll duration clamped 300-800ms, monotonically increasing
    - Device assessor returns feature flags based on core count
    - _Requirements: 2.7, 6.2-6.4, 8.1-8.4, 10.5_

  - [ ]* 1.12 Write property test for stagger delay calculator
    - **Property 20: Stagger delay calculator respects maximum duration**
    - Test that sum of delays never exceeds max duration for any child count 1-100
    - **Validates: Requirements 8.1, 8.2, 8.4**

  - [ ]* 1.13 Write property test for scroll duration calculator
    - **Property 21: Scroll duration calculator produces clamped values**
    - Test that output is between 300-800ms inclusive and monotonically increasing with distance
    - **Validates: Requirements 8.3**

  - [ ]* 1.14 Write property test for log level color mapping
    - **Property 7: Log level color mapping is total and deterministic**
    - Test that each level maps to exactly one color deterministically
    - **Validates: Requirements 2.7**

  - [ ]* 1.15 Write property test for device capability assessor
    - **Property 23: Device capability assessor feature flags**
    - Test that cores ≤ 2 disables particle lines, cursor trail, spotlight, flow auto-loop; cores > 2 enables all
    - **Validates: Requirements 10.5**

  - [ ]* 1.16 Write property test for cursor state resolver
    - **Property 16: Cursor state resolver maps element types correctly**
    - Test correct label and scale for project-card, external-link, button, other
    - **Validates: Requirements 6.2, 6.3, 6.4**

- [x] 2. Checkpoint — Foundation utilities
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Primary WOW — Project System View
  - [x] 3.1 Implement ProjectSystemView component with Architecture Diagram
    - Create `src/components/effects/ProjectSystemView.tsx` as a full-width modal/overlay
    - Render SVG-based ArchitectureDiagram with nodes positioned via percentage coordinates from `architectures.ts`
    - Nodes show label; on hover expand to reveal technologies, role, decisions
    - Edges rendered as SVG `<path>` elements connecting nodes
    - Close on Escape key or close button (400ms collapse animation)
    - Keyboard accessible: Enter/Space to open, Escape to close, Tab between nodes
    - Dynamic import with `ssr: false`
    - _Requirements: 3.1, 3.2, 3.3, 3.7, 11.6_

  - [ ]* 3.2 Write property test for architecture diagram node rendering
    - **Property 8: Architecture diagram renders all provided nodes**
    - Test that for any valid ProjectArchitecture (1-8 nodes), all node labels appear in output
    - **Validates: Requirements 3.2**

  - [x] 3.3 Implement FlowSimulation within ProjectSystemView
    - Animate a pulse/particle along SVG paths following `flowSequence` order
    - Each step highlighted for 400-600ms before moving to next
    - Loop continuously with 2-second pause between cycles
    - Disable auto-loop on low-performance devices (hardwareConcurrency ≤ 2)
    - Respect reduced-motion: show static highlighted path
    - _Requirements: 3.4, 3.5, 10.5, 11.1_

  - [x] 3.4 Implement EngineeringInsights accordion panel
    - Create expandable accordion within ProjectSystemView for engineering insights
    - Each insight renders Problem → Decision → Tradeoff → Outcome structure
    - Toggle "Show Engineering Thinking" button to reveal/hide panel
    - Use framer-motion AnimatePresence for smooth expand/collapse
    - VoiceOwl: full 4 insights; AgriSoft/Digisparsh: 2 insights each
    - _Requirements: 3.6, 3.8_

  - [ ]* 3.5 Write property test for engineering insight structure completeness
    - **Property 9: Engineering insight structure completeness**
    - Test that for any valid EngineeringInsight, output contains question, problem, decision, tradeoff, outcome
    - **Validates: Requirements 3.6**

  - [x] 3.6 Integrate ProjectSystemView into Projects component
    - Add "Explore System" button to each project card
    - On click, open ProjectSystemView with correct architecture data from `projectArchitectures` map
    - Add log entry on project explore via LogContext
    - _Requirements: 3.1, 2.3_

- [x] 4. Primary WOW — Boot Sequence
  - [x] 4.1 Implement BootSequence component
    - Create `src/components/effects/BootSequence.tsx` as full-screen terminal overlay
    - Use monospace font (JetBrains Mono via `font-mono`), neon-blue text, blinking cursor
    - Type messages from `bootMessages.ts` character-by-character using `typewriter` utility
    - Total animation completes within 1500-2000ms (using `calculateBootSchedule`)
    - On completion: cross-fade out with 500ms transition, reveal Hero content
    - Apply `characterScramble` settle effect on name reveal
    - Skip if `sessionStorage.getItem('boot_completed')` is true
    - Skip if `prefers-reduced-motion: reduce` (call `onComplete` immediately)
    - Dynamic import with `ssr: false`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 13.3_

  - [x] 4.2 Integrate BootSequence into page layout
    - Wire BootSequence into `page.tsx` — renders overlay on top of Hero
    - On boot complete: call `setBootCompleted()` from EffectsContext
    - Hero content visible after boot completes (opacity transition)
    - Particle system visible behind boot terminal
    - _Requirements: 1.2, 1.7_

- [x] 5. Checkpoint — Primary WOW items
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Secondary Enhancers — System Log Panel
  - [x] 6.1 Implement SystemLogPanel component
    - Create `src/components/effects/SystemLogPanel.tsx` consuming LogContext
    - Fixed position bottom-right on desktop (300px wide), collapsed on mobile (<768px)
    - Display timestamped entries with color-coded prefixes (blue/INFO, green/OK, yellow/AI, purple/ACTION)
    - Monospace font, semi-transparent glassmorphism background
    - Minimize/close toggle; collapsed shows unread count badge
    - Entries animate in with slide-left + fade; max 8 visible
    - Panel state persists via sessionStorage
    - Dynamic import with `ssr: false`
    - _Requirements: 2.1, 2.4, 2.5, 2.6, 2.7, 10.4_

  - [x] 6.2 Implement log message generation on scroll and interactions
    - Add IntersectionObserver in page sections that calls `addEntry` with section-specific messages from `logMessages.ts`
    - Add hover/click handlers on project cards that fire project-specific log entries
    - Use `sectionLogs` and `projectLogs` data maps
    - _Requirements: 2.2, 2.3_

  - [ ]* 6.3 Write property test for log message generator
    - **Property 5: Log message generator produces valid entries**
    - Test that for any valid interaction event, output has non-empty message containing section/project name, valid level, and timestamp
    - **Validates: Requirements 2.2, 2.3**

- [x] 7. Secondary Enhancers — Interactive Tech Skills Graph
  - [x] 7.1 Implement TechGraph component with force-directed layout
    - Create `src/components/effects/TechGraph.tsx` using SVG-based layout
    - Render nodes from `techGraph.ts` with connections as edges
    - Implement lightweight spring physics for node positioning (category clustering)
    - Idle: subtle 2-4px sine oscillation on nodes
    - Hover: highlight hovered + connected nodes at full opacity, dim others to 30%
    - Tooltip on hover: proficiency, years of experience, related projects
    - Mobile (<768px): switch to grouped vertical layout with expandable categories
    - Dynamic import with `ssr: false`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 10.4_

  - [ ]* 7.2 Write property test for tech graph node rendering
    - **Property 10: Tech graph renders all nodes with valid edge references**
    - Test that for any valid TechNode array (3-20 nodes), all names appear and edges reference existing nodes
    - **Validates: Requirements 4.1**

  - [ ]* 7.3 Write property test for graph highlight logic
    - **Property 11: Graph highlight logic — connected vs dimmed**
    - Test that highlighted set includes hovered node + connected nodes, and highlighted ∪ dimmed = full node set
    - **Validates: Requirements 4.2**

  - [ ]* 7.4 Write property test for tech node tooltip
    - **Property 12: Tech node tooltip includes required information**
    - Test that tooltip output contains proficiency, years, and all project names
    - **Validates: Requirements 4.3**

  - [ ]* 7.5 Write property test for graph layout clustering
    - **Property 13: Graph layout clusters nodes by category**
    - Test that average intra-cluster distance < average inter-cluster distance
    - **Validates: Requirements 4.4**

  - [x] 7.6 Replace Skills section with TechGraph
    - Update `Skills.tsx` or page layout to render TechGraph instead of current grid
    - Ensure fallback to grid layout if TechGraph fails to load
    - _Requirements: 4.1, 14.2_

- [ ] 8. Checkpoint — Secondary enhancers
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Support Effects — Context Cursor and Magnetic Elements
  - [ ] 9.1 Implement ContextCursor component
    - Create `src/components/effects/ContextCursor.tsx`
    - Inner dot (8px) + outer ring (32px) following cursor with 80-120ms spring delay
    - Only renders on `@media (pointer: fine)` devices
    - Labels: "Explore" on `[data-cursor="explore"]`, "Open" on `[data-cursor="open"]`, scale 1.5x on buttons
    - Uses `pointer-events: none`, neon-blue color (#00d4ff)
    - Disabled when reduced-motion is active
    - Uses `resolveCursorState` utility for state mapping
    - Dynamic import with `ssr: false`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.7, 6.8, 11.2, 10.4_

  - [ ] 9.2 Implement MagneticWrapper component
    - Create `src/components/effects/MagneticWrapper.tsx`
    - Calculates distance from cursor to element center using `calculateMagneticTranslation`
    - Applies CSS transform translate (max 8px) when cursor within 60px radius
    - Spring-back on exit: 300ms ease-out
    - Disabled on touch and reduced-motion
    - Wrap Hero CTA buttons and nav links with MagneticWrapper
    - _Requirements: 6.5, 6.6, 6.7, 11.2_

- [ ] 10. Support Effects — Atmosphere (Aurora, Enhanced Particles, Grain)
  - [ ] 10.1 Implement AuroraBackground component
    - Create `src/components/effects/AuroraBackground.tsx`
    - Render animated gradient blobs using CSS (3+ color stops, neon-blue/purple, opacity 0.03-0.08)
    - CSS blur 40-80px, cycling positions over 15-30 seconds
    - `pointer-events: none`, z-index behind content
    - Reduced motion: static gradient
    - Dynamic import with `ssr: false`
    - _Requirements: 7.1, 7.4, 11.1, 10.4_

  - [ ] 10.2 Enhance ParticleSystem with connecting lines and mouse interaction
    - Refactor existing `ParticleBackground.tsx` → move to `src/components/effects/ParticleSystem.tsx`
    - Add connecting lines between particles within 120px (using `shouldDrawLine`)
    - Add mouse repulsion within 150px (using `calculateRepulsion`)
    - Minimum 50 particles with depth layers
    - Performance: reduce particle count and disable lines below 30fps
    - Reduced motion: static dots without movement
    - Pause when tab hidden (`visibilitychange` event)
    - _Requirements: 7.2, 7.5, 7.4, 1.7, 10.7, 11.1_

  - [ ] 10.3 Implement NoiseTexture component
    - Create `src/components/effects/NoiseTexture.tsx`
    - Full-viewport fixed overlay with SVG noise filter at opacity 0.02-0.05
    - Must add < 10KB to payload
    - `pointer-events: none`, z-index behind content
    - Reduced motion: remain static
    - _Requirements: 7.3, 7.4, 11.1_

- [ ] 11. Support Effects — Animated Borders and Card Effects
  - [ ] 11.1 Implement AnimatedBorder component
    - Create `src/components/effects/AnimatedBorder.tsx`
    - SVG `<rect>` with animated `stroke-dashoffset` flowing gradient (neon-blue → neon-purple)
    - 3-6 second cycle; hover: 2x speed
    - Applied to VoiceOwl project card and contact form
    - Reduced motion: static gradient border
    - _Requirements: 9.1, 9.4, 9.6_

  - [ ] 11.2 Implement TiltCard component
    - Create `src/components/effects/TiltCard.tsx`
    - Rotates card on X/Y axes proportional to pointer offset (using `calculateTilt`)
    - Max 12 degrees rotation, perspective 800-1200px
    - On pointer leave: spring back to 0 degrees (400ms ease-out)
    - Touch devices: disabled, falls back to scale hover
    - Reduced motion: disabled
    - Wrap project cards with TiltCard
    - _Requirements: 9.2, 9.3, 9.5, 9.6, 11.2_

- [ ] 12. Support Effects — AI Assistant
  - [ ] 12.1 Implement AIAssistant component
    - Create `src/components/effects/AIAssistant.tsx`
    - Floating button (non-overlapping with log panel) expands to chat panel
    - Rule-based keyword matching using `chatPatterns.ts` data
    - Typewriter response animation (20-40 chars/sec using `typewriter` utility)
    - Max 20 messages in history (using `BoundedQueue`)
    - Welcome message with 3 suggested clickable questions from `chatPatterns.ts`
    - Fallback response for unmatched questions
    - Close button to dismiss; keyboard navigable (focus management)
    - Dynamic import with `ssr: false`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 11.5, 10.4_

  - [ ]* 12.2 Write property test for AI pattern matcher (matched)
    - **Property 14: AI pattern matcher returns category-appropriate response**
    - Test that for any input matching a known pattern, response is non-empty and from correct category
    - **Validates: Requirements 5.2**

  - [ ]* 12.3 Write property test for AI pattern matcher (fallback)
    - **Property 15: AI pattern matcher fallback for unmatched input**
    - Test that random non-matching strings return the designated fallback message
    - **Validates: Requirements 5.6**

- [ ] 13. Checkpoint — Support effects
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Cross-cutting — Section Transitions, Quick View, Brand, and Impact
  - [ ] 14.1 Implement StaggeredList component for entrance animations
    - Create `src/components/effects/StaggeredList.tsx`
    - Wraps groups of child elements with staggered fade-up-scale or slide-in
    - Uses `calculateStaggerDelays` to respect max 1200ms total duration
    - IntersectionObserver with `once: true`
    - Section headings: word-by-word reveal with 80ms stagger (800ms max)
    - Reduced motion: children render immediately in final state
    - Apply to project cards, skill nodes, experience entries, section headings
    - _Requirements: 8.1, 8.2, 8.4, 8.5, 8.6, 11.3_

  - [ ] 14.2 Implement smooth scroll and anchor navigation
    - Add smooth-scroll behavior with ease-out timing using `calculateScrollDuration`
    - Duration proportional to distance (300-800ms)
    - Wire to navigation links and CTA buttons
    - _Requirements: 8.3_

  - [ ] 14.3 Implement QuickViewMode component and toggle
    - Create `src/components/QuickViewMode.tsx` — clean single-scroll summary page
    - Display: years of experience, role, top 8 tech tags, project name + one-line impact, contact CTA
    - Direct links to resume PDF, GitHub, LinkedIn, contact section
    - No animations, no effects, plain dark background
    - Show single most impressive metric per project
    - Render within 200ms (data already in memory from data files)
    - Add "⚡ Quick View" toggle in top navigation (persisted via sessionStorage)
    - Returning to full mode: no re-trigger of boot sequence
    - Dynamic import with `ssr: false`
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 15.7_

  - [ ]* 14.4 Write property test for quick view data transformer
    - **Property 24: Quick view data transformer completeness**
    - Test that transformer produces name, role, top skills (≤8), project summaries, and all link URLs
    - **Validates: Requirements 12.2**

  - [ ]* 14.5 Write property test for quick view metric selector
    - **Property 26: Quick view shows exactly one metric per project**
    - Test that for any project with N≥2 metrics, selector returns exactly 1
    - **Validates: Requirements 15.7**

  - [ ] 14.6 Add impact metrics to project cards and experience entries
    - Extend Project type with `impactMetrics: ImpactMetric[]` field
    - Add impact data to projects in `projects.ts` (VoiceOwl: 4 metrics, AgriSoft: 2, Digisparsh: 2)
    - Render impact section in ProjectCard and ProjectSystemView with visual emphasis (larger font, neon accent)
    - Add highlighted callout metrics to experience timeline entries
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [ ]* 14.7 Write property test for project impact data completeness
    - **Property 25: Project impact data completeness**
    - Test that every project has impactMetrics array with ≥ 2 entries, each with non-empty label and value
    - **Validates: Requirements 15.1**

  - [ ] 14.8 Add brand voice copy updates
    - Add positioning statement to Hero section below role text
    - Add philosophy statement to About section
    - Update section headings to engineering-flavored language ("Systems I've Built", "The Stack", "Engineering Timeline")
    - AI assistant welcome message with first-person brand voice (already in `chatPatterns.ts`)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 15. Performance, Accessibility, and Fallbacks
  - [ ] 15.1 Implement performance safeguards and background tab pausing
    - Wire `usePerformanceMonitor` into atmosphere components
    - Add `visibilitychange` listener to pause all rAF animations when tab hidden
    - Ensure all effects use GPU-accelerated properties only (transform, opacity, filter)
    - Verify all effect components use dynamic import with `ssr: false`
    - _Requirements: 10.3, 10.4, 10.7, 7.5, 14.3_

  - [ ]* 15.2 Write property test for performance monitor sustained drop detection
    - **Property 19: Performance monitor sustained drop detection**
    - Test that below-threshold FPS for specified duration triggers degradation, above threshold does not
    - **Validates: Requirements 7.5, 14.3**

  - [ ] 15.3 Implement fail-safe static fallback mode
    - Wrap each effect component in React Error Boundary that renders nothing on failure
    - Ensure SSR renders all critical content without client JS (verify via HTML output)
    - Add subtle "Viewing simplified mode" indicator when effects are disabled
    - Add "Try full experience" link that reloads with effects enabled
    - Progressive enhancement: content renders first, effects hydrate on top
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 15.4 Verify accessibility and reduced-motion compliance
    - Ensure all `prefers-reduced-motion: reduce` behaviors are correctly wired via EffectsContext
    - Add `aria-hidden="true"` to all decorative effect elements
    - Verify AI assistant focus management (focus into panel on open, return to trigger on close)
    - Verify Project System View keyboard navigation (Enter/Space/Escape/Tab)
    - All effects decorative only — no information lost when disabled
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 16. Final checkpoint — Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at each priority layer
- Property tests validate universal correctness properties from the design document (26 properties total)
- Unit tests validate specific examples and edge cases
- All effect components use dynamic imports with `ssr: false` for code splitting and hydration safety
- Data files (`architectures.ts`, `techGraph.ts`, `chatPatterns.ts`, `bootMessages.ts`, `logMessages.ts`) are already populated
- EffectsContext and LogContext are already implemented and ready to consume
- `usePerformanceMonitor` hook is already implemented
- fast-check v3.23.2 already installed for property-based testing

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.6", "1.11"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5", "1.7", "1.8", "1.9", "1.10", "1.12", "1.13", "1.14", "1.15", "1.16"] },
    { "id": 2, "tasks": ["3.1", "4.1", "6.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "4.2", "6.2"] },
    { "id": 4, "tasks": ["3.5", "3.6", "6.3", "7.1"] },
    { "id": 5, "tasks": ["7.2", "7.3", "7.4", "7.5", "7.6"] },
    { "id": 6, "tasks": ["9.1", "9.2", "10.1", "10.2", "10.3"] },
    { "id": 7, "tasks": ["11.1", "11.2", "12.1"] },
    { "id": 8, "tasks": ["12.2", "12.3", "14.1", "14.2"] },
    { "id": 9, "tasks": ["14.3", "14.6", "14.8"] },
    { "id": 10, "tasks": ["14.4", "14.5", "14.7"] },
    { "id": 11, "tasks": ["15.1", "15.3", "15.4"] },
    { "id": 12, "tasks": ["15.2"] }
  ]
}
```
