#!/usr/bin/env node

/**
 * Apply Supabase RLS policies via REST API
 * Usage: node supabase/apply-policies.js <project-ref> <service-role-key>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [projectRef, serviceRoleKey] = process.argv.slice(2);

if (!projectRef || !serviceRoleKey) {
  console.error('Usage: node apply-policies.js <project-ref> <service-role-key>');
  console.error('Example: node apply-policies.js abcdefghij eyJhbGci...');
  process.exit(1);
}

const SUPABASE_URL = `https://${projectRef}.supabase.co`;
const SQL_FILE = path.join(__dirname, 'migrations', '001_exploring_next_rls.sql');

async function applyPolicies() {
  console.log('📋 Reading SQL migration file...');
  const sqlContent = fs.readFileSync(SQL_FILE, 'utf-8');
  
  // Remove comments and split into statements
  const statements = sqlContent
    .split('\n')
    .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
    .join('\n')
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('/*'));

  console.log(`\n🔧 Applying ${statements.length} SQL statements to ${SUPABASE_URL}...\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    console.log(`[${i + 1}/${statements.length}] Executing: ${statement.substring(0, 80)}...`);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ query: statement })
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`❌ Failed (${response.status}): ${text}`);
        
        // Try alternative endpoint (direct query via PostgREST)
        console.log('   Trying direct SQL endpoint...');
        const altResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/vnd.pgrst.object+json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({ query: statement })
        });

        if (!altResponse.ok) {
          const altText = await altResponse.text();
          console.error(`   ❌ Also failed: ${altText}`);
        } else {
          console.log('   ✅ Success via alternative endpoint');
        }
      } else {
  await response.json().catch(() => null);
  console.log(`   ✅ Success`);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n🎉 Policy application complete!');
  console.log('\nNext steps:');
  console.log('1. Verify in Supabase Dashboard → Authentication → Policies');
  console.log('2. Test with: npm run dev --prefix workers/exploring-ingest');
}

applyPolicies().catch(console.error);
