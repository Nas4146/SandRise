# SandRise Domain, Hosting, and Email Launch Plan

## 1. Objective
Provide a clear, low-maintenance path to launch sandrise.io on a custom domain with Cloudflare Pages hosting, Cloudflare-managed DNS, and email forwarding, while keeping the existing Cloudflare Worker + Supabase ingestion stack operational.

## 2. Success Criteria
- ✅ `sandrise.io` (and `www.sandrise.io`) resolve to the Astro site served via Cloudflare Pages.
- ✅ TLS is issued and enforced automatically through Cloudflare within 30 minutes of cutover.
- ✅ Exploring Next ingestion Worker continues to function via a permanent subdomain (`ingest.sandrise.io`) with no downtime during migration.
- ✅ Email forwarding enabled for `nsanders@sandrise.io` to personal Gmail account.
- ✅ Documentation captures deployment, DNS, and email steps so future changes take <30 minutes.

## 3. Current State (✅ ALL PHASES COMPLETE)
- ✅ Astro portfolio live at `sandrise.io` and `www.sandrise.io`
- ✅ Cloudflare Pages deployed with GitHub auto-deploy from `main` branch
- ✅ Cloudflare Worker (`exploring-ingest`) accessible at `ingest.sandrise.io`
- ✅ Twilio SMS webhook configured and tested
- ✅ Email forwarding configured: `nsanders@sandrise.io` → `nick.sanders.a@gmail.com`
- ✅ DNS zone fully configured with all required records
- ✅ TLS active on all domains

## 4. Deployed Stack Overview
- **Registrar & DNS**: Cloudflare Registrar + Cloudflare DNS (single control plane, automatic DNSSEC, free proxy/CDN).
- **Static Hosting**: Cloudflare Pages (free tier, automatic builds from GitHub, preview deployments).
- **Edge Functions**: Cloudflare Worker bound via custom route (`ingest.sandrise.io`).
- **Email**: Cloudflare Email Routing (free forwarding to personal Gmail).
- **Monitoring**: Cloudflare Analytics for Pages + Worker logs via `wrangler tail`.

```
GitHub (main) ──▶ Cloudflare Pages (sandrise.io)
                               │
                               └─▶ Cloudflare DNS (Apex + www)

Twilio SMS ──▶ Cloudflare Worker (ingest.sandrise.io) ──▶ Supabase
Slack (future) ────────────────────────────────────────────▲

Email (nsanders@sandrise.io) ──▶ Cloudflare Email Routing ──▶ nick.sanders.a@gmail.com
```

## 5. Implementation Summary (Completed Phases)

### ✅ Phase 0 — Accounts & Access
- Confirmed Cloudflare account with admin access (same tenant as Worker)
- Verified GitHub repo owner can authorize Cloudflare Pages integration
- Payment method configured for domain purchase

### ✅ Phase 1 — Domain Acquisition & DNS Zone
- Purchased `sandrise.io` through Cloudflare Registrar
- DNS zone automatically provisioned with nameservers
- Enabled Universal SSL and Always Use HTTPS
- Configured initial DNS records

### ✅ Phase 2 — Cloudflare Pages Deployment
- Created Pages project `sandrise` connected to GitHub repo `Nas4146/SandRise`
- Build settings: Astro framework, `npm run build`, output `dist/`
- Environment variables: `NODE_VERSION=18`
- Custom domains assigned: `sandrise.io` and `www.sandrise.io`
- Added redirect middleware to prevent `sandrise.pages.dev` access (301 redirect to `sandrise.io`)

### ✅ Phase 3 — Worker Routing Alignment
- Added custom domain `ingest.sandrise.io` to `exploring-ingest` Worker
- Removed conflicting manual CNAME (Cloudflare manages this automatically)
- Updated Twilio webhook to `https://ingest.sandrise.io/ingest/twilio`
- Tested SMS ingestion end-to-end successfully

### ✅ Phase 4 — Email Forwarding Setup
- Enabled Cloudflare Email Routing for `sandrise.io`
- Created custom address: `nsanders@sandrise.io`
- Configured forwarding destination: `nick.sanders.a@gmail.com`
- Verified email forwarding via test message

### ✅ Phase 5 — Cutover & Validation
- Verified `https://sandrise.io` loads with TLS
- Verified `https://www.sandrise.io` loads with TLS
- Confirmed `https://sandrise.pages.dev` redirects to `sandrise.io` (301)
- Tested DNS resolution for apex, www, and ingest subdomains
- Validated Twilio SMS ingestion via `ingest.sandrise.io/ingest/twilio`
- Verified feed endpoint: `https://ingest.sandrise.io/feed`
- Tested email forwarding successfully

## 6. DNS Record Matrix (Production)
| Hostname | Type  | Value / Target                                     | Proxy | Purpose                              |
|----------|-------|-----------------------------------------------------|-------|--------------------------------------|
| `sandrise.io` | CNAME | `sandrise.pages.dev` (auto-managed by Cloudflare) | ON    | Root domain to Cloudflare Pages      |
| `www`     | CNAME | `sandrise.pages.dev`                                | ON    | WWW subdomain                        |
| `ingest`  | CNAME | (auto-managed by Worker custom domain)             | ON    | Worker route for Exploring Next      |
| `@`       | MX    | (auto-managed by Email Routing)                    | OFF   | Email routing MX records             |
| `@`       | TXT   | (auto-managed by Email Routing)                    | OFF   | SPF record for email                 |

> **Note:** Email routing MX and TXT records are automatically created and managed by Cloudflare Email Routing. They cannot be proxied.

## 7. Email Routing Configuration

### Current Setup
- **Service**: Cloudflare Email Routing (Free)
- **Custom Address**: `nsanders@sandrise.io`
- **Forwarding To**: `nick.sanders.a@gmail.com`
- **Status**: Active and verified

### How to Manage
1. Navigate to Cloudflare dashboard → `sandrise.io` → **Email** → **Email Routing**
2. View/edit destination addresses under **Destination addresses**
3. Add/remove custom addresses under **Custom addresses**
4. Monitor email statistics in the dashboard

### Adding Additional Addresses
To add more forwarding addresses (e.g., `hello@sandrise.io`, `contact@sandrise.io`):
1. Go to Email Routing → **Custom addresses**
2. Click **Create address**
3. Enter local part (e.g., `hello`)
4. Select or add destination email
5. Click **Save**

### Sending Email
Currently configured for **receiving only**. To send email from `@sandrise.io`:
- Use Gmail's "Send mail as" feature with `nsanders@sandrise.io`
- Or integrate a transactional email service (SendGrid, Postmark) for automated sends

## 8. Operations Playbook

### Deployments
- **Trigger**: Push to `main` branch → Cloudflare Pages auto-build
- **Hotfix**: Trigger manual redeploy from Pages dashboard
- **Rollback**: Pages → Deployments → Promote previous build

### Secrets Management
- **Pages**: Settings → Environment Variables
- **Worker**: `wrangler secret put <SECRET_NAME>` in `workers/exploring-ingest/`

### Backups
- **Site Content**: Git history provides version control
- **Email**: Forwarded to Gmail (archived there)
- **Supabase Data**: Consider periodic exports via Supabase dashboard

### Monitoring
- **Site Uptime**: Cloudflare Pages Analytics + Build notifications
- **Worker Logs**: `cd workers/exploring-ingest && wrangler tail`
- **Email Routing**: Cloudflare Email Routing dashboard stats
- **SMS Ingestion**: Monitor Supabase table `exploring_next` for new rows

### Incident Response
- **Site Down**: Check Pages deployment status; rollback if needed
- **Worker Issues**: Check Worker logs; redeploy if needed; fallback to `exploring-ingest.nick-sanders-a.workers.dev`
- **Email Not Forwarding**: Verify Email Routing status; check destination email (Gmail) spam folder
- **SMS Not Ingesting**: Check Twilio logs; verify Worker endpoint accessible; check Supabase connection

## 9. Cost, Timeline, and Ownership

### Costs
- **Domain**: ~$12-15/year for `.io` (Cloudflare Registrar at-cost)
- **Cloudflare Pages**: Free tier (sufficient for portfolio)
- **Cloudflare Workers**: Free tier (sufficient for current usage)
- **Email Routing**: Free (up to unlimited addresses)
- **Total**: ~$15/year

### Timeline Achieved
- Domain purchase: Day 1
- Pages deployment: Day 1
- Worker routing: Day 1
- Email forwarding: Day 1
- **Total**: <1 day (faster than 2.5-day estimate)

### Ownership
- **Domain & DNS**: Nick (Cloudflare admin)
- **Site Deployments**: Nick (GitHub + Cloudflare Pages)
- **Worker Maintenance**: Nick
- **Email Admin**: Nick (Cloudflare Email Routing)

## 10. Future Enhancements

### Immediate Next Steps
- Enable DNSSEC for added security (Optional, low priority)
- Monitor analytics for first week
- Test email forwarding with various senders

### Longer-Term Enhancements
- Automate Astro rebuild via Worker webhook when new Exploring Next items land
- Add staging branch mapped to `preview.sandrise.io` with password protection
- Integrate analytics (Plausible or Cloudflare Web Analytics)
- Add Slack ingestion channel alongside SMS
- Set up Slack notifications for Pages deploy status and Worker errors
- Consider transactional email provider (SendGrid/Postmark) if contact forms added
- Add additional email aliases (`hello@`, `contact@`) as needed

## 11. Testing & Validation Commands

### Site Availability
```bash
# Main site
curl -I https://sandrise.io
# Should return: HTTP/2 200

# WWW subdomain
curl -I https://www.sandrise.io
# Should return: HTTP/2 200

# Pages.dev redirect
curl -I https://sandrise.pages.dev
# Should return: HTTP/2 301, Location: https://sandrise.io/
```

### Worker Endpoints
```bash
# Feed endpoint
curl https://ingest.sandrise.io/feed
# Should return: JSON with exploring items

# Health check (old domain still works)
curl https://exploring-ingest.nick-sanders-a.workers.dev/feed
# Should return: Same JSON
```

### DNS Resolution
```bash
# Apex domain
dig sandrise.io

# WWW subdomain
dig www.sandrise.io

# Ingest subdomain
dig ingest.sandrise.io
```

### SMS Ingestion Test
```bash
# Send SMS to Twilio number with a URL
# Then check feed:
curl https://ingest.sandrise.io/feed | jq '.items[0]'

# Or watch Worker logs live:
cd workers/exploring-ingest && wrangler tail
```

## 12. Completion Checklist

### Domain & Hosting
- ✅ Domain purchased and DNS zone configured
- ✅ Cloudflare Pages project deployed and custom domain validated
- ✅ WWW subdomain configured and active
- ✅ Pages.dev redirect implemented (301 to custom domain)
- ✅ TLS/HTTPS active on all domains

### Worker Integration
- ✅ Worker custom domain `ingest.sandrise.io` configured
- ✅ Twilio webhook updated and tested
- ✅ SMS ingestion validated end-to-end
- ✅ Feed endpoint accessible and returning data

### Email Configuration
- ✅ Cloudflare Email Routing enabled
- ✅ Custom address `nsanders@sandrise.io` created
- ✅ Forwarding to `nick.sanders.a@gmail.com` verified
- ✅ Email forwarding tested successfully

### Documentation & Operations
- ✅ Deployment plan documented with all phases
- ✅ Operations playbook created
- ✅ Testing commands provided
- ✅ Credentials stored securely

---

**Status**: 🎉 **PRODUCTION READY** - All systems operational as of October 3, 2025
