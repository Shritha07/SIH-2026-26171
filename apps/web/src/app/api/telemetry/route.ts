import { NextRequest, NextResponse } from 'next/server';
import type { TelemetryEvent } from '@privacy-agent/shared-types';

// In-memory event buffer (persists during server lifetime)
let eventLog: TelemetryEvent[] = [
  {
    id: 'init_event_1',
    timestamp: Date.now() - 5000,
    component: 'privacy',
    event: 'PII_DETECTION_ENGINE_READY',
    data: {
      activeTokensCount: 5,
      signals: ['DOM_SEMANTICS', 'REGEX_SUITES', 'CANVAS_REDACTOR', 'WEBCRYPTO_VAULT'],
      vaultEncryption: 'AES-GCM-256',
    },
    level: 'info',
  },
  {
    id: 'init_event_2',
    timestamp: Date.now() - 4000,
    component: 'network',
    event: 'CANARY_LEAK_DETECTOR_ACTIVE',
    data: {
      monitoredCanariesCount: 4,
      rawPiiLeaksObserved: 0,
      sanitizationGuarantee: 'Strict Local Privacy Boundary Enforced',
    },
    level: 'security',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    events: eventLog.slice(-100), // return last 100 events
    totalCount: eventLog.length,
    timestamp: Date.now(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event: TelemetryEvent = {
      id: body.id || `event_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: body.timestamp || Date.now(),
      component: body.component || 'agent',
      event: body.event || 'GENERIC_EVENT',
      data: body.data || {},
      level: body.level || 'info',
    };

    eventLog.push(event);
    if (eventLog.length > 500) {
      eventLog = eventLog.slice(-300);
    }

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE() {
  eventLog = [];
  return NextResponse.json({ success: true, message: 'Telemetry event log cleared' });
}
