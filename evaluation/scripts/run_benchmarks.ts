import fs from 'fs';
import path from 'path';
import { runFullBenchmarkSuite } from '../../packages/privacy-core/src/benchmark-runner';
import type { BenchmarkMetrics } from '../../packages/shared-types/src';

export function executeFullBenchmark(): BenchmarkMetrics {
  const metrics = runFullBenchmarkSuite();

  const outputDir = path.resolve(__dirname, '../metrics');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outputDir, 'benchmark_results.json'), JSON.stringify(metrics, null, 2));

  return metrics;
}

if (require.main === module) {
  console.log('================================================================');
  console.log('  ISRO SIH Problem 26171 - Evaluation & Benchmark Suite Runner');
  console.log('================================================================\n');

  const res = executeFullBenchmark();

  console.log(`✓ Tested Samples:               ${res.testedSamplesCount}`);
  console.log(`✓ Visual Context Accuracy:      ${res.visualContextAccuracy}%`);
  console.log(`✓ PII Detection Precision:      ${res.piiPrecision}%`);
  console.log(`✓ PII Detection Recall:         ${res.piiRecall}%`);
  console.log(`✓ Redaction Precision:          ${res.redactionPrecision}%`);
  console.log(`✓ Redaction Safety Rate:        ${res.redactionSafetyRate}%`);
  console.log(`✓ Raw PII Leaks Observed:       ${res.rawPiiLeaksObserved} (Verified)`);
  console.log(`✓ On-Device Vision Latency:     ${res.averageInferenceLatencyMs} ms`);
  console.log(`✓ End-to-End Latency:           ${res.averageE2ELatencyMs} ms`);
  console.log(`✓ Client RAM Overhead:          ${res.memoryUsageMb} MB\n`);
  console.log('================================================================');
  console.log('  Benchmark Results Saved to evaluation/metrics/benchmark_results.json');
  console.log('================================================================\n');
}
