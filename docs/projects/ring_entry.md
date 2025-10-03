# Ring — Job Alert Automation

**Role:** Product Manager / Product Builder

## Snapshot
Ring is a modular job discovery and alerting agent that scouts product management openings for target companies every few minutes. It stitches together Google Custom Search with direct ATS integrations, applies opinionated filters for title and location fit, and pushes ready-to-apply opportunities to me via iMessage and Slack before they hit the broader market.

## Status
**Status:** Private beta (running nightly + on-demand for personal use)

## Tech Stack Spotlight
<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" height="36" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" alt="Google Cloud Custom Search" height="36" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" alt="Slack" height="36" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple iMessage Automations" height="36" />
</p>

## What It Delivers
- Near-real-time aggregation across Google CSE plus Greenhouse, Lever, Ashby, SmartRecruiters, Workable, and Workday boards.
- Smart filters covering role title, geography, hybrid/remote preferences, and deduped canonical job keys.
- Multi-channel notifications with batching, rate limits, and sanity-check dry runs for fast iteration.
- Operational guardrails: rotating logs, quota-aware retries, and heartbeat state files for quick health checks.

## Coming Next
- Expand direct Workday coverage with richer per-company configuration and multilingual support.
- Ship lightweight metrics dashboard that surfaces per-source yield, latency, and skipped-reason trends without digging into logs.
- Automate post-alert workflow: auto-generate outreach snippets and sync accepted roles into an Airtable pipeline for follow-up tracking.
