"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Smartphone,
  Cctv,
  Car,
  FileText,
  MapPin,
  UploadCloud,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';

interface IngestionStream {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  received: number;
  validated: number;
  reviewRequired: number;
  rejected: number;
  sourceInfo: string;
  timestamp: string;
  provenance: string;
  authRef: string;
  sampleNote: string;
}

const INGESTION_STREAMS: IngestionStream[] = [
  {
    id: 'STR-MOBILE',
    name: 'Mobile / Telecom Records',
    icon: Smartphone,
    received: 34,
    validated: 30,
    reviewRequired: 3,
    rejected: 1,
    sourceInfo: 'Synthetic Telecom Nodal Gateway (Batch-A & Corridor Tower Dump)',
    timestamp: '02 Nov 2026, 21:35 IST',
    provenance: 'EVD-002 & EVD-003 (CSV SHA-256 Sealed)',
    authRef: 'AUTH-BLR-SYN-2026-8841',
    sampleNote: '30 devices normalised (DEV-001 to DEV-030); 1 malformed test row rejected.',
  },
  {
    id: 'STR-CCTV',
    name: 'CCTV Footage Containers',
    icon: Cctv,
    received: 5,
    validated: 5,
    reviewRequired: 2,
    rejected: 0,
    sourceInfo: 'SafeCity Grid, Kaveri Trust, Apex Retail & Highway Concessionaire',
    timestamp: '02 Nov 2026, 22:00–22:14 IST',
    provenance: 'EVD-004, EVD-005, EVD-006, EVD-007, EVD-008',
    authRef: 'AUTH-BLR-SYN-2026-8841',
    sampleNote: 'CAM-014 and CAM-019 flagged for manual vehicle review.',
  },
  {
    id: 'STR-VEHICLE',
    name: 'Vehicle & ANPR Observations',
    icon: Car,
    received: 12,
    validated: 9,
    reviewRequired: 2,
    rejected: 1,
    sourceInfo: 'Municipal ANPR Lane Readers & RWA Gate Pass Logs',
    timestamp: '02 Nov 2026, 22:12 IST',
    provenance: 'EVD-006, EVD-009, EVD-011',
    authRef: 'AUTH-BLR-SYN-2026-8841',
    sampleNote: '8 distinct vehicles indexed (VEH-001 to VEH-008); 1 duplicate OCR read rejected.',
  },
  {
    id: 'STR-WITNESS',
    name: 'Witness Statements',
    icon: FileText,
    received: 2,
    validated: 0,
    reviewRequired: 2,
    rejected: 0,
    sourceInfo: 'Field Canvass Team-01 (12th Main Service Lane (Indiranagar) Interviews W-01 & W-02)',
    timestamp: '02 Nov 2026, 22:01 IST',
    provenance: 'EVD-010 (Signed Transcript PDF)',
    authRef: 'AUTH-BLR-SYN-2026-8841',
    sampleNote: 'Requires clarification on vehicle colour discrepancy under dusk lighting.',
  },
  {
    id: 'STR-LOCATION',
    name: 'Location & Cell-Sector Footprints',
    icon: MapPin,
    received: 18,
    validated: 16,
    reviewRequired: 2,
    rejected: 0,
    sourceInfo: 'GIS Cell-Sector Azimuth Registry & Enclave RFID Gate Logs',
    timestamp: '02 Nov 2026, 21:45 IST',
    provenance: 'EVD-003 & EVD-011 Spatial Layer',
    authRef: 'AUTH-BLR-SYN-2026-8841',
    sampleNote: 'Includes exculpatory West Domlur gate entry for DEV-007 at 18:55.',
  },
  {
    id: 'STR-DOCS',
    name: 'Uploaded Case Documents',
    icon: UploadCloud,
    received: 4,
    validated: 4,
    reviewRequired: 0,
    rejected: 0,
    sourceInfo: 'East Metro Station Desk & Library Sign-out Register',
    timestamp: '02 Nov 2026, 21:20 IST',
    provenance: 'EVD-001 (FIR-SYN-2026-0042)',
    authRef: 'AUTH-BLR-SYN-2026-8841',
    sampleNote: 'Establishes baseline 18:30 departure and 21:15 complaint registration.',
  },
  {
    id: 'STR-GOV',
    name: 'Other Approved Records (Maintenance & Fleet)',
    icon: Database,
    received: 5,
    validated: 4,
    reviewRequired: 1,
    rejected: 0,
    sourceInfo: 'Smart Pole 08 UPS Work Order & Commercial Fleet Dispatch Log',
    timestamp: '02 Nov 2026, 22:14 IST',
    provenance: 'Civic Grid Custodian Manifest #08-M',
    authRef: 'AUTH-BLR-SYN-2026-8841',
    sampleNote: 'Confirms CAM-008 power maintenance window (18:15–19:30) was pre-scheduled.',
  },
];

export const WorkspaceModule: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    timelineEvents,
    setActiveModule,
    isGuidedActive,
    guidedStageIndex,
  } = useSentinel();

  const [activeStreamId, setActiveStreamId] = useState<string>('STR-MOBILE');
  const [ingestionProgress, setIngestionProgress] = useState<number>(100);
  const [isRunningIngestion, setIsRunningIngestion] = useState<boolean>(false);

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const selectedStream = INGESTION_STREAMS.find((s) => s.id === activeStreamId) || INGESTION_STREAMS[0];

  const totalReceived = INGESTION_STREAMS.reduce((acc, s) => acc + s.received, 0);
  const totalValidated = INGESTION_STREAMS.reduce((acc, s) => acc + s.validated, 0);
  const totalReview = INGESTION_STREAMS.reduce((acc, s) => acc + s.reviewRequired, 0);
  const totalRejected = INGESTION_STREAMS.reduce((acc, s) => acc + s.rejected, 0);

  useEffect(() => {
    if (isGuidedActive && guidedStageIndex === 1) {
      replayIngestionAnimation();
    }
  }, [isGuidedActive, guidedStageIndex]);

  const replayIngestionAnimation = () => {
    setIsRunningIngestion(true);
    setIngestionProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 10;
      if (step >= 100) {
        setIngestionProgress(100);
        setIsRunningIngestion(false);
        clearInterval(interval);
      } else {
        setIngestionProgress(step);
      }
    }, 280);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <Layers className="w-4 h-4" />
            <span>Stage 2 Capability • Investigation Workspace & Multi-Source Evidence Ingestion</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            {currentCase.id} — Multi-Source Evidence Ingestion Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evidence from different sources is organised into a common structure, helping investigators examine events together rather than independently.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={replayIngestionAnimation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 text-xs font-semibold transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Replay Stage 2 Ingestion Stream</span>
          </button>
          <button
            onClick={() => setActiveModule('mobile-intelligence')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition"
          >
            <span>Proceed to Stage 3: Mobile Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* INGESTION SUMMARY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Records Received</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{totalReceived}</div>
          <div className="text-[11px] text-sky-400 mt-1">Across 7 Authorised Data Streams</div>
        </div>
        <div className="bg-[#141D2F] border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Records Validated & Hashed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{totalValidated}</div>
          <div className="text-[11px] text-slate-400 mt-1">Normalised into Unified Timeline</div>
        </div>
        <div className="bg-[#141D2F] border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>Records Requiring Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{totalReview}</div>
          <div className="text-[11px] text-slate-400 mt-1">Flagged for Investigator Clarification</div>
        </div>
        <div className="bg-[#141D2F] border border-rose-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-rose-300">
            <span>Records Rejected (Schema/Dup)</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{totalRejected}</div>
          <div className="text-[11px] text-slate-400 mt-1">Quarantined in Ingestion Log</div>
        </div>
      </div>

      {/* ANIMATED 7-STREAM INGESTION ENGINE VISUALIZER */}
      <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              CENTRAL MULTI-SOURCE EVIDENCE INGESTION PIPELINE
            </h2>
            <p className="text-xs text-slate-400">
              Click any data stream below to inspect source provenance, authorisation reference, and validation metrics.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Pipeline Sync:</span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              {ingestionProgress}% Normalised
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left 5 Cols: 7 Source Streams */}
          <div className="lg:col-span-5 space-y-2">
            {INGESTION_STREAMS.map((stream) => {
              const Icon = stream.icon;
              const isSelected = stream.id === activeStreamId;
              return (
                <button
                  key={stream.id}
                  onClick={() => setActiveStreamId(stream.id)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-950/70 border-sky-400 text-white shadow-md'
                      : 'bg-[#090D16] border-[#22314E] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{stream.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {stream.provenance}
                      </div>
                    </div>
                  </div>

                  {/* Animated flow bar + badges */}
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {stream.validated} OK
                    </span>
                    {stream.reviewRequired > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {stream.reviewRequired} Rev
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center 2 Cols: Animated Flow Pipes into Central Engine */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3 relative">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-sky-400 to-teal-400"
              />
            </div>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-500/25 to-teal-500/25 border-2 border-sky-400 flex flex-col items-center justify-center text-center p-2 shadow-xl shadow-sky-500/10">
              <ShieldCheck className="w-7 h-7 text-sky-400 mb-1" />
              <span className="text-[10px] font-mono font-bold text-white leading-tight">
                SENTINEL INGESTION ENGINE
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-3 relative">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-teal-400 to-emerald-400"
              />
            </div>
          </div>

          {/* Right 5 Cols: Selected Stream Provenance & Normalised Timeline Output */}
          <div className="lg:col-span-5 bg-[#090D16] border border-[#22314E] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <div className="text-[10px] font-mono text-sky-400 uppercase">
                  INSPECTING SOURCE STREAM
                </div>
                <h3 className="text-sm font-bold text-white">{selectedStream.name}</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                {selectedStream.authRef}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="p-2 rounded bg-[#0F1624] border border-slate-800">
                <div className="text-[10px] text-slate-400">Received</div>
                <div className="text-sm font-bold text-white">{selectedStream.received}</div>
              </div>
              <div className="p-2 rounded bg-[#0F1624] border border-emerald-500/30">
                <div className="text-[10px] text-emerald-300">Validated</div>
                <div className="text-sm font-bold text-emerald-400">{selectedStream.validated}</div>
              </div>
              <div className="p-2 rounded bg-[#0F1624] border border-amber-500/30">
                <div className="text-[10px] text-amber-300">Review</div>
                <div className="text-sm font-bold text-amber-400">{selectedStream.reviewRequired}</div>
              </div>
              <div className="p-2 rounded bg-[#0F1624] border border-rose-500/30">
                <div className="text-[10px] text-rose-300">Rejected</div>
                <div className="text-sm font-bold text-rose-400">{selectedStream.rejected}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Source Origin:</span>
                <span className="text-slate-200 font-medium text-right">{selectedStream.sourceInfo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Ingestion Timestamp:</span>
                <span className="text-slate-200 font-mono">{selectedStream.timestamp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Vault Provenance:</span>
                <span className="text-sky-300 font-mono">{selectedStream.provenance}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/30 text-xs text-slate-200">
              <span className="font-semibold text-sky-300">Normalisation Note: </span>
              {selectedStream.sampleNote}
            </div>
          </div>
        </div>
      </div>

      {/* NORMALISED INVESTIGATION TIMELINE PREVIEW */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Normalised Common Investigation Timeline ({timelineEvents.length} Events)
            </h3>
            <p className="text-xs text-slate-400">
              All ingested records are converted to IST chronological order while preserving individual evidence references.
            </p>
          </div>
          <button
            onClick={() => setActiveModule('reports')}
            className="text-xs text-sky-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Open Full Timeline & Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {timelineEvents.slice(0, 9).map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded-lg bg-[#090D16] border border-[#22314E] flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-sky-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ev.timestamp} IST
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {ev.sourceType}
                  </span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">{ev.title}</div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{ev.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Ref: {ev.evidenceRef}</span>
                <span className="text-teal-400">{ev.authorisationRef}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


