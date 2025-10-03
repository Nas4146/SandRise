---
title: "Ring — Job alert automation"
summary: "Modular scouting agent that hunts PM openings across CSE + ATS feeds and delivers ready-to-apply leads before they trend."
category: "Automation"
role: "Product Manager & Product Builder"
timeline: "Ongoing"
heroImage: "/images/projects/ring.svg"
heroAlt: "Ring job alert automation system"
impact: "Private beta · Nightly + on-demand runs"
draft: true
tags:
  - Python
  - Google Cloud
  - Slack
  - Apple
metrics:
  - label: "Cadence"
    value: "Every few minutes"
    hint: "Nightly + on-demand runs"
  - label: "Sources"
    value: "Google CSE + ATS"
    hint: "Greenhouse, Lever, Ashby, Workday"
  - label: "Delivery"
    value: "Slack & iMessage"
    hint: "Actionable, deduped alerts"
problem: "New PM roles move fast. Manually polling company boards wastes hours and loses the first-mover advantage. Ring automates discovery, filtering, and notifications so I can apply before listings go viral."
roleDetail: "Designed and built the agent architecture spanning Google CSE, direct ATS integrations, smart filters, and multi-channel delivery with guardrails, quotas, and health monitoring."
process:
  - title: "Source aggregation"
    description: "Federated Google Custom Search with direct Greenhouse, Lever, Ashby, Workday, and SmartRecruiters scrapers to capture fresh postings."
  - title: "Signal filtering"
    description: "Applied opinionated rules for title, geography, hybrid preferences, and deduped canonical job keys to surface only relevant roles."
  - title: "Notification pipeline"
    description: "Delivered ready-to-apply leads through Slack and iMessage with batching, sanity-check dry runs, and quota-aware retries."
outcomes:
  - "Identified qualified PM roles minutes after posting with automated hand-off."
  - "Built rotating logs, heartbeat state files, and retry backoff for resilient runs."
  - "Laid groundwork for future metrics dashboard and outreach automations."
reflection: "Career leverage comes from speed to signal. Ring keeps the scouting loop running so I can focus on thoughtful outreach instead of refreshing job boards."
---
