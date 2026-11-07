'use client';

import React, { useState } from 'react';
import {
  Shield, ShieldCheck, CheckCircle2, FileText, Check, Award, ArrowRight,
  SlidersHorizontal, DollarSign, Calculator, Heart, Users, Clock, AlertTriangle,
  FileCheck, Star, Sparkles, Building, ChevronRight, X, Lock,
} from 'lucide-react';

interface InsurancePlan {
  id: string;
  name: string;
  category: 'Health' | 'Term Life' | 'Super Top-Up' | 'Critical Illness';
  coverage: string;
  coverageAmount: number;
  baseAnnualPremium: number;
  claimRatio: string;
  networkHospitals: string;
  features: string[];
  recommended?: boolean;
  roomRentLimit: string;
  waitingPeriod: string;
}

const CATEGORIES = ['All', 'Health', 'Term Life', 'Super Top-Up', 'Critical Illness'];

const PLANS: InsurancePlan[] = [
  {
    id: 'plan_health_platinum',
    name: 'ShieldHealth Platinum Super 1-Crore Cover',
    category: 'Health',
    coverage: '₹1,00,00,000 (1 Crore)',
    coverageAmount: 10000000,
    baseAnnualPremium: 14500,
    claimRatio: '99.4%',
    networkHospitals: '11,400+ Cashless Hospitals',
    roomRentLimit: 'No Room Rent Capping (Any Room Category)',
    waitingPeriod: '30 Days for general / 2 Yrs for pre-existing',
    features: [
      'Zero Co-Payment across all ages',
      '100% Unlimited Sum Insured Restoration',
      'Global Emergency Medical Evacuation',
      'Annual Comprehensive Preventive Health Check-up',
      'Maternity Cover up to ₹1,00,000',
      'Ayush In-patient Treatment Covered',
    ],
    recommended: true,
  },
  {
    id: 'plan_life_term',
    name: 'ShieldLife Pure Term 360 (2.5 Crore)',
    category: 'Term Life',
    coverage: '₹2,50,00,000 (2.5 Crore)',
    coverageAmount: 25000000,
    baseAnnualPremium: 18200,
    claimRatio: '99.6%',
    networkHospitals: 'N/A (Lump Sum Death/Disability Benefit)',
    roomRentLimit: 'N/A',
    waitingPeriod: 'Immediate coverage upon issuance',
    features: [
      'Comprehensive 40 Critical Illness Cover Rider',
      'Accidental Total & Permanent Disability Benefit',
      'Waiver of Future Premiums on Critical Illness',
      'Tax Exemption under Section 80C & 10(10D)',
      'Increasing Cover Option by 10% per year',
    ],
    recommended: false,
  },
  {
    id: 'plan_health_gold',
    name: 'ShieldHealth Advantage Gold 50 Lakhs',
    category: 'Health',
    coverage: '₹50,00,000 (50 Lakhs)',
    coverageAmount: 5000000,
    baseAnnualPremium: 9800,
    claimRatio: '98.9%',
    networkHospitals: '9,200+ Hospitals',
    roomRentLimit: 'Single Private A/C Room',
    waitingPeriod: '30 Days / 3 Yrs for pre-existing',
    features: [
      'Zero Deductible on In-network Admissions',
      'Pre & Post Hospitalization (60 / 180 Days)',
      'Organ Donor Expenses 100% Covered',
      'Day Care Procedures 100% Covered',
      'Free E-Consultation with Top Specialists',
    ],
    recommended: false,
  },
  {
    id: 'plan_super_topup',
    name: 'ShieldHealth Super Top-Up 1 Crore (Deductible ₹5L)',
    category: 'Super Top-Up',
    coverage: '₹1,00,00,000 (1 Crore)',
    coverageAmount: 10000000,
    baseAnnualPremium: 4200,
    claimRatio: '99.1%',
    networkHospitals: '11,400+ Hospitals',
    roomRentLimit: 'No Room Rent Capping',
    waitingPeriod: '30 Days general',
    features: [
      'Affordable Booster above your employer cover',
      'Super Top-Up with aggregate deductible across year',
      'No Pre-policy Medical Test up to 55 yrs',
      'Cumulative Bonus up to 50%',
    ],
    recommended: false,
  },
];

type PolicyStep = 'compare' | 'proposer_info' | 'medical_declaration' | 'nominee_kyc' | 'review' | 'confirmed';

export default function InsuranceDemoPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan>(PLANS[0]);
  const [policyStep, setPolicyStep] = useState<PolicyStep>('compare');

  // Interactive Premium Calculator Controls
  const [proposerAge, setProposerAge] = useState(28);
  const [isSmoker, setIsSmoker] = useState(false);
  const [tenureYears, setTenureYears] = useState(1);
  const [coverAmount, setCoverAmount] = useState(10000000);

  // Policy Form State
  const [formData, setFormData] = useState({
    policyholderName: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: 'Male',
    maritalStatus: 'Single',
    occupation: 'Software Engineer',
    annualIncome: '₹25,00,000',
    nationalIdToken: 'GOV_ID_001',
    panToken: 'PAN_TOKEN_001',
    nomineeName: 'Pooja Kumar',
    nomineeRelation: 'Spouse',
    nomineeDob: '1998-07-14',
    tobaccoUse: 'No',
    alcoholUse: 'Occasional',
    preExistingSurgery: 'None',
  });

  const filteredPlans = PLANS.filter((p) => {
    return selectedCategory === 'All' || p.category === selectedCategory;
  });

  const calculateDynamicPremium = (plan: InsurancePlan) => {
    let base = plan.baseAnnualPremium;
    if (proposerAge > 35) base += (proposerAge - 35) * 350;
    if (isSmoker) base *= 1.25;
    if (tenureYears === 2) base = base * 2 * 0.92; // 8% multi-year discount
    if (tenureYears === 3) base = base * 3 * 0.85; // 15% discount
    return Math.round(base);
  };

  const handleApplyClick = (plan: InsurancePlan) => {
    setSelectedPlan(plan);
    setPolicyStep('proposer_info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full badge-glow-violet text-xs font-mono font-bold">
              DEMO 5 / 5 · INSURANCE & KYC
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">ShieldGuard Insurance Services</h1>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Agent Goal:{' '}
            <span className="text-violet-400 font-semibold">
              "Compare 1 Crore Health Cover plans, run premium calculator for 28yo non-smoker, and complete KYC policy application with national ID token."
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-mono text-violet-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>IRDAI Registered · 99.4% Claim Settlement</span>
          </div>
        </div>
      </div>

      {policyStep === 'compare' ? (
        <div className="space-y-6">
          {/* Interactive Calculator Banner */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-violet-400" /> Instant Premium Calculator & Customizer
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Quote Update</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>PROPOSER AGE</span>
                  <span className="text-violet-400 font-mono">{proposerAge} Years</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={proposerAge}
                  onChange={(e) => setProposerAge(+e.target.value)}
                  className="w-full accent-violet-500"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Tobacco / Smoking
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setIsSmoker(false)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      !isSmoker
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'border-white/5 text-slate-400'
                    }`}
                  >
                    Non-Smoker
                  </button>
                  <button
                    onClick={() => setIsSmoker(true)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSmoker
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'border-white/5 text-slate-400'
                    }`}
                  >
                    Smoker
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Policy Tenure
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setTenureYears(yr)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        tenureYears === yr
                          ? 'bg-violet-500/20 text-violet-400 border-violet-500/40'
                          : 'border-white/5 text-slate-400'
                      }`}
                    >
                      {yr} {yr === 1 ? 'Yr' : 'Yrs'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 block">Estimated Annual Quote</span>
                <span className="text-lg font-black text-white font-mono">
                  ₹{calculateDynamicPremium(selectedPlan).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Plan Comparison Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-bold text-slate-400">
                Available Comprehensive Plans ({filteredPlans.length})
              </span>
              <div className="flex gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40 font-bold'
                        : 'glass-card border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPlans.map((plan) => {
                const calculatedPremium = calculateDynamicPremium(plan);

                return (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-3xl glass-card border transition-all flex flex-col justify-between relative ${
                      plan.recommended
                        ? 'border-violet-500/80 shadow-lg shadow-violet-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Award className="w-3 h-3" /> Most Recommended
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-violet-400 font-mono font-bold">{plan.category} Plan</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          {plan.claimRatio} Claim Ratio
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-white leading-snug mb-3">{plan.name}</h3>

                      {/* Coverage & Premium Banner */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 mb-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Sum Insured</span>
                          <span className="text-lg font-black text-emerald-400 font-mono">{plan.coverage}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Premium / Year</span>
                          <span className="text-lg font-black text-white font-mono">₹{calculatedPremium.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Network & Room Rent Specs */}
                      <div className="space-y-1.5 text-xs text-slate-300 mb-4 font-medium">
                        <p className="flex items-center gap-2 text-slate-400">
                          <Building className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>{plan.networkHospitals}</span>
                        </p>
                        <p className="flex items-center gap-2 text-slate-400">
                          <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{plan.roomRentLimit}</span>
                        </p>
                      </div>

                      {/* Key Features List */}
                      <div className="space-y-2 mb-6">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Included Coverage Benefits
                        </span>
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyClick(plan)}
                      data-testid={`apply-plan-${plan.id}`}
                      className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                        plan.recommended
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-violet-500/20 hover:scale-[1.02]'
                          : 'bg-slate-900 hover:bg-slate-800 border border-white/10 text-white'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" /> Apply for Policy (Zero-Leak KYC)
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Step KYC & Policy Application Flow */
        <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] text-violet-400 font-mono font-bold uppercase block">
                Policy Application · {selectedPlan.name}
              </span>
              <h2 className="text-base font-extrabold text-white">Proposer Demographics & Identity KYC</h2>
            </div>
            <div className="flex gap-2 text-[10px] font-mono">
              {[
                { id: 'proposer_info', label: '1. Proposer' },
                { id: 'medical_declaration', label: '2. Health Declaration' },
                { id: 'nominee_kyc', label: '3. Nominee & KYC' },
                { id: 'review', label: '4. Review' },
              ].map((step, idx) => (
                <span
                  key={step.id}
                  className={`px-2.5 py-1 rounded-lg border font-bold ${
                    policyStep === step.id
                      ? 'bg-violet-500 text-white border-violet-400'
                      : ['proposer_info', 'medical_declaration', 'nominee_kyc', 'review'].indexOf(policyStep) > idx
                      ? 'bg-violet-950/60 text-violet-400 border-violet-800'
                      : 'bg-slate-900 text-slate-500 border-white/5'
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          {/* STEP 1: PROPOSER DETAILS */}
          {policyStep === 'proposer_info' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPolicyStep('medical_declaration');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Proposer Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="policyholderName"
                    required
                    placeholder="Harish Kumar"
                    value={formData.policyholderName}
                    onChange={(e) => setFormData((p) => ({ ...p, policyholderName: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Date of Birth (DOB) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData((p) => ({ ...p, dob: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Contact Email Address <span className="text-rose-400">*</span>
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
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Residential Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="42, Silicon Residency, Koramangala 4th Block, Bengaluru, KA 560034"
                    value={formData.address}
                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setPolicyStep('compare')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Plans
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Next: Health Declaration <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: MEDICAL DECLARATION */}
          {policyStep === 'medical_declaration' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPolicyStep('nominee_kyc');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Tobacco / Cigarette Usage</label>
                  <select
                    value={formData.tobaccoUse}
                    onChange={(e) => setFormData((p) => ({ ...p, tobaccoUse: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-950"
                  >
                    <option value="No">No / Never Consumed</option>
                    <option value="Occasional">Occasional / Social</option>
                    <option value="Regular">Regular Consumer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Alcohol Consumption</label>
                  <select
                    value={formData.alcoholUse}
                    onChange={(e) => setFormData((p) => ({ ...p, alcoholUse: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-950"
                  >
                    <option value="Never">Never</option>
                    <option value="Occasional">Occasional</option>
                    <option value="Regular">Regular</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Any Prior Surgeries / Chronic Conditions?
                  </label>
                  <input
                    type="text"
                    value={formData.preExistingSurgery}
                    onChange={(e) => setFormData((p) => ({ ...p, preExistingSurgery: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setPolicyStep('proposer_info')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Next: Nominee & KYC <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: NOMINEE & KYC DOCUMENTS */}
          {policyStep === 'nominee_kyc' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPolicyStep('review');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Nominee Full Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomineeName}
                    onChange={(e) => setFormData((p) => ({ ...p, nomineeName: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Relationship with Nominee</label>
                  <select
                    value={formData.nomineeRelation}
                    onChange={(e) => setFormData((p) => ({ ...p, nomineeRelation: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-950 font-bold"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent (Father/Mother)</option>
                    <option value="Child">Child (Son/Daughter)</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    National ID / Aadhaar Token Ref <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    required
                    placeholder="GOV_ID_001"
                    value={formData.nationalIdToken}
                    onChange={(e) => setFormData((p) => ({ ...p, nationalIdToken: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">PAN Card Token Ref</label>
                  <input
                    type="text"
                    value={formData.panToken}
                    onChange={(e) => setFormData((p) => ({ ...p, panToken: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setPolicyStep('medical_declaration')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Review Policy Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {policyStep === 'review' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="font-bold text-white">{selectedPlan.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedPlan.coverage}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">POLICYHOLDER</span>
                    <span className="font-bold text-white">{formData.policyholderName || 'Harish Kumar'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">NATIONAL ID KYC TOKEN</span>
                    <span className="font-mono text-violet-400 font-bold">GOV_ID_001 (Resolved Locally)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">NOMINEE</span>
                    <span>{formData.nomineeName} ({formData.nomineeRelation})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ANNUAL PREMIUM</span>
                    <span className="font-mono text-lg font-black text-white">
                      ₹{calculateDynamicPremium(selectedPlan).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPolicyStep('confirmed')}
                data-testid="confirm-insurance-final"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-extrabold shadow-lg shadow-violet-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Issue Insurance Policy Bond (Zero Data Leak)
              </button>
            </div>
          )}

          {/* CONFIRMATION SCREEN */}
          {policyStep === 'confirmed' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl badge-glow-violet flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Policy Bond Issued!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Policy Number:{' '}
                <span className="font-mono text-violet-400 font-bold">
                  POL-SG-{Math.floor(Math.random() * 900000 + 100000)}
                </span>
                . Your <strong className="text-white">{selectedPlan.name}</strong> is now active with immediate cashless coverage.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-300 max-w-sm mx-auto space-y-1">
                <div className="text-emerald-400 font-bold">✓ Digital Cashless Health Card Issued</div>
                <div className="text-slate-400">National ID & DOB resolved via local cryptographic vault.</div>
              </div>
              <button
                onClick={() => setPolicyStep('compare')}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-bold"
              >
                Explore Other Plans
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
