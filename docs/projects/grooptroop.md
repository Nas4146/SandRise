# GroopTroop – AI Coordination for Real-World Groups

## Snapshot
- **Role:** Product manager & product builder
- **Stage:** App Store submission (iOS v1.0) with phased release queued; public TestFlight beta active for feedback loops
- **Audience:** Busy families, friend groups, volunteer crews, and community teams that juggle schedules, tasks, and logistics
- **Distribution:** iOS (App Store/TestFlight). Android build tracked in Expo-managed workflow for post-launch expansion.

## Elevator Pitch
GroopTroop removes the chaos from coordinating real-world groups by pairing AI-assisted scheduling with privacy-first communication. The app senses availability, proposes conflict-free plans, and keeps everyone aligned across chat, tasks, calendars, and location—all from one streamlined workspace.

## Product Highlights
- **AI scheduling co-pilot** that analyzes member availability, resolves conflicts, and proposes optimal meeting windows in seconds.
- **Group command center** with role-aware messaging, task lists, and activity tracking tailored to each circle.
- **Calendar, contacts, and location integrations** built on Expo native modules to keep context-rich updates in sync across devices.
- **Privacy-first architecture** with end-to-end encryption, secure local storage, and Supabase row-level security guarding sensitive coordination data.

## Status & Traction
GroopTroop 1.0 has been submitted for App Store review with a seven-day phased release plan. The current TestFlight build validates onboarding, AI-powered coordination, calendar sync, and messaging stability. Core metrics during beta focus on first-week activation, successful event creation, and AI suggestion acceptance rates.

## Tech Stack Logos
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Native" height="48" />
  <img src="https://avatars.githubusercontent.com/u/12504344?s=200&v=4" alt="Expo" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" height="48" />
  <img src="https://raw.githubusercontent.com/supabase-community/supabase-brand-assets/main/supabase-logo-icon.png" alt="Supabase" height="48" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="OpenAI" height="48" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Anthropic_logo.svg" alt="Anthropic" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind / NativeWind" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" height="48" />
</p>

### Core Stack at a Glance
| Layer | Tools |
| --- | --- |
| Mobile | React Native (Expo), TypeScript, React Navigation, Zustand |
| Backend & Data | Supabase (Auth + Postgres), Row Level Security, Expo SecureStore |
| Intelligence | OpenAI function calling for scheduling, Anthropic Claude for complex reasoning |
| Experience | NativeWind/Tailwind styling, React Hook Form, Reanimated, Expo Notifications |
| Operations | EAS Build & Submit, PNPM monorepo, Jest smoke tests, docker-based CI wrappers |

## Upcoming Improvements
- **E2EE v2 rollout** that unifies the new message/image encryption pipeline currently validated by `crypto.v2` smoke tests.
- **Rich media coordination** with encrypted image attachments, map previews, and location-based reminders.
- **Smart itineraries** that auto-generate multi-step plans, assign owners, and track decision deadlines for larger events.
- **Android launch** reaching the full cross-platform promise once iOS learnings harden the onboarding funnel.
- **Group templates & playbooks** to help recurring cohorts (sports leagues, volunteer crews) spin up workflows in one tap.

## How It Serves the PM Narrative
- Demonstrates end-to-end ownership: market discovery, product strategy, UX prototyping, roadmap prioritization, and launch readiness.
- Highlights data-informed iteration through TestFlight analytics, feedback loops, and AI acceptance telemetry.
- Underscores technical stewardship, balancing advanced AI capabilities with stringent privacy, security, and compliance guardrails.
