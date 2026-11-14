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
  ShieldAlert,
  Crosshair,
  Languages,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';
import { GUIDED_STAGES } from '@/data/syntheticData';

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
    goToGuidedStage,
    narrationLanguage,
    setNarrationLanguage,
    isExecutiveFocusMode,
    setIsExecutiveFocusMode,
  } = useSentinel();

  const [showDetailedCharts, setShowDetailedCharts] = useState(false);
  const [showAllTraps, setShowAllTraps] = useState(true);
  const isHi = narrationLanguage === 'hi';

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

  const launchStageWithVoice = (stageIdx: number, lang?: 'en' | 'hi') => {
    const chosenLang = lang || (narrationLanguage === 'hi' ? 'hi' : 'en');
    startGuidedInvestigation(false, true, chosenLang, stageIdx);
  };

  return (
    <div className="space-y-6">
      {/* HERO EXECUTIVE COMMAND HEADER WITH BILINGUAL (ENGLISH & हिंदी) VOICE COMMENTARY LAUNCHER */}
      <div className="bg-gradient-to-r from-[#111C30] via-[#14223B] to-[#0F1829] border-2 border-sky-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-mono">
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {isHi
                    ? 'सरल हिंदी और इंग्लिश वॉइस डेमो तैयार है'
                    : 'INTERACTIVE VOICE-GUIDED DEMO READY (ENGLISH & हिंदी)'}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>8 SOVEREIGN GOVERNMENT TRAPS ACTIVE</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {isHi
                ? '“शाम 6:30 बजे अपहरण होता है। शातिर अपराधी हर सबूत मिटाता है — पर चक्रव्यूह का सरकारी जाल उसे पकड़ लेता है।”'
                : '“A person goes missing at 6:30 PM. A smart criminal erases every normal clue — until Project Chakravyuh’s Sovereign Grid springs 8 traps.”'}
            </h1>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              {isHi ? (
                <>
                  बिना किसी तकनीकी शब्दों के <b>सरल हिंदी</b> या <b>English</b> में सुनिए और देखिए कि कैसे अपराधी के फ़ैराडे बैग, घर पर छोड़े नकली अलिबी फोन, बंद CCTV कैमरे और नकली नंबर प्लेट को <b>Project Chakravyuh</b> स्मार्ट बिजली मीटर, सरकारी बस डैशकैम, टोल FASTag और टायर सेंसर से पकड़ता है।
                </>
              ) : (
                <>
                  Designed so <b>any non-technical person</b> can follow along in <b>English</b> or <b>Hindi (हिंदी)</b>: watch and listen as <b>Project Chakravyuh</b> defeats Faraday pouches, fake home phone alibis, camera power cuts, and cloned number plates using Smart Electricity Meters, Bus Dashcams, FASTag gantries, and Tyre Sensors.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row xl:flex-col items-stretch gap-2.5 shrink-0">
            <button
              onClick={() => startGuidedInvestigation(false, true, 'en')}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs md:text-sm shadow-xl shadow-sky-500/25 transition transform hover:-translate-y-0.5"
            >
              <Volume2 className="w-5 h-5" />
              <span>🇬🇧 START VOICE DEMO (IN ENGLISH)</span>
            </button>

            <button
              onClick={() => startGuidedInvestigation(false, true, 'hi')}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs md:text-sm shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <Volume2 className="w-5 h-5" />
              <span>🇮🇳 हिंदी में वॉइस डेमो सुनें (HINDI AUDIO)</span>
            </button>

            <button
              onClick={() => startGuidedInvestigation(false, true, 'bilingual')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] hover:bg-[#141D2F] text-teal-300 border border-teal-500/40 font-bold text-xs transition"
            >
              <Languages className="w-4 h-4" />
              <span>🇮🇳+🇬🇧 Play Bilingual Demo (English + हिंदी)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SMART CRIMINAL vs. SOVEREIGN SENTINEL — 8-STAGE INTERACTIVE CAT-AND-MOUSE MATRIX */}
      <div className="bg-[#111A2E] border-2 border-emerald-500/35 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                STEP 1: SMARTEST CRIMINAL
              </span>
              <span className="text-slate-400 font-bold">vs.</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                STEP 2: PROJECT CHAKRAVYUH (प्रोजेक्ट चक्रव्यूह) SOVEREIGN GRID
              </span>
            </div>
            <h2 className="text-base md:text-lg font-extrabold text-white mt-1">
              {isHi
                ? 'शातिर अपराधी की 8 चालें बनाम प्रोजेक्ट चक्रव्यूह के 8 सरकारी जाल (किसी भी कार्ड पर क्लिक करके सुनें)'
                : '8 Smart Criminal Evasion Moves vs. 8 Project Chakravyuh Sovereign Government Traps (Click Any Stage to Watch & Listen)'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNarrationLanguage(isHi ? 'en' : 'hi')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-sky-500/40 text-xs font-bold text-sky-300 hover:text-white transition"
            >
              {isHi ? '🇬🇧 Switch Cards to English' : '🇮🇳 कार्ड्स को हिंदी में देखें'}
            </button>
            <button
              onClick={() => setShowAllTraps((s) => !s)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition"
            >
              {showAllTraps ? (isHi ? 'छोटा करें' : 'Collapse') : isHi ? 'सभी 8 जाल देखें' : 'Show All 8 Traps'}
            </button>
          </div>
        </div>

        {showAllTraps && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {GUIDED_STAGES.map((stg, idx) => (
              <div
                key={stg.id}
                onClick={() => launchStageWithVoice(idx)}
                className="bg-[#090E1A] border border-slate-800 hover:border-sky-400 rounded-xl p-3.5 cursor-pointer transition flex flex-col justify-between gap-2.5 group shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[11px] font-bold">
                      {isHi ? `चरण ${stg.stageNumber}` : `STAGE ${stg.stageNumber}`}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 group-hover:underline">
                      🔊 {isHi ? 'हिंदी में सुनें →' : 'Play Voice →'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">
                    {isHi ? stg.titleHi.replace(/^चरण \d+ — /, '') : stg.title.replace(/^STAGE \d+ — /, '')}
                  </div>

                  <div className="p-2 rounded bg-rose-950/35 border border-rose-500/30 text-[11px] text-rose-200 leading-snug">
                    <div className="font-bold text-rose-400 mb-0.5 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 shrink-0" />
                      <span>{isHi ? 'अपराधी की चाल:' : 'Criminal’s Move:'}</span>
                    </div>
                    {isHi ? stg.criminalMoveHi : stg.criminalMoveEn}
                  </div>

                  <div className="p-2 rounded bg-emerald-950/35 border border-emerald-500/30 text-[11px] text-emerald-200 leading-snug">
                    <div className="font-bold text-emerald-400 mb-0.5 flex items-center gap-1">
                      <Crosshair className="w-3 h-3 shrink-0" />
                      <span>{isHi ? 'चक्रव्यूह का सरकारी जाल:' : 'Chakravyuh’s Sovereign Trap:'}</span>
                    </div>
                    {isHi ? stg.sentinelTrapHi : stg.sentinelTrapEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CLEAN 3-STEP EXECUTIVE STORY SUMMARY (Eliminates Confusion) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => setActiveModule('cases')}
          className="bg-[#141D2F] border border-sky-500/40 hover:border-sky-400 rounded-xl p-5 cursor-pointer transition space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold">
              {isHi ? 'भाग 1 • वारदात और 4-थाने लिंक' : 'STEP 1 • THE INCIDENT & 4-STATION LINK'}
            </span>
            <span className="font-mono text-xs text-slate-400">18:30 – 21:15 IST</span>
          </div>
          <h3 className="text-base font-bold text-white">
            {isHi
              ? 'CASE-SNT-2026-0042: आरव शर्मा अपहरण केस'
              : 'CASE-SNT-2026-0042: Missing Person (Aarav Sharma)'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHi ? (
              <>
                आरव शर्मा शाम <b>6:30</b> बजे लाइब्रेरी से निकलते हैं। <b>6:48</b> पर उनका फोन (<code className="text-sky-300">DEV-001</code>) फ़ैराडे बैग में डालकर बंद कर दिया जाता है। चक्रव्यूह देश के पुलिस ग्रिड (CCTNS) से 4 थानों के ट्रायल केस जोड़ता है।
              </>
            ) : (
              <>
                Aarav Sharma departs State Central Library, Indiranagar at <b>18:30</b>. His phone (<code className="text-sky-300">DEV-001</code>) is dropped into a Faraday pouch at <b>18:48</b>. Chakravyuh links 4 cross-station rehearsal cases via ICJS/CCTNS.
              </>
            )}
          </p>
          <div className="pt-1 text-xs font-semibold text-sky-400 flex items-center gap-1">
            <span>{isHi ? 'चरण 1 खोलें: केस रजिस्टर →' : 'Open Stage 1: Incident Registration →'}</span>
          </div>
        </div>

        <div
          onClick={() => setActiveModule('location-intelligence')}
          className="bg-[#141D2F] border border-teal-500/40 hover:border-teal-400 rounded-xl p-5 cursor-pointer transition space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-xs font-bold">
              {isHi ? 'भाग 2 • स्मार्ट मीटर, बस डैशकैम और FASTag' : 'STEP 2 • SMART METER, BUS DASHCAM & FASTAG'}
            </span>
            <span className="font-mono text-xs text-slate-400">31 Phones • 20 Cameras</span>
          </div>
          <h3 className="text-base font-bold text-white">
            {isHi
              ? 'झूठा अलिबी और बंद कैमरे की साज़िश बेनकाब'
              : 'Defeating Fake Alibis, Blind Spots & Cloned Plates'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHi ? (
              <>
                स्मार्ट बिजली मीटर से करण मल्होत्रा का झूठा अलिबी पकड़ता है, बंद कैमरे (<code className="text-teal-300">CAM-008</code>) की जगह <b>BMTC बस डैशकैम</b> निकालता है, और टायर सेंसर से सफ़ेद SUV पकड़ता है।
              </>
            ) : (
              <>
                Busts Karan Malhotra’s fake home alibi via <b>138W Smart Meter flatline</b>, fills the <code className="text-teal-300">CAM-008</code> outage using a <b>BMTC Bus Dashcam</b>, and matches the white SUV via <b>FASTag & 433MHz TPMS</b>.
              </>
            )}
          </p>
          <div className="pt-1 text-xs font-semibold text-teal-400 flex items-center gap-1">
            <span>{isHi ? 'नक्शा और CCTV जांच खोलें →' : 'Open Interactive Map & CCTV Discovery →'}</span>
          </div>
        </div>

        <div
          onClick={() => setActiveModule('ai-engine')}
          className="bg-[#141D2F] border border-amber-500/40 hover:border-amber-400 rounded-xl p-5 cursor-pointer transition space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
              {isHi ? 'भाग 3 • AI सुराग और कोर्ट रिपोर्ट' : 'STEP 3 • EXPLAINABLE AI & COURT REPORT'}
            </span>
            <span className="font-mono text-xs text-slate-400">6 Candidate Leads</span>
          </div>
          <h3 className="text-base font-bold text-white">
            {isHi
              ? 'निर्दोष नागरिकों की सुरक्षा और 15-भाग PDF रिपोर्ट'
              : 'Human-in-the-Loop Lead Verification & PDF Export'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isHi ? (
              <>
                निर्दोष नागरिक रोहन वर्मा और कैब ड्राइवर नवीन कुमार को पक्के सबूतों से तुरंत क्लीन चिट देता है और <b>15-भागों की कोर्ट PDF रिपोर्ट</b> तैयार करता है।
              </>
            ) : (
              <>
                Automatically clears innocent commuter Rohan Verma and cab driver Naveen Kumar using exculpatory gate and camera logs, and exports a <b>15-section court-ready PDF report</b>.
              </>
            )}
          </p>
          <div className="pt-1 text-xs font-semibold text-amber-400 flex items-center gap-1">
            <span>{isHi ? '6 AI सुरागों की समीक्षा करें →' : 'Review 6 Candidate Leads →'}</span>
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

