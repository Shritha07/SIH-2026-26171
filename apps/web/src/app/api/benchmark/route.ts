import { NextResponse } from 'next/server';
import { runFullBenchmarkSuite } from '@privacy-agent/privacy-core/src/benchmark-runner';

export async function GET() {
  try {
    const metrics = runFullBenchmarkSuite();
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Benchmark execution error' }, { status: 500 });
  }
}
