"use client";

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  Play,
  FolderKanban,
  FileLock2,
  Smartphone,
  Cctv,
  BrainCircuit,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Shield,
  Compass,
  Share2,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';

const CRIME_CATEGORY_DATA = [
  { category: 'Missing / Abduction', count: 4, fill: '#0EA5E9' },
  { category: 'Commercial Intrusion', count: 5, fill: '#14B8A6' },
  { category: 'Hit & Run Corridor', count: 4, fill: '#3B82F6' },
  { category: 'Digital Extortion', count: 3, fill: '#F59E0B' },
  { category: 'Organised Property', count: 2, fill: '#6366F1' },
];

const EVIDENCE_SOURCE_DATA = [
  { source: 'CCTV Containers', records: 18 },
  { source: 'Telecom / Sector Logs', records: 34 },
  { source: 'ANPR Corridor Reads', records: 22 },
  { source: 'Witness Statements', records: 9 },
  { source: 'Gate / RWA Logs', records: 7 },
  { source: 'Forensic Docs', records: 6 },
];

const ACTIVITY_TIMELINE_DATA = [
  { time: '18:00', events: 4, verified: 3 },
  { time: '18:30', events: 11, verified: 8 },
  { time: '19:00', events: 19, verified: 12 },
  { time: '19:30', events: 14, verified: 10 },
  { time: '20:30', events: 8, verified: 7 },
  { time: '21:15', events: 24, verified: 18 },
  { time: '22:15', events: 31, verified: 25 },
];

export const CommandCentreModule: React.FC = () => {
  const {
    cases,
    cameras,
    cctvRequests,
    leads,
    evidenceItems,
    setActiveModule,
    startGuidedInvestigation,
    isExecutiveFocusMode,
    setIsExecutiveFocusMode,
  } = useSentinel();

  const [showDetailedCharts, setShowDetailedCharts] = useState(false);

  const receivedCamerasCount = cameras.filter((c) => c.footageStatus === 'Footage received').length;
  const pendingLeadsCount = leads.filter((l) => l.reviewStatus === 'Awaiting Investigator Review').length;
  const criticalPreservationCount = cctvRequests.filter((r) => r.priority === 'Critical Preservation').length;

  const cctvStatusData = [
    { name: 'Footage Received', value: cameras.filter((c) => c.footageStatus === 'Footage received').length, color: '#10B981' },
    { name: 'Footage Available', value: cameras.filter((c) => c.footageStatus === 'Footage available').length, color: '#0EA5E9' },
    { name: 'Request Pending', value: cameras.filter((c) => c.footageStatus === 'Request pending' || c.footageStatus === 'Awaiting response').length, color: '#F59E0B' },
    { name: 'Unavailable / Expired', value: cameras.filter((c) => c.footageStatus === 'Footage unavailable' || c.footageStatus === 'Retention period expired').length, color: '#EF4444' },
  ];

  const leadStatusData = [
    {
      status: 'Awaiting Review',
      count: leads.filter((l) => l.reviewStatus === 'Awaiting Investigator Review').length,
      color: '#F59E0B',
    },
    {
      status: 'Marked for Verification',
      count: leads.filter((l) => l.reviewStatus === 'Marked for Further Verification').length,
      color: '#10B981',
    },
    {
      status: 'Clarification Needed',
      count: leads.filter((l) => l.reviewStatus === 'Clarification Requested').length,
      color: '#0EA5E9',
    },
    {
      status: 'Rejected (Logged)',
      count: leads.filter((l) => l.reviewStatus === 'Rejected by Investigator').length,
      color: '#EF4444',
    },
  ];

  const displayAllAnalytics = !isExecutiveFocusMode || showDetailedCharts;

  return (
    <div className="space-y-6">
      {/* HERO EXECUTIVE COMMAND HEADER WITH VOICE COMMENTARY LAUNCHER */}
      <div className="bg-gradient-to-r from-[#111C30] via-[#14223B] to-[#0F1829] border-2 border-sky-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-mono">
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <span>INTERACTIVE VOICE-GUIDED DEMONSTRATION READY</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              “A person goes missing at 6:30 PM. The complaint arrives at 9:15 PM.”
            </h1>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              Watch and listen as <b>Project Sentinel</b> guides you step-by-step through how investigators connect mobile records, discover 20 nearby CCTV cameras, compare vehicles, filter out innocent commuters, and generate a traceable report.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => startGuidedInvestigation(false, true)}
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-sky-500/25 transition transform hover:-translate-y-0.5"
            >
              <Volume2 className="w-5 h-5" />
              <span>START INVESTIGATION DEMO (WITH AUDIO)</span>
            </button>

            <button
              onClick={() => setActiveModule('workspace')}
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[#090D16] hover:bg-[#141D2F] text-sky-300 border border-sky-500/40 font-semibold text-sm transition"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Case Manually</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLEAN 3-STEP EXECUTIVE STORY SUMMARY (Eliminates Confusion) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => setActiveModule('cases')}
          className="bg-[#141D2F] border border-sky-500/40 hover:border-sky-400 rounded-xl p-5 cursor-pointer transition space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold">
              STEP 1 • THE INCIDENT
            </span>
            <span className="font-mono text-xs text-slate-400">18:30 – 21:15 IST</span>
          </div>
          <h3 className="text-base font-bold text-white">
            CASE-SNT-2026-0042: Missing Person (Aarav Sharma)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aarav Sharma departs Kaveri Enclave Library at <b>18:30</b>. Their phone (<code className="text-sky-300">DEV-001</code>) loses signal at <b>18:48</b>. Family files a complaint at <b>21:15</b>.
          </p>
          <div className="pt-1 text-xs font-semibold text-sky-400 flex items-center gap-1">
            <span>Open Stage 1: Incident Registration →</span>
          </div>
        </div>

        <div
          onClick={() => setActiveModule('location-intelligence')}
          className="bg-[#141D2F] border border-teal-500/40 hover:border-teal-400 rounded-xl p-5 cursor-pointer transition space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-xs font-bold">
              STEP 2 • MULTI-SOURCE EVIDENCE
            </span>
            <span className="font-mono text-xs text-slate-400">30 Phones • 20 Cameras</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Correlating Phones, CCTV & Vehicles
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Discovers <b>20 corridor cameras</b>, extracts a white SUV sighting at <b>19:02</b> (<code className="text-teal-300">CAM-014</code>) and <b>19:18</b> (<code className="text-teal-300">CAM-019</code>), and clears innocent commuters using exculpatory gate logs.
          </p>
          <div className="pt-1 text-xs font-semibold text-teal-400 flex items-center gap-1">
            <span>Open Interactive Map & CCTV Discovery →</span>
          </div>
        </div>

        <div
          onClick={() => setActiveModule('ai-engine')}
          className="bg-[#141D2F] border border-amber-500/40 hover:border-amber-400 rounded-xl p-5 cursor-pointer transition space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
              STEP 3 • EXPLAINABLE AI & REPORT
            </span>
            <span className="font-mono text-xs text-slate-400">6 Candidate Leads</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Human-in-the-Loop Lead Verification
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Generates <b>6 candidate leads</b> with supporting evidence, contradictory evidence, and innocent explanations—never assigning a guilt score—and exports a <b>15-section PDF report</b>.
          </p>
          <div className="pt-1 text-xs font-semibold text-amber-400 flex items-center gap-1">
            <span>Review 6 Candidate Leads →</span>
          </div>
        </div>
      </div>

      {/* KEY METRICS STRIP (4 High-Signal Cards always visible, expandable to all 10 KPIs + 6 Charts) */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Command Centre Operational Snapshot</span>
            </h2>
            <p className="text-xs text-slate-400">
              High-level summary across active cases, evidence vault, CCTV preservation, and human lead verification.
            </p>
          </div>

          <button
            onClick={() => {
              setShowDetailedCharts((s) => !s);
              if (isExecutiveFocusMode && !showDetailedCharts) {
                setIsExecutiveFocusMode(false);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#090D16] hover:bg-slate-800 border border-sky-500/40 text-sky-300 text-xs font-semibold transition"
          >
            {displayAllAnalytics ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Detailed Analytics & 6 Charts (Simplified Mode)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show All 10 KPIs & 6 Analytical Charts</span>
              </>
            )}
          </button>
        </div>

        {/* 10 EXECUTIVE KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div
            onClick={() => setActiveModule('cases')}
            className="bg-[#090D16] border border-[#22314E] hover:border-sky-500/50 rounded-xl p-4 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Active Cases</span>
              <FolderKanban className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">18</div>
            <div className="text-[11px] text-sky-300 mt-1">4 Priority Demo Cases</div>
          </div>

          <div
            onClick={() => setActiveModule('digital-evidence')}
            className="bg-[#090D16] border border-[#22314E] hover:border-sky-500/50 rounded-xl p-4 cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Evidence Sealed</span>
              <FileLock2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{evidenceItems.length} Files</div>
            <div className="text-[11px] text-slate-300 mt-1">100% SHA-256 Verified</div>
          </div>

          <div
            onClick={() => setActiveModule('mobile-intelligence')}
            className="bg-[#090D16] border border-[#22314E] hover:border-sky-500/50 rounded-xl p-4 cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Mobile Devices Analyzed</span>
              <Smartphone className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">30 Devices</div>
            <div className="text-[11px] text-slate-300 mt-1">Across 4 Cell Sectors</div>
          </div>

          <div
            onClick={() => setActiveModule('cctv-intelligence')}
            className="bg-[#090D16] border border-[#22314E] hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>CCTV Footage Received</span>
              <Cctv className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-teal-400 font-mono">{receivedCamerasCount} / 20</div>
            <div className="text-[11px] text-slate-300 mt-1">{cctvRequests.length} Requests Tracked</div>
          </div>

          <div
            onClick={() => setActiveModule('ai-engine')}
            className="bg-[#090D16] border border-[#22314E] hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>AI Leads for Review</span>
              <BrainCircuit className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300 font-mono">{pendingLeadsCount} / {leads.length}</div>
            <div className="text-[11px] text-amber-200/80 mt-1">Human Decision Required</div>
          </div>

          {displayAllAnalytics && (
            <>
              <div
                onClick={() => setActiveModule('cases')}
                className="bg-[#090D16] border border-[#22314E] rounded-xl p-4 cursor-pointer transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Cases by Category</span>
                  <Share2 className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-xl font-bold text-white font-mono">5 Categories</div>
                <div className="text-[11px] text-teal-300 mt-1">Abduction, Burglary, Traffic</div>
              </div>

              <div
                onClick={() => setActiveModule('location-intelligence')}
                className="bg-[#090D16] border border-[#22314E] rounded-xl p-4 cursor-pointer transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>CCTV Requests Sent</span>
                  <Cctv className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-white font-mono">{cctvRequests.length}</div>
                <div className="text-[11px] text-amber-300 mt-1">Custodian Queue Active</div>
              </div>

              <div
                onClick={() => setActiveModule('vehicle-intelligence')}
                className="bg-[#090D16] border border-[#22314E] rounded-xl p-4 cursor-pointer transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Pending Verification</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-amber-400 font-mono">7 Items</div>
                <div className="text-[11px] text-slate-300 mt-1">Vehicles & Witness Notes</div>
              </div>

              <div
                onClick={() => setActiveModule('location-intelligence')}
                className="bg-[#090D16] border border-[#22314E] rounded-xl p-4 cursor-pointer transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Critical Preservation</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-xl font-bold text-rose-400 font-mono">{criticalPreservationCount}</div>
                <div className="text-[11px] text-rose-300 mt-1">Rolling Retention Deadlines</div>
              </div>

              <div
                onClick={() => setActiveModule('reports')}
                className="bg-[#090D16] border border-[#22314E] rounded-xl p-4 cursor-pointer transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Reports Generated</span>
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white font-mono">14</div>
                <div className="text-[11px] text-emerald-300 mt-1">Traceable PDF Dossiers</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 6 ANALYTICAL CHARTS GRID (Visible when expanded or in Full Analyst View) */}
      {displayAllAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Chart 1: Cases by Crime Category */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Cases by Crime Category</h3>
                <p className="text-[11px] text-slate-400">Active division synthetic caseload distribution</p>
              </div>
              <span className="text-xs font-mono text-sky-400">n = 18</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CRIME_CATEGORY_DATA} layout="vertical" margin={{ left: 10, right: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis type="category" dataKey="category" stroke="#94A3B8" fontSize={11} width={125} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F1624', borderColor: '#22314E', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {CRIME_CATEGORY_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Evidence Received by Source */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Evidence Received by Source</h3>
                <p className="text-[11px] text-slate-400">Multi-source ingestion volume by provenance</p>
              </div>
              <span className="text-xs font-mono text-teal-400">96 Records</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EVIDENCE_SOURCE_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="source" stroke="#94A3B8" fontSize={10} interval={0} angle={-12} textAnchor="end" height={45} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F1624', borderColor: '#22314E', fontSize: '12px' }}
                  />
                  <Bar dataKey="records" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Investigation Activity Over Time */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Investigation Activity Over Time</h3>
                <p className="text-[11px] text-slate-400">02 Nov 2026 incident & ingestion chronology</p>
              </div>
              <span className="text-xs font-mono text-sky-400">18:00–22:15</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACTIVITY_TIMELINE_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F1624', borderColor: '#22314E', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="events" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.2} name="Total Observations" />
                  <Area type="monotone" dataKey="verified" stroke="#10B981" fill="#10B981" fillOpacity={0.25} name="Verified Records" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: CCTV Collection Progress */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">CCTV Collection Progress</h3>
                <p className="text-[11px] text-slate-400">Status across 20 discovered corridor cameras</p>
              </div>
              <span className="text-xs font-mono text-emerald-400">20 Cameras</span>
            </div>
            <div className="h-52 w-full flex items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cctvStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={68}
                      paddingAngle={3}
                    >
                      {cctvStatusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F1624', borderColor: '#22314E', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2 pl-2">
                {cctvStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 5: Lead Review Status */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">AI Lead Review Status</h3>
                <p className="text-[11px] text-slate-400">Human investigator verification pipeline</p>
              </div>
              <span className="text-xs font-mono text-amber-400">{leads.length} Candidate Leads</span>
            </div>
            <div className="space-y-3 my-auto">
              {leadStatusData.map((item) => {
                const pct = Math.round((item.count / leads.length) * 100);
                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{item.status}</span>
                      <span className="font-mono font-semibold text-white">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#090D16] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(pct, 6)}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 6: Evidence Processing & Integrity Status */}
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Evidence Processing Status</h3>
                  <p className="text-[11px] text-slate-400">Cryptographic custody & normalisation pipeline</p>
                </div>
                <span className="text-xs font-mono text-emerald-400">100% Hashed</span>
              </div>

              <div className="space-y-2.5 mt-2">
                <div className="p-2.5 rounded-lg bg-[#090D16] border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-300">Original Evidence Sealed (SHA-256)</div>
                    <div className="text-[11px] text-slate-400">Immutable vault containers verified</div>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400">10 Files</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#090D16] border border-sky-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-sky-300">Working Copies & Derived Observations</div>
                    <div className="text-[11px] text-slate-400">Normalised for timeline & map layers</div>
                  </div>
                  <span className="text-sm font-mono font-bold text-sky-400">21 Items</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#090D16] border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-amber-300">AI-Generated Interpretations</div>
                    <div className="text-[11px] text-slate-400">Separated from factual records until reviewed</div>
                  </div>
                  <span className="text-sm font-mono font-bold text-amber-400">6 Leads</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Active Cases in Division: {cases.length}</span>
              <button
                onClick={() => setActiveModule('digital-evidence')}
                className="text-sky-400 hover:underline font-medium"
              >
                Inspect Vault →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

