# Requirements Document

## Introduction

This feature enhances the VoiceOwl project's "Explore System" overlay (ProjectSystemView) with comprehensive project information organized in a tabbed interface. The enhancement adds four content tabs (Overview, Architecture, Features, Contributions) below the existing header and metrics panel, providing deep-dive information about the VoiceOwl AI platform. The tabbed interface uses Framer Motion for smooth transitions and only activates for the VoiceOwl project overlay.

## Glossary

- **ProjectSystemView**: The full-screen overlay component at `src/components/effects/ProjectSystemView.tsx` that displays when a user clicks "Explore System" on a project card
- **Tab_Bar**: A horizontal navigation element containing tab buttons that allows switching between content sections
- **Active_Tab**: The currently selected tab whose content panel is visible to the user
- **Overview_Tab**: The first content tab displaying project description, core problems solved, and impact statistics
- **Architecture_Tab**: The second content tab displaying the node-graph visualization and engineering decision insights from `architectures.ts`
- **Features_Tab**: The third content tab displaying the six feature categories with their sub-items
- **Contributions_Tab**: The fourth content tab displaying personal contributions, challenges solved, and detailed tech stack
- **Animated_Counter**: A numeric display that counts from zero to a target value using an easing animation over a defined duration
- **VoiceOwl_Overlay**: The ProjectSystemView instance rendered specifically for the VoiceOwl AI project (project id `voiceowl-ai`)
- **Content_Panel**: The visible area below the Tab_Bar that renders the content for the Active_Tab

## Requirements

### Requirement 1: Tab Navigation Bar

**User Story:** As a portfolio visitor, I want a horizontal tab navigation below the metrics panel, so that I can switch between different content sections about the VoiceOwl project.

#### Acceptance Criteria

1. WHEN the VoiceOwl_Overlay is displayed, THE Tab_Bar SHALL render four tabs labeled "Overview", "Architecture", "Features", and "Contributions" in a horizontal row below the existing live metrics section.
2. THE Tab_Bar SHALL display "Overview" as the Active_Tab by default when the VoiceOwl_Overlay opens.
3. WHEN a user clicks a tab in the Tab_Bar, THE ProjectSystemView SHALL display the Content_Panel for the selected tab and hide all other Content_Panels.
4. THE Tab_Bar SHALL visually distinguish the Active_Tab from inactive tabs using a highlighted style.
5. WHILE a tab is the Active_Tab, THE Tab_Bar SHALL display a visual indicator (underline or background accent) on that tab.
6. THE Tab_Bar SHALL remain visible and fixed at its position while the user scrolls through the Content_Panel below.

### Requirement 2: VoiceOwl-Only Activation

**User Story:** As a portfolio visitor, I want the tabbed content to appear only on the VoiceOwl project overlay, so that other project overlays remain unchanged.

#### Acceptance Criteria

1. WHEN the ProjectSystemView renders for a project with id `voiceowl-ai`, THE ProjectSystemView SHALL display the Tab_Bar and tabbed content sections.
2. WHEN the ProjectSystemView renders for a project with an id other than `voiceowl-ai`, THE ProjectSystemView SHALL display the existing layout without the Tab_Bar or tabbed content.
3. THE ProjectSystemView SHALL preserve the existing header bar, live metrics panel, and close functionality for all projects regardless of tab activation.

### Requirement 3: Overview Tab Content

**User Story:** As a portfolio visitor, I want to see a high-level summary of VoiceOwl including impact stats, so that I can understand the project's scope and significance.

#### Acceptance Criteria

1. WHEN the Overview_Tab is the Active_Tab, THE Content_Panel SHALL display the project description text.
2. WHEN the Overview_Tab is the Active_Tab, THE Content_Panel SHALL display four core problems that the VoiceOwl platform solves, each with a brief description.
3. WHEN the Overview_Tab is the Active_Tab, THE Content_Panel SHALL display impact statistics as Animated_Counter hero stats with large typography.
4. WHEN the Overview_Tab becomes the Active_Tab, THE Animated_Counter SHALL animate from zero to the target value using an ease-out easing curve.
5. THE Overview_Tab SHALL display impact statistics including daily active users, daily API requests, and system uptime percentage.

### Requirement 4: Architecture Tab Content

**User Story:** As a portfolio visitor, I want to see the system architecture and engineering decisions, so that I can understand the technical depth of the VoiceOwl platform.

#### Acceptance Criteria

1. WHEN the Architecture_Tab is the Active_Tab, THE Content_Panel SHALL render a node-graph visualization using the five nodes defined in `voiceowlArchitecture` from `architectures.ts`.
2. WHEN the Architecture_Tab is the Active_Tab, THE Content_Panel SHALL render edges between nodes as defined in the `voiceowlArchitecture.edges` data.
3. WHEN the Architecture_Tab is the Active_Tab, THE Content_Panel SHALL display node labels and their associated technologies.
4. WHEN the Architecture_Tab is the Active_Tab, THE Content_Panel SHALL display six backend layer descriptions representing the system's architectural layers.
5. WHEN the Architecture_Tab is the Active_Tab, THE Content_Panel SHALL display the four engineering decision insights from `voiceowlArchitecture.insights` showing question, decision, tradeoff, and outcome for each.

### Requirement 5: Features Tab Content

**User Story:** As a portfolio visitor, I want to see the feature set of VoiceOwl organized by category, so that I can understand the platform's capabilities.

#### Acceptance Criteria

1. WHEN the Features_Tab is the Active_Tab, THE Content_Panel SHALL display six feature categories: AI Conversation Engine, Real-Time Call Processing, Intelligent Call Routing, Real-Time Dashboard, Advanced Auth, and Customizable Bots.
2. WHEN the Features_Tab is the Active_Tab, THE Content_Panel SHALL display sub-items for each feature category describing specific capabilities.
3. THE Features_Tab SHALL present each feature category as a distinct visual card or section with a title and list of sub-items.

### Requirement 6: Contributions Tab Content

**User Story:** As a portfolio visitor, I want to see specific personal contributions and challenges solved, so that I can understand the developer's role and problem-solving ability.

#### Acceptance Criteria

1. WHEN the Contributions_Tab is the Active_Tab, THE Content_Panel SHALL display seven personal contribution items describing specific work performed on the VoiceOwl project.
2. WHEN the Contributions_Tab is the Active_Tab, THE Content_Panel SHALL display four challenges solved, each with a before-state and after-state description.
3. WHEN the Contributions_Tab is the Active_Tab, THE Content_Panel SHALL display a detailed tech stack organized into seven categories.
4. THE Contributions_Tab SHALL visually differentiate the before-state and after-state for each challenge using distinct styling.

### Requirement 7: Tab Transition Animations

**User Story:** As a portfolio visitor, I want smooth animated transitions when switching tabs, so that the experience feels polished and professional.

#### Acceptance Criteria

1. WHEN a user switches from one tab to another, THE Content_Panel SHALL animate the outgoing content out and the incoming content in using Framer Motion AnimatePresence.
2. THE Content_Panel transition animation SHALL complete within 300 milliseconds.
3. WHILE a tab transition is in progress, THE Tab_Bar SHALL remain interactive and responsive to further clicks.
4. IF a user clicks a new tab during an active transition, THEN THE Content_Panel SHALL interrupt the current animation and begin transitioning to the newly selected tab content.

### Requirement 8: Responsive Layout

**User Story:** As a portfolio visitor on any device, I want the tabbed content to display correctly across screen sizes, so that I can explore the VoiceOwl details on mobile or desktop.

#### Acceptance Criteria

1. THE Tab_Bar SHALL adapt its layout to fit mobile viewport widths (below 768px) without horizontal overflow.
2. THE Content_Panel SHALL use a single-column layout on viewports below 768px and a multi-column layout on wider viewports where applicable.
3. THE Architecture_Tab node-graph visualization SHALL support horizontal scrolling on viewports too narrow to display all nodes simultaneously.

### Requirement 9: Accessibility

**User Story:** As a portfolio visitor using assistive technology, I want the tabbed interface to be keyboard-navigable and screen-reader accessible, so that I can interact with all content.

#### Acceptance Criteria

1. THE Tab_Bar SHALL use appropriate ARIA roles (`tablist`, `tab`, `tabpanel`) to communicate tab semantics to assistive technologies.
2. WHEN a user presses the left or right arrow key while focus is within the Tab_Bar, THE Tab_Bar SHALL move focus to the adjacent tab.
3. WHEN a user presses Enter or Space on a focused tab, THE Tab_Bar SHALL activate that tab and display its Content_Panel.
4. THE Active_Tab SHALL set `aria-selected` to `true` and all inactive tabs SHALL set `aria-selected` to `false`.
5. EACH Content_Panel SHALL reference its associated tab via `aria-labelledby` to provide context for screen readers.
