"use client";

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  CheckCircle2,
  Clock,
  Plus,
  ShieldAlert,
  ArrowUpRight,
  FileCheck,
} from 'lucide-react';
import { useChakravyuh } from '@/context/ChakravyuhContext';
import { UserRole, CollaborationTask } from '@/types/chakravyuh';

const ROLE_CAPABILITIES: Array<{
  role: UserRole;
  badge: string;
  actor: string;
  permissions: string[];
}> = [
  {
    role: 'Investigator',
    badge: 'INV-BLR-01',
    actor: 'Inspector Vikram Rao',
    permissions: [
      'Access assigned cases (CASE-CKV-2026-0042)',
      'Review multi-source evidence & CCTV segments',
      'Review candidate AI leads & record verification notes',
      'Extract timeline observations & submit approval requests',
    ],
  },
  {
    role: 'Senior Officer',
    badge: 'SUP-BLR-04',
    actor: 'ACP Meera Nair',
    permissions: [
      'Monitor division-wide investigation progress',
      'Review & sign off on Priority-1 investigative leads',
      'Approve or return emergency CCTV preservation orders',
      'Inspect case-level supervisory audit history',
    ],
  },
  {
    role: 'Forensic Officer',
    badge: 'DFIR-BLR-02',
    actor: 'Dr. Priya Krishnan',
    permissions: [
      'Receive digital evidence containers into immutable vault',
      'Execute & re-verify cryptographic SHA-256 checksums',
      'Record optical/metadata forensic examination findings',
      'Maintain unbroken chain-of-custody logs',
    ],
  },
  {
    role: 'System Administrator',
    badge: 'ADM-CKV-01',
    actor: 'Arjun Hegde (SysAdmin)',
    permissions: [
      'Manage demonstration user profiles & role assignments',
      'Configure role-based access matrices (Demo Simulation)',
      'Inspect platform-wide audit logs & ingestion pipelines',
      'Review system health & reset demonstration scenarios',
    ],
  },
];

export const CollaborationModule: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    collaborationTasks,
    updateCollaborationTaskStatus,
    createCollaborationTask,
    selectedCaseId,
  } = useChakravyuh();

  const [newTaskTitle, setNewTaskTitle] = useState(
    'Request Nodal Provenance Check for Field Handset DEV-004'
  );
  const [newTaskType, setNewTaskType] = useState<CollaborationTask['requestType']>(
    'Lead Verification Sign-off'
  );
  const [newTaskTargetRole, setNewTaskTargetRole] = useState<UserRole>('Senior Officer');
  const [newTaskPriority, setNewTaskPriority] = useState<CollaborationTask['priority']>('High');
  const [newTaskNotes, setNewTaskNotes] = useState(
    'Requires supervisory authorisation under AUTH-BLR-SYN-2026-8841 before contacting telecom nodal.'
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createCollaborationTask({
      title: newTaskTitle,
      caseId: selectedCaseId,
      requestType: newTaskType,
      requestedBy: `${currentRole}`,
      assignedRole: newTaskTargetRole,
      priority: newTaskPriority,
      status: 'Pending Approval',
      notes: newTaskNotes,
    });
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <Users className="w-4 h-4" />
            <span>Part 9 Capability • Agency Collaboration & Simulated Role-Based Workflows</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Inter-Unit Task Routing, Supervisory Approvals & Role Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrates coordinated workflows across Investigating Officers, Supervising ACPs, Digital Forensics Specialists, and System Administrators.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-mono shrink-0">
          DEMONSTRATION FUNCTIONALITY — NOT PRODUCTION-CERTIFIED SECURITY
        </div>
      </div>

      {/* 4 SIMULATED ROLE CARDS WITH INSTANT ROLE SWITCHING */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {ROLE_CAPABILITIES.map((rc) => {
          const isActive = currentRole === rc.role;
          return (
            <div
              key={rc.role}
              onClick={() => setCurrentRole(rc.role)}
              className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                isActive
                  ? 'bg-[#192841] border-sky-400 shadow-xl'
                  : 'bg-[#141D2F] border-[#22314E] hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#090D16] text-sky-300 border border-slate-800">
                    {rc.badge}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ACTIVE ROLE
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <span>{rc.role}</span>
                </h3>
                <div className="text-xs text-slate-400 font-mono mb-3">{rc.actor}</div>

                <ul className="space-y-1.5 text-xs text-slate-300">
                  {rc.permissions.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentRole(rc.role);
                }}
                className={`mt-4 w-full py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-[#090D16] hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {isActive ? `Currently Viewing as ${rc.role}` : `Switch to ${rc.role}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* INTER-UNIT APPROVAL WORKFLOW QUEUE + NEW REQUEST FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active Approval & Collaboration Queue */}
        <div className="lg:col-span-7 bg-[#141D2F] border border-[#22314E] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Simulated Inter-Agency & Supervisory Approval Queue ({collaborationTasks.length})
              </h2>
              <p className="text-xs text-slate-400">
                Active Role: <b className="text-sky-300">{currentRole}</b>. Click any status action to simulate approval or completion.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {collaborationTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-[#090D16] border border-[#22314E] space-y-2.5 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-300">{task.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {task.requestType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        task.priority === 'Urgent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[11px] px-2.5 py-0.5 rounded font-bold ${
                      task.status === 'Approved' || task.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : task.status === 'Clarification Needed'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="text-sm font-bold text-white">{task.title}</div>
                <p className="text-slate-300 leading-relaxed">{task.notes}</p>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-slate-400">
                    Requested by: <span className="text-slate-200">{task.requestedBy}</span> → Assigned:{' '}
                    <span className="text-teal-300">{task.assignedRole}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCollaborationTaskStatus(task.id, 'Approved')}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold text-[11px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateCollaborationTaskStatus(task.id, 'Completed')}
                      className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-semibold text-[11px]"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateCollaborationTaskStatus(task.id, 'Clarification Needed')}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-[11px]"
                    >
                      Request Clarification
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Submit New Inter-Unit Approval / Forensic Request */}
        <div className="lg:col-span-5 bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 space-y-4 h-fit">
          <div className="border-b border-slate-800 pb-3">
            <div className="text-[10px] font-mono text-sky-400 uppercase">
              SUBMIT INTER-UNIT WORKFLOW REQUEST
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Route Request to Senior Officer or Forensic Lab
            </h3>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">REQUEST SUBJECT</label>
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">WORKFLOW TYPE</label>
                <select
                  aria-label="Workflow Request Type"
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value as CollaborationTask['requestType'])}
                  className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                >
                  <option value="CCTV Preservation Order">CCTV Preservation Order</option>
                  <option value="Forensic Hash Verification">Forensic Hash Verification</option>
                  <option value="Lead Verification Sign-off">Lead Verification Sign-off</option>
                  <option value="Cross-Unit Query Approval">Cross-Unit Query Approval</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">ASSIGN TO ROLE</label>
                <select
                  aria-label="Assign to Role"
                  value={newTaskTargetRole}
                  onChange={(e) => setNewTaskTargetRole(e.target.value as UserRole)}
                  className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-2.5 py-2 text-sky-300 font-semibold"
                >
                  <option value="Senior Officer">Senior Officer</option>
                  <option value="Forensic Officer">Forensic Officer</option>
                  <option value="Investigator">Investigator</option>
                  <option value="System Administrator">System Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-400 mb-1">JUSTIFICATION & PROVENANCE NOTES</label>
              <textarea
                rows={3}
                value={newTaskNotes}
                onChange={(e) => setNewTaskNotes(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Workflow Request to Queue</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


