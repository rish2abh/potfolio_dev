# Implementation Plan: Portfolio Website

## Overview

Build a futuristic, scroll-animated single-page portfolio website for Rishabh Shrivastava using Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion. The site is statically generated with one serverless API route for contact form processing, optimized for Vercel free-tier deployment.

## Tasks

- [x] 1. Set up project structure, configuration, and core types
  - [x] 1.1 Initialize Next.js 14 project with TypeScript and Tailwind CSS
    - Run `npx create-next-app@14` with App Router, TypeScript, Tailwind CSS, and ESLint
    - Install dependencies: `framer-motion`, `resend`, `vitest`, `@testing-library/react`, `fast-check`, `@vitejs/plugin-react`, `jsdom`
    - Configure `tailwind.config.ts` with dark theme colors (dark base #0a0a0f, neon blue #00d4ff, purple #8b5cf6), glassmorphism backdrop blur, and particle drift animation
    - Configure `next.config.js` with image optimization settings
    - Create `vercel.json` for deployment configuration
    - _Requirements: 8.1, 13.1, 13.4, 13.5_

  - [x] 1.2 Create TypeScript interfaces and type definitions
    - Create `src/types/index.ts` with interfaces: PersonalInfo, Project, Experience, Skill, Certification, ContactFormData, ContactFormErrors, ApiResponse
    - Ensure all interfaces match the design document specifications
    - _Requirements: 12.3_

  - [x] 1.3 Create content data files
    - Create `src/data/personal.ts` with name, role, tagline, GitHub, LinkedIn, resume path, profile image
    - Create `src/data/projects.ts` with VoiceOwl AI (featured), AgriSoft, and Digisparsh entries
    - Create `src/data/experience.ts` with VoiceOwl AI, MoreYeahs, and Codesid in reverse chronological order
    - Create `src/data/skills.ts` with skills organized in Backend, Database, Cloud, AI/Systems categories
    - Create `src/data/certifications.ts` with AWS Prompt Engineering, Generative AI, and IBM SQL
    - _Requirements: 4.1, 5.1, 6.1, 12.2, 12.4_

- [x] 2. Implement shared UI components and utilities
  - [x] 2.1 Create SectionWrapper component with scroll animations
    - Create `src/components/SectionWrapper.tsx` using Framer Motion `useInView` with `once: true`
    - Support configurable animation variants: fade-up, fade-left, fade-right
    - Cap animation duration at 600ms
    - _Requirements: 8.4_

  - [x] 2.2 Create GlassCard UI component
    - Create `src/components/ui/GlassCard.tsx` with backdrop-filter blur (≥8px), background opacity 10-30%, and 1px semi-transparent border
    - Apply hover state change (glow/scale 1.02-1.05) within 200ms
    - _Requirements: 8.2, 8.5_

  - [x] 2.3 Create Button UI component
    - Create `src/components/ui/Button.tsx` with neon gradient styling, hover glow effect within 200ms
    - Ensure minimum tap target of 44x44px
    - _Requirements: 8.5, 9.3_

  - [x] 2.4 Create contact form validation logic
    - Create `src/lib/validators.ts` with `validateContactForm` function
    - Validate: name not empty/whitespace, email matches `local@domain.tld` pattern, message ≥10 characters
    - Return `ContactFormErrors` object (empty if all valid)
    - _Requirements: 7.4, 7.5, 7.6_

  - [ ]* 2.5 Write property test for contact form validation (Property 4)
    - **Property 4: Contact form validation correctness**
    - Test with random strings: empty/whitespace names, valid/invalid emails, messages of varying lengths
    - Verify error presence/absence matches validation rules for all generated inputs
    - Minimum 100 iterations using fast-check
    - **Validates: Requirements 7.4, 7.5, 7.6**

- [x] 3. Implement Hero and About sections
  - [x] 3.1 Create RootLayout with metadata, fonts, and global styles
    - Create `src/app/layout.tsx` with Inter + JetBrains Mono fonts, dark theme base styles
    - Set metadata: title containing "Rishabh Shrivastava", meta description (120-160 chars), OG tags, Twitter Card tags
    - Use semantic HTML with `<main>` wrapper
    - _Requirements: 11.1, 11.3, 11.4_

  - [x] 3.2 Create ParticleBackground component
    - Create `src/components/ParticleBackground.tsx` as a canvas-based particle animation
    - Render 30+ particles with subtle drift motion at 60fps using `requestAnimationFrame`
    - Use `next/dynamic` with `ssr: false` to avoid hydration mismatch
    - Fixed positioning behind all content (z-index: 0)
    - _Requirements: 8.3_

  - [x] 3.3 Create Hero section component
    - Create `src/components/Hero.tsx` reading from `data/personal.ts`
    - Display name, role, tagline; three CTA buttons (View Projects, Contact Me, Download Resume)
    - Social links (GitHub, LinkedIn) opening in new tab with `rel="noopener noreferrer"`
    - Profile image: circular crop, neon glow border, hover scale animation (300ms)
    - Responsive: side-by-side on desktop (≥768px), stacked on mobile (<768px)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 3.4 Create About section component
    - Create `src/components/About.tsx` wrapped in SectionWrapper
    - Include paragraph on backend systems (Node.js, Express.js, NestJS, 150K+ DAU, 2M+ daily requests)
    - Include paragraph on AI integration (OpenAI, Deepgram, ElevenLabs, Twilio)
    - Include 2+ quantifiable outcomes (99.9% uptime, 40% reduction in manual tasks, 200K+ records)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4. Checkpoint - Ensure project builds and Hero/About render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Skills and Projects sections
  - [x] 5.1 Create SkillItem UI component
    - Create `src/components/ui/SkillItem.tsx` with hover/tap visual transformation (scale/glow) within 300ms
    - Ensure minimum tap target of 44x44px for touch devices
    - _Requirements: 3.2, 3.4, 9.3_

  - [x] 5.2 Create Skills section component
    - Create `src/components/Skills.tsx` rendering skills from `data/skills.ts` grouped by category
    - Responsive grid: 4 columns (≥1024px), 2 columns (768-1023px), 1 column (<768px)
    - Display visible category headings for each group
    - Dynamically imported with `next/dynamic`
    - _Requirements: 3.1, 3.3_

  - [x] 5.3 Create ProjectCard UI component
    - Create `src/components/ui/ProjectCard.tsx` displaying: name, description (problem + solution), tech stack list, contribution, impact, GitHub link
    - Conditionally render live demo link only when `liveUrl` is defined
    - Apply glassmorphism styling with hover state change
    - _Requirements: 4.3, 4.4_

  - [x] 5.4 Create Projects section component
    - Create `src/components/Projects.tsx` rendering projects from `data/projects.ts`
    - Visually highlight VoiceOwl AI as featured (1.5x size, positioned first)
    - Dynamically imported with `next/dynamic`
    - Wrap in SectionWrapper for scroll animation
    - _Requirements: 4.1, 4.2, 4.5, 4.6, 4.7_

  - [ ]* 5.5 Write property test for ProjectCard rendering (Property 1)
    - **Property 1: ProjectCard renders all required fields and conditional elements**
    - Generate random valid Project objects with varied field lengths, tech stack sizes (2-8), with/without liveUrl
    - Verify all required fields rendered and live link present iff liveUrl defined
    - Minimum 100 iterations using fast-check
    - **Validates: Requirements 4.3, 4.4**

  - [ ]* 5.6 Write property test for data-driven rendering (Property 5)
    - **Property 5: Data-driven rendering produces one item per data entry**
    - Generate random arrays of 0-20 items for skills data
    - Verify exactly N items rendered for N entries in data array
    - Minimum 100 iterations using fast-check
    - **Validates: Requirements 12.4**

- [x] 6. Implement Experience and Certifications sections
  - [x] 6.1 Create TimelineEntry UI component
    - Create `src/components/ui/TimelineEntry.tsx` displaying: company name, role title, dates, description, contributions list, measurable impact
    - Include visual connector element (line/node) for timeline connection
    - _Requirements: 5.2, 5.3_

  - [x] 6.2 Create Experience section component
    - Create `src/components/Experience.tsx` rendering from `data/experience.ts`
    - Vertical timeline layout with visual connectors between entries
    - Responsive: adapts to single-column stacked on mobile (<768px) preserving connectors
    - Dynamically imported with `next/dynamic`
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 6.3 Create Certifications section component
    - Create `src/components/Certifications.tsx` rendering from `data/certifications.ts`
    - Display each certification as a GlassCard with name, issuer, date
    - Conditionally render verification link (opens in new tab with `target="_blank"`) when URL available
    - Responsive grid/list layout, dynamically imported
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 6.4 Write property test for TimelineEntry rendering (Property 2)
    - **Property 2: TimelineEntry renders all required fields**
    - Generate random valid Experience objects with varied contributions and string lengths
    - Verify all required fields (company, role, dates, description, contributions, impact) rendered
    - Minimum 100 iterations using fast-check
    - **Validates: Requirements 5.2**

  - [ ]* 6.5 Write property test for CertificationCard rendering (Property 3)
    - **Property 3: CertificationCard renders all required fields and conditional elements**
    - Generate random valid Certification objects with/without verificationUrl
    - Verify name, issuer, date rendered; verification link present iff verificationUrl defined
    - Minimum 100 iterations using fast-check
    - **Validates: Requirements 6.2, 6.3**

- [x] 7. Checkpoint - Ensure all sections render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement Contact form and API route
  - [x] 8.1 Create email sending utility
    - Create `src/lib/email.ts` using Resend SDK
    - Read API key from environment variable (RESEND_API_KEY)
    - Send structured email with contact form data
    - _Requirements: 7.3, 13.4_

  - [x] 8.2 Create Contact API route
    - Create `src/app/api/contact/route.ts` as POST handler
    - Validate request body using `validateContactForm`
    - Return 400 with errors on validation failure
    - Send email via Resend on success, return 200
    - Catch errors and return 500 with generic message
    - Ensure execution under 10 seconds
    - _Requirements: 7.2, 7.3, 13.2, 13.3_

  - [x] 8.3 Create Contact section component
    - Create `src/components/Contact.tsx` with controlled form (name, email, message)
    - Client-side validation with inline error display adjacent to fields
    - Submit button disabled during processing
    - Show success message and clear form on success
    - Preserve data and show error message on failure
    - Display alternative contact links (LinkedIn, GitHub)
    - Dynamically imported with `next/dynamic`
    - _Requirements: 7.1, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10_

  - [ ]* 8.4 Write unit tests for Contact API route
    - Mock Resend SDK
    - Test successful submission (200 response)
    - Test validation failure (400 response)
    - Test server error handling (500 response)
    - _Requirements: 7.2, 7.3_

- [x] 9. Compose main page and finalize structure
  - [x] 9.1 Create main page composing all sections
    - Create `src/app/page.tsx` importing all section components
    - Statically import Hero and About (above the fold)
    - Use `next/dynamic` for Skills, Projects, Experience, Certifications, Contact
    - Include ParticleBackground with dynamic import (ssr: false)
    - Use semantic HTML: sections for each portfolio section, article for project cards
    - _Requirements: 10.4, 11.3, 12.5_

  - [x] 9.2 Add static assets and SEO files
    - Add `public/robots.txt` permitting all crawlers
    - Add `public/sitemap.xml` listing accessible URLs
    - Add placeholder `public/images/profile.webp` and `public/resume.pdf`
    - _Requirements: 11.2_

  - [x] 9.3 Configure Vitest for testing
    - Create `vitest.config.ts` with React plugin and jsdom environment
    - Add test scripts to `package.json`: test, test:watch, test:coverage
    - Create a sample smoke test verifying the app builds
    - _Requirements: 13.5_

- [x] 10. Final checkpoint - Ensure full build succeeds and all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All content is externalized in `src/data/` files — components iterate over arrays for easy updates
- The site is fully static except the contact API route (serverless function)
- Framer Motion animations are client-side only; content renders server-side for SEO

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4"] },
    { "id": 3, "tasks": ["2.5", "3.1", "3.2"] },
    { "id": 4, "tasks": ["3.3", "3.4", "5.1"] },
    { "id": 5, "tasks": ["5.2", "5.3", "6.1"] },
    { "id": 6, "tasks": ["5.4", "5.5", "6.2", "6.3"] },
    { "id": 7, "tasks": ["5.6", "6.4", "6.5", "8.1"] },
    { "id": 8, "tasks": ["8.2", "8.3"] },
    { "id": 9, "tasks": ["8.4", "9.1"] },
    { "id": 10, "tasks": ["9.2", "9.3"] }
  ]
}
```
