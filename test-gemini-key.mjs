import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
      if (key.trim() === 'GEMINI_API_KEY' && val && val !== 'your_gemini_api_key_here') {
        return { path: filePath, key: val };
      }
    }
  }
  return null;
}

async function verifyGeminiKey() {
  console.log('======================================================');
  console.log('         GOOGLE GEMINI API KEY VERIFICATION           ');
  console.log('======================================================\n');

  // Check possible locations
  const locations = [
    path.resolve(process.cwd(), 'apps/web/.env.local'),
    path.resolve(process.cwd(), 'apps/web/.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
  ];

  let detectedKey = process.env.GEMINI_API_KEY;
  let source = 'System Environment Variable (process.env.GEMINI_API_KEY)';

  if (!detectedKey || detectedKey === 'your_gemini_api_key_here') {
    for (const loc of locations) {
      const found = loadEnvFile(loc);
      if (found) {
        detectedKey = found.key;
        source = found.path;
        break;
      }
    }
  }

  if (!detectedKey || detectedKey === 'your_gemini_api_key_here') {
    console.log('❌ STATUS: GEMINI_API_KEY NOT FOUND\n');
    console.log('No active API key was detected in your environment or .env files.');
    console.log('\nTo configure your key:');
    console.log('1. Create a file named .env.local inside apps/web:');
    console.log('   File path: apps/web/.env.local');
    console.log('2. Add your key inside:');
    console.log('   GEMINI_API_KEY=AIzaSyYourActualKeyHere...');
    console.log('3. Re-run this check.\n');
    console.log('Note: The platform has a built-in Autonomous Heuristic Planner so the demo');
    console.log('and evaluation suite work immediately even without a key.');
    console.log('======================================================\n');
    return;
  }

  const masked = detectedKey.slice(0, 6) + '••••••••••••••••' + detectedKey.slice(-4);
  console.log(`✓ Detected Key: ${masked}`);
  console.log(`✓ Source:       ${source}`);
  console.log('\nSending test prompt to Google Gemini 2.5 Flash / 1.5 Flash...');

  try {
    const genAI = new GoogleGenerativeAI(detectedKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const startTime = Date.now();
    const result = await model.generateContent('Respond with: "GEMINI_API_KEY_VALIDATED_SUCCESSFULLY"');
    const responseText = result.response.text().trim();
    const latency = Date.now() - startTime;

    console.log('\n✅ STATUS: GEMINI API KEY IS VALID & WORKING!');
    console.log(`✓ Model Response: "${responseText}"`);
    console.log(`✓ API Latency:    ${latency} ms`);
    console.log('✓ Secure Server Gateway is ready for live cloud reasoning.\n');
  } catch (err) {
    console.log('\n❌ STATUS: GEMINI API KEY ERROR\n');
    console.log(`Error Message: ${err.message || err}`);
    console.log('\nPossible causes:');
    console.log('1. The key may be invalid, revoked, or expired.');
    console.log('2. The Generative Language API might not be enabled on your Google Cloud project.');
    console.log('3. There might be quota limits or IP restrictions on the key.');
  }

  console.log('======================================================\n');
}

verifyGeminiKey();
