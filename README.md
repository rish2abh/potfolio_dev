# Rishabh Shrivastava — Portfolio

A premium, futuristic portfolio website designed as a **Live AI System Dashboard**. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion — this isn't a static website, it's an interactive system that boots up, comes alive, and reveals engineering depth through immersive visual storytelling.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple?logo=framer)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Live System Dashboard Experience](#live-system-dashboard-experience)
- [Creative Effects & Interactions](#creative-effects--interactions)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Architecture](#architecture)
- [Content Management](#content-management)
- [License](#license)

---

## Overview

This portfolio showcases **Rishabh Shrivastava** — a Backend Developer and AI Systems Engineer with 3+ years of experience building production-scale systems. The site is designed to convert recruiters and hiring managers within 5 seconds of landing, using an immersive dashboard experience that visually demonstrates engineering thinking.

**Live at:** Deployed on Vercel (zero-cost free tier)

---

## Key Features

### Core Portfolio

- **Hero Section** — Full-viewport landing with name, role, tagline, CTAs, and animated system visualization
- **About Section** — Backend expertise and AI system experience with quantifiable outcomes
- **Skills Grid** — Interactive categorized skills display (Backend, Database, Cloud, AI/Systems)
- **Projects Showcase** — Detailed project cards with problem/solution, tech stack, impact metrics, and system views
- **Experience Timeline** — Reverse chronological career progression with measurable outcomes
- **Certifications** — Professional credentials with verification links
- **Contact Form** — Working form with backend API (Resend email), inline validation, and loading states

### Projects Highlighted

| Project | Description | Impact |
|---------|-------------|--------|
| **VoiceOwl AI** | Enterprise AI calling & automation platform | 150K+ DAU, 2M+ daily API requests, 99.9% uptime |
| **AgriSoft** | Automation & data processing platform | 200K+ monthly records, 40% reduction in manual tasks |
| **Digisparsh** | HealthTech workflow & billing platform | Streamlined operations, reduced billing errors |

---

## Live System Dashboard Experience

The portfolio presents itself as a running AI system dashboard rather than a traditional website:

### System Boot Sequence
- Terminal-style animated loading with character-by-character typed messages
- Messages reflect personal brand: "Warming up the backend engines...", "Connecting AI pipelines..."
- Completes within 1.5–2 seconds, then morphs into hero content
- Skipped for returning visitors (sessionStorage) and reduced-motion users

### System Log Panel
- Fixed-position floating panel (bottom-right) with timestamped, color-coded log entries
- Updates dynamically based on user interactions (scroll, hover, clicks)
- Color-coded prefixes: `[INFO]` blue, `[OK]` green, `[AI]` yellow, `[ACTION]` purple
- Collapsible with unread count badge on mobile

### System Status Indicator
- Persistent HUD showing: connection status (● ONLINE), latency (fluctuates ±5ms), and active module count
- Monospace font, uppercase, subtle opacity — reinforces the live-system feel

### Dashboard Framing
- "SYSTEM DASHBOARD" label fixed at top
- Sections renamed: "System Profile", "Tech Network", "Active Systems", "Execution Timeline"
- Visual narrative flow: BOOT → SYSTEM ONLINE → MODULES LOADED → CORE SYSTEM → EXECUTION LOG

### Project System View (Flagship)
- VoiceOwl AI opens as a full-screen product dashboard overlay
- Multi-panel layout: live metrics, architecture diagram, technology stack, action links
- Simulated live activity: blinking status dots, incrementing counters, fluctuating latency
- Architecture diagram with interactive nodes (User → Backend → AI Engine → Database → External APIs)
- Engineering insights with Problem → Decision → Tradeoff → Outcome structure

### Recruiter Quick View Mode
- ⚡ Quick View toggle in navigation
- Strips all effects, shows scannable summary in 10–20 seconds
- Displays: years of experience, current role, top 8 technologies, project impacts, contact CTA
- Loads within 200ms (no network requests needed)

---

## Creative Effects & Interactions

### Visual Atmosphere
- **Aurora Background** — Animated gradient blobs (neon-blue/purple, 3–8% opacity, 40–80px blur)
- **Particle System** — 60 particles with connecting lines, cursor-reactive (repels within 150px)
- **Noise Texture** — Subtle grain overlay (SVG filter, 2–5% opacity, <10KB)

### Micro-Interactions
- **Context Cursor** — Custom dot (8px) + ring (32px) with contextual labels ("Explore", "Open")
- **Magnetic Elements** — CTA buttons pull toward cursor within 60px proximity (8px max displacement)
- **3D Card Tilt** — Perspective-based rotation on hover (up to 12° on X/Y axes)
- **Animated Borders** — Gradient stroke flowing along card perimeter (neon-blue ↔ purple, 3–6s cycle)

### Interactive Skills Graph
- Force-directed network layout with technology nodes and relationship edges
- Hover highlights connected nodes, dims unrelated (30% opacity)
- Tooltip shows proficiency, experience years, and related projects
- Category clusters (Backend, Database, Cloud, AI/Systems) with distinct spatial regions
- Subtle floating animation (2–4px oscillation) when idle

### Section Animations
- Scroll-triggered entrance animations (fade-up, stagger 50–100ms per item)
- Word-by-word heading reveals (80ms stagger, completes within 800ms)
- Smooth-scroll navigation with ease-out timing (300–800ms)

### AI Assistant Chat Widget
- Floating chat button that expands into conversation panel
- Rule-based keyword matching (no external API calls)
- Answers about projects, tech stack, experience, and availability
- Typewriter-style responses (20–40 chars/sec)
- Welcome message with 3 suggested questions

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14 (App Router, SSG + API Routes) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion 11 |
| **Email** | Resend API |
| **Canvas** | HTML5 Canvas (Particle System) |
| **Testing** | Vitest, React Testing Library, fast-check |
| **Deployment** | Vercel (Free Tier) |
| **Linting** | ESLint (Next.js config) |

---

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (metadata, fonts, theme)
│   │   ├── page.tsx                # Main page composing all sections
│   │   ├── globals.css             # Global styles + Tailwind directives
│   │   └── api/contact/route.ts    # Contact form API handler
│   ├── components/
│   │   ├── Hero.tsx                # Full-viewport hero with system viz
│   │   ├── About.tsx               # System profile section
│   │   ├── Skills.tsx              # Tech network / skills grid
│   │   ├── Projects.tsx            # Active systems showcase
│   │   ├── Experience.tsx          # Execution timeline
│   │   ├── Certifications.tsx      # Professional credentials
│   │   ├── Contact.tsx             # Contact form with validation
│   │   ├── SectionWrapper.tsx      # Scroll-triggered animation wrapper
│   │   ├── ParticleBackground.tsx  # Canvas particle effect
│   │   ├── effects/
│   │   │   ├── AuroraBackground.tsx
│   │   │   ├── BootSequence.tsx
│   │   │   ├── ContextCursor.tsx
│   │   │   ├── MagneticWrapper.tsx
│   │   │   ├── NoiseTexture.tsx
│   │   │   ├── ParticleSystem.tsx
│   │   │   ├── ProjectSystemView.tsx
│   │   │   ├── SystemLogPanel.tsx
│   │   │   └── TechGraph.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── GlassCard.tsx
│   │       ├── ProjectCard.tsx
│   │       ├── SkillItem.tsx
│   │       └── TimelineEntry.tsx
│   ├── contexts/
│   │   ├── EffectsContext.tsx      # Shared effects state (mouse, perf tier)
│   │   └── LogContext.tsx          # System log entries management
│   ├── data/
│   │   ├── personal.ts            # Name, role, links
│   │   ├── projects.ts            # Project details
│   │   ├── experience.ts          # Work history
│   │   ├── skills.ts              # Technical skills
│   │   ├── certifications.ts      # Credentials
│   │   ├── architectures.ts       # System view architecture data
│   │   ├── bootMessages.ts        # Boot sequence messages
│   │   ├── chatPatterns.ts        # AI assistant Q&A patterns
│   │   ├── logMessages.ts         # System log messages
│   │   └── techGraph.ts           # Skills network graph data
│   ├── hooks/
│   │   └── usePerformanceMonitor.ts  # FPS tracking & tier management
│   ├── lib/
│   │   ├── validators.ts          # Form validation logic
│   │   ├── email.ts               # Resend email utility
│   │   ├── effects-utils.ts       # Effect helper functions
│   │   ├── layout-utils.ts        # Layout calculations
│   │   └── physics-utils.ts       # Particle physics calculations
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── public/
│   ├── images/profile.webp        # Profile photo (WebP optimized)
│   ├── resume.pdf                  # Downloadable resume
│   ├── sitemap.xml                 # SEO sitemap
│   └── robots.txt                  # Crawler permissions
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/rish2abh/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Resend API key (see Environment Variables section)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Production build (static generation) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run test` | Run all tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Resend API Key (required for contact form)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Email configuration
CONTACT_EMAIL=your-email@example.com
```

> Secrets are never hardcoded. All environment-specific values are configured through the Vercel dashboard for production.

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy — automatic builds on every push to `main`

The project is optimized for Vercel free tier:
- Serverless functions execute under 10 seconds
- Memory usage under 1024MB per invocation
- Static generation for all pages (CDN-served)

### Manual Build

```bash
npm run build
npm run start
```

---

## Performance

The portfolio is engineered for speed:

- **Lighthouse Desktop:** 90+ Performance score
- **Lighthouse Mobile:** 85+ Performance score
- **CLS:** ≤ 0.1 (Cumulative Layout Shift)
- **Images:** Next.js Image component with lazy loading & WebP/AVIF
- **Code Splitting:** Dynamic imports for below-the-fold sections
- **SSR/SSG:** All text content server-rendered for instant display

### Adaptive Performance System

The portfolio includes a built-in performance monitor that adapts effects based on device capability:

| Tier | Criteria | Behavior |
|------|----------|----------|
| **High** | 4+ CPU cores, 60fps | Full effects (60 particles, connecting lines, aurora, all animations) |
| **Medium** | 2-4 cores or <60fps | Reduced particles, no connecting lines, slower animations |
| **Low** | ≤2 cores or <30fps | 30 particles, static aurora, no cursor effects |
| **Disabled** | <20fps sustained | All effects disabled, clean static dark theme |

---

## Accessibility

- **Reduced Motion:** All animations respect `prefers-reduced-motion: reduce` — static fallbacks display immediately
- **Keyboard Navigation:** Full keyboard support for chat widget, project system view, and all interactive elements
- **Semantic HTML:** Proper use of `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **Touch Support:** Magnetic/cursor effects disabled on touch devices; tap alternatives provided
- **Progressive Enhancement:** Core content renders server-side; effects hydrate on top without blocking content
- **Fallback Mode:** If JS fails or effects crash, all content remains readable via server-rendered HTML

---

## Testing

The project uses **Vitest** with **React Testing Library** for unit tests and **fast-check** for property-based testing.

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage Includes

- Component rendering with sample data
- Contact form validation (property-based: all input combinations)
- API route success/error paths
- Conditional rendering (live links, featured badges)
- Data-driven rendering (N data items → N rendered elements)
- Semantic HTML verification

---

## Architecture

### Rendering Strategy

| Layer | Strategy |
|-------|----------|
| Page content | Static Site Generation (SSG) — HTML at build time |
| Contact API | Serverless function (Node.js runtime) |
| Animations | Client-side hydration (Framer Motion) |
| Canvas effects | Dynamic import, `ssr: false` |

### Design Principles

1. **Data-Driven** — All content externalized in `/src/data/`. Adding a project or skill requires zero component changes.
2. **Progressive Enhancement** — Core content works without JavaScript. Effects layer on top.
3. **Performance Budget** — Every effect has a fallback. FPS drops trigger automatic degradation.
4. **Modular Components** — One component per file, PascalCase naming, TypeScript interfaces for all props.
5. **Vercel-Optimized** — Static where possible, serverless where needed, CDN-first delivery.

### Color System

| Token | Value | Usage |
|-------|-------|-------|
| `dark-base` | `#020617` | Page background |
| `neon-blue` | `#00d4ff` | Primary accent, interactive elements, VoiceOwl glow |
| `neon-purple` | `#8b5cf6` | Secondary accent, gradients, graph categories |
| `glass-bg` | `rgba(255,255,255,0.05)` | Card backgrounds |
| `glass-border` | `rgba(255,255,255,0.1)` | Card borders |

---

## Content Management

All portfolio content lives in typed data files under `src/data/`. To update:

### Add a New Project

Edit `src/data/projects.ts`:

```typescript
{
  id: 'new-project',
  name: 'Project Name',
  description: 'One-line description',
  problem: 'What problem it solves (50-200 chars)',
  solution: 'How it solves it (50-200 chars)',
  techStack: ['Tech1', 'Tech2', 'Tech3'],
  contribution: 'Your specific contribution',
  impact: 'Measurable outcomes',
  githubUrl: 'https://github.com/...',
  featured: false,
}
```

### Add a New Skill

Edit `src/data/skills.ts`:

```typescript
{ name: 'Redis', category: 'Database' }
```

### Add Work Experience

Edit `src/data/experience.ts` — entries display in array order (place newest first).

### Update Personal Info

Edit `src/data/personal.ts` — name, role, tagline, social links, resume path.

---

## License

This project is private and not open for redistribution. Built by **Rishabh Shrivastava**.

---

## Contact

- **GitHub:** [github.com/rish2abh](https://github.com/rish2abh)
- **LinkedIn:** [linkedin.com/in/rishabh-shrivastava-2973671a1](https://www.linkedin.com/in/rishabh-shrivastava-2973671a1)
- **Resume:** Available for download on the portfolio site
# potfolio_dev
