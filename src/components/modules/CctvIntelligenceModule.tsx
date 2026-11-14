"use client";

import React, { useState, useEffect } from 'react';
import {
  Cctv,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ShieldCheck,
  AlertTriangle,
  Plus,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Link2,
  ArrowRight,
  FileLock2,
  Clock,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';

export const CctvIntelligenceModule: React.FC = () => {
  const {
    cameras,
    selectedCameraId,
    setSelectedCameraId,
    vehicles,
    addVideoObservation,
    updateVideoObservationStatus,
    setActiveModule,
  } = useSentinel();

  // Focus on cameras with received footage first, while allowing any camera to be selected
  const reviewableCameras = cameras.filter((c) =>
    ['CAM-014', 'CAM-019', 'CAM-006', 'CAM-001', 'CAM-003', 'CAM-015', 'CAM-008'].includes(c.id)
  );

  const activeCam =
    cameras.find((c) => c.id === selectedCameraId) ||
    cameras.find((c) => c.id === 'CAM-014') ||
    cameras[0];

  // Synthetic Video Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackProgress, setPlaybackProgress] = useState<number>(42); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // New Observation Form State
  const [newObsTime, setNewObsTime] = useState<string>('19:03');
  const [newObsDesc, setNewObsDesc] = useState<string>(
    'Eastbound white SUV-like vehicle passes secondary lane marker; rear quarter window tint noted.'
  );
  const [newObsType, setNewObsType] = useState<'Vehicle' | 'Pedestrian Activity' | 'Lighting / Obstruction' | 'No Relevant Activity'>('Vehicle');
  const [newObsVehicleId, setNewObsVehicleId] = useState<string>('VEH-001');
  const [newObsNotes, setNewObsNotes] = useState<string>('Requires manual comparison with CAM-019.');

  // Advance synthetic video scrubber
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 1.2 * playbackSpeed));
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Format synthetic timestamp overlay based on camera
  const getSimulatedTimestamp = () => {
    const baseHour =
      activeCam.id === 'CAM-001' || activeCam.id === 'CAM-003' || activeCam.id === 'CAM-008'
        ? '18'
        : '19';
    const baseMin =
      activeCam.id === 'CAM-014'
        ? '02'
        : activeCam.id === 'CAM-019'
        ? '18'
        : activeCam.id === 'CAM-008'
        ? '44'
        : activeCam.id === 'CAM-006'
        ? '25'
        : activeCam.id === 'CAM-001'
        ? '30'
        : '36';
    const sec = String(Math.floor((playbackProgress / 100) * 59)).padStart(2, '0');
    return `2026-11-02 ${baseHour}:${baseMin}:${sec} IST`;
  };

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObsDesc.trim()) return;
    addVideoObservation({
      cameraId: activeCam.id,
      timestamp: newObsTime,
      videoTimecode: `00:${Math.floor(playbackProgress / 2)
        .toString()
        .padStart(2, '0')}:14`,
      description: newObsDesc,
      objectType: newObsType,
      linkedVehicleId: newObsVehicleId || undefined,
      reviewClassification: 'Relevant — Requires Verification',
      reviewer: 'Inspector Vikram Rao',
      evidenceRef: activeCam.evidenceRef || 'EVD-006',
      notes: newObsNotes,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <Cctv className="w-4 h-4" />
            <span>Stage 5 Capability • CCTV Footage Review, Integrity & Observation Extraction</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Video Evidence Inspection Workspace (Synthetic Illustrative Feeds)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Once footage is obtained through authorised channels, the platform helps investigators review, document and connect relevant observations while preserving the original footage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            POTENTIALLY RELATED VEHICLE OBSERVATIONS — MANUAL VERIFICATION REQUIRED.
          </span>
          <button
            onClick={() => setActiveModule('vehicle-intelligence')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition"
          >
            <span>Proceed to Stage 6: Vehicle Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 8-STEP WORKFLOW BAR */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-3.5">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-[11px]">
          {[
            '1. Request Received',
            '2. Original Preserved',
            '3. SHA-256 Calculated',
            '4. Metadata Inspected',
            '5. Segments Identified',
            '6. Footage Reviewed',
            '7. Observations Logged',
            '8. Added to Timeline',
          ].map((step) => (
            <div
              key={step}
              className="px-2.5 py-1.5 rounded bg-[#090D16] border border-emerald-500/30 text-emerald-300 font-mono flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MULTI-CAMERA SELECTOR TABS */}
      <div className="flex flex-wrap items-center gap-2">
        {reviewableCameras.map((cam) => {
          const isSelected = cam.id === activeCam.id;
          return (
            <button
              key={cam.id}
              onClick={() => setSelectedCameraId(cam.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition flex items-center gap-2 ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg'
                  : 'bg-[#141D2F] border-[#22314E] text-slate-300 hover:border-slate-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  cam.footageStatus === 'Footage received' ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span className="font-mono font-bold">{cam.id}</span>
              <span className="hidden sm:inline text-slate-400 truncate max-w-[140px]">
                {cam.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* MAIN WORKSPACE: SYNTHETIC VIDEO PLAYER + OBSERVATION EXTRACTION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Synthetic Illustrative Video Player & Metadata */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl overflow-hidden shadow-2xl">
            {/* Top Camera HUD Bar */}
            <div className="bg-[#090D16] px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  SYNTHETIC ILLUSTRATIVE FEED
                </span>
                <span className="text-sky-300 font-bold">{activeCam.id}</span>
                <span className="text-slate-300">{activeCam.name}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Ref: {activeCam.evidenceRef || 'N/A'}</span>
                <span className="text-emerald-400">{getSimulatedTimestamp()}</span>
              </div>
            </div>

            {/* Synthetic Illustrative Video Canvas Area — Animated for Every Camera (Including BMTC Bus 335E Dashcam for CAM-008) */}
            <div className="relative h-80 bg-[#050911] overflow-hidden flex items-center justify-center select-none">
              <svg className="w-full h-full" viewBox="0 0 700 320" preserveAspectRatio="none">
                {/* Night sky / street background */}
                <rect width="700" height="320" fill="#070D19" />
                {/* Perspective road lanes */}
                <polygon points="0,300 700,300 520,110 180,110" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
                <line
                  x1="350"
                  y1="110"
                  x2="350"
                  y2="300"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="14 10"
                  opacity="0.4"
                />
                {/* Grid overlay */}
                <line x1="0" y1="160" x2="700" y2="160" stroke="#0EA5E9" strokeWidth="0.5" opacity="0.2" />
                <line x1="350" y1="0" x2="350" y2="320" stroke="#0EA5E9" strokeWidth="0.5" opacity="0.2" />

                {/* CAM-014 (Sony World Junction) & CAM-019 (Domlur–Marathahalli Flyover Ramp) */}
                {(activeCam.id === 'CAM-014' || activeCam.id === 'CAM-019') && (
                  <g
                    transform={`translate(${110 + playbackProgress * 4.2}, ${
                      activeCam.id === 'CAM-014' ? 185 : 170
                    })`}
                  >
                    <rect
                      x="-12"
                      y="-24"
                      width="155"
                      height="74"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                    />
                    <text x="-10" y="-29" fill="#FDE68A" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      {activeCam.id === 'CAM-014'
                        ? 'OBJ: WHITE CRETA SUV (19:02) | KA-01-MX-4XX? | TPMS-HEX-88A4'
                        : 'OBJ: WHITE CRETA SUV (19:18 RAMP) | GHOST-FASTAG + TPMS-88A4'}
                    </text>
                    {/* White SUV Silhouette */}
                    <rect x="0" y="0" width="115" height="34" rx="6" fill="#F8FAFC" />
                    <polygon points="15,0 32,-12 90,-12 104,0" fill="#E2E8F0" />
                    {/* Roof rail crossbars */}
                    <line x1="36" y1="-14" x2="86" y2="-14" stroke="#0F172A" strokeWidth="2.5" />
                    <rect x="28" y="-9" width="24" height="9" fill="#1E293B" />
                    <rect x="56" y="-9" width="28" height="9" fill="#0F172A" />
                    <circle cx="24" cy="34" r="9" fill="#334155" stroke="#38BDF8" strokeWidth="2" />
                    <circle cx="88" cy="34" r="9" fill="#334155" stroke="#38BDF8" strokeWidth="2" />
                    <polygon
                      points="115,8 180,-5 180,38 115,24"
                      fill="#FEF08A"
                      opacity={activeCam.id === 'CAM-019' ? '0.5' : '0.3'}
                    />
                  </g>
                )}

                {/* CAM-008: BMTC Route-335E Electric Bus ADAS Side-Camera Sovereign Trap Feed */}
                {activeCam.id === 'CAM-008' && (
                  <g>
                    {/* Side-lane lay-by curb */}
                    <rect x="240" y="135" width="260" height="80" rx="8" fill="#111C2D" stroke="#10B981" strokeWidth="1.5" strokeDasharray="5 3" />
                    <text x="250" y="128" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      🪤 SOVEREIGN TRAP: BMTC BUS #KA-01-F-8XX1 (ROUTE 335E) ADAS DASHCAM @ 18:44:50
                    </text>
                    <g transform={`translate(${265 + (playbackProgress % 40) * 0.4}, 162)`}>
                      <rect x="-8" y="-16" width="135" height="62" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" />
                      <text x="-6" y="-20" fill="#FCA5A5" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                        WHITE SUV IDLING IN CAM-008 BLIND SPOT | KA-01-MX-4XX1
                      </text>
                      <rect x="0" y="0" width="112" height="32" rx="6" fill="#F8FAFC" />
                      <polygon points="14,0 30,-11 86,-11 100,0" fill="#E2E8F0" />
                      <circle cx="24" cy="32" r="8" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
                      <circle cx="86" cy="32" r="8" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
                    </g>
                  </g>
                )}

                {/* CAM-006: Exculpatory Feed — Naveen Kumar's Airport Cab Turning South to Hosur Road */}
                {activeCam.id === 'CAM-006' && (
                  <g transform={`translate(${480 - playbackProgress * 3.1}, 190)`}>
                    <rect x="-10" y="-18" width="138" height="64" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="-8" y="-23" fill="#6EE7B7" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      CLEARED: NAVEEN KUMAR AIRPORT CAB (KA-04-AB-8XX4) → HOSUR RD
                    </text>
                    <rect x="0" y="0" width="108" height="30" rx="5" fill="#E2E8F0" />
                    <rect x="38" y="-8" width="26" height="8" rx="2" fill="#F59E0B" />
                    <circle cx="22" cy="30" r="8" fill="#334155" stroke="#10B981" strokeWidth="2" />
                    <circle cx="84" cy="30" r="8" fill="#334155" stroke="#10B981" strokeWidth="2" />
                  </g>
                )}

                {/* CAM-001, CAM-003 & All Other Corridor Cameras */}
                {!['CAM-014', 'CAM-019', 'CAM-008', 'CAM-006'].includes(activeCam.id) && (
                  <g transform={`translate(${150 + playbackProgress * 3.4}, 188)`}>
                    <rect
                      x="-10"
                      y="-25"
                      width="68"
                      height="76"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <text x="-10" y="-30" fill="#6EE7B7" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      {activeCam.id === 'CAM-001'
                        ? 'AARAV SHARMA DEPARTING INDIRANAGAR LIBRARY (18:30)'
                        : activeCam.id === 'CAM-003'
                        ? 'APOLLO PHARMACY 100FT RD — PEDESTRIAN & PARKED SEDAN (18:36)'
                        : `${activeCam.id} CORRIDOR FEED — ACTIVE PLAYBACK`}
                    </text>
                    <circle cx="18" cy="-8" r="7" fill="#38BDF8" />
                    <rect x="10" y="0" width="16" height="28" rx="4" fill="#0284C7" />
                  </g>
                )}
              </svg>

              {/* Top-Left HUD Overlay */}
              <div className="absolute top-3 left-3 bg-[#090D16]/85 border border-slate-700 rounded px-2.5 py-1.5 text-[10px] font-mono text-slate-300 space-y-0.5">
                <div>
                  CAM ID: {activeCam.id} (
                  {activeCam.id === 'CAM-008'
                    ? 'Fixed Pole Offline → Recovered via BMTC Bus #335E ADAS Dashcam'
                    : activeCam.cameraType}
                  )
                </div>
                <div>DIR: {activeCam.directionLabel} | FOV: {activeCam.fovDeg}°</div>
                <div className="text-teal-400">BIOMETRICS / FACIAL REC: DISABLED BY POLICY</div>
              </div>

              {/* Bottom-Right Integrity Stamp */}
              <div className="absolute bottom-3 right-3 bg-[#090D16]/85 border border-emerald-500/40 rounded px-2.5 py-1 text-[10px] font-mono text-emerald-300">
                WORKING COPY PROXY • ORIGINAL SHA-256 SEALED
              </div>
            </div>

            {/* Video Playback Controls */}
            <div className="bg-[#0F1624] p-3 border-t border-slate-800 space-y-2">
              <input
                type="range"
                aria-label="Video Scrubber"
                min={0}
                max={100}
                value={playbackProgress}
                onChange={(e) => setPlaybackProgress(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPlaybackProgress((p) => Math.max(0, p - 10))}
                    className="p-1.5 rounded bg-[#090D16] hover:bg-slate-800 text-slate-300"
                    title="Step Back"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={() => setPlaybackProgress((p) => Math.min(100, p + 10))}
                    className="p-1.5 rounded bg-[#090D16] hover:bg-slate-800 text-slate-300"
                    title="Step Forward"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Jump Sample Segments */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-mono">Key Segments:</span>
                  <button
                    onClick={() => {
                      setSelectedCameraId('CAM-014');
                      setPlaybackProgress(35);
                    }}
                    className="px-2 py-1 rounded bg-[#090D16] border border-slate-700 hover:border-sky-400 text-[11px] font-mono text-sky-300"
                  >
                    CAM-014 (19:02)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCameraId('CAM-019');
                      setPlaybackProgress(45);
                    }}
                    className="px-2 py-1 rounded bg-[#090D16] border border-slate-700 hover:border-sky-400 text-[11px] font-mono text-amber-300"
                  >
                    CAM-019 (19:18)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCameraId('CAM-006');
                      setPlaybackProgress(50);
                    }}
                    className="px-2 py-1 rounded bg-[#090D16] border border-slate-700 hover:border-sky-400 text-[11px] font-mono text-slate-300"
                  >
                    CAM-006 (19:25)
                  </button>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  {[0.5, 1, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded ${
                        playbackSpeed === spd ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-[#090D16] text-slate-400'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Container Integrity & Metadata Inspection Card */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase font-mono flex items-center gap-1.5">
                <FileLock2 className="w-4 h-4 text-emerald-400" />
                Original Container Integrity & Metadata ({activeCam.evidenceRef || 'Unassigned'})
              </span>
              <span className="text-[11px] font-mono text-emerald-400">SHA-256 Verified</span>
            </div>
            <div className="p-2 rounded bg-[#090D16] border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
              SHA-256: {activeCam.sha256 || 'Pending Custodian Container Transfer'}
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-400 block">Original Preservation:</span>
                <span className="text-emerald-300 font-mono">Immutable Vault Copy</span>
              </div>
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-400 block">Stream / NVR Offset:</span>
                <span className="text-white font-mono">H.264 • +0.0s NTP Sync</span>
              </div>
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-400 block">Review Status:</span>
                <span className="text-sky-300 font-semibold">{activeCam.videoReviewStatus || 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Observation Extraction Panel & Sample Observations */}
        <div className="lg:col-span-5 space-y-4">
          {/* Extracted Observations List across CAM-014, CAM-019, CAM-006, etc. */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 space-y-3">
            <div className="border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Documented Video Observations ({activeCam.id} & Key Corridor Cameras)
              </h3>
              <p className="text-[11px] text-slate-400">
                Never claim visually similar vehicles are necessarily the same vehicle. Mark each observation after manual review.
              </p>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {cameras
                .flatMap((c) => c.extractedObservations)
                .map((obs) => (
                  <div
                    key={obs.id}
                    className={`p-3 rounded-xl border space-y-2 text-xs ${
                      obs.cameraId === activeCam.id
                        ? 'bg-sky-950/40 border-sky-400/70'
                        : 'bg-[#090D16] border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                          {obs.cameraId}
                        </span>
                        <span className="text-white font-bold">{obs.timestamp} IST</span>
                        <span className="text-slate-400 text-[10px]">({obs.evidenceRef})</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          obs.reviewClassification === 'Relevant — Requires Verification'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : obs.reviewClassification === 'Inconclusive'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {obs.reviewClassification}
                      </span>
                    </div>

                    <p className="text-slate-100 font-medium leading-relaxed">{obs.description}</p>
                    <p className="text-[11px] text-slate-400">{obs.notes}</p>

                    {/* Investigator Action Controls for each Observation */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateVideoObservationStatus(
                              obs.cameraId,
                              obs.id,
                              'Relevant — Requires Verification'
                            )
                          }
                          className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold"
                        >
                          Mark Relevant
                        </button>
                        <button
                          onClick={() =>
                            updateVideoObservationStatus(obs.cameraId, obs.id, 'Inconclusive')
                          }
                          className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-semibold"
                        >
                          Inconclusive
                        </button>
                        <button
                          onClick={() =>
                            updateVideoObservationStatus(
                              obs.cameraId,
                              obs.id,
                              'Not Relevant / Rejected'
                            )
                          }
                          className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[10px] font-semibold"
                        >
                          Reject
                        </button>
                      </div>

                      {obs.linkedVehicleId && (
                        <span className="text-[10px] font-mono text-teal-300 flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          Linked: {obs.linkedVehicleId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Add New Video Observation & Sync to Timeline Form */}
          <form
            onSubmit={handleAddObservation}
            className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-4 space-y-3 text-xs"
          >
            <div className="font-bold text-white uppercase font-mono flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Extract New Observation from {activeCam.id} to Timeline</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-0.5">TIMESTAMP (IST)</label>
                <input
                  type="text"
                  required
                  value={newObsTime}
                  onChange={(e) => setNewObsTime(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-0.5">OBJECT CLASS</label>
                <select
                  aria-label="Select Object Type"
                  value={newObsType}
                  onChange={(e) => setNewObsType(e.target.value as typeof newObsType)}
                  className="w-full bg-[#090D16] border border-slate-700 rounded px-2 py-1.5 text-white"
                >
                  <option value="Vehicle">Vehicle</option>
                  <option value="Pedestrian Activity">Pedestrian Activity</option>
                  <option value="Lighting / Obstruction">Lighting / Obstruction</option>
                  <option value="No Relevant Activity">No Relevant Activity</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-0.5">LINK VEHICLE REF</label>
                <select
                  aria-label="Link Vehicle Reference"
                  value={newObsVehicleId}
                  onChange={(e) => setNewObsVehicleId(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 rounded px-2 py-1.5 text-sky-300 font-mono"
                >
                  <option value="">None</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-0.5">OBSERVATION DESCRIPTION</label>
              <input
                type="text"
                required
                value={newObsDesc}
                onChange={(e) => setNewObsDesc(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-0.5">REVIEWER NOTES & LIMITATIONS</label>
              <input
                type="text"
                value={newObsNotes}
                onChange={(e) => setNewObsNotes(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-700 rounded px-2.5 py-1.5 text-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Record Observation & Add to Investigation Timeline</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


