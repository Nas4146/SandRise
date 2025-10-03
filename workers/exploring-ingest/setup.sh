#!/bin/bash
# Quick setup script for Exploring Next ingestion worker

set -e

echo "🚀 Exploring Next Worker Setup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "wrangler.toml" ]; then
  echo "❌ Error: Must run from workers/exploring-ingest directory"
  exit 1
fi

# Prompt for Supabase project ref
echo "📋 Step 1: Supabase Configuration"
echo "Go to your Supabase project → Settings → API"
echo ""
read -p "Enter your Supabase project ref (e.g., 'abcdefghij' from the URL): " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Project ref required"
  exit 1
fi

# Update wrangler.toml
echo "Updating wrangler.toml..."
sed -i.backup "s|YOUR_PROJECT_REF|$PROJECT_REF|g" wrangler.toml
rm wrangler.toml.backup
echo "✅ Updated SUPABASE_URL in wrangler.toml"
echo ""

# Create .dev.vars for local development
echo "📋 Step 2: Local Development Secrets"
echo "Creating .dev.vars file for local testing..."
echo ""

read -p "Enter your Supabase service_role key: " -s SERVICE_ROLE_KEY
echo ""

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "⚠️  Warning: No service role key provided - you'll need to add it manually"
  SERVICE_ROLE_KEY="your_service_role_key_here"
fi

cat > .dev.vars << EOF
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
TWILIO_AUTH_TOKEN=test_token_for_local_dev
SLACK_SIGNING_SECRET=test_secret_for_local_dev
BUILD_WEBHOOK_URL=
EOF

echo "✅ Created .dev.vars"
echo ""

echo "📋 Step 3: RLS Policies"
echo "You need to apply RLS policies to Supabase:"
echo "1. Open Supabase dashboard → SQL Editor"
echo "2. Copy contents of: ../../supabase/migrations/001_exploring_next_rls.sql"
echo "3. Paste and run in SQL Editor"
echo ""
read -p "Press Enter once you've applied the RLS policies..."

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Test locally: npm run dev"
echo "2. Set production secrets: npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY"
echo "3. Deploy: npm run deploy"
echo ""
