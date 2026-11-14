"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  Plus,
  Play,
  CheckCircle2,
  MapPin,
  Clock,
  UserCheck,
  Shield,
  ArrowRight,
  FileText,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useChakravyuh } from '@/context/ChakravyuhContext';

export const CasesModule: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    registerCase,
    setActiveModule,
    isGuidedActive,
    guidedStageIndex,
  } = useChakravyuh();

  // Stage 1 6-Step Animated Sequence State
  const [animStep, setAnimStep] = useState<number>(6);
  const [isAnimatingStage1, setIsAnimatingStage1] = useState<boolean>(false);

  // Manual New Case Registration Modal State
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [formTitle, setFormTitle] = useState('Suspected Corridor Vehicle Abduction Inquiry');
  const [formCategory, setFormCategory] = useState('Missing Person / Suspected Abduction');
  const [formLocation, setFormLocation] = useState('Indiranagar 100 Feet Road (HAL 2nd Stage), East Link Corridor (Fictional Bengaluru)');
  const [formVictim, setFormVictim] = useState('Aarav Sharma (32, Software Architect)');
  const [formSighting, setFormSighting] = useState('18:30');
  const [formComplaint, setFormComplaint] = useState('21:15');

  // Trigger Stage 1 sequence automatically when Guided Tour enters Stage 1
  useEffect(() => {
    if (isGuidedActive && guidedStageIndex === 0) {
      runStage1Sequence();
    }
  }, [isGuidedActive, guidedStageIndex]);

  const runStage1Sequence = () => {
    setIsAnimatingStage1(true);
    setAnimStep(1);
    const timers = [
      setTimeout(() => setAnimStep(2), 1200),
      setTimeout(() => setAnimStep(3), 2600),
      setTimeout(() => setAnimStep(4), 4000),
      setTimeout(() => setAnimStep(5), 5400),
      setTimeout(() => {
        setAnimStep(6);
        setIsAnimatingStage1(false);
      }, 6800),
    ];
    return () => timers.forEach(clearTimeout);
  };

  const handleCreateCustomCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CASE-CKV-2026-00${43 + cases.length - 4}`;
    registerCase({
      id: newId,
      title: formTitle,
      category: formCategory,
      status: 'Active — Priority Verification',
      incidentDate: '02 November 2026',
      lastConfirmedSightingTime: formSighting,
      complaintReceivedTime: formComplaint,
      incidentLocation: formLocation,
      coordinates: [12.9685, 77.6412],
      victimAlias: formVictim,
      victimDescription: 'Registered via Interactive Demonstration Form.',
      assignedInvestigator: 'Inspector Vikram Rao',
      supervisingOfficer: 'ACP Meera Nair',
      forensicLead: 'Dr. Priya Krishnan',
      summary: `Documented incident at ${formLocation}. Last confirmed sighting at ${formSighting}; complaint received at ${formComplaint}.`,
      authorisationRef: `AUTH-BLR-SYN-2026-${8900 + cases.length}`,
      jurisdiction: 'Indiranagar Police Station — Bengaluru East Division',
    });
    setShowNewCaseModal(false);
  };

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141D2F] border border-[#22314E] rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <FolderKanban className="w-4 h-4" />
            <span>Stage 1 Capability • Case Management & Incident Registration</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Structured Investigation Case Registry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            An investigation begins with a documented incident. Project Chakravyuh creates a structured case workspace where all subsequent evidence and investigative observations can be brought together.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={runStage1Sequence}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 text-xs font-semibold transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Replay Stage 1 Registration Animation</span>
          </button>

          <button
            onClick={() => setShowNewCaseModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Incident</span>
          </button>
        </div>
      </div>

      {/* STAGE 1 — INTERACTIVE 6-STEP INCIDENT REGISTRATION ANIMATION PANEL */}
      <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              STAGE 1 — INCIDENT REGISTRATION SEQUENCE (CASE-CKV-2026-0042)
            </h2>
          </div>
          {animStep >= 6 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Incident successfully registered.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-mono animate-pulse">
              Step {animStep} of 6 in progress...
            </span>
          )}
        </div>

        {/* 6 Animated Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 7 Cols: Animated Registration Form & Sequence Steps */}
          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { step: 1, label: '1. Registration Form' },
                { step: 2, label: '2. Incident Details Entered' },
                { step: 3, label: '3. Location Plotted on Map' },
                { step: 4, label: '4. 18:30 Sighting Highlighted' },
                { step: 5, label: '5. Added to Timeline' },
                { step: 6, label: '6. Reference Generated' },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all duration-300 ${
                    animStep >= s.step
                      ? 'bg-sky-950/60 border-sky-500/50 text-sky-200'
                      : 'bg-[#090D16]/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      animStep >= s.step ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span className="truncate">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Step 1 & 2: Structured Case Registration Card */}
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: animStep >= 1 ? 1 : 0.4 }}
              className="bg-[#090D16] border border-[#22314E] rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-slate-400">
                  DIGITAL INCIDENT INTAKE FORM (SYNTHETIC)
                </span>
                {animStep >= 6 && (
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    REF: CASE-CKV-2026-0042
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-[#0F1624] border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Case Category</div>
                  <div className="font-semibold text-white mt-0.5">
                    {animStep >= 2 ? 'Missing Person / Suspected Abduction' : 'Entering...'}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#0F1624] border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Incident Date</div>
                  <div className="font-semibold text-white mt-0.5">
                    {animStep >= 2 ? '02 November 2026' : 'Entering...'}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#0F1624] border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Victim Subject</div>
                  <div className="font-semibold text-sky-300 mt-0.5">
                    {animStep >= 2 ? 'Aarav Sharma (32, Software Architect)' : 'Entering...'}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#0F1624] border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Assigned Investigator</div>
                  <div className="font-semibold text-teal-300 mt-0.5">
                    {animStep >= 2 ? 'Inspector Vikram Rao' : 'Assigning...'}
                  </div>
                </div>
              </div>

              {/* Step 4 & 5: Highlighted Sighting & Timeline Anchor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-lg border transition-all duration-500 ${
                    animStep >= 4
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/5'
                      : 'bg-[#0F1624] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Last Confirmed Sighting</span>
                  </div>
                  <div className="text-lg font-bold font-mono mt-0.5">18:30 IST</div>
                  <div className="text-[11px] opacity-90">
                    Indiranagar 100 Feet Road (HAL 2nd Stage) Community Library Walkway
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border transition-all duration-500 ${
                    animStep >= 5
                      ? 'bg-sky-500/15 border-sky-400 text-sky-200'
                      : 'bg-[#0F1624] border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>Complaint Received & Timeline Anchored</span>
                  </div>
                  <div className="text-lg font-bold font-mono mt-0.5">21:15 IST</div>
                  <div className="text-[11px] opacity-90">
                    Added to Unified Investigation Timeline (TLE-004 & TLE-019)
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right 5 Cols: Step 3 Animated Spatial Radar & Workspace Launch */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#090D16] border border-[#22314E] rounded-xl p-4 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-sky-400 uppercase font-semibold">
                  Spatial Incident Pin — Bengaluru Demo Grid
                </span>
                <span className="font-mono text-[11px] text-slate-400">12.9685° N, 77.6412° E</span>
              </div>

              {/* Tactical Vector Map Preview */}
              <div className="h-44 rounded-lg bg-[#0B1322] border border-slate-800 relative overflow-hidden flex items-center justify-center">
                {/* Grid lines */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #1e3a5f 1px, transparent 1px), linear-gradient(to bottom, #1e3a5f 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                {/* Corridor Arterial Line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180">
                  <path
                    d="M 20 130 Q 150 110, 240 85 T 380 45"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="8"
                  />
                  <path
                    d="M 20 130 Q 150 110, 240 85 T 380 45"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                  {animStep >= 3 && (
                    <>
                      <circle cx="145" cy="105" r="32" fill="#EF4444" fillOpacity="0.15" stroke="#EF4444" strokeDasharray="3 3" />
                      <circle cx="145" cy="105" r="7" fill="#EF4444" />
                      <text x="158" y="102" fill="#F8FAFC" fontSize="10" fontWeight="bold">
                        Kaveri Sector-4 (18:30 Sighting)
                      </text>
                      <text x="158" y="115" fill="#94A3B8" fontSize="9">
                        CASE-CKV-2026-0042 Anchor
                      </text>
                    </>
                  )}
                </svg>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs">
                <div className="font-bold text-emerald-400">
                  “Incident successfully registered.”
                </div>
                <div className="text-[11px] text-slate-400">
                  Structured workspace ready for multi-source ingestion.
                </div>
              </div>
              <button
                onClick={() => setActiveModule('workspace')}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shrink-0 transition"
              >
                <span>Open Investigation Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ALL CASES TABLE & SELECTED CASE DOSSIER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Division Synthetic Cases ({cases.length})
          </h3>
          {cases.map((c) => {
            const isSelected = c.id === selectedCase.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-[#17233A] border-sky-400 shadow-lg'
                    : 'bg-[#141D2F] border-[#22314E] hover:border-slate-600'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-300">{c.id}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {c.category}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      c.id === 'CASE-CKV-2026-0042'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{c.title}</h4>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {c.incidentLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Sighting: {c.lastConfirmedSightingTime} | Complaint: {c.complaintReceivedTime}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Case Detail Card */}
        <div className="lg:col-span-5 bg-[#141D2F] border border-[#22314E] rounded-xl p-5 space-y-4 h-fit">
          <div className="border-b border-slate-800 pb-3">
            <div className="text-xs font-mono text-sky-400">{selectedCase.id} • CASE DOSSIER</div>
            <h3 className="text-base font-bold text-white mt-0.5">{selectedCase.title}</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{selectedCase.summary}</p>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">VICTIM (SYNTHETIC)</div>
              <div className="font-semibold text-white mt-0.5">{selectedCase.victimAlias}</div>
            </div>
            <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">AUTHORISATION REF</div>
              <div className="font-mono font-semibold text-teal-300 mt-0.5">{selectedCase.authorisationRef}</div>
            </div>
            <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">INVESTIGATOR</div>
              <div className="font-semibold text-white mt-0.5">{selectedCase.assignedInvestigator}</div>
            </div>
            <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono">SUPERVISING OFFICER</div>
              <div className="font-semibold text-white mt-0.5">{selectedCase.supervisingOfficer}</div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveModule('workspace')}
              className="flex-1 py-2.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs text-center transition"
            >
              Launch Case Workspace
            </button>
            <button
              onClick={() => setActiveModule('reports')}
              className="py-2.5 px-3 rounded-lg bg-[#090D16] hover:bg-slate-800 border border-[#22314E] text-slate-200 text-xs font-medium transition"
            >
              View Case Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Modal to Register a New Custom Synthetic Case */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141D2F] border border-sky-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl"
            >
              <h3 className="text-base font-bold text-white mb-1">
                Register New Synthetic Demonstration Case
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Creates a new structured case container in the demonstration environment.
              </p>

              <form onSubmit={handleCreateCustomCase} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Case Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Category</label>
                    <input
                      type="text"
                      required
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Fictional Subject / Victim</label>
                    <input
                      type="text"
                      required
                      value={formVictim}
                      onChange={(e) => setFormVictim(e.target.value)}
                      className="w-full bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Fictional Location (Bengaluru)</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Last Confirmed Sighting</label>
                    <input
                      type="text"
                      required
                      value={formSighting}
                      onChange={(e) => setFormSighting(e.target.value)}
                      className="w-full bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Complaint Received</label>
                    <input
                      type="text"
                      required
                      value={formComplaint}
                      onChange={(e) => setFormComplaint(e.target.value)}
                      className="w-full bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowNewCaseModal(false)}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                  >
                    Register Incident & Open Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


