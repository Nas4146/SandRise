# Exploring Next Ingestion Platform — Implementation Plan

## 1. Objective
Create a lightweight ingestion pipeline that accepts links from SMS and Slack, standardizes the payload, and posts items directly to the "Exploring Next" queue surfaced on sandrise.studio.

## 2. Success Criteria
- ✅ SMS (Twilio) and Slack submissions populate the shared data store within 5 seconds.
- ✅ Each item is categorized automatically (`tool`, `article`, `research`, `api`) with <5% manual corrections.
- ✅ Duplicate URLs are rejected with a helpful response.
- ✅ Astro site reflects new entries within 5 minutes (webhook-triggered rebuild) or instantly via client-side fetch.
- ✅ All requests are authenticated and logged; secrets are rotated through Wrangler/Twilio/Slack consoles.

## 3. Current State Snapshot
- `ExploringNext.astro` renders a static `exploringItems` array.
- No external data source or automated ingestion exists.
- Supabase instance available (assumption) for storing other portfolio data.

## 4. Target Architecture Overview
- **Inbound Channels**
  - Twilio Programmable SMS → HTTP POST to `/ingest/twilio`.
  - Slack Slash Command `/explore` (or bot DM) → HTTP POST to `/ingest/slack`.
- **Processing Layer**
  - Cloudflare Worker (`exploring-ingest`) normalizes payloads, verifies signatures, and extracts metadata.
- **Persistence**
  - Supabase table `exploring_next` holds normalized records.
- **Publishing**
  - Optional Cloudflare Worker endpoint to emit JSON (or Supabase REST directly).
  - Astro site fetches data at build time or client-side; rebuild triggered via webhook.

```
SMS/Slack → Cloudflare Worker → Supabase → (Rebuild webhook) → Astro site
```

## 5. Data Model
| Column            | Type        | Notes                                      |
|-------------------|-------------|--------------------------------------------|
| `id`              | UUID        | Default `gen_random_uuid()`                |
| `title`           | text        | Derived from OG title or message fallback  |
| `url`             | text        | Unique constraint to prevent duplicates    |
| `type`            | text        | `tool` \| `article` \| `research` \| `api` |
| `description`     | text        | Metadata description or trailing text      |
| `source_channel`  | text        | `twilio` or `slack`                        |
| `source_context`  | jsonb       | Phone number, Slack user/channel IDs       |
| `discovered_at`   | timestamptz | Defaults to `now()`                        |

## 6. Implementation Phases

### Phase 0 — Prerequisites
- [ ] Create/select Supabase project; run `CREATE TABLE` from plan.
- [ ] Reserve Twilio phone number; configure messaging webhook URL (temporary ngrok during dev).
- [ ] Create Slack app with Slash Command; capture signing secret.
- [ ] Provision Cloudflare Worker via `npm create cloudflare@latest exploring-ingest`.

### Phase 1 — Cloudflare Worker Ingestion
- Scaffold worker with `fetch` handler routing `/ingest/twilio` and `/ingest/slack`.
- Add environment flags `ENABLE_TWILIO`, `ENABLE_SLACK` for configurable channel enablement.
- Implement Twilio signature validation and Slack HMAC check.
- Parse incoming payloads, extract URL via regex, fetch OG metadata, classify type, and build normalized record.
- Return channel-specific responses (Twilio XML, Slack JSON).

### Phase 2 — Persistence & Deduplication
- Add Supabase REST insert call using service-role key stored as a secret.
- Enforce unique constraint on `url`; handle 409 conflicts gracefully with custom message.
- Include optional Slack notification to confirm ingestion (future optional).

### Phase 3 — Publishing for Astro
- Option A: Add worker route `/exploring-next.json` that queries Supabase REST and returns curated JSON.
- Option B: Read from Supabase directly during Astro build (`getStaticPaths`/`getCollection`).
- Update `ExploringNext.astro` to fetch dynamic data:
  - If preferring static: fetch data during `astro:content` load using environment secret.
  - If preferring live: hydrate minimal client component to fetch JSON at runtime.
- Introduce fallback messaging if fetch fails.

### Phase 4 — Rebuild Automation & Monitoring
- Configure Vercel/Netlify webhook (`BUILD_WEBHOOK_URL`) invoked via `ctx.waitUntil` after successful insert.
- Add logging (console statements shipped to Cloudflare logs) and optional error notifications (Slack webhook).
- Document manual admin tasks (deleting entries via Supabase dashboard).

## 7. Configuration & Secrets Matrix
| Variable / Secret              | Location                 | Purpose                              |
|--------------------------------|--------------------------|--------------------------------------|
| `ENABLE_TWILIO`                | Worker plain var         | Gate SMS channel                     |
| `ENABLE_SLACK`                 | Worker plain var         | Gate Slack channel                   |
| `TWILIO_AUTH_TOKEN`            | Worker secret             | Validate Twilio signatures           |
| Twilio phone number SID        | Twilio Console           | Route inbound SMS to Worker          |
| `SLACK_SIGNING_SECRET`         | Worker secret             | Verify Slack HMAC                    |
| Slack slash command token      | Slack app config          | Provide command to users             |
| `SUPABASE_URL`                 | Worker plain var         | Base REST endpoint                   |
| `SUPABASE_SERVICE_ROLE_KEY`    | Worker secret             | Authenticated write access           |
| `SUPABASE_EXPLORING_TABLE`     | Worker plain var (opt)    | Custom table name if needed          |
| `BUILD_WEBHOOK_URL`            | Worker secret (optional)  | Trigger site rebuild                 |
| `TWILIO_SUCCESS_MESSAGE`       | Worker plain var (opt)    | Custom SMS confirmation              |
| `SLACK_SUCCESS_MESSAGE`        | Worker plain var (opt)    | Custom Slack response                |

## 8. Security & Compliance
- Enforce HTTPS-only endpoints (Cloudflare Worker default).
- Use signing verification before processing input.
- Limit body size and rate-limit by channel (Cloudflare routes).
- Store minimal context (mask phone numbers if required).
- Rotate secrets quarterly; document process in README.

## 9. Deployment Workflow
1. Local development with `wrangler dev --remote` and ngrok for Twilio testing.
2. Deploy Worker via `wrangler deploy` (staging then production environment).
3. Configure Twilio + Slack webhooks to point at production Worker URL.
4. Update infrastructure README and notify stakeholders.

## 10. Testing Strategy
- **Unit tests** (Miniflare) for URL parsing, classification, metadata fallback.
- **Integration tests**
  - Simulated Twilio POST verifying XML response.
  - Simulated Slack payload verifying HMAC rejection on tamper.
  - End-to-end: Worker → Supabase entry created, rebuild webhook fired.
- **Manual UAT**
  - Send SMS with article URL.
  - Trigger Slack command with metadata.
  - Confirm item rendering on site.

## 11. Rollout Plan
- Launch in staging (Twilio test number, private Slack channel) for 24 hours.
- Monitor logs and Supabase entries.
- Toggle `ENABLE_TWILIO`/`ENABLE_SLACK` in production once stable.
- Announce workflow in README / internal docs.

## 12. Future Enhancements
- Auto-summarization via OpenAI/Anthropic for richer descriptions.
- Admin dashboard to edit/reorder items.
- Support email forwarding (SendGrid, Postmark).
- Weekly digest summarizing new additions.
- Automatic archive after items are marked "explored".
