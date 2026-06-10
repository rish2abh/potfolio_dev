# Requirements Document

## Introduction

A complete experiential transformation of Rishabh Shrivastava's Next.js portfolio website from a standard developer portfolio into a "live AI system dashboard" — an interactive, product-like experience that visually demonstrates backend and AI engineering thinking. The portfolio should feel like a running system, not a static website, and should impress recruiters within 5 seconds by showcasing real engineering depth through interactive architecture diagrams, system boot sequences, live log panels, and an AI assistant.

The enhancement builds on the existing tech stack (Next.js 14, TypeScript, Tailwind CSS, Framer Motion) and adds canvas/WebGL where needed for particle effects. All effects must maintain 90+ Lighthouse desktop score and respect reduced-motion preferences.

## Glossary

- **Portfolio_System**: The transformed Next.js web application that presents itself as a live AI system dashboard
- **Boot_Sequence**: A terminal-style animated loading experience in the Hero section that simulates system initialization before revealing the main content
- **System_Log_Panel**: A floating UI panel that displays contextual, dynamically updating log messages based on user interactions
- **Project_System_View**: An interactive full-screen or expanded view for each project that displays architecture diagrams, animated data flows, and engineering decision panels
- **Architecture_Diagram**: An interactive node-graph visualization showing system components (User, Backend API, AI Engine, Database, External APIs) and their connections
- **Flow_Simulation**: An animated visualization showing data/request flow between architecture nodes with pulses and transitions
- **Engineering_Insight_Panel**: A toggleable panel within a Project_System_View that explains technical decisions (why specific technologies were chosen, scaling approaches)
- **Tech_Graph**: A network graph visualization of technical skills showing relationships and connections between technologies
- **AI_Assistant**: A floating chat widget that answers visitor questions about the developer's projects, experience, and tech stack
- **Spotlight_Effect**: A radial gradient light effect that follows the mouse position, illuminating nearby content
- **Magnetic_Element**: An interactive element that visually pulls toward the cursor when the cursor is within a defined proximity radius
- **Context_Cursor**: A cursor that changes its label or appearance based on what element it hovers over (e.g., "Explore" on projects, "Open" on links)
- **Aurora_Background**: An animated gradient background with soft, flowing color transitions at low opacity
- **Noise_Texture**: A subtle static grain overlay applied via CSS or SVG filter to add visual depth
- **Particle_System**: The enhanced canvas-based particle animation with mouse interaction and depth layers
- **Visitor**: Any person viewing the portfolio website (recruiter, hiring manager, or peer)
- **Quick_View_Mode**: A recruiter-optimized toggle that strips all effects and shows a scannable summary of key information in 10-20 seconds
- **Brand_Voice**: The consistent personality and positioning expressed through copy, headings, and AI assistant interactions that makes the portfolio memorable
- **Impact_Metrics**: Quantifiable outcomes (scale, performance, business results) displayed per project and experience entry
- **Fallback_Mode**: A static, effect-free version of the portfolio that activates on JS failure, weak devices, or sustained performance drops

## Experience Priority Layers (WOW Moment Hierarchy)

All effects are NOT equal. This defines the impact priority to prevent overbuilding low-impact features:

### 🏆 Primary WOW (Must be perfect — recruiter-stopping moments)
1. **Project System View** — The flagship interactive architecture experience (Requirement 3)
2. **Boot Sequence** — First 2 seconds set the tone (Requirement 1)

### 🥈 Secondary Enhancers (Strong but controlled scope)
3. Live System Log Panel (Requirement 2)
4. Tech Skills Graph (Requirement 4)

### 🎨 Support Effects (Polish, don't over-invest)
5. Context Cursor & Magnetic Elements (Requirement 6)
6. Particle System & Aurora (Requirement 7)
7. Animated Borders & Card Effects (Requirement 9)
8. AI Assistant (Requirement 5)

> **Development rule:** If time is constrained, Primary WOW items must be flawless before touching Secondary or Support layers. Support effects should be the first things cut if performance degrades.

---

## Requirements

### Requirement 1: System Boot Hero Experience

**User Story:** As a Visitor, I want the portfolio to greet me with a terminal-style boot sequence that morphs into the main hero content, so that I immediately understand this developer builds systems, not just websites.

#### Acceptance Criteria

1. WHEN the Portfolio_System loads for the first time in a session, THE Boot_Sequence SHALL display a terminal-style animation showing system initialization messages (such as "Initializing system...", "Loading backend modules...", "Connecting AI services...", "System ready.") typed character-by-character at a rate of 30 to 50 characters per second
2. THE Boot_Sequence SHALL complete its full animation within 1500ms to 2000ms from page load, then smoothly morph (cross-fade and translate) into the Hero content showing name, role, and CTA buttons within an additional 500ms transition
3. WHEN the Boot_Sequence completes, THE Hero section SHALL display "Rishabh Shrivastava" with a brief character-scramble settle effect, the role text, and all CTA buttons in their final interactive state
4. WHILE the Boot_Sequence is animating, THE Portfolio_System SHALL display a minimal dark terminal-style container with a monospace font, a blinking cursor indicator, and a subtle green or neon-blue text color
5. IF the Visitor has previously completed the boot sequence in the same browser session (tracked via sessionStorage), THEN THE Portfolio_System SHALL skip the Boot_Sequence and display the Hero content immediately
6. IF the Visitor has enabled prefers-reduced-motion: reduce, THEN THE Boot_Sequence SHALL be skipped and the Hero content SHALL display immediately without animation
7. WHEN the Visitor moves the mouse during or after the Boot_Sequence, THE Particle_System in the background SHALL respond to mouse position by repelling nearby particles within a 150px radius

### Requirement 2: Live System Log Panel

**User Story:** As a Visitor, I want to see a floating log panel that updates based on my interactions, so that the portfolio feels like a live running system I am interacting with.

#### Acceptance Criteria

1. THE System_Log_Panel SHALL render as a fixed-position, semi-transparent panel (positioned at the bottom-right of the viewport on desktop, collapsible on mobile) with a monospace font displaying timestamped log entries
2. WHEN the Visitor scrolls to a new section, THE System_Log_Panel SHALL append a contextual log entry (e.g., "[INFO] Navigating to Projects module", "[LOAD] Rendering experience timeline")
3. WHEN the Visitor hovers over or clicks on a project card, THE System_Log_Panel SHALL append a project-specific log entry (e.g., "[AI] Loading VoiceOwl architecture", "[API] Fetching system metrics")
4. THE System_Log_Panel SHALL display a maximum of 8 visible log entries at any time, with older entries fading out as new entries are added
5. THE System_Log_Panel SHALL include a minimize/close toggle that collapses the panel to a small icon, and the panel state SHALL persist within the session
6. WHEN viewed on mobile (viewport below 768px), THE System_Log_Panel SHALL render in a collapsed state by default with a small indicator showing new log count
7. THE System_Log_Panel log entries SHALL use color-coded prefixes: blue for [INFO], green for [OK], yellow for [AI], purple for [ACTION]

### Requirement 3: Interactive Project System View

**User Story:** As a Visitor, I want each project to expand into a full interactive system view with architecture diagrams and animated data flows, so that I can understand the engineering depth behind each project.

#### Acceptance Criteria

1. WHEN the Visitor clicks or taps "Explore System" on a project card, THE Project_System_View SHALL expand into a full-width view (or modal overlay) displaying three panels: Architecture Diagram, Flow Simulation, and Engineering Insights
2. THE Architecture_Diagram SHALL render interactive nodes representing system components (User, Backend API, AI Engine, Database, External APIs) connected by lines indicating data flow relationships, with each node displaying its component label
3. WHEN the Visitor hovers over a node in the Architecture_Diagram, THE node SHALL expand to reveal: the specific technologies used for that component, the component's role in the system, and key technical decisions made for that component
4. THE Flow_Simulation SHALL animate a visual pulse or particle moving along the connection paths between nodes in the sequence: User → Backend API → AI Engine → Decision → Response, with each step highlighted for 400ms to 600ms before moving to the next
5. THE Flow_Simulation SHALL loop continuously while the Project_System_View is open, with a 2-second pause between each full cycle
6. WHEN the Visitor toggles "Show Engineering Thinking" in the Engineering_Insight_Panel, THE panel SHALL display explanations for key decisions (e.g., "Why Node.js?", "Why MongoDB?", "Why SSE for real-time?", "Scaling approach") as expandable accordion items, where EACH insight MUST follow the Problem → Decision → Tradeoff → Outcome structure:
   - **Problem**: What engineering challenge existed (1 sentence)
   - **Decision**: What was chosen and why (1 sentence)
   - **Tradeoff**: What alternative was considered and why it was rejected (1 sentence)
   - **Outcome**: Measurable result or system benefit (1 sentence)
   
   Example: "Why SSE?" → Problem: Needed real-time dashboard updates without heavy infra. Decision: Server-Sent Events chosen for unidirectional streaming. Tradeoff: WebSockets considered but overkill for one-way data. Outcome: Reduced complexity, stable streaming at 150K+ daily users.
7. WHEN the Visitor clicks a close button or presses Escape, THE Project_System_View SHALL smoothly collapse back to the card view within 400ms
8. THE Project_System_View SHALL be implemented for the VoiceOwl AI project with FULL architecture data (all nodes, detailed flows, complete engineering insights). Other projects SHALL display SIMPLIFIED system views with: a basic architecture diagram (3-4 nodes max), one flow animation, and 2 engineering insights. This prevents overengineering non-flagship projects.

### Requirement 4: Interactive Tech Skills Graph

**User Story:** As a Visitor, I want to see skills as an interactive network graph showing how technologies connect to each other, so that I can understand the breadth and depth of technical expertise.

#### Acceptance Criteria

1. THE Tech_Graph SHALL render skills as nodes in a force-directed or manually positioned network layout, with connecting edges between related technologies (e.g., Node.js connected to Express, MongoDB, APIs, AWS)
2. WHEN the Visitor hovers over a skill node, THE Tech_Graph SHALL highlight all directly connected nodes and their connecting edges while dimming unrelated nodes to 30% opacity
3. WHEN the Visitor hovers over a skill node, THE Tech_Graph SHALL display a tooltip showing: skill proficiency level, years of experience, and names of projects that use this technology
4. THE Tech_Graph SHALL organize nodes into visual clusters matching the existing skill categories (Backend, Database, Cloud, AI/Systems) with each cluster occupying a distinct spatial region
5. THE Tech_Graph SHALL animate node positions with subtle floating motion (2-4px oscillation) when idle, and SHALL settle nodes smoothly when the Visitor interacts with them
6. WHEN viewed on mobile (viewport below 768px), THE Tech_Graph SHALL adapt to a simplified vertical layout with grouped nodes rather than a force-directed spread, maintaining touch interaction for node selection

### Requirement 5: AI Assistant Chat Widget

**User Story:** As a Visitor, I want to ask questions about the developer through a chat interface, so that I can quickly get answers about projects, experience, and capabilities without reading the entire page.

#### Acceptance Criteria

1. THE AI_Assistant SHALL render as a floating button (bottom-left or bottom-right, non-overlapping with the System_Log_Panel) that expands into a chat panel when clicked
2. WHEN the Visitor sends a message, THE AI_Assistant SHALL respond with contextual answers about Rishabh's projects, tech stack, experience, and capabilities based on pre-defined data from the portfolio content
3. THE AI_Assistant SHALL support answering questions in these categories: project details ("Tell me about VoiceOwl"), technical capabilities ("What databases does he know?"), experience ("How much experience?"), and availability ("How to contact?")
4. THE AI_Assistant SHALL display responses with a typewriter-style animation at 20 to 40 characters per second to simulate a conversational AI feel
5. THE AI_Assistant SHALL use a local rule-based or keyword-matching system (no external AI API calls required) that maps common question patterns to pre-written answers derived from the portfolio data files
6. IF the AI_Assistant cannot match a question to any known pattern, THEN THE AI_Assistant SHALL respond with a helpful fallback message directing the Visitor to relevant sections or the contact form
7. THE AI_Assistant panel SHALL display a maximum of 20 messages in the conversation history and SHALL include a close button to dismiss the panel
8. WHEN the AI_Assistant is first opened, THE AI_Assistant SHALL display a welcome message with 3 suggested questions the Visitor can click to get started

### Requirement 6: Context-Aware Cursor and Magnetic Elements

**User Story:** As a Visitor on desktop, I want interactive elements to respond magnetically to my cursor and the cursor to change based on context, so that the interface feels tactile and alive.

#### Acceptance Criteria

1. THE Context_Cursor SHALL render as a custom dot (8px) with a larger ring (32px) that follows with an 80ms to 120ms delay, using neon-blue (#00d4ff) color
2. WHEN the Visitor hovers over a project card, THE Context_Cursor ring SHALL display the label "Explore" adjacent to the cursor ring
3. WHEN the Visitor hovers over an external link, THE Context_Cursor ring SHALL display the label "Open" adjacent to the cursor ring
4. WHEN the Visitor hovers over a button, THE Context_Cursor ring SHALL scale up to 1.5x its default diameter
5. WHEN the Visitor's cursor enters within a 60px proximity radius of a Magnetic_Element (CTA buttons in Hero, navigation links), THE Magnetic_Element SHALL translate toward the cursor position by up to 8px using CSS transform
6. WHEN the Visitor's cursor exits the proximity radius, THE Magnetic_Element SHALL return to its original position within 300ms using ease-out timing
7. THE Context_Cursor and Magnetic_Element interactions SHALL only render on devices with a fine pointer (pointer: fine media query), preserving native behavior on touch devices
8. THE Context_Cursor SHALL use pointer-events: none so it does not interfere with clicking underlying elements

### Requirement 7: Visual Atmosphere (Aurora, Particles, Grain)

**User Story:** As a Visitor, I want the background to have layered atmospheric effects — aurora gradients, interactive particles, and film grain — so that the dark theme feels alive and cinematic.

#### Acceptance Criteria

1. THE Aurora_Background SHALL render animated gradient blobs using at least three color stops from the neon-blue and neon-purple palette at opacity between 0.03 and 0.08, with CSS blur of 40px to 80px, cycling through positions over 15 to 30 seconds
2. THE Particle_System SHALL render at least 50 particles with connecting lines drawn between particles within 120px of each other, and SHALL repel particles within 150px of the cursor
3. THE Noise_Texture SHALL render as a full-viewport fixed overlay using an SVG noise filter or tiled PNG at opacity between 0.02 and 0.05, adding less than 10KB to page payload
4. ALL atmospheric effects SHALL be layered behind interactive content (z-index below main content) and SHALL use pointer-events: none
5. WHEN a canvas-based effect detects sustained frame drops below 30fps for more than 500ms, THE effect SHALL reduce complexity (lower particle count or disable connecting lines) to recover performance
6. WHEN the Visitor has enabled prefers-reduced-motion: reduce, THE Aurora_Background SHALL display as a static gradient, the Particle_System SHALL display static dots without movement, and the Noise_Texture SHALL remain static

### Requirement 8: Section Transitions and Staggered Animations

**User Story:** As a Visitor, I want smooth transitions between sections and cascading entrance animations for lists, so that content reveals feel polished and the scroll experience is premium.

#### Acceptance Criteria

1. WHEN a section containing multiple child items (skills graph nodes, project cards, experience entries) enters the viewport, THE Portfolio_System SHALL animate each child element sequentially with 50ms to 100ms stagger delay, using fade-up-and-scale for grid items and slide-in for timeline entries
2. THE staggered animation total duration for a group SHALL not exceed 1200ms regardless of child count, proportionally adjusting delay for groups larger than 12 items
3. WHEN the Visitor clicks an anchor link (navigation, CTA buttons), THE Portfolio_System SHALL smooth-scroll to the target section using an ease-out timing curve with duration proportional to distance (300ms to 800ms)
4. THE Portfolio_System SHALL implement section heading animations that reveal text word-by-word with 80ms stagger between words, completing within 800ms of entering the viewport
5. ALL entrance animations SHALL trigger only once per page load using intersection observer with once: true
6. IF the Visitor has enabled prefers-reduced-motion: reduce, THEN ALL staggered animations SHALL be skipped and content SHALL display immediately in its final state

### Requirement 9: Animated Borders and Card Effects

**User Story:** As a Visitor, I want featured cards to have animated gradient borders and 3D tilt effects, so that interactive elements feel premium and tactile.

#### Acceptance Criteria

1. THE Portfolio_System SHALL apply animated SVG border effects to the VoiceOwl AI project card and the contact form container, using a gradient stroke transitioning between neon-blue and neon-purple that flows along the card perimeter with a 3 to 6 second cycle
2. WHEN the Visitor moves the pointer over a project card, THE card SHALL rotate on X and Y axes proportional to pointer offset from card center, with maximum 12 degrees rotation and a CSS perspective value between 800px and 1200px
3. WHEN the pointer leaves a tilted card, THE card SHALL smoothly return to flat (0 degrees) within 400ms using ease-out timing
4. WHEN the Visitor hovers over a card with an animated border, THE animation speed SHALL increase by 2x for the hover duration
5. WHEN the Portfolio_System detects a touch-only device, THE 3D tilt interaction SHALL be disabled and replaced with the existing hover scale effect
6. IF the Visitor has enabled prefers-reduced-motion: reduce, THEN animated borders SHALL display as static gradient borders and 3D tilt SHALL be disabled

### Requirement 10: Performance and Device Adaptation

**User Story:** As a developer, I want all visual enhancements to maintain performance standards and gracefully degrade on limited devices, so that the experience remains fast and accessible for all visitors.

#### Acceptance Criteria

1. THE Portfolio_System SHALL maintain a Lighthouse Performance score of 90 or above on desktop and 85 or above on mobile after all effects are implemented
2. THE Portfolio_System SHALL maintain a Cumulative Layout Shift (CLS) score of 0.1 or below
3. ALL animation effects SHALL use GPU-accelerated CSS properties (transform, opacity, filter) exclusively and SHALL not trigger layout recalculations during animation
4. ALL creative effect components (Particle_System, Aurora_Background, System_Log_Panel, AI_Assistant, Context_Cursor, Tech_Graph) SHALL be loaded via dynamic imports with ssr: false to prevent hydration mismatches and reduce initial bundle size
5. IF the Visitor's device reports navigator.hardwareConcurrency of 2 or fewer cores, THEN THE Portfolio_System SHALL disable particle connecting lines, the Context_Cursor trail, the Spotlight_Effect, and the Flow_Simulation auto-loop
6. THE Boot_Sequence, System_Log_Panel, and AI_Assistant SHALL add no more than 50KB combined to the JavaScript bundle (gzipped)
7. WHEN any canvas or requestAnimationFrame-based animation is running in a background tab, THE animation SHALL pause to reduce CPU and GPU usage

### Requirement 11: Accessibility and Reduced Motion

**User Story:** As a Visitor with motion sensitivities or assistive technology, I want to access all portfolio content without being affected by animations, so that I can evaluate the developer's work comfortably.

#### Acceptance Criteria

1. WHEN the Visitor's system reports prefers-reduced-motion: reduce, THE Portfolio_System SHALL disable all continuous animations (Boot_Sequence, particle movement, Aurora_Background, animated borders, Flow_Simulation, noise shifting) and display static equivalents
2. WHEN the Visitor's system reports prefers-reduced-motion: reduce, THE Portfolio_System SHALL disable the Context_Cursor, Magnetic_Element, 3D tilt, and Spotlight interactions entirely, preserving native browser cursor and click behavior
3. WHEN the Visitor's system reports prefers-reduced-motion: reduce, THE Portfolio_System SHALL skip all entrance animations (stagger, text reveal) and display content immediately in its final visible state
4. ALL creative effects SHALL remain decorative and SHALL not convey information that would be lost when effects are disabled
5. THE AI_Assistant chat panel SHALL be fully keyboard-navigable with proper focus management: focus moves into the panel when opened, the input field receives focus, and focus returns to the trigger button when closed
6. THE Project_System_View SHALL be accessible via keyboard: Enter or Space to open, Escape to close, and Tab to navigate between Architecture nodes and Engineering Insight accordion items

### Requirement 12: Recruiter Quick Scan Mode

**User Story:** As a Recruiter with limited time, I want a quick summary toggle that shows key information at a glance, so that I can evaluate this candidate in 10-20 seconds without navigating through immersive effects.

#### Acceptance Criteria

1. THE Portfolio_System SHALL display a persistent "⚡ Quick View" toggle button in the top navigation area, visible on all viewport sizes
2. WHEN the Visitor activates Quick View mode, THE Portfolio_System SHALL immediately replace the immersive layout with a clean, scannable summary displaying: years of experience, current role and company, tech stack (top 8 technologies as tags), key projects (name + one-line impact only), and a contact CTA
3. THE Quick View mode SHALL render as a single-scroll condensed page with no animations, no boot sequence, no particle effects, and no interactive diagrams — plain dark background with clear typography
4. THE Quick View mode SHALL load and display within 200ms of toggle activation (no network requests required — data already in memory)
5. WHEN the Visitor deactivates Quick View mode, THE Portfolio_System SHALL return to the full immersive experience without retriggering the boot sequence
6. THE Quick View toggle state SHALL persist via sessionStorage so returning visitors see the same mode they chose
7. THE Quick View summary SHALL include direct links to resume PDF, GitHub, LinkedIn, and the contact form section

### Requirement 13: Personal Brand Voice and Identity

**User Story:** As a Visitor, I want to immediately understand what kind of engineer Rishabh is and what he stands for, so that his portfolio feels distinct and memorable beyond just listing skills.

#### Acceptance Criteria

1. THE Portfolio_System SHALL display a positioning statement prominently in the Hero section (below the role text): "I build backend systems that handle real-world scale, real-time decisions, and AI-driven workflows."
2. THE About section SHALL include a philosophy statement that communicates engineering values, such as: "I believe in systems that are simple to understand, resilient under pressure, and designed for what comes next."
3. THE Boot_Sequence terminal messages SHALL reflect personal brand voice — not generic system messages, but personality-infused lines (e.g., "Warming up the backend engines...", "Connecting AI pipelines...", "Ready to build something great.")
4. THE AI_Assistant welcome message SHALL include a first-person introduction that establishes brand voice (e.g., "Hey! I'm Rishabh's portfolio assistant. Ask me about the systems I've built, the scale I've handled, or what I'm working on next.")
5. ALL section headings SHALL use active, engineering-flavored language rather than generic labels (e.g., "Systems I've Built" instead of "Projects", "The Stack" instead of "Skills", "Engineering Timeline" instead of "Experience")

### Requirement 14: Fail-Safe Static Fallback

**User Story:** As a Visitor on a weak device or with JavaScript failures, I want to still see all critical portfolio content, so that the portfolio demonstrates engineering maturity through graceful degradation.

#### Acceptance Criteria

1. IF JavaScript fails to load or execute, THEN THE Portfolio_System SHALL display all critical content (name, role, projects, skills, experience, contact information) via server-rendered HTML that is readable without client-side JavaScript
2. IF canvas-based effects (Particle_System, Tech_Graph, Flow_Simulation) fail to initialize, THEN THE Portfolio_System SHALL hide the canvas elements and display static fallback content (skill tags in a grid, project cards without animation, experience as plain timeline)
3. IF the Portfolio_System detects sustained frame drops below 20fps for more than 1000ms, THEN THE Portfolio_System SHALL automatically disable ALL atmospheric effects (aurora, particles, noise, spotlight) and animated borders, switching to a static but visually clean dark theme
4. THE static fallback version SHALL still maintain the dark theme aesthetic, glassmorphism card styling (CSS-only, no backdrop-filter if not supported), and responsive layout
5. THE Portfolio_System SHALL use progressive enhancement: core content renders first (SSR HTML), then effects hydrate on top. At no point should content depend on effects loading successfully
6. THE fallback mode SHALL display a subtle indicator: "Viewing simplified mode" at the bottom of the page, with an option to "Try full experience" that reloads with effects enabled

### Requirement 15: Measurable Impact Display

**User Story:** As a Visitor evaluating this candidate, I want to see quantifiable outcomes and scale metrics for each project, so that I can understand the real-world impact rather than just the technologies used.

#### Acceptance Criteria

1. EACH Project_Card and Project_System_View SHALL display a dedicated "Impact" section containing at least two quantifiable metrics (even estimated) showing scale, performance improvement, or business outcome
2. THE VoiceOwl AI impact section SHALL display metrics including: "1000+ AI calls handled daily", "150,000+ daily active users", "2M+ daily API requests", "99.9% system uptime"
3. THE AgriSoft impact section SHALL display metrics including: "200K+ monthly records processed", "40% reduction in manual data tasks"
4. THE Digisparsh impact section SHALL display metrics including estimated scale and workflow improvements relevant to the HealthTech billing domain
5. THE impact metrics SHALL be rendered with visual emphasis — larger font, neon accent color, or animated counter effect — to draw recruiter attention
6. THE Experience_Timeline entries SHALL each include at least one measurable outcome rendered as a highlighted callout (e.g., pill badge or accent-bordered text) within the timeline entry
7. THE Quick View mode (Requirement 12) SHALL show the single most impressive metric per project as the primary identifier alongside the project name
