#!/bin/bash
# Test ingestion endpoints locally

WORKER_URL="http://localhost:8787"

echo "🧪 Testing Exploring Next Ingestion Worker"
echo "==========================================="
echo ""

# Test 1: Feed endpoint (should be empty initially)
echo "📋 Test 1: GET /feed"
echo "Expected: Empty items array"
curl -s "$WORKER_URL/feed" | jq '.'
echo ""
echo ""

# Test 2: Simulated Twilio SMS with URL
echo "📱 Test 2: POST /ingest/twilio (simulated SMS)"
echo "Note: This will fail signature verification but shows the flow"
curl -s -X POST "$WORKER_URL/ingest/twilio" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "Body=Check out this cool AI tool https://continue.dev - looks interesting" \
  -d "From=%2B15555551234" \
  -d "To=%2B15555556789"
echo ""
echo ""

# Test 3: Direct Supabase insert (bypassing Twilio auth)
echo "💉 Test 3: Direct insert via Supabase REST API"
echo "Inserting test item..."

read -p "Enter your Supabase service_role key: " -s SERVICE_KEY
echo ""

SUPABASE_URL=$(grep SUPABASE_URL .dev.vars | cut -d'=' -f2 | tr -d '"')

curl -s -X POST "$SUPABASE_URL/rest/v1/exploring_next" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "Continue.dev - AI coding assistant",
    "url": "https://continue.dev",
    "type": "tool",
    "description": "AI-powered coding assistant for VS Code and JetBrains",
    "source_channel": "manual_test",
    "discovered_at": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }' | jq '.'

echo ""
echo ""

# Test 4: Feed endpoint again (should show the item)
echo "📋 Test 4: GET /feed (should show test item)"
curl -s "$WORKER_URL/feed" | jq '.'
echo ""
echo ""

echo "✅ Testing complete!"
echo ""
echo "Next steps:"
echo "1. If you see the test item in the feed, the integration works!"
echo "2. Apply RLS policies in Supabase dashboard if you haven't already"
echo "3. Register workers.dev subdomain to deploy: https://dash.cloudflare.com/workers/onboarding"
