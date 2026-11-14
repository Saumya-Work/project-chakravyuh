"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Cctv,
  Clock,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  XCircle,
  ArrowRight,
  GitCompare,
  MapPin,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';
import { VehicleVerificationComparison } from '@/types/sentinel';

const VERIFICATION_OPTIONS: VehicleVerificationComparison[] = [
  'Confirmed same vehicle',
  'Possibly related vehicle',
  'Not the same vehicle',
  'Inconclusive',
];

export const VehicleIntelligenceModule: React.FC = () => {
  const {
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    updateVehicleVerification,
    setActiveModule,
    setSelectedCameraId,
  } = useSentinel();

  const [comparisonNote, setComparisonNote] = useState('');
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const veh1 = vehicles.find((v) => v.id === 'VEH-001')!;
  const veh2 = vehicles.find((v) => v.id === 'VEH-002')!;
  const veh3 = vehicles.find((v) => v.id === 'VEH-003')!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <Car className="w-4 h-4" />
            <span>Stage 6 Capability • Vehicle Intelligence & Multi-Camera Sighting Comparison</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Corridor Vehicle Observation & Comparison Workspace (VEH-001 to VEH-008)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Vehicle observations from different evidence sources can be brought together for comparison and manual verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveModule('ai-engine')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition"
          >
            <span>Proceed to Stage 7: AI Investigation Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SIDE-BY-SIDE CORRIDOR COMPARISON & ROUTE VERIFICATION DIAGRAM */}
      <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              POTENTIALLY RELATED VEHICLE GROUPING & EXCLUSION ANALYSIS (EAST LINK CORRIDOR)
            </h2>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded">
            No Invented Movement Between Disconnected Sightings
          </span>
        </div>

        {/* Interactive Corridor Schematic SVG */}
        <div className="bg-[#090D16] border border-[#22314E] rounded-xl p-4">
          <svg className="w-full h-44" viewBox="0 0 900 175">
            {/* Background Grid */}
            <line x1="40" y1="80" x2="860" y2="80" stroke="#1E293B" strokeWidth="8" />
            {/* Southbound branch at Sony World Signal (Indiranagar–Koramangala) */}
            <path d="M 410 80 L 490 155 L 700 155" fill="none" stroke="#1E293B" strokeWidth="6" />

            {/* Documented Segment 1: Enclave Library (CAM-001) to Sony World Signal (Indiranagar–Koramangala) (CAM-014) */}
            <line
              x1="90"
              y1="80"
              x2="410"
              y2="80"
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Unverified 1.1km Intermediate Segment between CAM-014 (19:02) and CAM-019 (19:18) */}
            <line
              x1="410"
              y1="80"
              x2="780"
              y2="80"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            <rect x="495" y="42" width="215" height="24" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
            <text x="602" y="58" textAnchor="middle" fill="#FDE68A" fontSize="10" fontFamily="monospace">
              ? 16-Min Interval (1.1 km) — Unverified Route
            </text>

            {/* Verified Southbound Exclusion Route for VEH-003 */}
            <path
              d="M 410 80 L 490 155 L 650 155"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
            />

            {/* Node 1: Kaveri Library / Enclave */}
            <circle cx="90" cy="80" r="9" fill="#EF4444" />
            <text x="90" y="60" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="bold">
              CAM-001 (18:22 / 18:30)
            </text>
            <text x="90" y="102" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
              VEH-008 & VEH-007
            </text>

            {/* Node 2: CAM-014 (Sony World Junction (Koramangala–Indiranagar Link)) */}
            <circle
              cx="410"
              cy="80"
              r="12"
              fill={selectedVehicle.id === 'VEH-001' ? '#0EA5E9' : '#F59E0B'}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text x="410" y="32" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="bold">
              CAM-014 (19:02 IST) — EVD-006
            </text>
            <text x="410" y="48" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="monospace">
              VEH-001: White SUV (KA-01-MX-4??)
            </text>

            {/* Node 3: CAM-019 (Domlur–Marathahalli Flyover Ramp (Old Airport Road)) */}
            <circle
              cx="780"
              cy="80"
              r="12"
              fill={selectedVehicle.id === 'VEH-002' ? '#0EA5E9' : '#F59E0B'}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <text x="780" y="32" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="bold">
              CAM-019 (19:18 IST) — EVD-007
            </text>
            <text x="780" y="48" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="monospace">
              VEH-002: Similar White SUV (Glare)
            </text>

            {/* Node 4: CAM-015 (Southbound Exclusion) */}
            <circle cx="650" cy="155" r="9" fill="#10B981" />
            <text x="650" y="140" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontWeight="bold">
              CAM-015 (19:08 Southbound) — EVD-009
            </text>
            <text x="650" y="170" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
              VEH-003 (KA-01-MX-4812) Excluded
            </text>
          </svg>
        </div>

        {/* 3-Card Comparison Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div
            onClick={() => setSelectedVehicleId('VEH-001')}
            className="p-3.5 rounded-xl bg-[#090D16] border border-amber-500/40 cursor-pointer hover:border-amber-400 transition"
          >
            <div className="flex items-center justify-between font-mono mb-1">
              <span className="font-bold text-amber-300">VEH-001 • CAM-014 (19:02)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                {veh1.verificationStatus}
              </span>
            </div>
            <div className="font-semibold text-white">White Compact SUV • Reg: {veh1.syntheticRegObservation}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Observed moving east at Sony World Junction (Koramangala–Indiranagar Link). Roof rails and dark rear quarter glass documented in EVD-006.
            </p>
          </div>

          <div
            onClick={() => setSelectedVehicleId('VEH-002')}
            className="p-3.5 rounded-xl bg-[#090D16] border border-amber-500/40 cursor-pointer hover:border-amber-400 transition"
          >
            <div className="flex items-center justify-between font-mono mb-1">
              <span className="font-bold text-amber-300">VEH-002 • CAM-019 (19:18)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                {veh2.verificationStatus}
              </span>
            </div>
            <div className="font-semibold text-white">Visually Similar White SUV • Reg: Obscured</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Observed 16 minutes later on Domlur–Marathahalli Flyover (Old Airport Road) ramp (EVD-007). Matches silhouette of VEH-001; requires intermediate camera verification (CAM-016/017).
            </p>
          </div>

          <div
            onClick={() => setSelectedVehicleId('VEH-003')}
            className="p-3.5 rounded-xl bg-[#090D16] border border-emerald-500/40 cursor-pointer hover:border-emerald-400 transition"
          >
            <div className="flex items-center justify-between font-mono mb-1">
              <span className="font-bold text-emerald-300">VEH-003 • CAM-014 & CAM-015</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                {veh3.verificationStatus}
              </span>
            </div>
            <div className="font-semibold text-white">White Fleet SUV • Reg: KA-01-MX-4812</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Verified turning south at 19:04 and confirmed on CAM-015 at 19:08 (EVD-009). Proven NOT the same vehicle as the 19:18 East Flyover sighting.
            </p>
          </div>
        </div>
      </div>

      {/* ALL 8 VEHICLES TABLE + SELECTED VEHICLE VERIFICATION WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: All 8 Vehicles */}
        <div className="lg:col-span-7 bg-[#141D2F] border border-[#22314E] rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Case Vehicle Registry (VEH-001 through VEH-008)
          </h3>

          <div className="space-y-2.5">
            {vehicles.map((veh) => {
              const isSelected = veh.id === selectedVehicle.id;
              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedVehicleId(veh.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#192841] border-sky-400 shadow-lg'
                      : 'bg-[#090D16] border-[#22314E] hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-300">{veh.id}</span>
                      <span className="text-xs font-bold text-white">{veh.vehicleType}</span>
                      <span className="text-[11px] text-slate-400">({veh.color})</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        veh.verificationStatus === 'Possibly related vehicle'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : veh.verificationStatus === 'Confirmed same vehicle'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : veh.verificationStatus === 'Not the same vehicle'
                          ? 'bg-slate-800 text-slate-300 border border-slate-700'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {veh.verificationStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 mt-1">
                    <span className="font-mono text-teal-300">
                      Reg Obs: {veh.syntheticRegObservation}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Cameras: {veh.sightings.map((s) => `${s.cameraId} (${s.timestamp})`).join(' → ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Vehicle Verification & Sightings Panel */}
        <div className="lg:col-span-5 bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 space-y-4 h-fit">
          <div className="border-b border-slate-800 pb-3">
            <div className="text-[10px] font-mono text-sky-400 uppercase">
              VEHICLE EVIDENCE & MANUAL VERIFICATION PANEL
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{selectedVehicle.label}</h3>
            <div className="text-xs font-mono text-teal-300 mt-1">
              Synthetic Registration Observation: {selectedVehicle.syntheticRegObservation}
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                Comparison Summary
              </div>
              <p className="text-slate-200 leading-relaxed">{selectedVehicle.summaryNotes}</p>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30">
              <div className="text-[10px] font-mono text-amber-400 uppercase mb-1">
                Analytical Limitations
              </div>
              <p className="text-slate-200 leading-relaxed">{selectedVehicle.limitations}</p>
            </div>
          </div>

          {/* Documented Camera Sightings */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase font-mono">
              Documented Sightings ({selectedVehicle.sightings.length})
            </div>
            {selectedVehicle.sightings.map((sgt) => (
              <div
                key={sgt.sightingId}
                className="p-3 rounded-lg bg-[#090D16] border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-sky-300 font-bold">
                    {sgt.timestamp} IST • {sgt.cameraId} ({sgt.cameraName})
                  </span>
                  <span className="text-emerald-300">{sgt.evidenceRef}</span>
                </div>
                <div className="text-slate-200 font-medium">Direction: {sgt.direction}</div>
                <div className="text-[11px] text-slate-400">{sgt.visualMatchNote}</div>
                <button
                  onClick={() => {
                    setSelectedCameraId(sgt.cameraId);
                    setActiveModule('cctv-intelligence');
                  }}
                  className="text-[11px] text-sky-400 hover:underline pt-1 inline-block"
                >
                  Inspect {sgt.cameraId} Video Segment →
                </button>
              </div>
            ))}
          </div>

          {/* Investigator Classification Controls */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs">
            <div className="font-bold text-white uppercase font-mono">
              Investigator Comparison Classification
            </div>
            <input
              type="text"
              value={comparisonNote}
              onChange={(e) => setComparisonNote(e.target.value)}
              placeholder="Optional investigator note before updating classification..."
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-1.5 text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              {VERIFICATION_OPTIONS.map((opt) => {
                const isCurrent = selectedVehicle.verificationStatus === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      updateVehicleVerification(selectedVehicle.id, opt, comparisonNote);
                      setComparisonNote('');
                    }}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition ${
                      isCurrent
                        ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
                        : 'bg-[#090D16] hover:bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


