# AI Dev Agents – Portfolio Project Entry

This document captures the specific content needed to feature the **AI Dev Agents** platform on your product manager/product builder portfolio site. Drop this copy directly into a project card alongside visuals or interactive demos.

---

## Quick Snapshot
| Field | Detail |
| --- | --- |
| **Project Name** | AI Dev Agents |
| **Status** | In Development (internal beta) |
| **Role** | Product Manager · Product Builder |
| **Launch Window** | Core orchestration MVP shipped Q3&nbsp;2025; active beta hardening underway |
| **Primary CTA** | Explore on GitHub (private repo showcase) or request pilot access |

---

## One-line Value Statement
> _"AI-native developer workstation that orchestrates autonomous coding agents, multi-tier storage, and progress-aware execution."_

---

## Product Overview
- **Problem**: Teams experimenting with AI coding agents struggle to coordinate tasks, maintain execution traceability, and sync results across storage backends.
- **Solution**: AI Dev Agents provides a unified orchestration layer with CLI and API parity, multi-tier agent storage (local JSON + Firestore), and progress reporting aligned with human reviewers.
- **Traction & Signals**:
  - Successful end-to-end smoke runs across CLI and API parity tests.
  - Storage unification validated through execution record regression suite.
  - Early design partners using container execution path for secure automation.

---

## Key Responsibilities & Contributions
- Defined product requirements bridging CLI workflows, HTTP APIs, and background services.
- Led the architecture split into orchestration, storage, registry, and configuration layers (documented in `ARCHITECTURE_ANALYSIS.md`).
- Implemented execution record unification (`behavior_unify_execution_records`) to keep CLI progress, SSE streaming, and storage adapters in sync.
- Coordinated developer experience for hybrid authentication (session + API key) and security hardening across endpoints.

---

## Feature Highlights
- **Agent Orchestrator**: Launches tasks via CLI or API, persists state, and manages containerized backends.
- **Multi-tier Storage System**: Local JSON cache with Firestore federation for scalability.
- **Progress Reporter**: Structured status updates, card comment integration, and SSE event streaming.
- **Collaboration Hooks**: Hybrid auth, run approvals, and webhook ingestion for external systems.

---

## Technology & Tooling Logos
Render these as a row of brand-approved logos on the portfolio page.

<div class="tech-logos">
  <img src="/assets/logos/python.svg" alt="Python" />
  <img src="/assets/logos/flask.svg" alt="Flask" />
  <img src="/assets/logos/firebase.svg" alt="Firebase" />
  <img src="/assets/logos/docker.svg" alt="Docker" />
  <img src="/assets/logos/openai.svg" alt="OpenAI" />
  <img src="/assets/logos/github.svg" alt="GitHub Actions" />
</div>

**Stack Notes**
- Python 3.11 backend with Flask blueprints for API delivery.
- Firestore & JSON adapters managed through `MultiTierAgentStorage`.
- Docker-based execution backend for isolated agent runs.
- OpenAI / Anthropic model integration via configurable keys in `config/settings.py`.
- GitHub Actions planned for CI smoke automation.

---

## Upcoming Improvements
- **Now (0–3 weeks)**
  - Finalize unified RunManager implementation across API and CLI (`behavior_wire_cli_to_orchestrator`).
  - Extend TestFlight-style beta dashboard to visualize execution metrics inline.
- **Next (1–2 months)**
  - Ship scheduler service for recurring agent runs with cron-style triggers.
  - Add artifact management API to surface generated assets in the portfolio export flow.
- **Later (Quarter+)**
  - Launch GitHub PR automation via MCP integration for auto-generated branches.
  - Publish public API docs and provide managed cloud workspace tier.

---

## Suggested Visuals & Assets
- Screenshot of progress reporting comment thread within the kanban board.
- Diagram of orchestration pipeline (CLI/API → Orchestrator → Storage Tiers → Collaboration hooks).
- Animated GIF of SSE live updates in the dashboard.

---

## Contact & CTA Copy
"Interested in piloting AI Dev Agents or partnering on advanced agent workflows? Reach out for a guided tour and beta access."  (Link to preferred contact method.)

---

## Maintenance Notes
- Update status and roadmap bullets after each storage or orchestrator milestone.
- Ensure linked logos remain licensed; refresh SVGs if branding guidelines shift.
- Sync with internal roadmap tracker so portfolio highlights match execution reality.
