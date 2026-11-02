"use client";

import React, { useState, useMemo } from 'react';
import {
  Shield,
  LayoutDashboard,
  FolderKanban,
  Layers,
  Smartphone,
  MapPin,
  Cctv,
  Car,
  BrainCircuit,
  Share2,
  FileLock2,
  FileText,
  Users,
  ShieldCheck,
  Search,
  Bell,
  Play,
  Presentation,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Volume2,
  VolumeX,
  Eye,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';
import { ModuleId, UserRole } from '@/types/sentinel';
import { GuidedPresentationBar } from '@/components/guided/GuidedPresentationBar';

interface NavItem {
  id: ModuleId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  plainExplanation: string;
  voiceCommentary: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'command-centre',
    label: 'Command Centre',
    shortLabel: 'Command',
    icon: LayoutDashboard,
    plainExplanation: 'Executive overview of the Aarav Sharma missing person investigation and one-click Voice-Guided Demo launch.',
    voiceCommentary:
      'Welcome to Project Sentinel. Software architect Aarav Sharma goes missing at 6:30 PM, and his sister Ananya Sharma files a complaint at 9:15 PM. Click Start Voice Guided Demo to watch and listen as the platform connects mobile, CCTV, and vehicle evidence into a traceable report.',
  },
  {
    id: 'cases',
    label: '1. Incident Registration',
    shortLabel: 'Cases',
    icon: FolderKanban,
    badge: 'Stage 1',
    plainExplanation: 'Stage 1: Registers the missing person complaint for Aarav Sharma (last seen 18:30 at Kaveri Enclave) and anchors it on the map.',
    voiceCommentary:
      'Stage 1, Incident Registration. Here Inspector Vikram Rao registers the missing person case for Aarav Sharma, who was last seen leaving the Kaveri Enclave library at 6:30 PM. The platform creates a structured workspace and plots the incident location.',
  },
  {
    id: 'workspace',
    label: '2. Evidence Ingestion',
    shortLabel: 'Ingestion',
    icon: Layers,
    badge: 'Stage 2',
    plainExplanation: 'Stage 2: Brings together 7 different evidence streams (telecom, CCTV, vehicles, witnesses Suresh Babu & Aditi Rao) into one timeline.',
    voiceCommentary:
      'Stage 2, Multi Source Evidence Ingestion. Authorized telecom records, CCTV videos, vehicle logs, and witness statements from Suresh Babu and Aditi Rao flow into the central engine, where Forensic Lead Doctor Priya Krishnan verifies their cryptographic hashes.',
  },
  {
    id: 'mobile-intelligence',
    label: '3. Mobile Intelligence',
    shortLabel: 'Mobile',
    icon: Smartphone,
    badge: 'Stage 3',
    plainExplanation: 'Stage 3: Compares 30 citizen mobile phones in approximate cell sectors—flagging an unattributed prepaid phone while clearing resident Rohan Verma.',
    voiceCommentary:
      'Stage 3, Mobile Intelligence. Aarav Sharma’s iPhone loses signal at 6:48 PM. An unattributed prepaid phone appears in four overlapping cell sectors moving east, while resident Rohan Verma’s phone is cleared because his apartment gate log proves he went west.',
  },
  {
    id: 'location-intelligence',
    label: '4. Map & CCTV Discovery',
    shortLabel: 'Map / GIS',
    icon: MapPin,
    badge: 'Stage 4',
    plainExplanation: 'Stage 4: Interactive map of 20 nearby CCTV cameras, showing coverage cones, the Pickup Lay-by camera outage, and timeline playback.',
    voiceCommentary:
      'Stage 4, C C T V Camera Discovery. Instead of searching streets manually, Inspector Vikram Rao uses the map to discover twenty cameras along the eastbound corridor, identifies a scheduled battery outage at the pickup lay-by camera, and sends preservation requests.',
  },
  {
    id: 'cctv-intelligence',
    label: '5. Video Footage Review',
    shortLabel: 'Video Review',
    icon: Cctv,
    badge: 'Stage 5',
    plainExplanation: 'Stage 5: Inspects received video feeds—logging a white compact SUV at 27th Main Signal (19:02) and East Link Flyover (19:18).',
    voiceCommentary:
      'Stage 5, C C T V Footage Review. Reviewing the received video containers, the 27th Main Signal camera shows a white compact S U V moving east at 7:02 PM, and the East Link Flyover camera shows a visually similar white S U V on the ramp at 7:18 PM.',
  },
  {
    id: 'vehicle-intelligence',
    label: '6. Vehicle Intelligence',
    shortLabel: 'Vehicles',
    icon: Car,
    badge: 'Stage 6',
    plainExplanation: 'Stage 6: Compares 8 corridor vehicles side-by-side without inventing movement across the 16-minute gap, and rules out Naveen Kumar’s cab.',
    voiceCommentary:
      'Stage 6, Vehicle Intelligence. We compare the 7:02 PM and 7:18 PM white S U V sightings while highlighting the sixteen minute gap that needs verification. Meanwhile, Naveen Kumar’s airport cab is ruled out because the southern camera proves it turned toward Hosur Road.',
  },
  {
    id: 'ai-engine',
    label: '7. AI Leads Review',
    shortLabel: 'AI Leads',
    icon: BrainCircuit,
    badge: 'Stage 7',
    plainExplanation: 'Stage 7: Shortlists 6 explainable leads for Inspector Vikram Rao & ACP Meera Nair with supporting and contradictory evidence. Zero guilt scores.',
    voiceCommentary:
      'Stage 7, A I Investigation Engine. The A I never assigns a guilt score. Instead, it organizes six leads for Inspector Vikram Rao and A C P Meera Nair, showing supporting evidence alongside contradictory evidence and innocent explanations.',
  },
  {
    id: 'reports',
    label: '8. Timeline & PDF Report',
    shortLabel: 'Reports',
    icon: FileText,
    badge: 'Stage 8',
    plainExplanation: 'Stage 8: Unified chronological timeline and 15-section Investigation Report for the Aarav Sharma case with one-click PDF export.',
    voiceCommentary:
      'Stage 8, Unified Timeline and Investigation Report. All verified facts, observations, and unverified leads for the Aarav Sharma investigation are consolidated into a traceable fifteen section dossier ready for P D F export.',
  },
  {
    id: 'relationship-explorer',
    label: 'Relationship Graph',
    shortLabel: 'Graph',
    icon: Share2,
    plainExplanation: 'Visual link diagram separating Verified Relationships (Green), AI Suggestions (Amber), and Rejected Links (Red).',
    voiceCommentary:
      'Relationship Explorer. This interactive graph shows how Aarav Sharma, corridor phones, cameras, witnesses, and vehicles connect—clearly separating verified facts from unverified leads and contradicted hypotheses.',
  },
  {
    id: 'digital-evidence',
    label: 'Digital Evidence Vault',
    shortLabel: 'Vault',
    icon: FileLock2,
    plainExplanation: 'Cryptographic SHA-256 evidence repository preserving original files untouched and logging every chain-of-custody event.',
    voiceCommentary:
      'Digital Evidence Vault. Every uploaded file is hashed in the browser. Original files are locked in an immutable vault by Doctor Priya Krishnan while investigators work on derived copies.',
  },
  {
    id: 'collaboration',
    label: 'Agency Collaboration',
    shortLabel: 'Agency',
    icon: Users,
    plainExplanation: 'Role-based approval queue between Inspector Vikram Rao, ACP Meera Nair, Dr. Priya Krishnan, and Arjun Hegde.',
    voiceCommentary:
      'Agency Collaboration. Switch between Inspector Vikram Rao, A C P Meera Nair, Doctor Priya Krishnan, and System Administrator Arjun Hegde to test supervisory approvals and forensic verification tasks.',
  },
  {
    id: 'admin-audit',
    label: 'Audit & Roadmap',
    shortLabel: 'Audit Log',
    icon: ShieldCheck,
    plainExplanation: 'Live tamper-evident session audit log, Simulated vs. Production matrix, and Sovereign Deployment Roadmap.',
    voiceCommentary:
      'Administration and Audit. Every click and review decision in this demo is logged in real time, alongside the architectural roadmap for sovereign government deployment.',
  },
];

const ROLES: UserRole[] = [
  'Investigator',
  'Senior Officer',
  'Forensic Officer',
  'System Administrator',
];

const ROLE_PROFILES: Record<UserRole, { name: string; badgeId: string; unit: string }> = {
  Investigator: { name: 'Inspector Vikram Rao', badgeId: 'INV-BLR-01', unit: 'Special Investigation Team (Demo)' },
  'Senior Officer': { name: 'ACP Meera Nair', badgeId: 'SUP-BLR-04', unit: 'East Division Command (Demo)' },
  'Forensic Officer': { name: 'Dr. Priya Krishnan', badgeId: 'DFIR-BLR-02', unit: 'Digital Evidence Lab (Demo)' },
  'System Administrator': { name: 'Arjun Hegde (SysAdmin)', badgeId: 'ADM-SNT-01', unit: 'Platform Governance Cell' },
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeModule,
    setActiveModule,
    currentRole,
    setCurrentRole,
    isExecutiveFocusMode,
    setIsExecutiveFocusMode,
    isAudioEnabled,
    setIsAudioEnabled,
    isSpeaking,
    stopSpeaking,
    cases,
    devices,
    cameras,
    vehicles,
    leads,
    evidenceItems,
    setSelectedCaseId,
    setSelectedDeviceId,
    setSelectedCameraId,
    setSelectedVehicleId,
    setSelectedLeadId,
    isGuidedActive,
    startGuidedInvestigation,
    isPresentationMode,
    togglePresentationMode,
    resetDemoData,
    toasts,
    dismissToast,
  } = useSentinel();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentNavMeta = NAV_ITEMS.find((n) => n.id === activeModule) || NAV_ITEMS[0];

  const speakCurrentPageGuide = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentNavMeta.voiceCommentary);
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  // Instant Global Search across all synthetic entities
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      module: ModuleId;
      onSelect: () => void;
    }> = [];

    cases.forEach((c) => {
      if (c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.incidentLocation.toLowerCase().includes(q)) {
        results.push({
          id: c.id,
          title: `${c.id}: ${c.title}`,
          subtitle: c.incidentLocation,
          category: 'Case',
          module: 'cases',
          onSelect: () => {
            setSelectedCaseId(c.id);
            setActiveModule('cases');
          },
        });
      }
    });

    devices.forEach((d) => {
      if (d.id.toLowerCase().includes(q) || d.label.toLowerCase().includes(q) || d.ownerNote.toLowerCase().includes(q)) {
        results.push({
          id: d.id,
          title: d.label,
          subtitle: `${d.relevanceStatus} • ${d.sectorIds.join(', ')}`,
          category: 'Device',
          module: 'mobile-intelligence',
          onSelect: () => {
            setSelectedDeviceId(d.id);
            setActiveModule('mobile-intelligence');
          },
        });
      }
    });

    cameras.forEach((cam) => {
      if (cam.id.toLowerCase().includes(q) || cam.name.toLowerCase().includes(q) || cam.locationName.toLowerCase().includes(q)) {
        results.push({
          id: cam.id,
          title: `${cam.id} — ${cam.name}`,
          subtitle: `${cam.footageStatus} • ${cam.locationName}`,
          category: 'CCTV Camera',
          module: 'location-intelligence',
          onSelect: () => {
            setSelectedCameraId(cam.id);
            setActiveModule('location-intelligence');
          },
        });
      }
    });

    vehicles.forEach((v) => {
      if (v.id.toLowerCase().includes(q) || v.label.toLowerCase().includes(q) || v.syntheticRegObservation.toLowerCase().includes(q)) {
        results.push({
          id: v.id,
          title: v.label,
          subtitle: `${v.syntheticRegObservation} • ${v.verificationStatus}`,
          category: 'Vehicle',
          module: 'vehicle-intelligence',
          onSelect: () => {
            setSelectedVehicleId(v.id);
            setActiveModule('vehicle-intelligence');
          },
        });
      }
    });

    leads.forEach((l) => {
      if (l.id.toLowerCase().includes(q) || l.title.toLowerCase().includes(q) || l.observationSummary.toLowerCase().includes(q)) {
        results.push({
          id: l.id,
          title: `${l.id}: ${l.title}`,
          subtitle: l.reviewStatus,
          category: 'AI Lead',
          module: 'ai-engine',
          onSelect: () => {
            setSelectedLeadId(l.id);
            setActiveModule('ai-engine');
          },
        });
      }
    });

    evidenceItems.forEach((e) => {
      if (e.id.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) || e.originalFilename.toLowerCase().includes(q)) {
        results.push({
          id: e.id,
          title: `${e.id}: ${e.title}`,
          subtitle: `SHA-256: ${e.sha256Hash.slice(0, 16)}...`,
          category: 'Digital Evidence',
          module: 'digital-evidence',
          onSelect: () => {
            setActiveModule('digital-evidence');
          },
        });
      }
    });

    return results.slice(0, 10);
  }, [searchQuery, cases, devices, cameras, vehicles, leads, evidenceItems, setSelectedCaseId, setActiveModule, setSelectedDeviceId, setSelectedCameraId, setSelectedVehicleId, setSelectedLeadId]);

  const activeProfile = ROLE_PROFILES[currentRole];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* MANDATORY PERSISTENT SYNTHETIC DATA BANNER */}
      <div className="bg-[#0D1829] border-b border-amber-500/30 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs z-40">
        <div className="flex items-center gap-2 font-mono font-semibold text-amber-300 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA ONLY</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400 font-mono">
          <span>Active Scenario: CASE-SNT-2026-0042 (Fictional Bengaluru Zone)</span>
          <span>•</span>
          <span className="text-sky-300">🔊 Voice Audio Commentary & Simplified Briefing Mode Available</span>
        </div>
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="bg-[#0F1624] border-b border-[#22314E] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveModule('command-centre')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-teal-500/20 border border-sky-400/40 flex items-center justify-center shadow-inner group-hover:border-sky-400 transition">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider text-white">
                  PROJECT SENTINEL
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  v1.0 GOV-DEMO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Connect Evidence. Discover Relationships. Accelerate Investigations.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="relative flex-1 max-w-sm mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              placeholder="Search DEV-004, CAM-014, VEH-001, LEAD-001..."
              className="w-full bg-[#090D16] border border-[#22314E] focus:border-sky-400 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-[#141D2F] border border-sky-500/40 rounded-lg shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">
                  No synthetic records matching “{searchQuery}”
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={`${item.category}-${item.id}`}
                    onMouseDown={() => {
                      item.onSelect();
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-sky-500/10 border-b border-slate-800/80 last:border-none flex items-center justify-between gap-2 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 shrink-0">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: Voice-Guided Demo Button, Simplified View Toggle, Role Selector, Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => startGuidedInvestigation(false, true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/15 transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>START VOICE-GUIDED DEMO</span>
          </button>

          {/* Simplified / Executive View Toggle */}
          <button
            onClick={() => setIsExecutiveFocusMode(!isExecutiveFocusMode)}
            title="Toggle between Simplified Executive View and Full Analyst View"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isExecutiveFocusMode
                ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                : 'bg-[#141D2F] border-[#22314E] text-slate-300 hover:border-sky-400/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">
              {isExecutiveFocusMode ? 'Simplified View' : 'Full View'}
            </span>
          </button>

          <button
            onClick={togglePresentationMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              isPresentationMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-[#141D2F] border-[#22314E] text-slate-200 hover:border-sky-400/50'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden 2xl:inline">Presentation Mode</span>
          </button>

          {/* Role Selector */}
          <div className="flex items-center bg-[#090D16] border border-[#22314E] rounded-lg px-2 py-1 gap-2">
            <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <select
              aria-label="Select Simulated User Role"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-sky-300 outline-none cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#0F1624] text-slate-100">
                  {ROLE_PROFILES[r].name} ({r})
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((s) => !s)}
              title="System Alerts & Notifications"
              className="relative p-2 rounded-lg bg-[#141D2F] border border-[#22314E] hover:border-sky-500/40 text-slate-300 hover:text-white transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                4
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#141D2F] border border-[#22314E] rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="text-xs font-bold text-white">Investigation Alerts (Demo)</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => {
                      setActiveModule('ai-engine');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15"
                  >
                    <div className="font-semibold text-amber-300">6 Candidate AI Leads Awaiting Review</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      LEAD-001 & LEAD-002 flagged for priority investigator verification.
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setActiveModule('location-intelligence');
                      setSelectedCameraId('CAM-008');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded bg-rose-500/10 border border-rose-500/30 cursor-pointer hover:bg-rose-500/15"
                  >
                    <div className="font-semibold text-rose-300">CAM-008 Coverage Gap Identified</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Smart Pole 08 offline 18:15–19:30 due to UPS feeder maintenance.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Demo Data to Baseline"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141D2F] border border-[#22314E] hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* GUIDED PRESENTATION OVERLAY BAR (Visible when Guided Tour or Presentation Mode is active) */}
      <GuidedPresentationBar />

      {/* PERSISTENT PLAIN-ENGLISH SCREEN GUIDE & AUDIO EXPLAINER (When browsing outside Guided Tour) */}
      {!isGuidedActive && !isPresentationMode && (
        <div className="bg-[#0B1424] border-b border-sky-500/30 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-[11px]">
              SCREEN GUIDE
            </span>
            <span className="text-slate-200 font-medium">
              {currentNavMeta.plainExplanation}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={speakCurrentPageGuide}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 font-semibold text-xs transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <span>🔊 Listen to Screen Explanation</span>
            </button>
            <button
              onClick={stopSpeaking}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px]"
              title="Stop Voice"
            >
              Stop Audio
            </button>
          </div>
        </div>
      )}

      {/* MAIN BODY: LEFT SIDEBAR + WORKSPACE CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        {!isPresentationMode && (
          <aside
            className={`${
              sidebarCollapsed ? 'w-16' : 'w-64'
            } bg-[#0F1624] border-r border-[#22314E] flex flex-col justify-between transition-all duration-200 shrink-0 select-none`}
          >
            <div className="p-2 space-y-1 overflow-y-auto">
              <div className="flex items-center justify-between px-2 py-1.5">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    8-Stage Flow & Tools
                  </span>
                )}
                <button
                  onClick={() => setSidebarCollapsed((c) => !c)}
                  title={sidebarCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white ml-auto"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              </div>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    title={item.label}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500/20 to-teal-500/10 text-sky-300 border border-sky-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#141D2F] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-sky-400' : 'text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          isActive
                            ? 'bg-sky-500/30 text-sky-200 font-bold'
                            : 'bg-slate-800/90 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Safeguard Status */}
            {!sidebarCollapsed && (
              <div className="p-3 m-2 rounded-lg bg-[#090D16] border border-[#22314E] text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Investigative Safeguards</span>
                </div>
                <p className="text-slate-400 leading-snug text-[10px]">
                  Human-in-the-loop enforced. No automated guilt scoring, facial recognition, or live tracking.
                </p>
                <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Badge: {activeProfile.badgeId}</span>
                  <span className="text-emerald-400">● Audit Active</span>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Quick Module Bar when in Presentation Mode */}
        {isPresentationMode && (
          <div className="bg-[#0F1624] border-r border-[#22314E] w-14 flex flex-col items-center py-3 gap-2 shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  title={item.label}
                  className={`p-2.5 rounded-lg transition ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}

        {/* Active Module Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-[1920px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base mb-2">
              <RotateCcw className="w-5 h-5" />
              <span>Reset Demonstration Environment?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              This will restore all synthetic cases, CCTV footage requests, extracted video observations, vehicle comparisons, and AI investigative lead statuses back to the initial baseline for{' '}
              <span className="font-mono text-sky-300">CASE-SNT-2026-0042</span>.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
              >
                Confirm Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded-lg border shadow-xl flex items-start gap-2.5 backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-[#0D211D]/95 border-emerald-500/50 text-emerald-100'
                : t.type === 'warning'
                ? 'bg-[#261B0D]/95 border-amber-500/50 text-amber-100'
                : 'bg-[#0F1B2E]/95 border-sky-500/50 text-sky-100'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : t.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold">{t.title}</div>
              <div className="text-[11px] opacity-90 leading-snug mt-0.5">{t.message}</div>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
