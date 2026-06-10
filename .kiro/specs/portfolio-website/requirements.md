# Requirements Document

## Introduction

A premium, futuristic portfolio website for Rishabh Shrivastava — a Backend Developer and AI Systems Engineer with 3+ years of experience. The portfolio showcases real backend and AI systems work, highlights production-level experience, and is designed to convert visitors (recruiters/hiring managers) through a visually striking, interactive, scroll-based experience built with Next.js, Tailwind CSS, and Framer Motion.

## Glossary

- **Portfolio_Site**: The Next.js web application serving as Rishabh Shrivastava's personal portfolio
- **Hero_Section**: The top-most viewport section displaying name, role, tagline, CTAs, and profile image
- **About_Section**: The section describing backend expertise, AI system experience, and problem-solving focus
- **Skills_Grid**: An interactive grid layout displaying categorized technical skills
- **Projects_Section**: The section showcasing completed projects with detailed cards
- **Experience_Timeline**: A chronological timeline displaying work history
- **Certifications_Section**: The section listing professional certifications
- **Contact_Form**: A working form that collects visitor name, email, and message and submits to a backend API route
- **Contact_API**: The Next.js API route (Node.js) that processes contact form submissions
- **Visitor**: Any person viewing the portfolio website (recruiter, hiring manager, or peer)
- **Project_Card**: A UI component displaying a single project's details including name, description, tech stack, contribution, impact, and links
- **Responsive_Layout**: A layout that adapts between desktop (side-by-side) and mobile (stacked) configurations
- **Glassmorphism**: A design style using background blur, transparency, and subtle borders to create glass-like UI elements
- **Particle_Background**: A subtle animated background effect using particles or similar motion elements

## Experience Priority Layers (WOW Moment Hierarchy)

All sections are NOT equal. The following defines impact priority for development effort and polish:

### 🏆 Primary WOW (Must be perfect — maximum polish, recruiter-stopping moments)
1. **Projects Section — System View** (VoiceOwl AI flagship deep-dive)
2. **Hero Section — First Impression** (brand positioning + immediate value)
3. **Experience Timeline — Career Impact**

### 🥈 Secondary Enhancers (Strong but don't over-engineer)
4. Skills Grid
5. About Section
6. Certifications

### 🎨 Support Effects (Enhance, don't distract)
7. Particle Background
8. Glassmorphism cards
9. Scroll animations
10. Cursor/hover effects

> Development rule: If time is constrained, ensure Primary WOW items are flawless before polishing Secondary or Support layers.

---

## Requirements

### Requirement 1: Hero Section Display

**User Story:** As a Visitor, I want to immediately see Rishabh's name, role, and value proposition, so that I can quickly understand who he is and what he does.

#### Acceptance Criteria

1. WHEN the Portfolio_Site loads, THE Hero_Section SHALL display the name "Rishabh Shrivastava", the role "Backend Developer | AI Systems | Node.js", and the tagline "Building Scalable Backend & AI Systems"
2. THE Hero_Section SHALL display three CTA buttons: "View Projects" which navigates to the Projects section, "Contact Me" which navigates to the Contact section, and "Download Resume" which initiates a file download of the resume document
3. THE Hero_Section SHALL display quick links to GitHub (https://github.com/rish2abh) and LinkedIn (www.linkedin.com/in/rishabh-shrivastava-2973671a1), each opening in a new browser tab
4. WHEN viewed on desktop (viewport width 768px or above), THE Hero_Section SHALL render the profile image on the right side and name/tagline/CTAs on the left side
5. WHEN viewed on mobile (viewport width below 768px), THE Hero_Section SHALL render the profile image at the top-center and name/tagline/CTAs below it
6. THE Hero_Section SHALL render the profile image with a circular or rounded shape, a neon glow border, and a hover animation that completes a scale or glow transition within 300ms

### Requirement 2: About Section Content

**User Story:** As a Visitor, I want to read about Rishabh's backend and AI expertise, so that I can assess his technical depth and real-world problem-solving ability.

#### Acceptance Criteria

1. THE About_Section SHALL include at least one paragraph describing backend systems built in production, referencing specific technologies (Node.js, Express.js, NestJS) and scale metrics (e.g., 150,000+ daily active users, 2 million daily API requests)
2. THE About_Section SHALL include at least one paragraph describing AI system integration experience, referencing specific platforms (OpenAI, Deepgram, ElevenLabs, Twilio) and use cases (conversational automation, voice AI)
3. THE About_Section SHALL include at least two quantifiable outcomes derived from Rishabh's resume (e.g., "99.9% uptime", "40% reduction in manual tasks", "200K+ monthly records processed")
4. THE About_Section SHALL use only factual content derived from Rishabh's actual resume and work history, with no generic filler statements

### Requirement 3: Interactive Skills Display

**User Story:** As a Visitor, I want to see Rishabh's technical skills organized by category in an interactive layout, so that I can quickly identify his areas of expertise.

#### Acceptance Criteria

1. THE Skills_Grid SHALL display skills organized into four visually labeled categories: Backend (Node.js, Express, NestJS, Hapi), Database (MongoDB, SQL), Cloud (AWS S3, Cloudinary), and AI/Systems (Prompt Engineering, Server-Sent Events, Automation systems), with each category displaying a visible heading
2. WHEN a Visitor hovers over a skill item on a pointer-enabled device, THE Skills_Grid SHALL display a visual transformation (such as scale change, glow, or elevation shift) on that item within 300ms of the hover event
3. THE Skills_Grid SHALL render as a responsive grid displaying four columns on viewports 1024px and above, two columns on viewports between 768px and 1023px, and a single column on viewports below 768px
4. WHEN a Visitor taps a skill item on a touch device, THE Skills_Grid SHALL display the same visual transformation as the hover interaction for a duration of at least 300ms

### Requirement 4: Projects Showcase

**User Story:** As a Visitor, I want to see detailed project cards highlighting real systems Rishabh has built, so that I can evaluate his technical contributions and impact.

#### Acceptance Criteria

1. THE Projects_Section SHALL display Project_Cards for: VoiceOwl AI, AgriSoft, and Digisparsh
2. THE Projects_Section SHALL visually highlight VoiceOwl AI as the primary project by rendering its Project_Card at a larger size (at least 1.5x the width or height of other Project_Cards) and positioning it first in the section layout
3. WHEN a Project_Card is displayed, THE Project_Card SHALL include: project name, a description containing the problem (50–200 characters) and solution (50–200 characters), a tech stack list of 2–8 items, key contribution, measurable impact, and a GitHub link
4. IF a Project_Card's live demo link is not available, THEN THE Project_Card SHALL hide the live demo link element entirely rather than displaying a broken or disabled link
5. THE VoiceOwl AI Project_Card SHALL describe the AI calling and automation system design, real-time backend with SSE dashboards, and list the tech stack items as sourced from the external project data file
6. THE AgriSoft Project_Card SHALL describe it as an Automation and Data Processing Platform
7. THE Digisparsh Project_Card SHALL describe it as a HealthTech Workflow and Billing Platform

### Requirement 5: Experience Timeline

**User Story:** As a Visitor, I want to see Rishabh's work history in a timeline format, so that I can understand his career progression and contributions at each role.

#### Acceptance Criteria

1. THE Experience_Timeline SHALL display entries for: VoiceOwl AI (Apr 2024 – Present), MoreYeahs (Feb 2023 – Mar 2024), and Codesid (Dec 2022 – Jan 2023) in reverse chronological order
2. WHEN an experience entry is displayed, THE Experience_Timeline SHALL show the company name, role title, employment dates, a description of systems built, specific technical contributions, and at least one measurable outcome or quantifiable impact for that role
3. THE Experience_Timeline SHALL present entries in a vertical timeline layout with visual connectors (lines or nodes) linking consecutive entries to indicate chronological progression
4. WHEN the viewport is below 768px, THE Experience_Timeline SHALL adapt the vertical timeline layout to a single-column stacked format while preserving the visual connectors and chronological order

### Requirement 6: Certifications Display

**User Story:** As a Visitor, I want to see Rishabh's professional certifications, so that I can verify his credentials in relevant domains.

#### Acceptance Criteria

1. THE Certifications_Section SHALL display the following certifications: AWS Prompt Engineering, Generative AI, and IBM SQL
2. WHEN a certification is displayed, THE Certifications_Section SHALL show the certification name, issuing organization, and date of completion
3. WHEN a certification has a verification URL available, THE Certifications_Section SHALL display a clickable link that opens the credential verification page in a new browser tab
4. THE Certifications_Section SHALL display each certification as a distinct visual card element within a responsive grid or list layout that adapts to the viewport width

### Requirement 7: Contact Form with Backend Processing

**User Story:** As a Visitor, I want to submit a message through a contact form, so that I can reach Rishabh directly from the portfolio.

#### Acceptance Criteria

1. THE Contact_Form SHALL provide input fields for: visitor name (maximum 100 characters), email address (maximum 254 characters), and message (maximum 1000 characters)
2. WHEN a Visitor submits the Contact_Form with valid data, THE Contact_API SHALL receive and process the submission
3. WHEN the Contact_API receives a valid submission, THE Contact_API SHALL either send an email notification or store the submission in a database
4. IF the Contact_Form is submitted with a name field that is empty or contains only whitespace, THEN THE Contact_Form SHALL display a validation error message adjacent to the name field indicating a name is required
5. IF the Contact_Form is submitted with an email field that is empty or does not match a standard email format (local@domain.tld), THEN THE Contact_Form SHALL display a validation error message adjacent to the email field indicating a valid email is required
6. IF the Contact_Form is submitted with a message field that is empty or contains fewer than 10 characters, THEN THE Contact_Form SHALL display a validation error message adjacent to the message field indicating the minimum length requirement
7. WHEN a submission is successfully processed, THE Contact_Form SHALL display a success confirmation message to the Visitor and clear all input fields
8. IF the Contact_API encounters a processing error, THEN THE Contact_Form SHALL display an error message indicating the submission could not be processed and SHALL preserve the Visitor's entered data in the form fields
9. WHILE the Contact_Form submission is being processed, THE Contact_Form SHALL disable the submit button to prevent duplicate submissions
10. THE Contact_Form section SHALL also display LinkedIn (www.linkedin.com/in/rishabh-shrivastava-2973671a1) and GitHub (https://github.com/rish2abh) links as alternative contact methods

### Requirement 8: Futuristic Visual Design

**User Story:** As a Visitor, I want a visually striking, futuristic experience, so that the portfolio feels premium and memorable.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL use a dark theme base (background color #0a0a0f or darker) with neon blue (#00d4ff or similar) and purple (#8b5cf6 or similar) gradient accents applied to headings, borders, and interactive element highlights
2. THE Portfolio_Site SHALL apply Glassmorphism effects to card-like UI elements using CSS backdrop-filter blur of at least 8px, background opacity between 10% and 30%, and a 1px semi-transparent border
3. THE Portfolio_Site SHALL render a Particle_Background using an animated canvas or SVG element with at least 30 visible particles that move continuously without user interaction
4. THE Portfolio_Site SHALL implement scroll-based entrance animations using Framer Motion that trigger when a section enters the viewport, with each animation completing within 600ms
5. WHEN a Visitor hovers over buttons, cards, or links, THE Portfolio_Site SHALL display a visual state change (such as glow intensity increase, scale to 1.02–1.05, or border color shift) within 200ms of the hover event

### Requirement 9: Responsive Layout

**User Story:** As a Visitor, I want the portfolio to be fully usable on any device, so that I can view it on desktop, tablet, or mobile.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render without horizontal overflow on viewports ranging from 320px to 2560px width
2. WHEN the viewport is below 768px, THE Responsive_Layout SHALL switch from side-by-side to single-column stacked configurations for all multi-column sections
3. THE Portfolio_Site SHALL maintain a minimum body text size of 16px, minimum tap target size of 44x44px for interactive elements, and minimum spacing of 8px between adjacent tap targets across all supported viewports
4. WHEN the viewport is between 768px and 1023px (tablet), THE Responsive_Layout SHALL display content in a two-column grid where applicable, scaling down from the desktop four-column layout

### Requirement 10: Performance Optimization

**User Story:** As a Visitor, I want the portfolio to load quickly and run smoothly, so that I have a fast, uninterrupted browsing experience.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL achieve a Lighthouse Performance score of 90 or above on desktop when tested with simulated throttling disabled
2. THE Portfolio_Site SHALL achieve a Lighthouse Performance score of 85 or above on mobile when tested with Lighthouse default mobile throttling
3. THE Portfolio_Site SHALL implement image optimization using the Next.js Image component (next/image) with lazy loading for below-the-fold images and WebP or AVIF format serving where browser-supported
4. THE Portfolio_Site SHALL use dynamic imports (next/dynamic) for non-critical sections (Projects, Experience, Certifications, Contact) that are not visible in the initial viewport
5. THE Portfolio_Site SHALL achieve a Cumulative Layout Shift (CLS) score of 0.1 or below as measured by Lighthouse

### Requirement 11: SEO Optimization

**User Story:** As a Visitor searching for backend developers, I want the portfolio to appear in search results, so that I can discover Rishabh's profile organically.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL include a title tag containing "Rishabh Shrivastava", a meta description between 120 and 160 characters, Open Graph tags (og:title, og:description, og:image, og:url), and Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
2. THE Portfolio_Site SHALL generate a valid sitemap.xml listing all accessible URLs and a robots.txt that permits crawling of all public pages
3. THE Portfolio_Site SHALL use semantic HTML elements: header for site header, main for primary content, section for each portfolio section, article for project cards, and footer for the page footer
4. THE Portfolio_Site SHALL render all text content server-side (via Next.js SSR or SSG) so that the full page content is present in the initial HTML response without requiring JavaScript execution

### Requirement 12: Modular Component Architecture

**User Story:** As a developer (Rishabh), I want clean modular components, so that I can easily update content and add new sections in the future.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL organize components into separate files with one component per file, using PascalCase filenames that match the exported component name
2. THE Portfolio_Site SHALL externalize all content data (projects, experience, skills, certifications) into dedicated data files separate from component files, and components SHALL render collection data by iterating over data arrays rather than hardcoding individual items
3. THE Portfolio_Site SHALL use TypeScript interfaces for all component props and data structures
4. WHEN a new entry is added to or an existing entry is modified in a data file, THE Portfolio_Site SHALL reflect those changes without requiring modifications to any component file
5. THE Portfolio_Site SHALL contain no more than one level of component nesting per section, with each section (Hero, About, Skills, Projects, Experience, Certifications, Contact) implemented as a distinct top-level component

### Requirement 13: Deployment Configuration

**User Story:** As a developer (Rishabh), I want the portfolio optimized for Vercel free tier deployment, so that I can host it at zero cost with production-grade performance.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL include a valid Vercel deployment configuration that enables successful build and deployment via `vercel deploy` or Git-based automatic deployment without manual intervention
2. THE Portfolio_Site SHALL function within Vercel free tier limits: serverless function execution time under 10 seconds per invocation, serverless function memory usage under 1024MB, and bandwidth under 100GB per month
3. THE Contact_API SHALL be implemented as a Next.js API route that executes within 10 seconds and uses no more than 1024MB memory per invocation on Vercel serverless functions
4. THE Portfolio_Site SHALL externalize all secrets and environment-specific values (API keys, email service credentials) into environment variables configurable through the Vercel dashboard, with no secrets hardcoded in source code
5. WHEN the Portfolio_Site is built on Vercel, THE build process SHALL complete successfully without errors and produce a deployable output
