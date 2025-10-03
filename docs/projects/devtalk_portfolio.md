# DevTalk – Autonomous Incident Response Workbench

## Elevator Pitch
DevTalk is an AI-augmented productivity console that helps product builders investigate, diagnose, and remediate issues across their applications without leaving chat. It combines a locally running orchestrator, a Slack assistant, and an OpenAI-powered change broker to turn natural-language “work” requests into targeted diagnostics, code fixes, and operational runbooks in minutes instead of hours.

## Product Status
- **Lifecycle:** Internal beta with hands-on usage by the core engineering/Product team
- **Availability:** Self-hosted (Docker compose or local Python environment)
- **Primary Users:** Product managers and tech leads who need rapid incident triage and lightweight change management

## Why It Matters
Keeping a portfolio of live applications healthy often means juggling logs, terminals, code reviews, and deployment gates. DevTalk compresses that workflow into a single conversational surface so product teams can:
- Ask “why is feature X broken?” and receive an automated investigation with log snippets and service health checks.
- Generate tightly-scoped git-style patches with proper line numbers and context, even when the AI diff is imperfect, thanks to structured fallback applicators.
- Collaborate from Slack with real-time status updates, audit trails, and approval checkpoints before changes land in the repo.

## Key Capabilities
- **Investigative Agent:** Runs targeted diagnostics (HTTP checks, log tailing, service restarts) triggered from natural language instructions.
- **Patch Intelligence:** Uses an OpenAI broker with line-numbered context to draft diffs; the FastAPI server normalizes, validates, and safely applies patches via git or structured edit operations.
- **Slack-First Workflow:** A “work …” command flow that supports investigative tasks, operator commands (e.g., installing dependencies), and conversational approvals with thread-level progress reporting.
- **Audit & Transparency:** Every action is captured in SQLite-backed audit logs, and a lightweight web UI visualizes applied patches, investigations, and context snippets.

## Technologies & Tools
<table>
  <tr>
    <td><img src="https://cdn.simpleicons.org/python/3776AB" alt="Python" height="36"/></td>
    <td><img src="https://cdn.simpleicons.org/fastapi/009688" alt="FastAPI" height="36"/></td>
    <td><img src="https://cdn.simpleicons.org/slack/4A154B" alt="Slack" height="36"/></td>
    <td><img src="https://cdn.simpleicons.org/openai/412991" alt="OpenAI" height="36"/></td>
    <td><img src="https://cdn.simpleicons.org/sqlite/044A64" alt="SQLite" height="36"/></td>
    <td><img src="https://cdn.simpleicons.org/docker/2496ED" alt="Docker" height="36"/></td>
    <td><img src="https://cdn.simpleicons.org/tailwindcss/38B2AC" alt="Tailwind CSS" height="36"/></td>
  </tr>
  <tr>
    <td align="center">Python 3.12</td>
    <td align="center">FastAPI</td>
    <td align="center">Slack Platform</td>
    <td align="center">OpenAI API</td>
    <td align="center">SQLite</td>
    <td align="center">Docker & Compose</td>
    <td align="center">Tailwind-inspired UI</td>
  </tr>
</table>

## Recent Wins
- Hardened patch application pipeline with context-anchored edit operations, reducing AI diff failures and ensuring deterministic file updates.
- Delivered a dark-themed web console so reviewers can quickly skim investigations and applied patches.
- Enabled natural language install flows (e.g., “work install dependencies”) with safe allowlisted command execution and runtime summaries.

## Roadmap & Next Enhancements
- **Expanded Command Palette:** Broaden the safe-command allowlist (migrations, smoke tests) with per-environment guardrails and execution cost estimates.
- **Previewable Patch Ops:** Add a UI/API step to visualize parsed edit operations before committing for easier human approval.
- **Diff Quality Feedback Loop:** Collect post-apply metrics to steer prompt adjustments (or fine-tuning) that prevent malformed hunks at the source.
- **Team Visibility:** Surface run history dashboards and SLA alerts so PMs can monitor mean-time-to-resolution across projects.

## Call to Action
Looking for collaborators who want to ship faster without sacrificing control. If you’re exploring AI-assisted product operations, DevTalk offers a ready-made sandbox to plug into your existing repos and messaging tools.
