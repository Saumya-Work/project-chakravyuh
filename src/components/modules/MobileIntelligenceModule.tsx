"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  ShieldAlert,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Info,
  Filter,
  ArrowRight,
  Sparkles,
  Link2,
} from 'lucide-react';
import { useChakravyuh } from '@/context/ChakravyuhContext';

export const MobileIntelligenceModule: React.FC = () => {
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    setActiveModule,
    setSelectedLeadId,
    triggerToast,
    logAudit,
  } = useChakravyuh();

  const [filterMode, setFilterMode] = useState<'PrioritySubset' | 'All30'>('PrioritySubset');
  const [highlightConnections, setHighlightConnections] = useState<boolean>(true);

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0];

  // Key subset for horizontal correlation timeline vs all devices
  const timelineDevices = devices.filter((d) =>
    ['DEV-001', 'DEV-004', 'DEV-019', 'DEV-007', 'DEV-012', 'DEV-002', 'DEV-003'].includes(d.id)
  );

  const displayedRegistryDevices =
    filterMode === 'PrioritySubset'
      ? devices.filter((d) => d.relevanceStatus !== 'Routine Background Traffic' || ['DEV-002', 'DEV-003', 'DEV-005'].includes(d.id))
      : devices;

  // Convert timeMinutes (1080 = 18:00, 1170 = 19:30) to percentage (0% to 100%)
  const getTimelineLeftPct = (timeMinutes: number) => {
    const min = 1085; // 18:05
    const max = 1165; // 19:25
    const clamped = Math.max(min, Math.min(max, timeMinutes));
    return ((clamped - min) / (max - min)) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <Smartphone className="w-4 h-4" />
            <span>Stage 3 Capability • Mobile Intelligence & Cell-Sector Correlation</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Authorised Cell-Sector Observation Analysis (DEV-001 to DEV-030)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            The system helps investigators identify patterns and associations in authorised records. These are investigative leads that require independent verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            POTENTIAL INVESTIGATIVE ASSOCIATIONS IDENTIFIED
          </span>
          <button
            onClick={() => setActiveModule('location-intelligence')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition"
          >
            <span>Proceed to Stage 4: CCTV Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MANDATORY INVESTIGATIVE LIMITATIONS & SAFEGUARDS BANNER */}
      <div className="bg-[#10192B] border border-amber-500/40 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300">Approximate Cell-Sector Footprints Only</div>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
              Cell-sector observations span 450m–800m radii and must never be represented as exact GPS coordinates. Co-location in a sector does not establish physical proximity, communication, or wrongdoing.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sky-300">Device ≠ Owner Identity</div>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
              A device is not the same as its registered owner. Shared fleet devices (e.g., DEV-012), reassigned SIMs, and family handsets must be verified independently.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-teal-300">Signal Loss & No Live Tracking</div>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
              A device becoming inactive (DEV-001 at 18:48) does not prove its owner disappeared at that moment (battery depletion is plausible). Arbitrary number lookup and live tracking are strictly disabled.
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE HORIZONTAL DEVICE OBSERVATION & CORRELATION TIMELINE */}
      <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              HORIZONTAL CELL-SECTOR CORRELATION TIMELINE (02 NOV 2026 • 18:05 TO 19:25 IST)
            </h2>
            <p className="text-xs text-slate-400">
              Shaded band highlights the Primary Incident & Corridor Window (18:25 – 19:20 IST). Click any device node to inspect provenance and limitations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighlightConnections((h) => !h)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
                highlightConnections
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-[#090D16] border-slate-700 text-slate-400'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{highlightConnections ? 'Hide Correlation Links' : 'Show Correlation Links'}</span>
            </button>
          </div>
        </div>

        {/* Time Axis Labels */}
        <div className="grid grid-cols-12 gap-2 mb-2 text-[11px] font-mono text-slate-400">
          <div className="col-span-3">DEVICE REFERENCE</div>
          <div className="col-span-9 flex justify-between px-2">
            <span>18:10</span>
            <span className="text-amber-300 font-bold">18:30 (Sighting)</span>
            <span className="text-rose-300 font-bold">18:48 (DEV-001 Loss)</span>
            <span className="text-sky-300">19:02 (Sony World Signal (Indiranagar–Koramangala))</span>
            <span>19:20 (Flyover)</span>
          </div>
        </div>

        {/* Horizontal Tracks */}
        <div className="space-y-2.5 relative">
          {timelineDevices.map((dev) => {
            const isSelected = dev.id === selectedDevice.id;
            return (
              <div
                key={dev.id}
                onClick={() => setSelectedDeviceId(dev.id)}
                className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-400'
                    : 'bg-[#090D16] border-[#22314E] hover:border-slate-600'
                }`}
              >
                {/* Device Label */}
                <div className="col-span-12 md:col-span-3 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{dev.id}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        dev.id === 'DEV-001'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : dev.id === 'DEV-004'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : dev.id === 'DEV-007'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {dev.relevanceStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{dev.label}</div>
                </div>

                {/* Timeline Bar */}
                <div className="col-span-12 md:col-span-9 h-12 bg-[#0F1624] rounded-lg border border-slate-800 relative overflow-hidden flex items-center">
                  {/* Highlighted Relevant Incident Window (18:25 to 19:20) */}
                  <div
                    className="absolute top-0 bottom-0 bg-sky-500/10 border-x border-sky-500/30"
                    style={{ left: '24%', width: '68%' }}
                  />

                  {/* Device Inactivity / Gap Indicator for DEV-001 after 18:48 */}
                  {dev.id === 'DEV-001' && (
                    <div
                      className="absolute top-2 bottom-2 bg-rose-950/50 border border-dashed border-rose-500/50 rounded flex items-center justify-center text-[10px] font-mono text-rose-300"
                      style={{ left: '55%', right: '3%' }}
                    >
                      No Network Registration After 18:48 (Battery / Power-off / RF Loss)
                    </div>
                  )}

                  {/* Observation Dots */}
                  {dev.observations.map((obs) => {
                    const leftPct = getTimelineLeftPct(obs.timeMinutes);
                    return (
                      <motion.div
                        key={obs.obsId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ left: `${leftPct}%` }}
                        className="absolute -translate-x-1/2 flex flex-col items-center group z-10"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 shadow ${
                            dev.id === 'DEV-001'
                              ? 'bg-rose-500 border-white'
                              : dev.id === 'DEV-004'
                              ? 'bg-amber-400 border-slate-950'
                              : dev.id === 'DEV-007'
                              ? 'bg-emerald-400 border-slate-950'
                              : 'bg-sky-400 border-slate-950'
                          }`}
                        />
                        <span className="text-[9px] font-mono text-slate-200 mt-0.5 bg-[#090D16]/90 px-1 rounded">
                          {obs.timestamp} ({obs.cellSectorId.replace('BLR-', '')})
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explainable Correlation Callouts */}
        {highlightConnections && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>1. Overlapping Sector Progression (DEV-004)</span>
                <span className="font-mono text-[10px]">LEAD-001</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                Why connected: DEV-004 registered in Sector 04A (18:28) and handed over to Sector 04B (18:44) within 2 minutes of DEV-001, then progressed east to Sony World Signal (Indiranagar–Koramangala) (19:03) and Flyover (19:19).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>2. Contradictory Observation (DEV-007)</span>
                <span className="font-mono text-[10px]">EXCULPATORY</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                Why excluded: Although DEV-007 overlapped Sector 04A at 18:32, it registered 2.8 km west in Sector WST-01A at 18:55 with a verified residential RFID gate entry.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
              <div className="font-bold text-sky-300 flex items-center justify-between">
                <span>3. Shared Fleet Handset (DEV-012)</span>
                <span className="font-mono text-[10px]">CONTEXTUAL</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                Why filtered: Co-location in Sector 04B (18:46) and 02A (19:05) corresponds to a shared FastDrop courier handset corroborated by scooter VEH-007 on CAM-001/003.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SPLIT: 30-DEVICE REGISTRY + SELECTED DEVICE EVIDENCE DETAIL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Device Registry Table */}
        <div className="lg:col-span-7 bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Synthetic Device Registry ({displayedRegistryDevices.length} of {devices.length} Shown)
              </h3>
              <p className="text-[11px] text-slate-400">
                Includes relevant associations, contradictory records, and routine background traffic to demonstrate intelligent filtering.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#090D16] p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setFilterMode('PrioritySubset')}
                className={`px-2.5 py-1 rounded transition ${
                  filterMode === 'PrioritySubset'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Key Subset (7)
              </button>
              <button
                onClick={() => setFilterMode('All30')}
                className={`px-2.5 py-1 rounded transition ${
                  filterMode === 'All30'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All 30 Devices
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[460px] space-y-2 pr-1">
            {displayedRegistryDevices.map((d) => {
              const isSelected = d.id === selectedDevice.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDeviceId(d.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#1A2942] border-sky-400'
                      : 'bg-[#090D16] border-[#22314E] hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-300">{d.id}</span>
                      <span className="text-xs font-semibold text-white truncate">{d.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      Sectors: {d.sectorIds.join(' → ')} • Window: {d.firstObserved}–{d.lastObserved} IST
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                      d.relevanceStatus === 'Co-located Observation'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : d.relevanceStatus === 'Inactive After Window'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : d.relevanceStatus === 'Contradictory / Alibi Supported'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {d.relevanceStatus}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Device Evidence Detail Panel */}
        <div className="lg:col-span-5 bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 space-y-4 h-fit">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-[10px] font-mono text-sky-400 uppercase">
                DEVICE EVIDENCE & LIMITATIONS DOSSIER
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedDevice.label}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedDevice.ownerNote}</p>
            </div>
            <span className="font-mono text-xs px-2 py-1 rounded bg-[#090D16] border border-slate-700 text-sky-300">
              {selectedDevice.imeiMask}
            </span>
          </div>

          {/* Confidence & Mandatory Limitations */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800">
              <div className="text-[10px] font-mono text-teal-400 uppercase font-semibold mb-1">
                Analytical Assessment
              </div>
              <p className="text-slate-200 leading-relaxed">{selectedDevice.confidenceNote}</p>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30">
              <div className="text-[10px] font-mono text-amber-400 uppercase font-semibold mb-1">
                Mandatory Investigative Limitations
              </div>
              <p className="text-slate-200 leading-relaxed">{selectedDevice.limitations}</p>
            </div>

            <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/30">
              <div className="text-[10px] font-mono text-sky-400 uppercase font-semibold mb-1">
                Plausible Alternative Explanation
              </div>
              <p className="text-slate-200 leading-relaxed">{selectedDevice.alternativeExplanation}</p>
            </div>
          </div>

          {/* Documented Cell-Sector Observations */}
          <div>
            <div className="text-xs font-bold text-white uppercase font-mono mb-2">
              Documented Cell-Sector Observations ({selectedDevice.observations.length})
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedDevice.observations.map((obs) => (
                <div
                  key={obs.obsId}
                  className="p-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-sky-300 font-bold">
                      {obs.timestamp} IST • {obs.cellSectorId}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      ~{obs.sectorRadiusMeters}m Radius
                    </span>
                  </div>
                  <div className="text-slate-200 font-medium">{obs.eventType}</div>
                  <div className="text-[11px] text-slate-400">{obs.notes}</div>
                  <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Source: {obs.sourceRecordRef}</span>
                    <span>Quality: {obs.signalQuality}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedLeadId('LEAD-001');
                setActiveModule('ai-engine');
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
            >
              Inspect Linked Lead (LEAD-001)
            </button>
            <button
              onClick={() => {
                logAudit(
                  'Mobile Intelligence',
                  'DEVICE_OBSERVATION_FLAGGED',
                  selectedDevice.id,
                  `Investigator logged manual verification check for ${selectedDevice.id}.`
                );
                triggerToast(
                  'Recorded for Verification',
                  `${selectedDevice.id} observation logged in case audit trail.`,
                  'success'
                );
              }}
              className="py-2 px-3 rounded-lg bg-[#090D16] hover:bg-slate-800 border border-[#22314E] text-slate-200 text-xs font-medium transition"
            >
              Log Verification Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


