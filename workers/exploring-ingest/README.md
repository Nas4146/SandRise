# Cloudflare Worker Environment Setup

Replace `YOUR_PROJECT_REF` in `wrangler.toml` with your actual Supabase project reference (from the project URL).

Then set secrets using wrangler:

```bash
cd workers/exploring-ingest

# Required secrets
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Paste your service_role key when prompted

npx wrangler secret put TWILIO_AUTH_TOKEN
# Paste your Twilio auth token

npx wrangler secret put SLACK_SIGNING_SECRET
# Paste your Slack app signing secret

# Optional: rebuild webhook
npx wrangler secret put BUILD_WEBHOOK_URL
# Paste your Vercel/Netlify deploy webhook URL
```

## Getting Supabase credentials

1. Open your EmergingQueue project in Supabase
2. Go to **Settings → API**
3. Copy:
   - **Project URL** → replace `YOUR_PROJECT_REF` in `wrangler.toml`
   - **service_role** secret key → use for `SUPABASE_SERVICE_ROLE_KEY`

## Local development

```bash
# Start worker in dev mode (will prompt for missing secrets)
npm run dev

# Test endpoints
curl -X POST http://localhost:8787/feed
```
