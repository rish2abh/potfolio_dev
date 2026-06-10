# Implementation Plan: AI Dashboard Transformation

## Overview

Transform the existing Next.js 14 portfolio into a "Live AI System Dashboard" experience by enhancing existing components and creating 3 new ones. The implementation follows an incremental approach: foundational CSS/utilities first, then new components, then enhancements to existing components, and finally wiring everything together with the focal glow system and performance optimizations.

## Tasks

- [x] 1. Foundation: CSS utilities, types, and layout utilities
  - [x] 1.1 Add keyframe animations and glow utility classes to globals.css
    - Add `@keyframes` for `rotateBorderPseudo`, `fadeIn`, `pulseGlow`, `rotateRing`, `statusPulse`, `auroraFloat`
    - Add utility classes: `.animate-fadeIn`, `.animate-pulseGlow`, `.animate-rotateRing`, `.animate-statusPulse`, `.animate-auroraFloat`
    - Add glow utilities: `.glow-neon-idle`, `.glow-neon-hover`, `.glow-voiceowl-hover`, `.glow-viz-core`
    - Add focal glow CSS: `[data-focal-container]` rules for section dimming
    - Add VoiceOwl animated border CSS: `.voiceowl-card` with `::before` and `::after` pseudo-elements
    - Set body background to `#020617`
    - _Requirements: 8.1, 8.2, 8.3, 8.8, 12.1, 12.2, 12.3_

  - [x] 1.2 Add new types to `src/types/effects.ts`
    - Add `FocalState` interface (activeSectionId, sections array)
    - Add `SystemStatus` interface (online, latency, moduleCount)
    - Add `VisualizationNode` interface (id, x, y, vx, vy, connections)
    - _Requirements: 10.1, 12.1_

  - [x] 1.3 Add utility functions to `src/lib/layout-utils.ts`
    - Implement `calculateParallaxOffset` (cursor-based, clamped to ±15px)
    - Implement `fluctuateLatency` (base ±5ms bounded)
    - Implement `calculateFocalSection` (closest section to viewport center)
    - Implement `calculateCardTilt` (cursor-to-card tilt angles, clamped to ±maxAngle)
    - Implement `calculateStaggerDelays` (baseDelay 150ms, maxDuration 1200ms cap)
    - _Requirements: 1.6, 6.2, 10.4, 12.1, 12.6_

  - [x]* 1.4 Write property tests for layout utility functions
    - **Property 1: Parallax offset is bounded**
    - **Property 2: Latency fluctuation is bounded**
    - **Property 7: Card tilt is bounded by maximum angle**
    - **Property 9: Focal glow selects exactly one section**
    - **Property 10: Stagger delays are within bounds and sum is capped**
    - **Validates: Requirements 1.6, 6.2, 10.4, 12.1, 12.6**

- [x] 2. New Component: SystemVisualization
  - [x] 2.1 Create `src/components/effects/SystemVisualization.tsx`
    - Implement 5-layer animated visualization (background glow, rotating ring, network nodes, pulsing core, canvas micro-particles)
    - Hexagonal node layout with sine-wave oscillation (Layer 3)
    - Framer Motion scale animation on core (Layer 4, 0.9→1.1 over 3s loop)
    - Canvas cursor-reactive particles (Layer 5, high tier only)
    - Respect performance tiers: Phase 1 (core) always renders, Phase 2 (ring+nodes) medium+, Phase 3 (canvas) high only
    - Static gradient glow fallback for low performance tier
    - Responsive sizing: 400×400px desktop, 320×320px tablet, 280×280px mobile
    - _Requirements: 1.5, 1.9, 1.10, 8.4, 8.8, 9.3, 9.4, 11.5, 11.6_

- [x] 3. New Component: SystemStatusIndicator
  - [x] 3.1 Create `src/components/effects/SystemStatusIndicator.tsx`
    - Render persistent fixed-position HUD (top-right, z-40)
    - Display 3 metrics: green blinking status dot + "ONLINE", latency (fluctuates ±5ms every 2-4s), module count
    - Consume EffectsContext for bootCompleted and activeSection
    - Fade in after boot completes (opacity 0→0.7 over 400ms)
    - Compact mobile layout (only dot + "ONLINE" on viewports < 768px)
    - Monospace font, 11px, uppercase, 70% opacity
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 4. New Component: FocalGlowManager
  - [x] 4.1 Create `src/components/effects/FocalGlowManager.tsx`
    - Use merged IntersectionObserver (shared thresholds: 0, 0.25, 0.3, 0.5, 0.75, 1.0)
    - Determine focal section by proximity to viewport center
    - Debounce focal changes by 80ms to prevent flicker
    - Apply `data-focal="true"` to active section, 0.85 opacity to non-focal sections
    - Optional 0.3px blur on non-focal sections for high performance tier
    - Expose `data-focal-container` and `data-perf` attributes on wrapper
    - Reduced motion: dimming still applies (opacity-based, not motion)
    - _Requirements: 12.1, 12.2, 12.3, 12.7_

- [x] 5. Checkpoint - Core components created
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Hero Section Redesign
  - [x] 6.1 Enhance `src/components/Hero.tsx`
    - Replace profile image with `<SystemVisualization />` component
    - Two-column layout: left 55% (identity), right 45% (visualization), stacking on mobile
    - Name: text-5xl md:text-7xl, font-extrabold (800), tracking-[-0.03em], pure white
    - Tagline: "I build real-time AI backend systems and scalable architectures." at 65% opacity, text-xl, max-w-lg
    - Full 100vh height with flex items-center vertical centering
    - CTA buttons wrapped in MagneticWrapper with `.glow-neon-idle` class
    - Responsive: stack vertically below 768px, 50/50 at tablet (768-1023px)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7, 1.8, 8.4, 8.5, 11.1, 11.2, 11.5, 11.6_

  - [x]* 6.2 Write unit tests for Hero component
    - Test 100vh rendering, text-7xl name presence, two-column layout
    - Test mobile stacking behavior
    - Test CTA glow class presence
    - _Requirements: 1.1, 1.2, 1.3, 11.1, 11.2_

- [x] 7. Dashboard Framing and Section Headings
  - [x] 7.1 Add Dashboard Shell label to `src/app/page.tsx`
    - Fixed-position centered top label: "SYSTEM DASHBOARD" in monospace, 11px, uppercase, 60% opacity
    - Fade-in animation (500ms) with 300ms delay after boot completion
    - Immediate display (no animation) when boot is skipped (reduced motion or returning session)
    - _Requirements: 2.1, 2.6, 2.7_

  - [x] 7.2 Update section headings in About, Skills, Projects, Experience
    - `About.tsx`: "About Me" → "System Profile"
    - `Skills.tsx`: "Skills" → "Tech Network"
    - `Projects.tsx`: "Projects" → "Active Systems"
    - `Experience.tsx`: "Experience" → "Execution Timeline"
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 8. VoiceOwl Flagship Project Card
  - [x] 8.1 Enhance `src/components/ui/ProjectCard.tsx` with featured variant
    - Accept `isFeatured` prop for VoiceOwl differentiation
    - Featured: col-span-2, min-h-[400px], p-8, `[PRIMARY SYSTEM]` badge, metric badges (3), animated gradient border (hover-only), `.glow-voiceowl-hover` on hover
    - Standard: min-h-[200px], p-6, border-white/10, no glow, 75% text opacity
    - "Explore System →" button with neon glow on VoiceOwl card
    - Responsive: full single-column width on mobile, retain badges
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.9, 3.10, 8.7_

  - [x] 8.2 Enhance `src/components/effects/ProjectSystemView.tsx` as full-screen product dashboard
    - Full-screen overlay: fixed inset-0, z-[60], bg-[#020617]/95, backdrop-blur-xl
    - Header: status dot (blinking green), "SYSTEM ACTIVE", project name, close button
    - Live metrics panel: 3 cards (API Requests with animated counter, Avg Latency fluctuating ±5ms, Uptime static)
    - Architecture diagram: horizontal flow (Input → AI Router → Voice Engine → Output)
    - Tech stack pills + action links (GitHub, Live Demo)
    - Entrance animation: scale 0.95→1.0 + opacity 0→1 over 300ms
    - Pause all lower-tier rAF loops when open (overlayActive flag in EffectsContext)
    - _Requirements: 3.5, 3.6, 3.7, 3.8_

  - [x] 8.3 Update `src/components/Projects.tsx` with VoiceOwl layout
    - Extra vertical padding: py-32 for Active Systems section
    - Grid layout: grid-cols-2 with VoiceOwl spanning full width (col-span-2)
    - Pass `isFeatured` prop to VoiceOwl card
    - 32px gap between VoiceOwl and standard cards
    - _Requirements: 3.1, 8.7_

- [x] 9. System Log Panel Enhancement
  - [x] 9.1 Enhance `src/components/effects/SystemLogPanel.tsx`
    - Fixed bottom-right (16px inset), 300px width, max 320px height, glassmorphism background
    - Max 8 entries with HH:MM:SS timestamps, color-coded level prefixes (INFO, OK, AI, ACTION)
    - Fade-out animation (250ms) for entries exceeding 8
    - Slide-left + fade entry animation via Framer Motion AnimatePresence
    - Collapsed state on mobile by default (40×40 icon button, unread badge capped at "9+")
    - Minimize/expand with sessionStorage persistence
    - Post-boot timing: first entry at +200ms, second at +1200ms, third at +2500ms, then idle interval (5-8s)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 11.4_

  - [x]* 9.2 Write property tests for log queue behavior
    - **Property 3: Log queue never exceeds maximum size**
    - **Property 4: Log entries are unique per section trigger**
    - **Validates: Requirements 4.2, 4.3, 4.5**

- [x] 10. Checkpoint - Major components complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Background Atmosphere and Particle Enhancements
  - [x] 11.1 Enhance `src/components/effects/AuroraBackground.tsx`
    - Animated gradient blobs: opacity 0.03-0.08, neon-blue and purple, blur 40-80px, 15-30s cycle
    - CSS keyframe animations with will-change: transform (GPU acceleration)
    - Static radial gradient fallback for low performance tier
    - Static gradient for prefers-reduced-motion
    - Disabled when effectsEnabled is false
    - _Requirements: 5.1, 5.5, 5.6, 5.7, 9.2_

  - [x] 11.2 Enhance `src/components/effects/ParticleSystem.tsx`
    - Add cursor parallax offset (max 15px) based on cursor distance from viewport center
    - 60 particles on high/medium, 30 on low tier
    - Connecting lines within 120px (high/medium only), disabled on low
    - Pause rAF loop when tab is hidden, reset timing on resume
    - Static dots for prefers-reduced-motion
    - Disabled when effectsEnabled is false
    - _Requirements: 1.6, 5.3, 5.6, 5.7, 9.1, 9.3, 9.4, 9.8_

  - [x]* 11.3 Write property test for particle count
    - **Property 5: Particle count matches performance tier**
    - **Validates: Requirements 5.3**

- [x] 12. Micro-Interactions and Motion
  - [x] 12.1 Enhance `src/components/effects/MagneticWrapper.tsx`
    - Read mousePosition from EffectsContext (no own listener)
    - Max 8px translation within 60px proximity radius
    - Spring-back to origin over 300ms with easeOut
    - Disabled for prefers-reduced-motion and non-fine pointers
    - _Requirements: 6.1, 6.4, 6.5, 6.7_

  - [x] 12.2 Add 3D tilt effect to ProjectCard
    - CSS perspective container (1000px)
    - Up to 5° tilt on X/Y based on cursor-to-card-center position using `calculateCardTilt`
    - Disabled for prefers-reduced-motion and non-fine pointers
    - _Requirements: 6.2, 6.6, 6.7_

  - [x] 12.3 Enhance `src/components/SectionWrapper.tsx` with stagger animations
    - Entrance: opacity 0→1, y: 50→0, triggered at 30% viewport visibility
    - Stagger children: 150ms between each, 100ms initial delay
    - Max total stagger: 1200ms
    - Duration: 500ms per child with easeOutQuad
    - Trigger once per page load
    - Final-state rendering for prefers-reduced-motion
    - _Requirements: 6.3, 6.6, 12.5, 12.6, 12.7_

  - [x]* 12.4 Write property test for magnetic translation
    - **Property 6: Magnetic translation is bounded by strength and radius**
    - **Validates: Requirements 6.1**

- [x] 13. Tech Graph Enhancement
  - [x] 13.1 Enhance `src/components/effects/TechGraph.tsx`
    - Hover: highlight hovered node + connected nodes at full opacity, dim unrelated to 30%
    - Glow ring on hovered node (1 viewBox unit, category color at 50% opacity)
    - Edge opacity: highlighted=50%, unrelated=5%, idle=15%
    - Idle oscillation: sine-wave 0.2-0.3 viewBox units (disabled on low tier / reduced motion)
    - Restore all to full opacity within 300ms on pointer leave
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x]* 13.2 Write property test for tech graph highlight sets
    - **Property 8: Tech graph highlight set partitions nodes correctly**
    - **Validates: Requirements 7.1**

- [x] 14. Button and Cursor Enhancements
  - [x] 14.1 Enhance `src/components/ui/Button.tsx`
    - Add `.glow-neon-idle` class for primary variant (idle state)
    - Hover: `.glow-neon-hover` class, scale(1.02), border opacity increase
    - Active/pressed: scale(0.98), reduced glow
    - Background: bg-[#00d4ff]/10 idle, bg-[#00d4ff]/15 hover
    - Border: border-[#00d4ff]/30 idle, border-[#00d4ff]/60 hover
    - Transition: all 200ms ease-out
    - _Requirements: 1.7, 8.1, 8.8_

  - [x] 14.2 Enhance `src/components/effects/ContextCursor.tsx` with cursor trail
    - 8-position ring buffer updated every 50ms (throttled)
    - Trail dots: radius 3px, opacity decay (oldest 10% → newest 60%)
    - Blend mode: screen
    - Only active when performanceTier !== 'low' and pointer: fine
    - _Requirements: 6.1, 11.3_

- [x] 15. Performance Optimization and Context Wiring
  - [x] 15.1 Update `src/contexts/EffectsContext.tsx` with shared mouse state and animation coordinator
    - Single RAF-gated mousemove handler (no per-component listeners)
    - AnimationCoordinator class managing all rAF loops
    - `overlayActive` flag to pause background animations when ProjectSystemView is open
    - Merged IntersectionObserver (shared with FocalGlowManager and SectionWrapper)
    - Module count tracking for SystemStatusIndicator
    - _Requirements: 9.1, 9.6, 9.7, 9.8_

  - [x] 15.2 Update `src/hooks/usePerformanceMonitor.ts` with FPS-based downgrade logic
    - Rolling window of 30 frame samples
    - Trigger single downgrade when average FPS < 30
    - Disable all effects if low tier and FPS < 20 for >1000ms
    - _Requirements: 9.6, 9.7_

  - [x]* 15.3 Write property test for FPS downgrade trigger
    - **Property 11: FPS downgrade triggers at threshold**
    - **Validates: Requirements 9.6**

- [x] 16. Page Assembly and Dynamic Imports
  - [x] 16.1 Update `src/app/page.tsx` with full component wiring
    - Add AuroraBackground (dynamic, ssr: false) — fixed inset-0, z-0
    - Add NoiseTexture — fixed inset-0, z-[1], pointer-events-none
    - Add ParticleSystem (dynamic, ssr: false) — fixed, z-1
    - Add SystemStatusIndicator (dynamic, ssr: false) — fixed top-4 right-6, z-40
    - Add SystemLogPanel (dynamic, ssr: false) — fixed bottom-4 right-4, z-50
    - Add FocalGlowManager wrapping content sections
    - Add Dashboard Shell label (fixed top-center, z-40)
    - Ensure all dynamic imports use `{ ssr: false }`
    - Wire BootSequence completion to trigger HUD and label fade-in
    - _Requirements: 2.1, 2.6, 5.7, 9.5, 10.3, 11.4, 11.5, 12.4_

- [x] 17. Checkpoint - Full integration complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Visual Narrative Flow and Final Polish
  - [x] 18.1 Implement scroll-driven narrative flow
    - Ensure section order: BOOT → SYSTEM ONLINE (hero) → MODULES LOADED (skills) → CORE SYSTEM (VoiceOwl) → EXECUTION LOG (experience)
    - Section entrances trigger sequentially with stagger (100-200ms between children)
    - Log entries fire on section visibility per sectionLogs data
    - Module count in HUD updates as sections become visible
    - _Requirements: 12.4, 12.5, 12.6, 4.3_

  - [x] 18.2 Implement visual hierarchy enforcement
    - Hero name at text-7xl (at least 2-3x any other text)
    - Section headings at text-4xl (smaller than hero)
    - VoiceOwl title at text-3xl (smaller than section headings)
    - Standard card titles at text-xl
    - Ensure only designated elements have glow (Button, VoiceOwl hover, SystemViz, TechGraph hover, CTA)
    - _Requirements: 8.4, 8.5, 8.6, 8.7, 8.8, 11.2, 11.7_

- [x] 19. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The project uses TypeScript, Next.js 14, Framer Motion, Tailwind CSS, and fast-check for property testing
- All glow effects MUST use shared CSS utility classes (`.glow-neon-idle`, `.glow-neon-hover`, etc.) — no inline box-shadow
- All cursor-dependent components MUST read from EffectsContext.mousePosition — no per-component mousemove listeners

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3"] },
    { "id": 2, "tasks": ["1.4", "2.1", "3.1", "4.1"] },
    { "id": 3, "tasks": ["6.1", "7.1", "7.2", "8.1"] },
    { "id": 4, "tasks": ["6.2", "8.2", "8.3", "9.1"] },
    { "id": 5, "tasks": ["9.2", "11.1", "11.2"] },
    { "id": 6, "tasks": ["11.3", "12.1", "12.2", "12.3"] },
    { "id": 7, "tasks": ["12.4", "13.1", "14.1", "14.2"] },
    { "id": 8, "tasks": ["13.2", "15.1", "15.2"] },
    { "id": 9, "tasks": ["15.3", "16.1"] },
    { "id": 10, "tasks": ["18.1", "18.2"] }
  ]
}
```
