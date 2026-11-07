import Link from 'next/link';
import {
  ShieldCheck,
  Activity,
  Laptop,
  Briefcase,
  Plane,
  HeartPulse,
  FileText,
  Lock,
  Cpu,
  ArrowRight,
  Eye,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  Database,
  Terminal,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Spotlight Section */}
      <div className="relative p-8 md:p-12 rounded-3xl glass-card border border-white/10 shadow-2xl overflow-hidden group">
        {/* Glow backdrop mesh */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/30 transition-all duration-700" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-700" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-glow-sky text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ISRO Smart India Hackathon • Problem Statement 26171</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight">
            On-Device Perception for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              Privacy-Preserving
            </span>{' '}
            Browser Agents
          </h1>

          <p className="text-sm md:text-lg text-slate-300 leading-relaxed font-medium max-w-3xl">
            An autonomous Chrome browser agent where lightweight on-device visual perception and local privacy sanitization ensure sensitive user information (PII/secrets) never leaves the browser, while Gemini provides multimodal reasoning over sanitized state and emits capability actions resolved locally.
          </p>

          {/* Architectural Invariant Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg shadow-emerald-500/5 flex items-center gap-4 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="font-extrabold text-white text-sm block tracking-tight">Core Architectural Invariant</span>
              <span className="text-slate-300 font-medium leading-relaxed block">
                "Gemini controls task reasoning; the local client device controls sensitive data. Raw PII is excluded from all cloud requests."
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-sky-500/25 transition-all hover:scale-105"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Judge Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/demos/ecommerce"
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl glass-card hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-all hover:scale-105"
            >
              <Laptop className="w-4 h-4 text-amber-400" />
              <span>Explore 5 Demo Suites</span>
            </Link>

            <Link
              href="/evaluation"
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl glass-card hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-all hover:scale-105"
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Benchmarks Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Architecture Flow Visualizer */}
      <div className="p-8 rounded-3xl glass-card border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider block mb-1">
              Zero-Trust Architecture Pipeline
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">How the Privacy Sandbox Operates</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-white/5">
            Fail-Closed Security Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Browser State',
              desc: 'Live DOM tree, interactable elements, and screen viewport capture.',
              icon: Laptop,
              badge: 'CLIENT VIEWPORT',
              accent: 'border-slate-700 text-slate-400',
            },
            {
              step: '02',
              title: 'On-Device Perception',
              desc: 'DOM semantic parser + ONNX Web lightweight ViT model execution.',
              icon: Eye,
              badge: 'WEBGPU / WASM',
              accent: 'border-sky-500/40 text-sky-400',
            },
            {
              step: '03',
              title: 'Sanitization & Redaction',
              desc: 'Multi-signal PII detection, canvas bounding box masking & tokenization.',
              icon: ShieldCheck,
              badge: '0 LEAKS INVARIANT',
              accent: 'border-emerald-500/40 text-emerald-400',
            },
            {
              step: '04',
              title: 'Gemini Cloud Planning',
              desc: 'Multimodal reasoning over sanitized view. Emits capability actions.',
              icon: Cpu,
              badge: 'GEMINI 2.5 FLASH',
              accent: 'border-indigo-500/40 text-indigo-400',
            },
            {
              step: '05',
              title: 'Local Resolution',
              desc: 'Resolves opaque tokens internally from WebCrypto AES-GCM vault.',
              icon: Lock,
              badge: 'LOCAL RESOLUTION',
              accent: 'border-amber-500/40 text-amber-400',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-slate-950/80 border ${item.accent} space-y-3 flex flex-col justify-between hover:border-white/20 transition-all`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                    {item.step}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-300 font-semibold">
                    {item.badge}
                  </span>
                </div>
                <item.icon className={`w-5 h-5 ${item.accent}`} />
                <h3 className="text-xs font-bold text-white">{item.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Five Demo Environments Section */}
      <div className="space-y-5">
        <div>
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider block mb-1">
            Controlled Evaluation Suites
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">5 Realistic Multi-Step Demo Web Applications</h2>
          <p className="text-xs text-slate-400 mt-1">
            Nontrivial multi-step web applications featuring laptop stores, job application workflows, airline bookings, clinic intakes, and insurance policy flows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              title: '1. ApexTech Store',
              scenario: 'Find HP Victus 16GB under ₹80k, compare ratings, add to cart & checkout.',
              link: '/demos/ecommerce',
              icon: Laptop,
              color: 'text-amber-400',
              gradient: 'from-amber-500/20 to-orange-500/5',
              border: 'border-amber-500/30',
            },
            {
              title: '2. TalentSphere Jobs',
              scenario: 'Search engineering roles and fill multi-step application with profile token.',
              link: '/demos/jobs',
              icon: Briefcase,
              color: 'text-emerald-400',
              gradient: 'from-emerald-500/20 to-teal-500/5',
              border: 'border-emerald-500/30',
            },
            {
              title: '3. SkyVoyage Flights',
              scenario: 'Search BLR to DEL flights, select best fare, and complete passenger KYC.',
              link: '/demos/flights',
              icon: Plane,
              color: 'text-cyan-400',
              gradient: 'from-cyan-500/20 to-blue-500/5',
              border: 'border-cyan-500/30',
            },
            {
              title: '4. MediCare Clinic',
              scenario: 'Search specialist physician, select time slot, and fill patient intake form.',
              link: '/demos/healthcare',
              icon: HeartPulse,
              color: 'text-rose-400',
              gradient: 'from-rose-500/20 to-pink-500/5',
              border: 'border-rose-500/30',
            },
            {
              title: '5. ShieldGuard Insurance',
              scenario: 'Compare 1 Crore health plans, compute premium, and complete policy application.',
              link: '/demos/insurance',
              icon: FileText,
              color: 'text-violet-400',
              gradient: 'from-violet-500/20 to-purple-500/5',
              border: 'border-violet-500/30',
            },
          ].map((demo, idx) => (
            <Link
              key={idx}
              href={demo.link}
              className={`p-5 rounded-2xl glass-card bg-gradient-to-b ${demo.gradient} border ${demo.border} glass-card-hover flex flex-col justify-between group`}
            >
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/80 w-fit border border-white/10">
                  <demo.icon className={`w-6 h-6 ${demo.color} group-hover:scale-110 transition-transform`} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors mb-1">
                    {demo.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-snug font-medium">{demo.scenario}</p>
                </div>
              </div>

              <span className="text-[11px] text-sky-400 font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Demo Suite <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
