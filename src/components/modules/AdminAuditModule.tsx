"use client";

import React, { useState } from 'react';
import {
  ShieldCheck,
  History,
  RotateCcw,
  Server,
  Lock,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Layers,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';

const SIMULATED_VS_PRODUCTION = [
  {
    capability: 'Telecom / Cell-Sector Records',
    simulatedNow: 'Pre-seeded synthetic CSV records (DEV-001 to DEV-030) with approximate sector radii.',
    futureProduction: 'Authorised statutory nodal gateway intake (signed lawful interception / Section 94 BNSS orders) with automated digital signature verification.',
  },
  {
    capability: 'CCTV Registry & Footage Intake',
    simulatedNow: '20 fictional Bengaluru corridor cameras with illustrative synthetic canvas feeds & simulated custodian status updates.',
    futureProduction: 'Municipal SafeCity GIS registry integration + secure custodian upload portal with hardware-backed SHA-256/SHA-512 intake receipts.',
  },
  {
    capability: 'Vehicle & ANPR Observations',
    simulatedNow: '8 synthetic vehicle records (KA-00-SYN-...) with manual investigator comparison controls.',
    futureProduction: 'Authorised Traffic Command ANPR log ingestion with strict visual confirmation workflows.',
  },
  {
    capability: 'AI Investigation Engine',
    simulatedNow: 'Transparent, deterministic rule & scenario engine correlating synthetic records with explicit limitations.',
    futureProduction: 'On-premise air-gapped analytical models governed by mandatory human-in-the-loop sign-off, bias auditing, and zero guilt-scoring policies.',
  },
  {
    capability: 'Authentication & Role Access',
    simulatedNow: 'Instant one-click role switcher (Investigator, Senior Officer, Forensic Officer, SysAdmin) for demonstration.',
    futureProduction: 'Hardware MFA (PKI Smart Card / FIDO2), strict case-level RBAC/ABAC, and cryptographic WORM (Write-Once-Read-Many) audit logs.',
  },
];

const PRODUCTION_ROADMAP_REQUIREMENTS = [
  {
    title: '1. Applicable Legal Authorisation & Statutory Compliance',
    desc: 'Every external record request and ingestion workflow must require a verified statutory order reference, judicial/supervisory warrant, or nodal authorisation number.',
  },
  {
    title: '2. Agency Approvals & Inter-Departmental Governance',
    desc: 'Formal MoUs and SOPs between State Police Investigation Units, Forensic Science Laboratories (FSL), and Smart City command centres.',
  },
  {
    title: '3. Data Protection & Privacy Impact Assessment',
    desc: 'Strict data minimisation, retention expiry enforcement for non-relevant background records, and compliance with national data protection frameworks.',
  },
  {
    title: '4. Role-Based & Case-Level Access Control (RBAC / ABAC)',
    desc: 'Investigators may only access cases explicitly assigned to their unit; cross-case queries require logged supervisory approval.',
  },
  {
    title: '5. End-to-End Encryption & Immutable Evidence Storage',
    desc: 'TLS 1.3 in transit, AES-256-GCM at rest, and WORM object storage ensuring original evidence files can never be modified or overwritten.',
  },
  {
    title: '6. Tamper-Evident Cryptographic Audit Logs',
    desc: 'Append-only hash-chained audit ledger recording every view, query, export, lead review, and permission change.',
  },
  {
    title: '7. Independent Security Testing (STQC / CERT-In)',
    desc: 'Comprehensive VAPT, source-code security audit, and air-gapped sovereign cloud / state data centre deployment certification.',
  },
  {
    title: '8. AI Governance & Mandatory Human Oversight',
    desc: 'Strict prohibition of automated guilt scoring, biometric mass surveillance, or unreviewed suspect classification.',
  },
];

export const AdminAuditModule: React.FC = () => {
  const { auditLogs, resetDemoData, currentRole, setCurrentRole } = useSentinel();
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(
    (log) => moduleFilter === 'ALL' || log.module === moduleFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Part 12 & 16 • Administration, Tamper-Evident Audit Log & Production Roadmap</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Platform Governance, Live Audit Trail & Sovereign Production Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Records every demonstration action in real time and documents the transition path from synthetic demonstration to authorised government deployment.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs shrink-0 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data to Baseline</span>
        </button>
      </div>

      {/* DEMO CREDENTIALS & SYSTEM HEALTH BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#141D2F] border border-[#22314E] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase font-bold">
            <KeyRound className="w-4 h-4" />
            <span>Demonstration User Profiles & Instant Access Credentials</span>
          </div>
          <p className="text-xs text-slate-400">
            No login password is required in the live government demonstration environment; presenters can switch between these four pre-configured officer profiles at any time from the top navigation bar or below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {[
              { role: 'Investigator' as const, user: 'Inspector Vikram Rao', id: 'INV-BLR-01', desc: 'Case Lead — Full workspace, timeline & lead review' },
              { role: 'Senior Officer' as const, user: 'ACP Meera Nair', id: 'SUP-BLR-04', desc: 'Supervisory approvals & audit oversight' },
              { role: 'Forensic Officer' as const, user: 'Dr. Priya Krishnan', id: 'DFIR-BLR-02', desc: 'SHA-256 verification & chain of custody' },
              { role: 'System Administrator' as const, user: 'Arjun Hegde (SysAdmin)', id: 'ADM-SNT-01', desc: 'System health, audit logs & scenario reset' },
            ].map((cred) => (
              <div
                key={cred.id}
                onClick={() => setCurrentRole(cred.role)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  currentRole === cred.role
                    ? 'bg-sky-950/60 border-sky-400'
                    : 'bg-[#090D16] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-white">{cred.role}</span>
                  <span className="text-[10px] text-sky-300">{cred.id}</span>
                </div>
                <div className="text-teal-300 font-medium mt-0.5">{cred.user}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{cred.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health & Safeguards Status */}
        <div className="lg:col-span-5 bg-[#141D2F] border border-[#22314E] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold">
            <Server className="w-4 h-4" />
            <span>Demonstration Environment Health & Safeguards</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Synthetic Dataset Integrity', val: '100% Consistent (CASE-SNT-2026-0042)' },
              { label: 'External Telecom / Govt Connections', val: '0 Connected (Air-Gapped Demo Mode)' },
              { label: 'Facial Recognition / Biometrics', val: 'Disabled by Policy' },
              { label: 'Automated Guilt / Suspect Scoring', val: 'Disabled by Policy' },
              { label: 'Browser WebCrypto SHA-256 Engine', val: 'Online & Verified' },
              { label: 'Deterministic AI Scenario Engine', val: 'Online (6 Candidate Leads)' },
            ].map((s) => (
              <div
                key={s.label}
                className="p-2.5 rounded bg-[#090D16] border border-slate-800 flex items-center justify-between"
              >
                <span className="text-slate-300">{s.label}</span>
                <span className="font-mono text-emerald-400 font-semibold">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIVE AUDIT LOG TABLE */}
      <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-sky-400" />
              <span>Tamper-Evident Demonstration Audit Log ({filteredLogs.length} Entries)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Every action performed during this live session is automatically recorded below with actor, role, timestamp, and target reference.
            </p>
          </div>

          <select
            aria-label="Filter Audit Log by Module"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-1.5 text-xs text-slate-200"
          >
            <option value="ALL">All Modules</option>
            <option value="Case Management">Case Management</option>
            <option value="Evidence Ingestion">Evidence Ingestion</option>
            <option value="Mobile Intelligence">Mobile Intelligence</option>
            <option value="CCTV Intelligence">CCTV Intelligence</option>
            <option value="CCTV Footage Review">CCTV Footage Review</option>
            <option value="Vehicle Intelligence">Vehicle Intelligence</option>
            <option value="AI Investigation Engine">AI Investigation Engine</option>
            <option value="Digital Evidence">Digital Evidence</option>
            <option value="Investigation Reports">Investigation Reports</option>
            <option value="Role Management">Role Management</option>
          </select>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-2 px-3">Audit ID</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Actor & Role</th>
                <th className="py-2 px-3">Module & Action</th>
                <th className="py-2 px-3">Target Ref</th>
                <th className="py-2 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#090D16]/60">
                  <td className="py-2.5 px-3 font-mono font-bold text-sky-300">{log.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white">{log.actor}</div>
                    <div className="text-[10px] font-mono text-teal-300">{log.role}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-mono text-amber-300 font-bold text-[11px]">{log.action}</div>
                    <div className="text-[11px] text-slate-400">{log.module}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-sky-200">{log.targetRef}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELIVERABLE 25: FEATURES SIMULATED VS FUTURE AUTHORISED INTEGRATIONS */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Features Simulated in Demo vs. Future Authorised Government Integrations</span>
          </h2>
          <p className="text-xs text-slate-400">
            Transparent architectural boundary between this self-contained synthetic demonstration and a future production deployment.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Platform Capability</th>
                <th className="py-2.5 px-3">Simulated in Current Demo Environment</th>
                <th className="py-2.5 px-3">Future Authorised Production Integration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {SIMULATED_VS_PRODUCTION.map((row) => (
                <tr key={row.capability} className="hover:bg-[#090D16]/60">
                  <td className="py-3 px-3 font-bold text-sky-300 whitespace-nowrap">{row.capability}</td>
                  <td className="py-3 px-3 text-slate-300">{row.simulatedNow}</td>
                  <td className="py-3 px-3 text-emerald-300">{row.futureProduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELIVERABLE 26: PRODUCTION ROADMAP & MANDATORY GOVERNANCE SAFEGUARDS */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Recommended Sovereign Production Roadmap & Legal/Technical Safeguards</span>
          </h2>
          <p className="text-xs text-slate-400">
            Prerequisites required before transitioning Project Sentinel from a technology partnership demonstration to an operational law-enforcement environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {PRODUCTION_ROADMAP_REQUIREMENTS.map((req) => (
            <div
              key={req.title}
              className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5"
            >
              <div className="font-bold text-sky-300">{req.title}</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{req.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


