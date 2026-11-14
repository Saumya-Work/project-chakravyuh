"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Search,
  Cctv,
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Square,
  Send,
  Layers,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';
import { CameraStatus } from '@/types/sentinel';

const TacticalLeafletMap = dynamic(
  () => import('@/components/map/TacticalLeafletMap').then((mod) => mod.TacticalLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[540px] rounded-xl bg-[#090D16] border border-[#22314E] flex items-center justify-center text-xs font-mono text-sky-400">
        Initialising Project Chakravyuh Spatial Intelligence Grid (Bengaluru Demo Sector)...
      </div>
    ),
  }
);

export const LocationIntelligenceModule: React.FC = () => {
  const {
    cameras,
    selectedCameraId,
    setSelectedCameraId,
    cctvRequests,
    generateCctvRequests,
    updateCctvRequestStatus,
    vehicles,
    devices,
    timelineEvents,
    setActiveModule,
  } = useSentinel();

  // Discovery Controls State
  const [viewMode, setViewMode] = useState<'All' | 'Relevant'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchRadiusMeters, setSearchRadiusMeters] = useState<number>(2800);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>(['CAM-002', 'CAM-007', 'CAM-009']);

  // Map Layer Controls
  const [showSearchBoundary, setShowSearchBoundary] = useState<boolean>(true);
  const [showCoverageCones, setShowCoverageCones] = useState<boolean>(true);
  const [showVehiclesLayer, setShowVehiclesLayer] = useState<boolean>(true);
  const [showCellSectorsLayer, setShowCellSectorsLayer] = useState<boolean>(true);

  // PLAY INVESTIGATION TIMELINE ON MAP State
  const [isTimelinePlaying, setIsTimelinePlaying] = useState<boolean>(false);
  const [activeTimelineMinute, setActiveTimelineMinute] = useState<number | null>(null);

  // Request Generation Form State
  const [reqDate, setReqDate] = useState('02 Nov 2026');
  const [reqTimeRange, setReqTimeRange] = useState('18:15 – 19:35 IST');
  const [reqPriority, setReqPriority] = useState<'Critical Preservation' | 'High' | 'Standard'>('Critical Preservation');

  // Timeline playback effect
  useEffect(() => {
    if (!isTimelinePlaying) return;
    const timer = setInterval(() => {
      setActiveTimelineMinute((prev) => {
        const cur = prev === null ? 1090 : prev;
        if (cur >= 1170) {
          setIsTimelinePlaying(false);
          return 1170;
        }
        return cur + 2;
      });
    }, 350);
    return () => clearInterval(timer);
  }, [isTimelinePlaying]);

  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      if (viewMode === 'Relevant' && !cam.isRelevantToCorridor) return false;
      if (statusFilter !== 'ALL' && cam.footageStatus !== statusFilter) return false;
      if (cam.distanceFromIncidentMeters > searchRadiusMeters) return false;
      if (
        searchQuery.trim() &&
        !cam.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !cam.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !cam.locationName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [cameras, viewMode, statusFilter, searchRadiusMeters, searchQuery]);

  const selectedCamera = cameras.find((c) => c.id === selectedCameraId) || cameras[0];

  const toggleBatchCamera = (id: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllRelevantAvailable = () => {
    const ids = filteredCameras
      .filter((c) => c.isRelevantToCorridor && c.footageStatus !== 'Footage received')
      .map((c) => c.id);
    setSelectedBatchIds(ids);
  };

  const formatMinuteToTime = (min: number | null) => {
    if (min === null) return 'All Documented Events (18:00–19:30)';
    const hh = Math.floor(min / 60);
    const mm = String(min % 60).padStart(2, '0');
    return `${hh}:${mm} IST`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <MapPin className="w-4 h-4" />
            <span>Stage 4 & Part 6 • Interactive Location Intelligence & CCTV Camera Discovery</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Spatial Investigation Grid & 20-Camera Corridor Registry (Bengaluru (Indiranagar, Koramangala, Domlur, Marathahalli, Whitefield & Hosur/Kolar/Tumakuru/Mysuru))
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Instead of manually identifying camera locations, investigators can use the camera registry and incident geography to identify cameras that may contain relevant footage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveModule('cctv-intelligence')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition"
          >
            <span>Proceed to Stage 5: CCTV Footage Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOP CONTROLS BAR: CAMERA DISCOVERY + LAYER TOGGLES + TIMELINE PLAYBACK */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Discovery Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Cameras (e.g. CAM-014)..."
                className="bg-[#090D16] border border-[#22314E] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white w-52 outline-none focus:border-sky-400"
              />
            </div>

            <button
              onClick={() => setViewMode('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                viewMode === 'All'
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
                  : 'bg-[#090D16] text-slate-300 border-[#22314E] hover:border-slate-600'
              }`}
            >
              Show All Cameras (20)
            </button>

            <button
              onClick={() => setViewMode('Relevant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                viewMode === 'Relevant'
                  ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                  : 'bg-[#090D16] text-slate-300 border-[#22314E] hover:border-slate-600'
              }`}
            >
              Show Relevant Corridor Cameras (15)
            </button>

            {/* Filter by Status */}
            <select
              aria-label="Filter Cameras by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
            >
              <option value="ALL">Filter Status: All Statuses</option>
              <option value="Footage received">Footage received</option>
              <option value="Footage available">Footage available</option>
              <option value="Request pending">Request pending</option>
              <option value="Awaiting response">Awaiting response</option>
              <option value="Footage unavailable">Footage unavailable</option>
              <option value="Retention period expired">Retention period expired</option>
            </select>

            {/* Search Radius Selector */}
            <select
              aria-label="Geographic Search Radius"
              value={searchRadiusMeters}
              onChange={(e) => setSearchRadiusMeters(Number(e.target.value))}
              className="bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-1.5 text-xs text-sky-300 font-mono outline-none"
            >
              <option value={600}>Radius: 600m (Enclave Immediate)</option>
              <option value={1500}>Radius: 1,500m (Sony World Junction (Koramangala–Indiranagar Link))</option>
              <option value={2800}>Radius: 2,800m (Full East Corridor)</option>
            </select>
          </div>

          {/* Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Layers:
            </span>
            {[
              { label: 'Search Boundary', active: showSearchBoundary, toggle: () => setShowSearchBoundary((v) => !v) },
              { label: 'FOV Cones', active: showCoverageCones, toggle: () => setShowCoverageCones((v) => !v) },
              { label: 'Vehicle Sightings', active: showVehiclesLayer, toggle: () => setShowVehiclesLayer((v) => !v) },
              { label: 'Approx Cell Sectors', active: showCellSectorsLayer, toggle: () => setShowCellSectorsLayer((v) => !v) },
            ].map((lyr) => (
              <button
                key={lyr.label}
                onClick={lyr.toggle}
                className={`px-2.5 py-1 rounded border text-[11px] transition ${
                  lyr.active
                    ? 'bg-sky-500/20 border-sky-400/50 text-sky-200 font-semibold'
                    : 'bg-[#090D16] border-slate-800 text-slate-500'
                }`}
              >
                {lyr.label}
              </button>
            ))}
          </div>
        </div>

        {/* PLAY INVESTIGATION TIMELINE ON MAP BAR */}
        <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isTimelinePlaying) {
                  setIsTimelinePlaying(false);
                } else {
                  if (activeTimelineMinute === null || activeTimelineMinute >= 1170) {
                    setActiveTimelineMinute(1090);
                  }
                  setIsTimelinePlaying(true);
                }
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition"
            >
              {isTimelinePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>PLAY INVESTIGATION TIMELINE ON MAP</span>
            </button>

            {activeTimelineMinute !== null && (
              <button
                onClick={() => {
                  setIsTimelinePlaying(false);
                  setActiveTimelineMinute(null);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Show All Time</span>
              </button>
            )}

            <span className="text-xs font-mono text-sky-300">
              Map Time Filter: <b>{formatMinuteToTime(activeTimelineMinute)}</b>
            </span>
          </div>

          <div className="flex-1 max-w-md flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400">18:10</span>
            <input
              type="range"
              aria-label="Map Timeline Slider"
              min={1090}
              max={1170}
              value={activeTimelineMinute ?? 1170}
              onChange={(e) => {
                setIsTimelinePlaying(false);
                setActiveTimelineMinute(Number(e.target.value));
              }}
              className="flex-1 accent-sky-400 cursor-pointer"
            />
            <span className="text-[11px] font-mono text-slate-400">19:30</span>
          </div>
        </div>
      </div>

      {/* MAIN MAP + CAMERA DETAILS & BATCH SELECTION SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Leaflet Map + Legend */}
        <div className="lg:col-span-8 space-y-3">
          <TacticalLeafletMap
            cameras={filteredCameras}
            selectedCameraId={selectedCamera.id}
            selectedCameraForBatch={selectedBatchIds}
            onSelectCamera={setSelectedCameraId}
            onToggleBatchCamera={toggleBatchCamera}
            vehicles={vehicles}
            devices={devices}
            timelineEvents={timelineEvents}
            searchRadiusMeters={searchRadiusMeters}
            showSearchBoundary={showSearchBoundary}
            showCoverageCones={showCoverageCones}
            showVehiclesLayer={showVehiclesLayer}
            showCellSectorsLayer={showCellSectorsLayer}
            activeTimelineMinute={activeTimelineMinute}
          />

          {/* Consistent Map Legend */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-[11px] uppercase text-slate-400 font-semibold">Legend:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-white inline-block" />
                <span>Incident Anchor (18:30)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Footage Received</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                <span>Footage Available</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Request Pending / Awaiting</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Unavailable / Expired (CAM-008, CAM-011)</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400 italic">
              Note: No movement is interpolated between separate sightings.
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Selected Camera Detail Panel & Batch Request Generator */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Camera Dossier */}
          <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
              <div>
                <div className="text-[10px] font-mono text-sky-400 uppercase">
                  SELECTED CAMERA REGISTRY RECORD
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedCamera.id} — {selectedCamera.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedCamera.ownerEstablishment}</p>
              </div>
              <button
                onClick={() => toggleBatchCamera(selectedCamera.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#090D16] border border-sky-500/40 text-xs text-sky-300 hover:bg-sky-500/15"
              >
                {selectedBatchIds.includes(selectedCamera.id) ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
                    <span>Selected</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Select</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">LOCATION</div>
                <div className="font-medium text-white truncate mt-0.5">{selectedCamera.locationName}</div>
              </div>
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">DIRECTION & COVERAGE</div>
                <div className="font-medium text-teal-300 mt-0.5">
                  {selectedCamera.directionLabel} (~{selectedCamera.coverageRadiusMeters}m)
                </div>
              </div>
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">CAMERA TYPE</div>
                <div className="font-medium text-white mt-0.5">{selectedCamera.cameraType}</div>
              </div>
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">RETENTION WINDOW</div>
                <div className="font-medium text-amber-300 mt-0.5">{selectedCamera.retentionPeriod}</div>
              </div>
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">FOOTAGE STATUS</div>
                <div className="font-bold text-sky-300 mt-0.5">{selectedCamera.footageStatus}</div>
              </div>
              <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">REQUEST STATUS</div>
                <div className="font-semibold text-white mt-0.5">{selectedCamera.requestStatus}</div>
              </div>
            </div>

            {selectedCamera.reviewerNotes && (
              <div className="p-2.5 rounded-lg bg-[#090D16] border border-amber-500/30 text-xs text-slate-200">
                <span className="font-bold text-amber-300">Custodian / Review Note: </span>
                {selectedCamera.reviewerNotes}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setActiveModule('cctv-intelligence')}
                className="flex-1 py-2 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 font-semibold text-xs transition"
              >
                Open in Video Review Workspace
              </button>
            </div>
          </div>

          {/* Generate CCTV Footage Requests Panel */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase font-mono">
                Generate CCTV Preservation Requests
              </h3>
              <button
                onClick={selectAllRelevantAvailable}
                className="text-[11px] text-sky-400 hover:underline"
              >
                Select All Relevant Unreceived
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded bg-[#090D16] border border-slate-800">
              {cameras.map((c) => {
                const checked = selectedBatchIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleBatchCamera(c.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition ${
                      checked
                        ? 'bg-sky-500 text-slate-950 font-bold border-sky-300'
                        : 'bg-[#141D2F] text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {c.id}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-0.5">REQUESTED DATE</label>
                <input
                  type="text"
                  value={reqDate}
                  onChange={(e) => setReqDate(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-0.5">TIME RANGE</label>
                <input
                  type="text"
                  value={reqTimeRange}
                  onChange={(e) => setReqTimeRange(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
            </div>

            <button
              onClick={() => generateCctvRequests(selectedBatchIds, reqDate, reqTimeRange, reqPriority)}
              disabled={selectedBatchIds.length === 0}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Generate CCTV Footage Requests ({selectedBatchIds.length} Selected)</span>
            </button>
          </div>
        </div>
      </div>

      {/* GENERATED CCTV FOOTAGE REQUESTS TABLE WITH INTERACTIVE STATUS CONTROLS */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              CCTV Footage Preservation Request Log ({cctvRequests.length} Requests)
            </h3>
            <p className="text-xs text-slate-400">
              Simulated custodian request queue. Investigators can mark requests as Submitted, Pending, or Received.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-300">
            Synthetic Custodian Workflow — No Real Private CCTV Accessed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Request Ref</th>
                <th className="py-2.5 px-3">Camera & Custodian</th>
                <th className="py-2.5 px-3">Requested Window</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Preservation Deadline</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Update Custodian Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {cctvRequests.map((req) => (
                <tr key={req.requestId} className="hover:bg-[#090D16]/60">
                  <td className="py-2.5 px-3 font-mono font-bold text-sky-300">{req.requestId}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white">
                      {req.cameraId} — {req.cameraName}
                    </div>
                    <div className="text-[11px] text-slate-400">{req.ownerEstablishment}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">
                    {req.requestedDate} • {req.requestedTimeRange}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        req.priority === 'Critical Preservation'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-amber-300">{req.preservationDeadline}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                        req.status === 'Received'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : req.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {(['Submitted', 'Pending', 'Received'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateCctvRequestStatus(req.requestId, st)}
                          className={`px-2 py-1 rounded text-[10px] font-mono transition ${
                            req.status === st
                              ? 'bg-sky-500 text-slate-950 font-bold'
                              : 'bg-[#090D16] hover:bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


