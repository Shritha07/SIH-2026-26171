'use client';

import React, { useState } from 'react';
import {
  Briefcase, MapPin, DollarSign, Building2, CheckCircle2, ShieldCheck,
  FileText, Send, ChevronRight, Search, Filter, Clock, Award, Star,
  Check, X, Sparkles, User, Mail, Phone, GraduationCap, Calendar,
  ArrowRight, ExternalLink, Bookmark, Share2, Layers, AlertCircle,
} from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  experience: string;
  salary: string;
  postedDate: string;
  openings: number;
  featured?: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
}

const DEPARTMENTS = ['All', 'Engineering', 'AI Research', 'Security', 'Product', 'Design'];
const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS = ['All', '1-3 Years', '3-5 Years', '5+ Years'];

const JOBS: JobListing[] = [
  {
    id: 'job_senior_fullstack',
    title: 'Senior Full Stack Engineer (AI / Web Agents)',
    department: 'Engineering',
    location: 'Bengaluru, KA',
    workMode: 'Hybrid',
    experience: '4 - 7 Years',
    salary: '₹28,00,000 - ₹35,00,000',
    postedDate: '2 days ago',
    openings: 3,
    featured: true,
    description: 'Lead development of next-generation autonomous browser agents with on-device visual perception and strict privacy sandboxing.',
    responsibilities: [
      'Architect robust web automation pipelines with real-time DOM tree reconciliation and visual grounding.',
      'Implement fail-closed client-side privacy boundaries that intercept sensitive PII before transmission.',
      'Optimize WebGPU/WASM perception models for sub-30ms client-side inference.',
      'Design telemetry dashboards for observability and live audit trails.',
    ],
    requirements: [
      '5+ years experience building complex web applications with TypeScript, React, and Node.js.',
      'Deep understanding of browser security models, CSP, sandboxing, and WebExtension APIs.',
      'Experience with local LLMs, ONNX Runtime Web, or WebGPU shaders is a major plus.',
      'B.Tech/M.Tech in Computer Science or equivalent practical experience.',
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'ONNX Web', 'WebGPU', 'Security Architecture'],
    benefits: ['Stock Options (ESOPs)', 'Comprehensive Health Cover (₹10L)', 'Annual Tech Stipend (₹1.5L)', 'Flexible Working Hours'],
  },
  {
    id: 'job_ml_systems',
    title: 'Machine Learning Systems Engineer (Edge Vision)',
    department: 'AI Research',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    experience: '5+ Years',
    salary: '₹32,00,000 - ₹45,00,000',
    postedDate: '1 day ago',
    openings: 2,
    featured: true,
    description: 'Optimize lightweight Vision Transformers (ViT) and OCR pipelines for real-time in-browser element detection with zero cloud latency.',
    responsibilities: [
      'Quantize and prune vision-language models (INT8/FP16) for high-throughput edge execution.',
      'Benchmark memory footprint and battery efficiency across diverse consumer hardware.',
      'Develop custom WebAssembly kernels for accelerated tensor operations.',
    ],
    requirements: [
      'Demonstrated expertise in PyTorch, ONNX, TensorRT, and WebAssembly compilation.',
      'Solid foundation in transformer architectures, object detection, and visual perception.',
      'Track record of deploying models in constrained edge or mobile environments.',
    ],
    skills: ['PyTorch', 'ONNX Runtime', 'Quantization', 'WebAssembly', 'Computer Vision'],
    benefits: ['High Compute Access (H100 Clusters)', 'Remote Work Setup Allowance', 'Conference Travel Budget', 'Relocation Support'],
  },
  {
    id: 'job_privacy_security',
    title: 'AI Agent Security & Privacy Architect',
    department: 'Security',
    location: 'Bengaluru, KA',
    workMode: 'Hybrid',
    experience: '6 - 9 Years',
    salary: '₹35,00,000 - ₹50,00,000',
    postedDate: '3 days ago',
    openings: 1,
    featured: true,
    description: 'Design zero-knowledge cryptographic vaults and adversarial defense layers preventing prompt injection and exfiltration attacks in browser agents.',
    responsibilities: [
      'Formulate mathematical threat models against indirect prompt injection and side-channel leakage.',
      'Implement client-side AES-GCM-256 tokenization vaults with PBKDF2 key derivation.',
      'Conduct automated red-teaming and adversarial probe audits on autonomous agent decision trees.',
    ],
    requirements: [
      'Strong cryptography background and experience in application security auditing.',
      'Proficiency in defensive security for LLM-based autonomous workflows.',
      'Familiarity with OWASP LLM Top 10 and privacy regulations (GDPR, DPDP Act).',
    ],
    skills: ['Zero-Knowledge Cryptography', 'AES-GCM', 'Prompt Defense', 'Red Teaming', 'AppSec'],
    benefits: ['Executive Stock Package', 'Unlimited PTO', 'Wellness & Gym Allowance', 'Home Office Stipend'],
  },
  {
    id: 'job_frontend_architect',
    title: 'Frontend Architect (Design Systems & Observability)',
    department: 'Design',
    location: 'Bengaluru, KA',
    workMode: 'On-site',
    experience: '4 - 6 Years',
    salary: '₹26,00,000 - ₹34,00,000',
    postedDate: '5 days ago',
    openings: 2,
    description: 'Architect mission-critical developer dashboards, real-time telemetry streaming, and reactive glassmorphic micro-frontends.',
    responsibilities: [
      'Craft high-fidelity, accessible UI component libraries with Tailwind CSS and Next.js App Router.',
      'Stream real-time agent execution traces with WebSockets and high-performance canvas visualizers.',
    ],
    requirements: [
      'Expertise in modern frontend performance optimization, SSR, and micro-interactions.',
      'Eye for pristine UI design, typography, and responsive micro-animations.',
    ],
    skills: ['Next.js', 'Tailwind CSS', 'WebSockets', 'Canvas 2D', 'State Machines'],
    benefits: ['Top-tier MacBook Pro M3 Max', 'Catered Gourmet Meals', 'Health & Dental Care', 'Commuter Pass'],
  },
  {
    id: 'job_product_manager',
    title: 'Staff Product Manager (Autonomous Agent Platform)',
    department: 'Product',
    location: 'Bengaluru, KA',
    workMode: 'Hybrid',
    experience: '5 - 8 Years',
    salary: '₹30,00,000 - ₹40,00,000',
    postedDate: '1 week ago',
    openings: 1,
    description: 'Define the product roadmap for enterprise browser automation agents, driving adoption across fintech, healthcare, and e-commerce verticals.',
    responsibilities: [
      'Translate complex enterprise privacy requirements into frictionless user experiences.',
      'Define benchmark evaluation criteria for autonomous accuracy, latency, and compliance.',
    ],
    requirements: [
      'Proven track record managing developer platforms or AI/ML SaaS products.',
      'Strong technical grounding in AI agent architectures and enterprise security.',
    ],
    skills: ['Product Strategy', 'AI Agents', 'Enterprise SaaS', 'Telemetry & Analytics', 'UX Design'],
    benefits: ['Performance Bonuses', 'Parental Leave Policy', 'Executive Mentorship', 'Learning Stipend'],
  },
];

type AppStep = 'select' | 'candidate_info' | 'experience_details' | 'resume_kyc' | 'review' | 'success';

export default function JobsDemoPage() {
  const [selectedJob, setSelectedJob] = useState<JobListing>(JOBS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appStep, setAppStep] = useState<AppStep>('select');

  // Application Form State
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    currentLocation: '',
    portfolioUrl: '',
    experienceYears: '5',
    currentCompany: 'Tech Corp India',
    currentCtc: '₹22,00,000',
    expectedCtc: '₹30,00,000',
    noticePeriod: '30 Days',
    coverNote: 'Excited to contribute to privacy-preserving on-device browser vision agents.',
    resumeToken: 'Harish_Kumar_Resume_2026.pdf',
    highestDegree: 'B.Tech in Computer Science',
    collegeName: 'National Institute of Technology (NIT)',
    graduationYear: '2020',
    gpa: '9.1 / 10.0',
    nationalIdToken: 'GOV_ID_001',
  });

  const filteredJobs = JOBS.filter((job) => {
    const matchSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === 'All' || job.department === selectedDept;
    const matchMode = selectedMode === 'All' || job.workMode === selectedMode;
    return matchSearch && matchDept && matchMode;
  });

  const toggleSaveJob = (id: string) => {
    setSavedJobs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleApplyClick = (job: JobListing) => {
    setSelectedJob(job);
    setAppStep('candidate_info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full badge-glow-emerald text-xs font-mono font-bold">
              DEMO 2 / 5 · CAREERS & RECRUITMENT
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">TalentSphere Enterprise Portal</h1>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Agent Goal:{' '}
            <span className="text-emerald-400 font-semibold">
              "Filter AI / Engineering roles, inspect full job specs, and submit multi-stage job application using local profile and resume token."
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>{JOBS.length} Open Positions</span>
          </div>
        </div>
      </div>

      {appStep === 'select' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Filters & Search */}
          <div className="lg:col-span-4 space-y-4">
            {/* Search Input */}
            <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search job title, skills (e.g. PyTorch)..."
                  className="w-full glass-input rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-medium"
                />
              </div>

              {/* Department Filter */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                  Department
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                        selectedDept === dept
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                          : 'glass-card border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Mode Filter */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                  Work Mode
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {WORK_MODES.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium border text-center transition-all ${
                        selectedMode === mode
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                          : 'border-white/5 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Job List Cards */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400 flex items-center justify-between px-1">
                <span>Matching Roles ({filteredJobs.length})</span>
                <span className="text-[10px] text-emerald-400">Live Intake Active</span>
              </span>

              {filteredJobs.map((job) => {
                const isSelected = selectedJob.id === job.id;
                const isSaved = savedJobs.includes(job.id);

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border text-left space-y-2.5 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'glass-card border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {job.featured && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold font-mono uppercase inline-block mb-1">
                            ★ Featured Role
                          </span>
                        )}
                        <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{job.department}</span> · <span>{job.location}</span>
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-white"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
                      <span className="text-emerald-400 font-bold">{job.salary}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/5">{job.workMode}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Job View */}
          <div className="lg:col-span-8 space-y-5">
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                      {selectedJob.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 text-xs font-mono">
                      {selectedJob.workMode}
                    </span>
                    <span className="text-xs text-slate-500">Posted {selectedJob.postedDate}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white leading-snug">{selectedJob.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                      <DollarSign className="w-4 h-4" /> {selectedJob.salary}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" /> {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-500" /> {selectedJob.experience}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApplyClick(selectedJob)}
                    data-testid="apply-now-button"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Apply for this Role
                  </button>
                </div>
              </div>

              {/* Role Overview */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">About the Role</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedJob.description}</p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Key Responsibilities</h4>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Qualifications & Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Badges */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Required Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-mono text-sky-400 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Perks & Benefits */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Perks, Equity & Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                  {selectedJob.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Step Application Flow */
        <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
          {/* Step Progress Tracker */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">Job Application</span>
              <h2 className="text-base font-extrabold text-white">{selectedJob.title}</h2>
            </div>
            <div className="flex gap-2 text-[10px] font-mono">
              {[
                { id: 'candidate_info', label: '1. Profile' },
                { id: 'experience_details', label: '2. Experience' },
                { id: 'resume_kyc', label: '3. Resume & KYC' },
                { id: 'review', label: '4. Review' },
              ].map((step, idx) => (
                <span
                  key={step.id}
                  className={`px-2.5 py-1 rounded-lg border font-bold ${
                    appStep === step.id
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : ['candidate_info', 'experience_details', 'resume_kyc', 'review'].indexOf(appStep) > idx
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                      : 'bg-slate-900 text-slate-500 border-white/5'
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          {/* STEP 1: CANDIDATE INFO */}
          {appStep === 'candidate_info' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAppStep('experience_details');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Applicant Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    required
                    placeholder="Harish Kumar"
                    value={formData.applicantName}
                    onChange={(e) => setFormData((p) => ({ ...p, applicantName: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="harish.kumar@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Current Location</label>
                  <input
                    type="text"
                    name="currentLocation"
                    placeholder="Bengaluru, Karnataka"
                    value={formData.currentLocation}
                    onChange={(e) => setFormData((p) => ({ ...p, currentLocation: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Portfolio / GitHub Profile URL</label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    placeholder="https://github.com/harish-kumar-ai"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, portfolioUrl: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setAppStep('select')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Next: Work Experience <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: EXPERIENCE DETAILS */}
          {appStep === 'experience_details' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAppStep('resume_kyc');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Total Relevant Experience</label>
                  <select
                    value={formData.experienceYears}
                    onChange={(e) => setFormData((p) => ({ ...p, experienceYears: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-950"
                  >
                    <option value="1-3">1 - 3 Years</option>
                    <option value="3-5">3 - 5 Years</option>
                    <option value="5-8">5 - 8 Years</option>
                    <option value="8+">8+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Current Employer</label>
                  <input
                    type="text"
                    value={formData.currentCompany}
                    onChange={(e) => setFormData((p) => ({ ...p, currentCompany: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Current Annual CTC (₹)</label>
                  <input
                    type="text"
                    value={formData.currentCtc}
                    onChange={(e) => setFormData((p) => ({ ...p, currentCtc: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Expected Annual CTC (₹)</label>
                  <input
                    type="text"
                    value={formData.expectedCtc}
                    onChange={(e) => setFormData((p) => ({ ...p, expectedCtc: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Notice Period</label>
                  <select
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData((p) => ({ ...p, noticePeriod: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-950"
                  >
                    <option value="Immediate">Immediate / Serving Notice</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Why are you interested in this role?</label>
                  <textarea
                    rows={3}
                    value={formData.coverNote}
                    onChange={(e) => setFormData((p) => ({ ...p, coverNote: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setAppStep('candidate_info')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Next: Resume & KYC <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: RESUME & KYC */}
          {appStep === 'resume_kyc' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAppStep('review');
              }}
              className="space-y-4"
            >
              <div className="space-y-4">
                {/* Resume Token Attachment */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                  <label className="text-xs text-emerald-400 font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Attached Resume Reference
                  </label>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs">
                    <span className="text-white font-semibold">{formData.resumeToken}</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      ✓ SYNTHETIC VAULT TOKEN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    The agent references your encrypted local resume without uploading raw binary data to external models.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1.5">Highest Education Degree</label>
                    <input
                      type="text"
                      value={formData.highestDegree}
                      onChange={(e) => setFormData((p) => ({ ...p, highestDegree: e.target.value }))}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1.5">University / College</label>
                    <input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData((p) => ({ ...p, collegeName: e.target.value }))}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1.5">CGPA / Grade</label>
                    <input
                      type="text"
                      name="gpa"
                      value={formData.gpa}
                      onChange={(e) => setFormData((p) => ({ ...p, gpa: e.target.value }))}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1.5">Graduation Year</label>
                    <input
                      type="text"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData((p) => ({ ...p, graduationYear: e.target.value }))}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setAppStep('experience_details')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Review Application <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: REVIEW & SUBMISSION */}
          {appStep === 'review' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 text-xs">
                <h3 className="font-bold text-white pb-2 border-b border-white/10">Application Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">APPLICANT</span>
                    <span className="font-semibold text-white">{formData.applicantName || 'Harish Kumar'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EMAIL & PHONE</span>
                    <span className="font-mono text-white">{formData.email || 'harish.kumar@example.com'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EXPERIENCE & NOTICE</span>
                    <span>
                      {formData.experienceYears} yrs · {formData.noticePeriod}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EXPECTED CTC</span>
                    <span className="font-mono text-emerald-400 font-bold">{formData.expectedCtc}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setAppStep('success')}
                data-testid="submit-application-final"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Submit Application (Zero-Leak Verified)
              </button>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {appStep === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl badge-glow-emerald flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Application Submitted!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Tracking ID:{' '}
                <span className="font-mono text-emerald-400 font-bold">
                  #APP-TS-{Math.floor(Math.random() * 90000 + 10000)}
                </span>
                . Your application for <strong className="text-white">{selectedJob.title}</strong> has been received.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-400 max-w-md mx-auto">
                🔒 Privacy Audit: 0 PII leaks detected during automated submission.
              </div>
              <button
                onClick={() => setAppStep('select')}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-bold"
              >
                Browse More Positions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
