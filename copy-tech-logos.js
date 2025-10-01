// Quick script to copy tech logos from simple-icons package
// Run: node copy-tech-logos.js (after installing simple-icons)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = 'node_modules/simple-icons/icons';
const targetDir = 'public/images/tech';

// Mapping of component names to simple-icons filenames
const logoMapping = {
  // Languages & Frameworks
  'typescript.svg': 'typescript.svg',
  'javascript.svg': 'javascript.svg',
  'python.svg': 'python.svg',
  'swift.svg': 'swift.svg',
  'react.svg': 'react.svg',
  'react-native.svg': 'react.svg', // Use same as react
  'nextjs.svg': 'nextdotjs.svg',
  'astro.svg': 'astro.svg',
  'nodejs.svg': 'nodedotjs.svg',
  
  // Cloud Platforms
  'aws.svg': 'amazonaws.svg',
  'azure.svg': 'microsoftazure.svg',
  'gcp.svg': 'googlecloud.svg',
  'vercel.svg': 'vercel.svg',
  'docker.svg': 'docker.svg',
  'kubernetes.svg': 'kubernetes.svg',
  
  // Databases & Backend
  'postgresql.svg': 'postgresql.svg',
  'mongodb.svg': 'mongodb.svg',
  'redis.svg': 'redis.svg',
  'supabase.svg': 'supabase.svg',
  'firebase.svg': 'firebase.svg',
  'graphql.svg': 'graphql.svg',
  
  // Product & Analytics
  'mixpanel.svg': 'mixpanel.svg',
  'amplitude.svg': 'amplitude.svg',
  'segment.svg': 'segment.svg',
  'posthog.svg': 'posthog.svg',
  'ga.svg': 'googleanalytics.svg',
  'datadog.svg': 'datadog.svg',
  
  // Design & Prototyping
  'figma.svg': 'figma.svg',
  'framer.svg': 'framer.svg',
  'storybook.svg': 'storybook.svg',
  'adobe-xd.svg': 'adobexd.svg',
  
  // Development Tools
  'git.svg': 'git.svg',
  'github.svg': 'github.svg',
  'vscode.svg': 'visualstudiocode.svg',
  'linear.svg': 'linear.svg',
  'jira.svg': 'jira.svg',
  'notion.svg': 'notion.svg',
  
  // Testing & Quality
  'jest.svg': 'jest.svg',
  'cypress.svg': 'cypress.svg',
  'playwright.svg': 'playwright.svg',
  'postman.svg': 'postman.svg',
  
  // Mobile Development
  'expo.svg': 'expo.svg',
  'xcode.svg': 'xcode.svg',
  'swiftui.svg': 'swift.svg', // Use swift logo
  'testflight.svg': 'testflight.svg',
};

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`✅ Created directory: ${targetDir}`);
}

let copied = 0;
let missing = [];

console.log('🚀 Copying technology logos...\n');

Object.entries(logoMapping).forEach(([targetName, sourceName]) => {
  const sourcePath = path.join(sourceDir, sourceName);
  const targetPath = path.join(targetDir, targetName);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied: ${targetName}`);
    copied++;
  } else {
    console.log(`❌ Missing: ${sourceName} (for ${targetName})`);
    missing.push(sourceName);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Copied: ${copied} logos`);
console.log(`   Missing: ${missing.length} logos`);

if (missing.length > 0) {
  console.log(`\n⚠️  Missing logos:`);
  missing.forEach(name => console.log(`   - ${name}`));
  console.log(`\n💡 Tip: Search for these on https://simpleicons.org/`);
}

console.log(`\n✨ Done! Logos saved to: ${targetDir}/`);
