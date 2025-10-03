# IzzoCam — AI Commentary for a Beloved Dog

## Quick Facts

| | |
| --- | --- |
| **Stage** | TestFlight beta (weekly App Store submissions queued post-processing) |
| **Platforms** | iOS app (SwiftUI) + Node/TypeScript backend on Google Cloud Run |
| **Launch Cadence** | Daily backend releases, weekly iOS TestFlight drops |
| **Latest Milestone** | Moved tune-in events to a live stream chip and cleaned the commentary feed (October 2025) |

## Elevator Pitch

IzzoCam transforms a simple pet camera into a real-time storytelling companion. The system watches Izzo the dog via LiveKit, selects the most engaging frames, and uses AI to deliver playful commentary straight to iOS viewers.

## My Role

- Own the product vision, positioning, and roadmap spanning stream ingestion, AI generation, and mobile experience.
- Coordinate engineering and design to ship incremental value daily while safeguarding reliability and OpenAI cost envelopes.
- Define success metrics, instrument monitoring, and drive feature flag rollouts/rollbacks.

## Product Highlights

- **Live tune-in notifications:** Surface real-time viewer arrivals via a lightweight live-chip animation without cluttering the commentary feed.
- **AI commentary engine:** Provider rotation, persona configuration, and cost-aware prompt design keep the narrative fresh and on budget.
- **Daily release pipeline:** Automated canary deploys, fast rollbacks, and scriptable sanity checks maintain confidence in production.
- **iOS-first experience:** SwiftUI app orchestrates LiveKit streaming, Firebase auth, and background metrics polling to keep fans connected.

## Outcomes & Impact

- Reduced commentary feed noise by separating tune-in events, preparing the UI for richer storytelling moments.
- Normalized daily deploys with guardrails (feature flags, monitoring scripts) to preserve 95%+ commentary success rates.
- Strengthened cross-pipeline observability with scripts for provider rotation, stream health, and Firestore collection hygiene.

## Tech Stack & Tooling

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" alt="Swift" height="36" />
  <img src="https://developer.apple.com/assets/elements/icons/swiftui/swiftui-96x96_2x.png" alt="SwiftUI" height="36" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xcode/xcode-original.svg" alt="Xcode" height="36" />
  <img src="https://firebase.google.com/static/images/brand-guidelines/logo-logomark.png" alt="Firebase" height="36" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/512px-Google_Cloud_logo.svg.png" alt="Google Cloud" height="36" />
  <img src="https://seeklogo.com/images/L/livekit-logo-0F8C2B32A9-seeklogo.com.png" alt="LiveKit" height="36" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" height="36" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" height="36" />
  <img src="https://seeklogo.com/images/F/fastlane-logo-6BFD96A905-seeklogo.com.png" alt="Fastlane" height="36" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" alt="OpenAI" height="36" />
</p>

## What I'm Focusing on Next

- Broader personalization by blending user-submitted context with automated commentary rounds.
- A lightweight web viewer to complement the iOS experience and expand reach beyond TestFlight.
- Smarter cost controls that adjust model selection based on activity levels and time of day.
