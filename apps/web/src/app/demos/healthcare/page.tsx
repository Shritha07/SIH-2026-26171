'use client';

import React, { useState } from 'react';
import {
  HeartPulse, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, Star,
  User, Stethoscope, Video, Building, Phone, Mail, FileText, Check,
  AlertCircle, Sparkles, ArrowRight, Activity, Award,
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  hospital: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  fee: number;
  languages: string[];
  nextAvailable: string;
  slots: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
}

const SPECIALTIES = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'General Medicine'];

const DOCTORS: Doctor[] = [
  {
    id: 'doc_cardiology_dr_arvind',
    name: 'Dr. Arvind Nambiar, MD DM',
    specialty: 'Cardiology',
    degree: 'MD, DM (Cardiology) - AIIMS New Delhi',
    hospital: 'Apex Heart & Vascular Institute, Bengaluru',
    experience: '18 Years Experience',
    rating: 4.9,
    reviewsCount: 1240,
    fee: 1200,
    languages: ['English', 'Hindi', 'Kannada'],
    nextAvailable: 'Today',
    slots: {
      morning: ['09:30 AM', '10:30 AM', '11:15 AM'],
      afternoon: ['02:00 PM', '03:30 PM'],
      evening: ['05:00 PM', '06:30 PM'],
    },
  },
  {
    id: 'doc_neurology_dr_sneha',
    name: 'Dr. Sneha Reddy, MS MCh',
    specialty: 'Neurology',
    degree: 'MS, MCh (Neuro Surgery) - NIMHANS',
    hospital: 'MediCare Brain & Spine Hospital, Bengaluru',
    experience: '14 Years Experience',
    rating: 4.8,
    reviewsCount: 890,
    fee: 1500,
    languages: ['English', 'Telugu', 'Hindi'],
    nextAvailable: 'Tomorrow',
    slots: {
      morning: ['10:00 AM', '11:45 AM'],
      afternoon: ['02:30 PM', '04:00 PM'],
      evening: ['06:00 PM'],
    },
  },
  {
    id: 'doc_ortho_dr_vikram',
    name: 'Dr. Vikram Malhotra, MS (Ortho)',
    specialty: 'Orthopedics',
    degree: 'MS Orthopedics, Fellowship Joint Replacement',
    hospital: 'Fortis Orthopedic Care, Bengaluru',
    experience: '16 Years Experience',
    rating: 4.9,
    reviewsCount: 1560,
    fee: 1100,
    languages: ['English', 'Hindi', 'Punjabi'],
    nextAvailable: 'Today',
    slots: {
      morning: ['09:00 AM', '10:15 AM'],
      afternoon: ['01:30 PM', '03:00 PM'],
      evening: ['05:30 PM', '07:00 PM'],
    },
  },
  {
    id: 'doc_derma_dr_kavya',
    name: 'Dr. Kavya Shenoy, MD (Dermatology)',
    specialty: 'Dermatology',
    degree: 'MD Dermatology & Aesthetic Medicine - KMC',
    hospital: 'Skin & Aesthetics Specialty Clinic',
    experience: '10 Years Experience',
    rating: 4.7,
    reviewsCount: 940,
    fee: 900,
    languages: ['English', 'Kannada', 'Hindi'],
    nextAvailable: 'Today',
    slots: {
      morning: ['11:00 AM'],
      afternoon: ['02:00 PM', '03:45 PM'],
      evening: ['05:00 PM', '06:15 PM'],
    },
  },
  {
    id: 'doc_gen_dr_ramesh',
    name: 'Dr. Ramesh Sundaram, MD (Medicine)',
    specialty: 'General Medicine',
    degree: 'MD Internal Medicine - CMC Vellore',
    hospital: 'MediCare Comprehensive Health Center',
    experience: '22 Years Experience',
    rating: 4.9,
    reviewsCount: 2800,
    fee: 800,
    languages: ['English', 'Tamil', 'Hindi', 'Kannada'],
    nextAvailable: 'Today',
    slots: {
      morning: ['08:30 AM', '09:45 AM', '11:00 AM'],
      afternoon: ['01:00 PM', '02:30 PM'],
      evening: ['04:30 PM', '06:00 PM'],
    },
  },
];

type IntakeStep = 'select_doc' | 'patient_info' | 'medical_intake' | 'review' | 'confirmed';

export default function HealthcareDemoPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(DOCTORS[0]);
  const [consultType, setConsultType] = useState<'Clinic' | 'Video'>('Clinic');
  const [selectedDate, setSelectedDate] = useState('2026-09-02');
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM');
  const [intakeStep, setIntakeStep] = useState<IntakeStep>('select_doc');

  // Patient Intake State
  const [patientData, setPatientData] = useState({
    patientName: '',
    dob: '',
    phone: '',
    email: '',
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContact: '+91 9876543210',
    symptoms: 'Routine specialist consultation and annual health check-up.',
    allergies: 'None reported / Penicillin sensitivity',
    preExisting: 'Mild hypertension (controlled)',
    nationalIdToken: 'GOV_ID_001',
    insurancePolicyNo: 'MED-CARE-889410',
  });

  const filteredDoctors = DOCTORS.filter((d) => {
    return selectedSpecialty === 'All' || d.specialty === selectedSpecialty;
  });

  const handleBookDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setIntakeStep('patient_info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full badge-glow-rose text-xs font-mono font-bold">
              DEMO 4 / 5 · HEALTHCARE & TELEMEDICINE
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">MediCare Super Specialty Network</h1>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Agent Goal:{' '}
            <span className="text-rose-400 font-semibold">
              "Select Cardiology specialist (Dr. Arvind Nambiar), pick 10:30 AM slot, fill patient medical intake with DOB/vault token, and book appointment."
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-mono text-rose-400 flex items-center gap-2">
            <HeartPulse className="w-4 h-4" />
            <span>NABH Accredited · 100% HIPAA/DPDP Safe</span>
          </div>
        </div>
      </div>

      {intakeStep === 'select_doc' ? (
        <div className="space-y-6">
          {/* Specialty Filter Pills */}
          <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Filter by Specialty
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConsultType('Clinic')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    consultType === 'Clinic'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏥 In-Clinic Visit
                </button>
                <button
                  onClick={() => setConsultType('Video')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    consultType === 'Video'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📹 Video Consultation
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                    selectedSpecialty === spec
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                      : 'glass-card border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Directory Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-3xl glass-card border border-white/10 hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Doctor Profile Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <Stethoscope className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white">{doc.name}</h3>
                        <p className="text-xs text-rose-400 font-medium">{doc.specialty}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{doc.degree}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-slate-500">({doc.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Hospital & Languages */}
                  <div className="space-y-1 text-xs text-slate-300 mb-4">
                    <p className="flex items-center gap-1.5 text-slate-400">
                      <Building className="w-3.5 h-3.5 text-slate-500" /> {doc.hospital}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Languages: {doc.languages.join(', ')} · {doc.experience}
                    </p>
                  </div>

                  {/* Available Slots */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Available Consultation Slots (Today)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[...doc.slots.morning, ...doc.slots.afternoon].slice(0, 4).map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-rose-500 text-white border-rose-400'
                              : 'bg-slate-900 text-slate-300 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consultation Fee & Booking Action */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Consultation Fee</span>
                    <span className="text-lg font-black text-white font-mono">₹{doc.fee}</span>
                  </div>

                  <button
                    onClick={() => handleBookDoctor(doc)}
                    data-testid={`book-doctor-${doc.id}`}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    Book Appointment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Patient Intake Pipeline */
        <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] text-rose-400 font-mono font-bold uppercase block">
                Appointment with {selectedDoctor.name}
              </span>
              <h2 className="text-base font-extrabold text-white">Patient Demographics & Medical Intake</h2>
            </div>
            <div className="flex gap-2 text-[10px] font-mono">
              {[
                { id: 'patient_info', label: '1. Demographics' },
                { id: 'medical_intake', label: '2. Medical Intake' },
                { id: 'review', label: '3. Review' },
              ].map((step, idx) => (
                <span
                  key={step.id}
                  className={`px-2.5 py-1 rounded-lg border font-bold ${
                    intakeStep === step.id
                      ? 'bg-rose-500 text-white border-rose-400'
                      : ['patient_info', 'medical_intake', 'review'].indexOf(intakeStep) > idx
                      ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                      : 'bg-slate-900 text-slate-500 border-white/5'
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          {/* STEP 1: PATIENT DEMOGRAPHICS */}
          {intakeStep === 'patient_info' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIntakeStep('medical_intake');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Patient Full Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    required
                    placeholder="Harish Kumar"
                    value={patientData.patientName}
                    onChange={(e) => setPatientData((p) => ({ ...p, patientName: e.target.value }))}
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
                    value={patientData.dob}
                    onChange={(e) => setPatientData((p) => ({ ...p, dob: e.target.value }))}
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
                    value={patientData.email}
                    onChange={(e) => setPatientData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Contact Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={patientData.phone}
                    onChange={(e) => setPatientData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Blood Group</label>
                  <select
                    value={patientData.bloodGroup}
                    onChange={(e) => setPatientData((p) => ({ ...p, bloodGroup: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white bg-slate-950 font-bold"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Selected Appointment Slot</label>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-rose-400 font-bold">
                    {selectedDate} at {selectedSlot} ({consultType})
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIntakeStep('select_doc')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Change Doctor
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Next: Medical Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: MEDICAL ASSESSMENT */}
          {intakeStep === 'medical_intake' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIntakeStep('review');
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5">
                  Primary Symptoms / Reason for Visit
                </label>
                <textarea
                  rows={3}
                  name="symptoms"
                  value={patientData.symptoms}
                  onChange={(e) => setPatientData((p) => ({ ...p, symptoms: e.target.value }))}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Known Drug Allergies</label>
                  <input
                    type="text"
                    value={patientData.allergies}
                    onChange={(e) => setPatientData((p) => ({ ...p, allergies: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Pre-existing Health Conditions</label>
                  <input
                    type="text"
                    value={patientData.preExisting}
                    onChange={(e) => setPatientData((p) => ({ ...p, preExisting: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Health Insurance Policy #</label>
                  <input
                    type="text"
                    value={patientData.insurancePolicyNo}
                    onChange={(e) => setPatientData((p) => ({ ...p, insurancePolicyNo: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">National ID / Aadhaar Token Ref</label>
                  <input
                    type="text"
                    value={patientData.nationalIdToken}
                    onChange={(e) => setPatientData((p) => ({ ...p, nationalIdToken: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIntakeStep('patient_info')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Review Appointment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {intakeStep === 'review' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="font-bold text-white">{selectedDoctor.name} ({selectedDoctor.specialty})</span>
                  <span className="font-mono text-rose-400 font-bold">{selectedSlot} · {consultType}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">PATIENT NAME</span>
                    <span className="font-bold text-white">{patientData.patientName || 'Harish Kumar'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">DOB TOKEN</span>
                    <span className="font-mono text-rose-400 font-bold">DOB_001 (Protected)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">REASON</span>
                    <span className="truncate">{patientData.symptoms}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">CONSULTATION FEE</span>
                    <span className="font-mono text-lg font-black text-white">₹{selectedDoctor.fee}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIntakeStep('confirmed')}
                data-testid="confirm-appointment-final"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-extrabold shadow-lg shadow-rose-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Confirm Appointment (Zero Medical PII Leaks)
              </button>
            </div>
          )}

          {/* CONFIRMATION SCREEN */}
          {intakeStep === 'confirmed' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl badge-glow-rose flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-rose-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Token #:{' '}
                <span className="font-mono text-rose-400 font-bold">
                  MED-TKN-{Math.floor(Math.random() * 9000 + 1000)}
                </span>
                . Your consultation with <strong className="text-white">{selectedDoctor.name}</strong> is scheduled for{' '}
                <span className="text-white font-bold">{selectedSlot}</span>.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-300 max-w-sm mx-auto space-y-1">
                <div className="text-emerald-400 font-bold">✓ Digital Health Pass Issued</div>
                <div className="text-slate-400">Medical history & DOB encrypted locally.</div>
              </div>
              <button
                onClick={() => setIntakeStep('select_doc')}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-bold"
              >
                Book Another Doctor
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
