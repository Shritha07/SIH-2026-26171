'use client';

import React, { useState } from 'react';
import {
  Plane, Calendar, Users, ShieldCheck, CheckCircle2, ArrowRight, Clock,
  MapPin, Tag, Luggage, Utensils, Award, Star, Check, X, QrCode,
  CreditCard, ChevronRight, AlertCircle, Sparkles, SlidersHorizontal,
} from 'lucide-react';

interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNo: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  stops: 'Non-stop' | '1-stop (HYD)' | '1-stop (BOM)';
  aircraft: string;
  rating: number;
  seatsLeft: number;
  mealsIncluded: boolean;
  baggage: string;
  tiers: {
    saver: number;
    flexi: number;
    business: number;
  };
}

const CITIES = [
  { code: 'BLR', name: 'Bengaluru (BLR)' },
  { code: 'DEL', name: 'New Delhi (DEL)' },
  { code: 'BOM', name: 'Mumbai (BOM)' },
  { code: 'HYD', name: 'Hyderabad (HYD)' },
  { code: 'MAA', name: 'Chennai (MAA)' },
  { code: 'CCU', name: 'Kolkata (CCU)' },
];

const FLIGHTS: Flight[] = [
  {
    id: 'fl_indigo_6e2045',
    airline: 'IndiGo Airlines',
    airlineCode: '6E',
    flightNo: '6E-2045',
    from: 'Bengaluru (BLR)',
    fromCode: 'BLR',
    to: 'New Delhi (DEL)',
    toCode: 'DEL',
    departTime: '06:15',
    arriveTime: '09:05',
    duration: '2h 50m',
    price: 5499,
    stops: 'Non-stop',
    aircraft: 'Airbus A321neo',
    rating: 4.7,
    seatsLeft: 4,
    mealsIncluded: false,
    baggage: '15 kg check-in + 7 kg cabin',
    tiers: { saver: 5499, flexi: 6299, business: 12499 },
  },
  {
    id: 'fl_airindia_ai804',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNo: 'AI-804',
    from: 'Bengaluru (BLR)',
    fromCode: 'BLR',
    to: 'New Delhi (DEL)',
    toCode: 'DEL',
    departTime: '10:30',
    arriveTime: '13:15',
    duration: '2h 45m',
    price: 6850,
    stops: 'Non-stop',
    aircraft: 'Boeing 777-300ER',
    rating: 4.8,
    seatsLeft: 7,
    mealsIncluded: true,
    baggage: '25 kg check-in + 8 kg cabin',
    tiers: { saver: 6850, flexi: 7650, business: 15200 },
  },
  {
    id: 'fl_vistara_uk812',
    airline: 'Vistara (Club Vistara)',
    airlineCode: 'UK',
    flightNo: 'UK-812',
    from: 'Bengaluru (BLR)',
    fromCode: 'BLR',
    to: 'New Delhi (DEL)',
    toCode: 'DEL',
    departTime: '18:40',
    arriveTime: '21:35',
    duration: '2h 55m',
    price: 7490,
    stops: 'Non-stop',
    aircraft: 'Airbus A321neo LR',
    rating: 4.9,
    seatsLeft: 2,
    mealsIncluded: true,
    baggage: '20 kg check-in + 7 kg cabin',
    tiers: { saver: 7490, flexi: 8390, business: 16900 },
  },
  {
    id: 'fl_akasa_qp1340',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNo: 'QP-1340',
    from: 'Bengaluru (BLR)',
    fromCode: 'BLR',
    to: 'New Delhi (DEL)',
    toCode: 'DEL',
    departTime: '14:20',
    arriveTime: '17:10',
    duration: '2h 50m',
    price: 5199,
    stops: 'Non-stop',
    aircraft: 'Boeing 737 MAX 8',
    rating: 4.6,
    seatsLeft: 9,
    mealsIncluded: false,
    baggage: '15 kg check-in + 7 kg cabin',
    tiers: { saver: 5199, flexi: 5999, business: 11500 },
  },
  {
    id: 'fl_spicejet_sg502',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    flightNo: 'SG-502',
    from: 'Bengaluru (BLR)',
    fromCode: 'BLR',
    to: 'New Delhi (DEL)',
    toCode: 'DEL',
    departTime: '21:15',
    arriveTime: '00:10 (+1)',
    duration: '2h 55m',
    price: 4890,
    stops: 'Non-stop',
    aircraft: 'Boeing 737-800',
    rating: 4.3,
    seatsLeft: 12,
    mealsIncluded: false,
    baggage: '15 kg check-in + 7 kg cabin',
    tiers: { saver: 4890, flexi: 5590, business: 10990 },
  },
];

type BookingStep = 'search' | 'flight_selected' | 'passenger_intake' | 'addons' | 'review' | 'confirmed';

export default function FlightsDemoPage() {
  const [fromCity, setFromCity] = useState('BLR');
  const [toCity, setToCity] = useState('DEL');
  const [travelDate, setTravelDate] = useState('2026-09-15');
  const [travelClass, setTravelClass] = useState<'Economy' | 'Premium' | 'Business'>('Economy');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedTier, setSelectedTier] = useState<'saver' | 'flexi' | 'business'>('saver');
  const [bookingStep, setBookingStep] = useState<BookingStep>('search');

  // Add-ons
  const [seatPref, setSeatPref] = useState<'Window' | 'Aisle' | 'Extra Legroom'>('Window');
  const [addInsurance, setAddInsurance] = useState(true);
  const [extraBaggage, setExtraBaggage] = useState(false);

  // Passenger KYC Form
  const [passengerData, setPassengerData] = useState({
    passengerName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    nationality: 'Indian',
    passportNumber: '',
    frequentFlyer: 'FF-884291',
    emergencyContact: '+91 9123456780',
  });

  const getTierPrice = (flight: Flight) => {
    return flight.tiers[selectedTier] || flight.price;
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setBookingStep('passenger_intake');
  };

  const calculateTotal = () => {
    if (!selectedFlight) return 0;
    let base = getTierPrice(selectedFlight);
    if (addInsurance) base += 299;
    if (extraBaggage) base += 750;
    if (seatPref === 'Extra Legroom') base += 500;
    return base;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full badge-glow-cyan text-xs font-mono font-bold">
              DEMO 3 / 5 · FLIGHT BOOKING & KYC
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">SkyVoyage Global Flights</h1>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Agent Goal:{' '}
            <span className="text-cyan-400 font-semibold">
              "Search BLR to DEL flights, choose highest-rated carrier, select Economy Flexi tier, complete passenger KYC with passport token, and confirm booking."
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2">
            <Plane className="w-4 h-4" />
            <span>BLR ⇄ DEL Direct Hub</span>
          </div>
        </div>
      </div>

      {bookingStep === 'search' ? (
        <div className="space-y-6">
          {/* Flight Search Controls */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                  Origin Airport
                </label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-white bg-slate-950 font-bold"
                >
                  {CITIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                  Destination Airport
                </label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-white bg-slate-950 font-bold"
                >
                  {CITIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                  Travel Class
                </label>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value as any)}
                  className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-white bg-slate-950 font-bold"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium">Premium Economy</option>
                  <option value="Business">Business Class</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flight Search Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-bold text-slate-400">
                Available Direct Flights: <span className="text-white">{fromCity} → {toCity}</span> ({FLIGHTS.length})
              </span>
              <span className="text-xs text-cyan-400 font-mono">Sorted by Best Value & Departure</span>
            </div>

            <div className="space-y-3">
              {FLIGHTS.map((flight) => (
                <div
                  key={flight.id}
                  className="p-5 rounded-3xl glass-card border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Airline & Aircraft */}
                  <div className="flex items-center gap-4 min-w-[220px]">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black font-mono text-sm">
                      {flight.airlineCode}
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-white">{flight.airline}</h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {flight.flightNo} · {flight.aircraft}
                      </p>
                      <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold mt-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{flight.rating}</span>
                        <span className="text-slate-500">· {flight.seatsLeft} seats left</span>
                      </div>
                    </div>
                  </div>

                  {/* Flight Times */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-lg font-black text-white font-mono block">{flight.departTime}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{flight.fromCode}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-mono">{flight.duration}</span>
                      <div className="w-24 h-0.5 bg-slate-800 relative flex items-center justify-center">
                        <Plane className="w-3 h-3 text-cyan-400 absolute rotate-90" />
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase">{flight.stops}</span>
                    </div>

                    <div>
                      <span className="text-lg font-black text-white font-mono block">{flight.arriveTime}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{flight.toCode}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Luggage className="w-3.5 h-3.5" /> {flight.baggage}
                    </span>
                    {flight.mealsIncluded && (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Utensils className="w-3.5 h-3.5" /> Meal Included
                      </span>
                    )}
                  </div>

                  {/* Fare & Book CTA */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Economy from</span>
                      <span className="text-xl font-black text-white font-mono">₹{flight.price.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleSelectFlight(flight)}
                      data-testid={`select-flight-${flight.id}`}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 flex items-center gap-2"
                    >
                      Select Flight <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Step Passenger Intake & Booking Flow */
        <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase block">
                {selectedFlight?.airline} ({selectedFlight?.flightNo})
              </span>
              <h2 className="text-base font-extrabold text-white">Passenger KYC & Booking Details</h2>
            </div>
            <div className="flex gap-2 text-[10px] font-mono">
              {[
                { id: 'passenger_intake', label: '1. KYC & Passenger' },
                { id: 'addons', label: '2. Add-ons' },
                { id: 'review', label: '3. Review' },
              ].map((step, idx) => (
                <span
                  key={step.id}
                  className={`px-2.5 py-1 rounded-lg border font-bold ${
                    bookingStep === step.id
                      ? 'bg-cyan-500 text-white border-cyan-400'
                      : ['passenger_intake', 'addons', 'review'].indexOf(bookingStep) > idx
                      ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800'
                      : 'bg-slate-900 text-slate-500 border-white/5'
                  }`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          {/* STEP 1: PASSENGER KYC */}
          {bookingStep === 'passenger_intake' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBookingStep('addons');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Passenger Full Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="passengerName"
                    required
                    placeholder="Harish Kumar"
                    value={passengerData.passengerName}
                    onChange={(e) => setPassengerData((p) => ({ ...p, passengerName: e.target.value }))}
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
                    value={passengerData.dob}
                    onChange={(e) => setPassengerData((p) => ({ ...p, dob: e.target.value }))}
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
                    value={passengerData.email}
                    onChange={(e) => setPassengerData((p) => ({ ...p, email: e.target.value }))}
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
                    value={passengerData.phone}
                    onChange={(e) => setPassengerData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">
                    Passport / National ID Reference <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    required
                    placeholder="GOV_ID_001"
                    value={passengerData.passportNumber}
                    onChange={(e) => setPassengerData((p) => ({ ...p, passportNumber: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1.5">Frequent Flyer Number</label>
                  <input
                    type="text"
                    value={passengerData.frequentFlyer}
                    onChange={(e) => setPassengerData((p) => ({ ...p, frequentFlyer: e.target.value }))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setBookingStep('search')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Search
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Next: Add-ons & Seats <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ADD-ONS & SEAT SELECTION */}
          {bookingStep === 'addons' && (
            <div className="space-y-4">
              {/* Fare Tier Selector */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Select Fare Tier</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'saver', name: 'Economy Saver', price: selectedFlight?.tiers.saver, desc: 'Standard baggage' },
                    { id: 'flexi', name: 'Economy Flexi', price: selectedFlight?.tiers.flexi, desc: 'Free seat + Meal' },
                    { id: 'business', name: 'Business Prime', price: selectedFlight?.tiers.business, desc: 'Priority Lounge + 25kg' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTier(t.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedTier === t.id
                          ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg'
                          : 'glass-card border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold block">{t.name}</span>
                      <span className="text-sm font-mono font-black text-cyan-400 block mt-1">₹{t.price?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat Selection */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white">Preferred Seat Placement</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['Window', 'Aisle', 'Extra Legroom'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeatPref(s)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        seatPref === s
                          ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-400'
                          : 'border-white/10 text-slate-400'
                      }`}
                    >
                      {s} {s === 'Extra Legroom' ? '(+₹500)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Insurance */}
              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-white/10 cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addInsurance}
                    onChange={(e) => setAddInsurance(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Comprehensive Travel Insurance (+₹299)</span>
                    <span className="text-[11px] text-slate-400">Covers medical emergencies, baggage loss & flight delays up to ₹5,00,000</span>
                  </div>
                </div>
              </label>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setBookingStep('passenger_intake')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setBookingStep('review')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                >
                  Review Booking <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {bookingStep === 'review' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="font-bold text-white">{selectedFlight?.airline} · {selectedFlight?.flightNo}</span>
                  <span className="font-mono text-cyan-400 font-bold">{selectedFlight?.fromCode} → {selectedFlight?.toCode}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">PASSENGER NAME</span>
                    <span className="font-bold text-white">{passengerData.passengerName || 'Harish Kumar'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PASSPORT KYC REF</span>
                    <span className="font-mono text-cyan-400 font-bold">{passengerData.passportNumber || 'GOV_ID_001'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">SEAT PREFERENCE</span>
                    <span>{seatPref}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">TOTAL FARE</span>
                    <span className="font-mono text-lg font-black text-white">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBookingStep('confirmed')}
                data-testid="confirm-booking-final"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-extrabold shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Confirm & Issue Boarding Pass (Zero Leak)
              </button>
            </div>
          )}

          {/* CONFIRMATION SCREEN */}
          {bookingStep === 'confirmed' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl badge-glow-cyan flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Booking Confirmed!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                PNR Number:{' '}
                <span className="font-mono text-cyan-400 font-bold">
                  SKY-{Math.floor(Math.random() * 900000 + 100000)}
                </span>
                . Flight <strong className="text-white">{selectedFlight?.flightNo}</strong> ({selectedFlight?.fromCode} → {selectedFlight?.toCode}) is booked.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-300 max-w-sm mx-auto space-y-1">
                <div className="text-emerald-400 font-bold">✓ E-Ticket & Boarding Pass Ready</div>
                <div className="text-slate-400">Passport KYC resolved on-device only.</div>
              </div>
              <button
                onClick={() => setBookingStep('search')}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white text-xs font-bold"
              >
                Book Another Flight
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
