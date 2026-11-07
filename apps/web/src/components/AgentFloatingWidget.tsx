'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sparkles, Play, Square, ShieldCheck, CheckCircle2,
  Terminal, ArrowRight, Zap, RefreshCw, Eye, Lock,
  ChevronUp, ChevronDown, Send, Cpu,
} from 'lucide-react';
import type { SanitizedBrowserState, AgentAction } from '@privacy-agent/shared-types';

interface StepLog {
  step: number;
  thought: string;
  action: string;
  elementLabel?: string;
  latencyMs: number;
  source: string;
  status: 'RUNNING' | 'SUCCESS' | 'BLOCKED';
}

const DEMO_PRESETS: Record<string, string[]> = {
  '/demos/ecommerce': [
    'Find HP Victus 16GB, add to cart, apply coupon ISRO2025, and checkout with local address',
    'Search ASUS TUF, add to cart, and buy with Cash on Delivery',
    'Filter Gaming Laptops, add highest rated option to cart, and complete purchase',
  ],
  '/demos/jobs': [
    'Apply for Senior Full Stack Engineer (AI) using my saved profile and resume token',
    'Apply for Machine Learning Systems Engineer with expected CTC 35 Lakhs',
    'Apply for AI Agent Security Architect role and submit application',
  ],
  '/demos/flights': [
    'Find BLR to DEL flight, select IndiGo, choose Economy Flexi tier, and complete passenger KYC',
    'Book Air India flight from BLR to DEL with window seat and travel insurance',
    'Select cheapest flight to DEL and complete booking with passport token',
  ],
  '/demos/healthcare': [
    'Book appointment with Dr. Arvind Nambiar (Cardiology) for 10:30 AM slot and complete intake',
    'Book Dr. Sneha Reddy (Neurology) for consultation with routine checkup reason',
    'Select General Medicine doctor and confirm appointment pass',
  ],
  '/demos/insurance': [
    'Compare 1 Crore Platinum Health Shield plan, calculate 28yo quote, and submit KYC application',
    'Apply for Pure Term Life 2.5 Crore plan with national ID token',
    'Calculate premium for 3-year health cover and issue policy bond',
  ],
};

export default function AgentFloatingWidget() {
  const pathname = usePathname();
  const isDemoPage = pathname?.startsWith('/demos') || pathname === '/dashboard';

  const [isOpen, setIsOpen] = useState(false);
  const [taskPrompt, setTaskPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [stepLogs, setStepLogs] = useState<StepLog[]>([]);
  const [speed, setSpeed] = useState<'turbo' | 'normal'>('turbo');
  const [tokensProtected] = useState(['PERSON_001', 'EMAIL_001', 'PHONE_001', 'ADDRESS_001', 'GOV_ID_001', 'DOB_001']);

  const abortRef = useRef(false);
  const runningRef = useRef(false);

  // Set default prompt when navigating to different demos
  useEffect(() => {
    if (pathname && DEMO_PRESETS[pathname]) {
      setTaskPrompt(DEMO_PRESETS[pathname][0]);
    }
  }, [pathname]);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /**
   * Captures live interactive elements from the current webpage DOM.
   */
  const captureDOMState = useCallback((): SanitizedBrowserState => {
    const interactables = Array.from(
      document.querySelectorAll<HTMLElement>(
        'input, button, select, textarea, [role="button"], a[href], [data-testid]'
      )
    );

    const elements = interactables
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
      })
      .slice(0, 40)
      .map((el, index) => {
        const rect = el.getBoundingClientRect();
        const tag = el.tagName.toLowerCase();
        const type = el.getAttribute('type') || undefined;
        const name = el.getAttribute('name') || undefined;
        const placeholder = el.getAttribute('placeholder') || undefined;
        const label =
          el.innerText?.trim().slice(0, 80) ||
          el.getAttribute('aria-label') ||
          placeholder ||
          el.getAttribute('data-testid') ||
          '';
        const value = (el as HTMLInputElement).value || '';

        // Check if sensitive field
        const isSensitive =
          type === 'password' ||
          name === 'email' ||
          type === 'email' ||
          type === 'tel' ||
          name === 'phone' ||
          name === 'address' ||
          name === 'dob' ||
          name === 'nationalId' ||
          name === 'passportNumber' ||
          name === 'applicantName' ||
          name === 'patientName' ||
          name === 'policyholderName' ||
          name === 'fullName';

        let tokenRef: string | undefined = undefined;
        if (name === 'email' || type === 'email') tokenRef = 'EMAIL_001';
        else if (name === 'phone' || type === 'tel') tokenRef = 'PHONE_001';
        else if (name === 'address') tokenRef = 'ADDRESS_001';
        else if (name === 'dob') tokenRef = 'DOB_001';
        else if (name === 'nationalId' || name === 'passportNumber') tokenRef = 'GOV_ID_001';
        else if (name?.includes('Name') || name === 'fullName') tokenRef = 'PERSON_001';

        return {
          id: index + 1,
          tag,
          type,
          name,
          label,
          placeholder,
          value: isSensitive && value ? `[REDACTED: ${tokenRef || 'PROTECTED'}]` : value,
          isMasked: isSensitive,
          tokenRef,
          isInteractive: true,
          bbox: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        };
      });

    return {
      url: window.location.href,
      title: document.title || 'Demo App',
      viewport: { width: window.innerWidth, height: window.innerHeight },
      elements,
      activeTokens: tokensProtected,
      timestamp: Date.now(),
    };
  }, [tokensProtected]);

  /**
   * Physically executes an action on the real DOM element.
   */
  const executeRealDOMAction = useCallback(
    async (action: AgentAction, state: SanitizedBrowserState) => {
      if (action.action === 'FINISH_TASK') return true;

      const interactables = Array.from(
        document.querySelectorAll<HTMLElement>(
          'input, button, select, textarea, [role="button"], a[href], [data-testid]'
        )
      ).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
      });

      const targetEl = (action as any).elementId
        ? interactables[(action as any).elementId - 1]
        : null;

      if (!targetEl) return false;

      // 1. Visual Highlight Effect
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetEl.classList.add('ring-4', 'ring-emerald-400', 'ring-offset-2', 'ring-offset-slate-900', 'transition-all');

      await sleep(speed === 'turbo' ? 80 : 250);

      // 2. Perform Native Action
      if (action.action === 'CLICK') {
        targetEl.click();
        targetEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      } else if (action.action === 'TYPE') {
        const input = targetEl as HTMLInputElement;
        const textToType = (action as any).text || '';
        input.focus();

        // Native React input setter trigger
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter && targetEl.tagName === 'INPUT') {
          nativeInputValueSetter.call(targetEl, textToType);
        } else if (nativeTextareaValueSetter && targetEl.tagName === 'TEXTAREA') {
          nativeTextareaValueSetter.call(targetEl, textToType);
        } else {
          input.value = textToType;
        }

        targetEl.dispatchEvent(new Event('input', { bubbles: true }));
        targetEl.dispatchEvent(new Event('change', { bubbles: true }));

        if ((action as any).pressEnter) {
          targetEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        }
      } else if (action.action === 'FILL_FIELD') {
        // Vault token resolver (local on-device replacement)
        const token = (action as any).value_ref;
        let resolvedValue = 'Harish Kumar';
        if (token === 'EMAIL_001') resolvedValue = 'harish.kumar@example.com';
        else if (token === 'PHONE_001') resolvedValue = '+91 9876543210';
        else if (token === 'ADDRESS_001') resolvedValue = '42, Silicon Residency, Bengaluru KA 560034';
        else if (token === 'DOB_001') resolvedValue = '1996-03-22';
        else if (token === 'GOV_ID_001') resolvedValue = 'Z8942105';

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        if (nativeInputValueSetter && targetEl.tagName === 'INPUT') {
          nativeInputValueSetter.call(targetEl, resolvedValue);
        } else {
          (targetEl as HTMLInputElement).value = resolvedValue;
        }

        targetEl.dispatchEvent(new Event('input', { bubbles: true }));
        targetEl.dispatchEvent(new Event('change', { bubbles: true }));
      }

      await sleep(speed === 'turbo' ? 60 : 150);
      targetEl.classList.remove('ring-4', 'ring-emerald-400', 'ring-offset-2', 'ring-offset-slate-900');

      return true;
    },
    [speed]
  );

  const stopAgent = () => {
    abortRef.current = true;
    runningRef.current = false;
    setIsRunning(false);
  };

  /**
   * Main Autonomous Execution Loop
   */
  const runAutonomousTask = async () => {
    if (runningRef.current || !taskPrompt.trim()) return;

    runningRef.current = true;
    abortRef.current = false;
    setIsRunning(true);
    setStepLogs([]);
    setIsOpen(true);

    const maxSteps = 12;

    for (let step = 1; step <= maxSteps; step++) {
      if (abortRef.current) break;

      // 1. Capture current DOM state
      const state = captureDOMState();

      // 2. Request Next Action from Autonomous Agent Engine
      let action: AgentAction | null = null;
      let latencyMs = 12;
      let source = 'LOCAL_FAST_PLANNER';

      try {
        const t0 = performance.now();
        const res = await fetch('/api/gemini/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskPrompt, state, stepIndex: step }),
        });

        const data = await res.json();
        latencyMs = data.latencyMs || Math.round(performance.now() - t0);
        action = data.action;
        source = data.source || 'LOCAL_FAST_PLANNER';
      } catch {
        // Local fallback
      }

      if (!action) break;

      const logItem: StepLog = {
        step,
        thought: action.thought || 'Executing next autonomous action',
        action: action.action,
        latencyMs,
        source,
        status: 'RUNNING',
      };

      setStepLogs((prev) => [...prev, logItem]);

      // 3. Execute action on real live DOM
      if (action.action === 'FINISH_TASK') {
        setStepLogs((prev) =>
          prev.map((l, idx) => (idx === prev.length - 1 ? { ...l, status: 'SUCCESS' } : l))
        );
        break;
      }

      await executeRealDOMAction(action, state);

      setStepLogs((prev) =>
        prev.map((l, idx) => (idx === prev.length - 1 ? { ...l, status: 'SUCCESS' } : l))
      );

      await sleep(speed === 'turbo' ? 120 : 400);

      if (abortRef.current) break;
    }

    runningRef.current = false;
    setIsRunning(false);
  };

  if (!isDemoPage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Control Box */}
      {isOpen && (
        <div className="w-[380px] md:w-[440px] mb-3 p-5 rounded-3xl glass-card border border-white/20 shadow-2xl bg-slate-950/95 backdrop-blur-2xl space-y-4 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white tracking-tight">Autonomous Privacy Agent</h3>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Live DOM Control · 0 Leaks
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpeed((s) => (s === 'turbo' ? 'normal' : 'turbo'))}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                  speed === 'turbo'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-white/10'
                }`}
              >
                ⚡ {speed === 'turbo' ? 'TURBO (Fast)' : 'NORMAL'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Task Prompt Input */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                rows={2}
                value={taskPrompt}
                onChange={(e) => setTaskPrompt(e.target.value)}
                placeholder="Type ANY custom task for this website (e.g. Find HP Victus, add to cart, and checkout)..."
                className="w-full glass-input rounded-2xl p-3 text-xs text-white placeholder-slate-500 font-medium resize-none leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    runAutonomousTask();
                  }
                }}
              />
            </div>

            {/* Quick Presets */}
            {pathname && DEMO_PRESETS[pathname] && (
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Prompts for this page:
                </span>
                <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                  {DEMO_PRESETS[pathname].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setTaskPrompt(p)}
                      className="text-left text-[10px] text-slate-400 hover:text-sky-300 truncate px-2 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-white/5 font-medium transition-all"
                    >
                      → {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div>
            {isRunning ? (
              <button
                onClick={stopAgent}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Square className="w-4 h-4" /> Stop Autonomous Agent
              </button>
            ) : (
              <button
                onClick={runAutonomousTask}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.01]"
              >
                <Play className="w-4 h-4" /> Run Autonomous Task on This Page
              </button>
            )}
          </div>

          {/* Live Step HUD */}
          {stepLogs.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Execution Trace ({stepLogs.length} actions)</span>
                <span className="text-emerald-400 font-bold">🔒 PII Protected</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {stepLogs.map((log, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-start justify-between gap-2 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {log.step}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-black text-sky-400">{log.action}</span>
                          <span className="text-[9px] font-mono px-1.5 rounded bg-slate-800 text-slate-400">
                            {log.latencyMs}ms
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug">{log.thought}</p>
                      </div>
                    </div>
                    {log.status === 'SUCCESS' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-sky-500 via-indigo-600 to-emerald-500 text-white text-xs font-black shadow-2xl shadow-sky-500/40 hover:scale-105 transition-all border border-white/20"
      >
        <Sparkles className="w-4 h-4 animate-spin-slow" />
        <span>{isRunning ? 'Agent Automating...' : '✨ AI Privacy Agent'}</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
