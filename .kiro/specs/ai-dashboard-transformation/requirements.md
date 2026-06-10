# Requirements Document

## Introduction

Transform the existing Next.js 14 portfolio into a "Live AI System Dashboard" experience. The redesign reframes the portfolio as a real-time system monitoring interface, with the hero acting as an entry point, sections renamed to system-oriented labels, VoiceOwl AI presented as the flagship primary system, and ambient effects (particles, aurora, system logs) providing atmospheric depth. The enhancement builds on existing components (Hero, Projects, Skills, Experience, effects system) rather than rebuilding from scratch.

The experience should not feel like a static portfolio — it should feel like a living system booting up, coming online, and revealing its modules. Every design decision prioritizes emotional impact: dominance, motion, interactivity, and narrative flow.

## Glossary

- **Dashboard_Shell**: The top-level page layout that provides the "SYSTEM DASHBOARD" label and frames all sections as a unified system interface.
- **Hero_Section**: The full-viewport landing area containing identity information, CTA buttons, and the animated system visualization on the right side.
- **System_Visualization**: The animated orb, network graph, or glowing element rendered on the right side of the hero to represent a running AI system.
- **Boot_Overlay**: The existing BootSequence component that displays terminal-style text on initial load before revealing main content.
- **Particle_System**: The canvas-based particle effect layer that renders floating dots and connecting lines, reactive to cursor position.
- **Aurora_Background**: The animated gradient blob layer providing ambient atmospheric color behind content.
- **System_Log_Panel**: The floating bottom-right panel displaying contextual, timestamped log entries in monospace font.
- **Project_Card**: The card component displaying project details (name, tech stack, impact, links).
- **VoiceOwl_Card**: The enhanced, visually dominant Project_Card variant for the VoiceOwl AI flagship project.
- **ProjectSystemView**: The full-screen overlay that opens when the user explores a featured project, presenting it as a live product dashboard with real metrics, architecture diagrams, and system status.
- **Tech_Graph**: The SVG-based interactive graph visualization of skills with nodes, edges, category clusters, and hover highlighting.
- **Magnetic_Wrapper**: The component applying a cursor-following magnetic pull effect to wrapped interactive elements.
- **Noise_Texture**: The subtle grain overlay applied globally for visual texture.
- **Effects_Context**: The React context providing shared effects state (mouse position, performance tier, reduced motion preference).
- **Log_Context**: The React context managing system log entries, minimized state, and unread count.
- **Section_Wrapper**: The component that wraps each portfolio section with scroll-triggered animations and log emission.
- **Performance_Tier**: A classification (high, medium, low) determined by device hardware, controlling effect complexity.
- **System_Status_Indicator**: A persistent global HUD element displaying real-time system health metrics (online status, latency, active module count) to reinforce the live-system feel.
- **Focal_Glow**: The single primary glow area active at any given scroll position, creating visual focus hierarchy by dimming surrounding content relative to the lit focal point.
- **Visual_Narrative_Flow**: The scroll-driven storytelling progression (BOOT → SYSTEM ONLINE → MODULES LOADED → CORE SYSTEM → EXECUTION LOG) that makes the experience feel like a system revealing its components sequentially.

## Requirements

### Requirement 1: Hero Section Redesign as System Entry Point

**User Story:** As a visitor, I want the hero to feel like entering a live system dashboard, so that I immediately understand the developer works on real-time AI backend systems.

#### Acceptance Criteria

1. WHEN the page loads and the Boot_Overlay completes, THE Hero_Section SHALL display a two-column layout with identity content (name, role line, CTA buttons) on the left and the System_Visualization on the right, stacking vertically on viewports below 768px width.
2. THE Hero_Section SHALL occupy exactly 100vh (full viewport height) to establish immediate visual dominance upon entry.
3. THE Hero_Section SHALL display the developer name at a font size of text-7xl on viewports 1024px and above (text-5xl below 1024px), ensuring the name is at least 2x larger than any other text element on the page.
4. THE Hero_Section SHALL display the identity line "I build real-time AI backend systems and scalable architectures." as the tagline text below the developer name, rendered at a subdued opacity of 60-70% to keep visual focus on the name.
5. THE System_Visualization SHALL render an animated network graphic using Framer Motion or canvas, with a pulsing glow effect cycling between neon-blue (#00d4ff) and purple (#8b5cf6) over a 3-second repeating loop.
6. WHEN the user moves the cursor within the Hero_Section viewport, THE Particle_System SHALL apply a parallax offset to particle positions based on cursor coordinates relative to the viewport center, with a maximum displacement of 15px on each axis.
7. THE Hero_Section CTA buttons SHALL be wrapped in Magnetic_Wrapper components with a proximity radius of 60px and a magnetic pull strength of 8px, and SHALL display a neon-blue glow effect (box-shadow 0 0 15px rgba(0, 212, 255, 0.4)) in their idle state to draw attention.
8. WITHIN 3 seconds of the Boot_Overlay completing, THE Hero_Section background SHALL display visible motion through either active particle movement, aurora animation, or System_Visualization pulsing — the hero SHALL NOT appear static at any point after boot.
9. WHILE the Performance_Tier is "low", THE System_Visualization SHALL render a static gradient glow element (no animation frames) instead of the animated network graphic, replacing all motion with a fixed radial gradient using the same neon-blue and purple color values.
10. WHEN the user moves the cursor within the Hero_Section within 3 seconds of page load, THE Particle_System and System_Visualization SHALL visibly react to the cursor movement, creating an immediate sense of interactivity.

### Requirement 2: System Dashboard Framing

**User Story:** As a visitor, I want the portfolio framed as a system dashboard, so that the overall experience feels cohesive and technically themed.

#### Acceptance Criteria

1. THE Dashboard_Shell SHALL render a fixed-position top label centered horizontally at the top of the viewport, displaying "SYSTEM DASHBOARD" in monospace font, uppercase, with 60% opacity and font size of 11px.
2. THE About section heading SHALL display "System Profile" instead of "About Me".
3. THE Skills section heading SHALL display "Tech Network" instead of "Skills".
4. THE Projects section heading SHALL display "Active Systems" instead of "Projects".
5. THE Experience section heading SHALL display "Execution Timeline" instead of "Experience".
6. WHEN the Boot_Sequence completes, THE Dashboard_Shell label SHALL fade in over 500ms with an initial delay of 300ms after Boot_Sequence completion.
7. IF the Boot_Sequence is skipped (due to prefers-reduced-motion: reduce or a returning session visitor), THEN THE Dashboard_Shell label SHALL display immediately in its final visible state without animation.

### Requirement 3: VoiceOwl Flagship Project as Full-Screen System View

**User Story:** As a visitor, I want to experience VoiceOwl AI as a full product dashboard, so that I can understand the scale and sophistication of the developer's flagship work as if viewing a live SaaS application.

#### Acceptance Criteria

1. WHEN viewed on desktop (viewport width 768px or above), THE VoiceOwl_Card SHALL span the full width of the projects grid (2 columns) and render at a minimum vertical height of 1.5x the height of standard Project_Cards.
2. THE VoiceOwl_Card SHALL display a "[PRIMARY SYSTEM]" label badge in neon-blue (#00d4ff) positioned above the project name.
3. THE VoiceOwl_Card SHALL display the following metrics inline as visually distinct badge elements with a background fill and border: "2M+ daily API requests", "Real-time AI call routing", and "99.9% uptime".
4. WHEN the user hovers over the VoiceOwl_Card on a pointer-enabled device, THE VoiceOwl_Card SHALL display an animated gradient border cycling between neon-blue and purple over a 3-second animation duration, and a box-shadow glow of 20px spread with neon-blue at 25% opacity.
5. WHEN the user clicks the "Explore System →" button on the VoiceOwl_Card, THE ProjectSystemView SHALL open as a full-screen overlay (100vw × 100vh) that dominates the entire viewport, NOT as a small modal or card.
6. THE ProjectSystemView for VoiceOwl SHALL render as a multi-panel product dashboard layout containing: a header with system status and project name, a live metrics panel showing animated counters (API requests, response time, uptime), an architecture diagram panel, a technology stack panel, and action links (GitHub, Live Demo).
7. THE ProjectSystemView SHALL feel like a SaaS product dashboard — with distinct panel regions, live-updating metric animations, and a visual density that communicates "real running system" rather than a project description card.
8. THE ProjectSystemView SHALL display simulated live activity indicators: a blinking green status dot, incrementing request counters (animated over 2 seconds), and a latency metric that fluctuates by ±5ms every 3 seconds.
9. THE standard Project_Cards (non-featured) SHALL render with 70% border opacity and no animated gradient border.
10. WHEN viewed on mobile (viewport width below 768px), THE VoiceOwl_Card SHALL render at full single-column width and retain the "[PRIMARY SYSTEM]" badge and metric badges, remaining visually differentiated from standard Project_Cards through its badge elements and larger minimum height.

### Requirement 4: System Log Panel Enhancement

**User Story:** As a visitor, I want the system log to feel alive and responsive to my interactions, so that the dashboard experience feels real-time.

#### Acceptance Criteria

1. THE System_Log_Panel SHALL render as a fixed-position panel anchored to the bottom-right corner (16px inset) with a width of 300px, a maximum height of 320px, a dark glassmorphism background (black at 70% opacity with 12px backdrop blur), and a 1px border at 15% white opacity.
2. THE System_Log_Panel SHALL use monospace font for all log entries and display a maximum of 8 entries at any time, with each entry showing a HH:MM:SS timestamp, a color-coded level prefix (INFO, OK, AI, or ACTION), and the message text.
3. WHEN the user scrolls a new section into view for the first time, THE System_Log_Panel SHALL append the corresponding log entry from the sectionLogs data matching that section's identifier, without duplicating entries for previously visited sections within the same session.
4. WHEN the user hovers over a Project_Card, THE System_Log_Panel SHALL append the corresponding log entry from the projectLogs data matching that project's identifier.
5. WHEN log entries exceed 8, THE System_Log_Panel SHALL remove the oldest entry with a fade-out animation over 250ms before appending the new entry.
6. WHEN new entries are added, THE System_Log_Panel SHALL animate them in with a slide-left (20px to 0px) plus fade (0 to 1 opacity) effect over 250ms using Framer Motion AnimatePresence.
7. WHILE the viewport width is below 768px, THE System_Log_Panel SHALL render in a collapsed (minimized) state by default, displaying a 40px by 40px icon button in the bottom-right corner instead of the full panel.
8. WHEN the user clicks the minimize button, THE System_Log_Panel SHALL collapse to an icon button, persist the minimized state in sessionStorage, and display an unread count badge (capped at "9+") showing entries received while minimized.
9. WHEN the user clicks the collapsed icon button, THE System_Log_Panel SHALL expand to its full panel view, clear the unread count to zero, and persist the expanded state in sessionStorage.
10. WITHIN 3 seconds of page load, THE System_Log_Panel SHALL begin showing activity (boot log entries or system status messages), ensuring the visitor sees live log updates without needing to scroll or interact.

### Requirement 5: Background Atmosphere System

**User Story:** As a visitor, I want a subtle, atmospheric background that adds depth without distracting from content, so that the dashboard feels immersive.

#### Acceptance Criteria

1. THE Aurora_Background SHALL render animated gradient blobs at opacity levels between 0.03 and 0.08, using neon-blue and purple colors with blur radii of 40-80px, cycling positions over animation durations of 15-30 seconds per blob.
2. THE Noise_Texture SHALL render a fixed-position, full-viewport grain overlay at 3-5% opacity using a repeating SVG noise pattern.
3. THE Particle_System SHALL render 60 particles on high and medium Performance_Tiers and 30 particles on low Performance_Tier, with connecting lines drawn between particles within 120px of each other enabled only on high and medium Performance_Tiers.
4. THE background color of the page body SHALL be deep dark (#020617).
5. WHILE the Performance_Tier is "low" (device has 2 or fewer logical CPU cores), THE Aurora_Background SHALL render a static radial gradient instead of animated blobs.
6. WHILE the user has prefers-reduced-motion enabled, THE Particle_System SHALL render particles as static dots without animation, and THE Aurora_Background SHALL display a static gradient.
7. IF effects are globally disabled (effectsEnabled is false), THEN THE Aurora_Background, Noise_Texture, and Particle_System SHALL not render any visual output.

### Requirement 6: Micro-Interactions and Motion

**User Story:** As a visitor, I want subtle, responsive micro-interactions on interactive elements, so that the interface feels polished and reactive.

#### Acceptance Criteria

1. WHEN the user hovers over a CTA button wrapped in Magnetic_Wrapper, THE button element SHALL translate toward the cursor position by a maximum of 8px within a 60px proximity radius.
2. WHEN the user hovers over any Project_Card, THE Project_Card SHALL apply a CSS 3D perspective tilt of up to 5 degrees on the X and Y axes based on cursor position relative to the card center.
3. WHEN a Section_Wrapper element enters the viewport by at least 30% visibility, THE Section_Wrapper SHALL perform a fade-in entrance animation (opacity 0 to 1 with a 40px directional translate) using a duration between 300ms and 600ms with easeOut easing, and the animation SHALL trigger only once per page load.
4. WHEN the cursor leaves a Magnetic_Wrapper element, THE element SHALL spring back to its origin position over 300ms with easeOut easing.
5. WHILE the user has prefers-reduced-motion enabled, THE Magnetic_Wrapper SHALL disable the magnetic pull effect and remain at its origin position.
6. WHILE the user has prefers-reduced-motion enabled, THE Project_Card SHALL disable the 3D tilt effect, and THE Section_Wrapper SHALL render its content in the final visible state without animating.
7. IF the user's pointing device is not a fine pointer (e.g., touch devices), THEN THE Magnetic_Wrapper SHALL disable the magnetic pull effect, and THE Project_Card SHALL disable the 3D tilt effect.

### Requirement 7: Skills Section Network Visualization

**User Story:** As a visitor, I want the skills graph to feel like a network map with meaningful hover interactions, so that I can explore technology relationships.

#### Acceptance Criteria

1. WHEN the user hovers over a Tech_Graph node, THE Tech_Graph SHALL highlight the hovered node and all directly connected nodes (as defined by the node's connections array) at full opacity (1.0), and dim all unrelated nodes to 30% opacity, with the transition completing within 300ms.
2. WHEN the user hovers over a Tech_Graph node, THE hovered node SHALL display a glow ring extending 1 viewBox unit beyond the node radius, using its category border color at 50% opacity.
3. WHEN the user hovers over a Tech_Graph node, THE connecting edges between highlighted nodes SHALL transition to 50% opacity, while unrelated edges SHALL reduce to 5% opacity; idle edges (no node hovered) SHALL render at 15% opacity.
4. WHILE no Tech_Graph node is hovered, THE Tech_Graph nodes SHALL oscillate with a sine-wave animation of 0.2–0.3 viewBox units amplitude, creating a breathing network effect.
5. WHILE the Performance_Tier is "low" or reduced motion preference is active, THE Tech_Graph SHALL disable idle oscillation and render nodes in their final simulation-settled positions without animation.
6. WHEN the user moves the pointer away from a hovered Tech_Graph node, THE Tech_Graph SHALL restore all nodes to full opacity and all edges to 15% idle opacity within 300ms.

### Requirement 8: Visual Hierarchy, Color System, and Hero Dominance

**User Story:** As a visitor, I want a clear visual hierarchy with strategic use of color and glow effects where the hero and flagship project dominate the visual space, so that important elements stand out without visual noise.

#### Acceptance Criteria

1. THE color system SHALL use neon-blue (#00d4ff) as the primary accent color for interactive elements (buttons, links, navigation items), text highlights, and the VoiceOwl_Card border glow.
2. THE color system SHALL use purple (#8b5cf6) as the secondary accent for gradients, Tech_Graph category coloring, and the System_Visualization pulse.
3. THE page background SHALL use deep dark (#020617) as the base color.
4. THE Hero_Section SHALL have the largest visual weight on the page, achieved through full-viewport height (100vh), a System_Visualization occupying at least 40% of the Hero_Section's visible area, and the developer name rendered at text-7xl (at least 2-3x the size of any other text on the page) on viewports 1024px and above.
5. THE Hero_Section secondary text (tagline, subtitle) SHALL render at no more than 70% opacity relative to the name, ensuring the name is the unchallenged focal point of the hero.
6. THE Portfolio_System SHALL apply a descending font-size hierarchy for section headings: text-4xl for section titles on viewports 1024px and above (text-3xl below 1024px), ensuring all section headings are visually smaller than the Hero heading.
7. THE VoiceOwl_Card SHALL be the dominant element within the Active Systems section through its 2-column span, a minimum height of 1.5x the height of adjacent single-column cards, an animated neon-blue border, and a visible "PRIMARY SYSTEM" label.
8. THE glow effects (box-shadow with neon-blue or purple, blur radius between 10px and 30px) SHALL be applied only to the VoiceOwl_Card hover state, the System_Visualization pulse, Tech_Graph hovered nodes, CTA button idle and hover states, and the Hero_Section Focal_Glow — no other elements SHALL display glow box-shadow effects.

### Requirement 9: Performance Optimization

**User Story:** As a visitor on any device, I want the dashboard to run smoothly at 60fps, so that animations enhance rather than hinder the experience.

#### Acceptance Criteria

1. THE Particle_System animation loop SHALL render particles via canvas 2D context using lightweight draw calls (arc, fill) without triggering DOM layout recalculations, and SHALL pause the requestAnimationFrame loop when the browser tab's visibilityState is "hidden".
2. THE Aurora_Background animated blobs SHALL use CSS keyframe animations with will-change: transform for GPU acceleration rather than JavaScript-driven position updates.
3. WHEN the Performance_Tier downgrades from high to medium, THE Particle_System SHALL disable connecting line rendering between particles, and THE System_Visualization SHALL reduce its animation to a slower pulse cycle (at least 50% longer duration than the high-tier animation).
4. WHEN the Performance_Tier downgrades from medium to low, THE Particle_System SHALL reduce particle count to 30, THE Aurora_Background SHALL switch to a static gradient with no CSS animation running, and THE System_Visualization SHALL render as a static glow element with no animated properties.
5. THE System_Log_Panel, ProjectSystemView, TechGraph, BootSequence, ContextCursor, and ParticleSystem components SHALL be loaded via Next.js dynamic imports with ssr: false to reduce initial bundle size.
6. IF the average frame rate drops below 30fps over a rolling window of 30 consecutive frame samples, THEN THE Effects_Context SHALL trigger a single Performance_Tier downgrade (high to medium, medium to low, or low to effects disabled).
7. IF the Performance_Tier is already "low" and the average frame rate remains below 20fps for more than 1000ms, THEN THE Effects_Context SHALL disable all visual effects entirely by setting effectsEnabled to false.
8. WHEN the browser tab's visibilityState changes from "hidden" to "visible", THE Particle_System SHALL reset its frame timing reference to avoid a large delta spike on the first frame after resuming.

### Requirement 10: System State Feeling

**User Story:** As a visitor, I want to see a persistent global system status indicator, so that the portfolio feels like a real running system rather than a static website.

#### Acceptance Criteria

1. THE System_Status_Indicator SHALL render as a persistent, fixed-position HUD element visible at all scroll positions, displaying three metrics: connection status ("● ONLINE" with a green dot), latency (e.g., "LATENCY: 32ms"), and active module count (e.g., "MODULES: 6 ACTIVE").
2. THE System_Status_Indicator SHALL use monospace font, uppercase text, and a font size of 10-11px with 70% opacity to remain visible without competing with primary content.
3. WHEN the page loads, THE System_Status_Indicator SHALL animate in after the Boot_Overlay completes, fading from 0 to its final opacity over 400ms.
4. THE System_Status_Indicator latency value SHALL fluctuate by ±5ms every 2-4 seconds to simulate real network jitter, reinforcing the live-system illusion.
5. WHEN the user scrolls to a new section, THE System_Status_Indicator module count SHALL update to reflect the number of sections currently loaded/visible, reinforcing that the system is tracking state.
6. WHILE the viewport width is below 768px, THE System_Status_Indicator SHALL render in a compact single-line format showing only the status dot and "ONLINE" text to conserve screen space.

### Requirement 11: First Impression Impact

**User Story:** As a recruiter viewing this portfolio, I should be impressed within 5 seconds without scrolling, so that the developer's technical capability is immediately evident through the quality of the experience itself.

#### Acceptance Criteria

1. THE Hero_Section SHALL occupy exactly 100vh (full viewport height), ensuring no other content is visible above the fold on initial load.
2. THE developer name SHALL be the visually dominant element on screen, rendered at a minimum of 2x the font size of any other visible text element within the Hero_Section.
3. WITHIN 1 second of the user's first mouse movement after page load, THE Hero_Section SHALL display a visible interactive response (particle parallax shift, System_Visualization reaction, or cursor-following effect).
4. WITHIN 3 seconds of the Boot_Overlay completing, THE System_Log_Panel SHALL display at least 2 log entries showing system activity.
5. WITHIN 3 seconds of the Boot_Overlay completing, THE Hero_Section background SHALL display visible continuous motion (particles moving, aurora animating, or System_Visualization pulsing).
6. THE Hero_Section SHALL NOT display a fully static screen for longer than 2 seconds after the Boot_Overlay completes — at least one animated element SHALL be visibly in motion at all times.
7. THE combination of full-viewport hero, oversized typography, glowing CTA, visible motion, and live system logs SHALL create an immediate impression of technical sophistication without requiring any scroll or click interaction.

### Requirement 12: Visual Contrast, Focus Rules, and Storytelling Flow

**User Story:** As a visitor, I want the scroll experience to feel like a system coming alive and revealing its modules sequentially, so that the portfolio tells a story rather than presenting disconnected sections.

#### Acceptance Criteria

1. THE Portfolio_System SHALL maintain only one primary Focal_Glow area at any given scroll position — either the Hero_Section or the VoiceOwl_Card section — determined by which element is closest to viewport center.
2. WHILE the Focal_Glow is on the Hero_Section, THE remaining visible sections SHALL render at a reduced brightness (70-80% opacity or a subtle dimming overlay) relative to the Hero_Section.
3. WHILE the Focal_Glow is on the VoiceOwl_Card section, THE surrounding Project_Cards and adjacent sections SHALL render at reduced brightness (70-80% opacity) relative to the VoiceOwl_Card.
4. THE scroll experience SHALL follow the Visual_Narrative_Flow progression: BOOT (loading overlay) → SYSTEM ONLINE (hero reveals with status indicator) → MODULES LOADED (skills network animates in) → CORE SYSTEM (VoiceOwl flagship dominates) → EXECUTION LOG (experience timeline).
5. WHEN the user scrolls from one narrative phase to the next, THE transition SHALL feel like a system revealing its next module — each section SHALL animate in with a purposeful entrance (fade + translate) rather than simply appearing as the user scrolls.
6. THE Section_Wrapper entrance animations SHALL trigger sequentially with staggered timing (100-200ms delay between child elements) to create a "system loading modules" effect rather than all content appearing simultaneously.
7. WHILE the user has prefers-reduced-motion enabled, THE Focal_Glow dimming effect SHALL still apply (as it is opacity-based, not motion-based), but section entrance animations SHALL render in their final state without motion.
