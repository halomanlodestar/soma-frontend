<!-- @format -->

# Required Libs

## Below listed libs and components

### 1. Immediate Needs (Forms & Core UI)

These are required right now to build out functional pages like the Creatorship Application, Settings, and Post Creation.

Libraries:

• react-hook-form: The gold standard for performant, flexible, and extensible forms in React.  
 • zod: Schema declaration and validation (pairs perfectly with react-hook-form via @hookform/resolvers).  
 • zustand: (Optional but recommended) A tiny, fast, and scalable bearbones state-management solution. Better than Context for global UI states (e.g., sidebar toggles, audio players,
or complex modal states).

Shadcn UI Components to Add:

• form, toast (or sonner for beautiful toast notifications), dialog, sheet (side panels), popover, skeleton (loading states), and tooltip.  
 ──────

### 2. Mid-Term Needs (UX Smoothing & Core Features)

These will be necessary as we build out the specific features of Soma, particularly focusing on the "editorial and art" aspect.

• Rich Text Editor (@tiptap/react & @tiptap/starter-kit): Since Soma is a quality-first platform, creators need a robust, Notion-style or Medium-style editor for writing beautiful
posts.  
 • Media Uploads (react-dropzone): Essential for the drag-and-drop experience when creators upload their artwork or portfolio pieces.  
 • Animations (framer-motion): While you have tw-animate-css, Framer Motion is unbeatable for complex layout transitions, shared element animations (like clicking an image and  
 having it expand into a full-screen view), and buttery smooth micro-interactions.  
 • Image Optimization & Cropping (react-image-crop): Useful for when users upload avatars or Soma banners.  
 ──────

### 3. Long-Term Scale (Code Quality, Monitoring, & Observability)

These are the tools you integrate to ensure the platform doesn't break as it grows, and to understand how your users interact with it.

• Error Tracking (@sentry/nextjs): Automatically captures unhandled exceptions and performance bottlenecks in production so you can fix bugs before users complain.  
 • Product Analytics (posthog-js or @vercel/analytics): PostHog is great for tracking user behavior (e.g., "Where do users drop off during the Creatorship application?").  
 • E2E Testing (@playwright/test): End-to-end testing framework. You'll want this to write automated tests for your most critical paths (Login, Apply for Creatorship, Publish a  
 Post).  
 • Unit
