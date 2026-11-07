import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Activity, Laptop, Briefcase, Plane, HeartPulse, FileText, BarChart3, Lock, Sparkles, ChevronRight } from 'lucide-react';
import AgentFloatingWidget from '@/components/AgentFloatingWidget';
import './globals.css';

export const metadata: Metadata = {
  title: 'ISRO SIH 26171 - Privacy-Preserving On-Device Browser Agent',
  description: 'Lightweight on-device perception and privacy sanitization for browser agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-mesh-radial min-h-screen flex flex-col antialiased text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
        {/* Top Floating Glass Header */}
        <header className="sticky top-0 z-50 px-4 py-3">
          <div className="max-w-7xl mx-auto rounded-2xl glass-card px-4 h-14 flex items-center justify-between border border-white/10 shadow-2xl">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-all duration-300">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-sky-400 transition-colors">
                    ISRO SIH 26171
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full badge-glow-sky font-mono font-semibold">
                    ON-DEVICE ML
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Privacy-Preserving Vision Agent</p>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
              >
                <Activity className="w-4 h-4 text-sky-400" />
                <span>Dashboard</span>
              </Link>

              <div className="h-4 w-px bg-white/10 mx-1.5" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 font-mono">
                Demos:
              </span>

              <Link
                href="/demos/ecommerce"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Laptop className="w-3.5 h-3.5 text-amber-400" />
                <span>Store</span>
              </Link>
              <Link
                href="/demos/jobs"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Jobs</span>
              </Link>
              <Link
                href="/demos/flights"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Plane className="w-3.5 h-3.5 text-cyan-400" />
                <span>Flights</span>
              </Link>
              <Link
                href="/demos/healthcare"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>Clinic</span>
              </Link>
              <Link
                href="/demos/insurance"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-violet-400" />
                <span>Insurance</span>
              </Link>

              <div className="h-4 w-px bg-white/10 mx-1.5" />

              <Link
                href="/evaluation"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
              >
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Benchmarks</span>
              </Link>
            </nav>

            {/* Zero Leaks Live Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full badge-glow-emerald font-mono text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>0 RAW LEAKS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 space-y-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-slate-950/80 py-6 text-xs text-slate-400 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-500" />
              <p className="text-slate-400 font-medium">
                ISRO Problem Statement 26171 • On-device Visual Perception for Light-weight Browser Agents
              </p>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>Privacy Boundary: Local Enforced</span>
              <span>Vault: WebCrypto AES-GCM</span>
              <span>Model: Gemini 2.5 Flash</span>
            </div>
          </div>
        </footer>

        {/* Global Autonomous Agent Overlay */}
        <AgentFloatingWidget />
      </body>
    </html>
  );
}
