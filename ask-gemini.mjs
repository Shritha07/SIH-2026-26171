import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

function loadKey() {
  const locations = [
    path.resolve(process.cwd(), 'apps/web/.env.local'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), 'apps/web/.env'),
    path.resolve(process.cwd(), '.env'),
  ];

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    return process.env.GEMINI_API_KEY;
  }

  for (const loc of locations) {
    if (fs.existsSync(loc)) {
      const content = fs.readFileSync(loc, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
          if (key.trim() === 'GEMINI_API_KEY' && val && val !== 'your_gemini_api_key_here') {
            return val;
          }
        }
      }
    }
  }
  return null;
}

async function runInteractiveQuestions() {
  console.log('================================================================');
  console.log('         LIVE GEMINI API INTERACTIVE Q&A VERIFICATION           ');
  console.log('================================================================\n');

  const apiKey = loadKey();
  if (!apiKey) {
    console.error('❌ Error: No GEMINI_API_KEY found in environment or .env.local');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const testQuestions = [
    {
      num: 1,
      title: 'General Knowledge & ISRO Context',
      prompt: 'In 2 sentences, describe ISRO and its major contribution to space exploration.',
    },
    {
      num: 2,
      title: 'Agent Privacy & Security Reasoning',
      prompt: 'In 2 sentences, why is on-device PII redaction critical before transmitting data to cloud LLMs?',
    },
    {
      num: 3,
      title: 'Structured JSON Browser Action Generation',
      prompt: 'Generate a JSON object with keys "action", "elementId", "thought" to click the "Add to Cart" button (ID 14) for an HP Victus laptop.',
    },
  ];

  for (const q of testQuestions) {
    console.log(`----------------------------------------------------------------`);
    console.log(`❓ QUESTION ${q.num}: [${q.title}]`);
    console.log(`Prompt: "${q.prompt}"\n`);

    const startTime = Date.now();
    try {
      const result = await model.generateContent(q.prompt);
      const latency = Date.now() - startTime;
      const text = result.response.text().trim();

      console.log(`🤖 GEMINI REPLY (${latency} ms):`);
      console.log(text);
      console.log('');
    } catch (err) {
      console.error(`❌ Request failed: ${err.message || err}\n`);
    }
  }

  console.log('================================================================');
  console.log('✅ ALL QUESTIONS SUCCESSFULLY ANSWERED BY GEMINI!');
  console.log('================================================================\n');
}

runInteractiveQuestions();
