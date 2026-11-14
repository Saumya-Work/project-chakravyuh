"use client";

import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  FileText,
  Clock,
  Filter,
  Download,
  Printer,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';
import { TimelineEvent } from '@/types/sentinel';

export const ReportsModule: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    timelineEvents,
    devices,
    cameras,
    cctvRequests,
    vehicles,
    leads,
    evidenceItems,
    auditLogs,
    logAudit,
    triggerToast,
  } = useSentinel();

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Timeline Filter State
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string>('TLE-004');
  const [showReportPreview, setShowReportPreview] = useState<boolean>(true);

  const filteredEvents = useMemo(() => {
    return timelineEvents.filter((ev) => {
      if (sourceFilter !== 'ALL' && ev.sourceType !== sourceFilter) return false;
      if (categoryFilter !== 'ALL' && ev.categoryType !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && ev.verificationStatus !== statusFilter) return false;
      if (entityFilter !== 'ALL' && !ev.entityIds.includes(entityFilter)) return false;
      if (
        locationSearch.trim() &&
        !ev.locationName.toLowerCase().includes(locationSearch.toLowerCase()) &&
        !ev.title.toLowerCase().includes(locationSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [timelineEvents, sourceFilter, categoryFilter, statusFilter, entityFilter, locationSearch]);

  const selectedEvent: TimelineEvent =
    timelineEvents.find((e) => e.id === selectedEventId) || timelineEvents[0];

  // Real PDF Export using jsPDF
  const handleExportPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 45;

    const addLine = (text: string, size = 9.5, bold = false, color: [number, number, number] = [20, 30, 45]) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      lines.forEach((line: string) => {
        if (y > 780) {
          doc.addPage();
          y = 45;
        }
        doc.text(line, margin, y);
        y += size + 4;
      });
    };

    addLine('DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA ONLY', 9, true, [180, 80, 0]);
    addLine('PROJECT CHAKRAVYUH (प्रोजेक्ट चक्रव्यूह) — TRACEABLE INVESTIGATION REPORT', 15, true, [10, 25, 47]);
    addLine(`Case Reference: ${currentCase.id} | Category: ${currentCase.category}`, 10, true);
    addLine(`Incident Date: ${currentCase.incidentDate} | Authorisation: ${currentCase.authorisationRef}`, 9.5);
    y += 6;

    addLine('1. CASE OVERVIEW (VERIFIED FACTS)', 11, true, [14, 116, 144]);
    addLine(currentCase.summary);
    y += 4;

    addLine('2. INCIDENT CHRONOLOGY & UNIFIED TIMELINE SUMMARY', 11, true, [14, 116, 144]);
    timelineEvents.slice(0, 12).forEach((ev) => {
      addLine(`[${ev.timestamp} IST] (${ev.categoryType}) ${ev.title} — Ref: ${ev.evidenceRef}`, 9);
    });
    y += 4;

    addLine('3. EVIDENCE SOURCE SUMMARY & 4. MOBILE INTELLIGENCE ANALYSIS', 11, true, [14, 116, 144]);
    addLine(
      `Total Sealed Evidence Packages: ${evidenceItems.length}. Mobile analysis covered 30 synthetic devices (DEV-001 to DEV-030). DEV-001 lost network registration at 18:48 in Sector 04B. DEV-004 overlapped 4 sectors (requires verification; cell sectors are approximate 450m-800m radii). DEV-007 was cleared by a 18:55 westbound RFID gate log.`
    );
    y += 4;

    addLine('5. CCTV DISCOVERY, 6. VIDEO OBSERVATIONS & 7. VEHICLE OBSERVATIONS', 11, true, [14, 116, 144]);
    addLine(
      `20 corridor cameras discovered. CAM-014 (19:02): White SUV-like vehicle moving east (VEH-001, partial plate KA-01-MX-4??). CAM-019 (19:18): Visually similar white SUV-like vehicle on Domlur–Marathahalli Flyover (Old Airport Road) ramp (VEH-002). CAM-006 (19:25): No relevant observation. Fleet Cab VEH-003 (KA-01-MX-4812) excluded via CAM-015 southbound ANPR at 19:08.`
    );
    y += 4;

    addLine('8. GEOGRAPHIC CORRELATION & 9. AI INVESTIGATIVE LEADS (UNVERIFIED)', 11, true, [14, 116, 144]);
    leads.forEach((l) => {
      addLine(`${l.id} [${l.reviewStatus}]: ${l.title} — ${l.observationSummary}`, 9);
      addLine(`   Limitations: ${l.limitations}`, 8.5, false, [100, 116, 139]);
    });
    y += 4;

    addLine('10. SUPPORTING & CONTRADICTORY EVIDENCE & 11. ALTERNATIVE EXPLANATIONS', 11, true, [14, 116, 144]);
    addLine(
      'Contradictory Records: (a) DEV-007 westbound gate entry at 18:55; (b) VEH-003 southbound ANPR at 19:08; (c) 16-minute transit anomaly between CAM-014 and CAM-019; (d) CAM-008 outage confirmed as pre-scheduled UPS maintenance. Alternative Explanations: Commuter corridor overlap, shared delivery handsets, and distinct white SUVs.'
    );
    y += 4;

    addLine('12. EVIDENCE GAPS & 13. PENDING VERIFICATION ACTIONS', 11, true, [14, 116, 144]);
    addLine(
      'Key Gaps: CAM-008 offline 18:15-19:30; CAM-011 24h loop expired. Pending Verification: Retrieve CAM-005, CAM-007, CAM-016, CAM-017 footage and verify DEV-004 subscriber provenance.'
    );
    y += 4;

    addLine('14. CHAIN-OF-CUSTODY SUMMARY & 15. AUDIT HISTORY', 11, true, [14, 116, 144]);
    evidenceItems.slice(0, 8).forEach((evd) => {
      addLine(`${evd.id} (${evd.originalFilename}) — SHA-256: ${evd.sha256Hash}`, 8.5);
    });

    doc.save(`Project_Sentinel_Report_${currentCase.id}.pdf`);
    logAudit('Investigation Reports', 'REPORT_PDF_EXPORTED', currentCase.id, 'Exported 15-section traceable PDF investigation report.');
    triggerToast('PDF Report Exported', `Downloaded Project_Sentinel_Report_${currentCase.id}.pdf`, 'success');
  };

  const handleDownloadDossierHtml = () => {
    const content = `PROJECT CHAKRAVYUH (प्रोजेक्ट चक्रव्यूह) — TRACEABLE INVESTIGATION DOSSIER
===============================================================
DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA ONLY
Case Reference: ${currentCase.id}
Category: ${currentCase.category}
Incident Date: ${currentCase.incidentDate}
Last Confirmed Sighting: ${currentCase.lastConfirmedSightingTime} IST
Complaint Received: ${currentCase.complaintReceivedTime} IST
Assigned Investigator: ${currentCase.assignedInvestigator}

1. CASE OVERVIEW
${currentCase.summary}

9. AI INVESTIGATIVE LEADS (MARKED UNVERIFIED UNTIL HUMAN REVIEW)
${leads
  .map(
    (l) =>
      `- ${l.id}: ${l.title} [${l.reviewStatus}]\n  Observation: ${l.observationSummary}\n  Alternative Explanations: ${l.alternativeExplanations.join('; ')}\n  Limitations: ${l.limitations}`
  )
  .join('\n\n')}

14. CRYPTOGRAPHIC CHAIN OF CUSTODY (SHA-256)
${evidenceItems.map((e) => `- ${e.id}: ${e.originalFilename} | SHA-256: ${e.sha256Hash}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sentinel_Dossier_${currentCase.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    logAudit('Investigation Reports', 'REPORT_DOWNLOADED', currentCase.id, 'Downloaded structured text dossier.');
    triggerToast('Dossier Downloaded', `Saved Sentinel_Dossier_${currentCase.id}.txt`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141D2F] border border-[#22314E] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase">
            <FileText className="w-4 h-4" />
            <span>Stage 8 Capability • Unified Investigation Timeline & Traceable Report Generation</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Chronological Synthesis & 15-Section Investigation Report
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Project Chakravyuh consolidates the investigation into a traceable report, helping authorised officers understand what is known, what remains uncertain and what needs to be verified.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setShowReportPreview(true);
              triggerToast('Report Generated', '15-section investigation report compiled and ready below.', 'success');
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>GENERATE INVESTIGATION REPORT</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>PDF Export</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#090D16] hover:bg-slate-800 border border-[#22314E] text-slate-200 text-xs font-medium transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadDossierHtml}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#090D16] hover:bg-slate-800 border border-[#22314E] text-sky-300 text-xs font-medium transition"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Download Dossier</span>
          </button>
        </div>
      </div>

      {/* SECTION A: UNIFIED INVESTIGATION TIMELINE WITH 6 FILTERS & PROVENANCE INSPECTOR */}
      <div className="bg-[#141D2F] border border-sky-500/40 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Unified Investigation Timeline ({filteredEvents.length} of {timelineEvents.length} Events)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any timeline event to inspect its underlying evidence reference, source provenance, and methodological limitations.
            </p>
          </div>

          {/* Epistemic Separation Legend */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Facts
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Source Observations
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Contradictory / Exculpatory
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Unverified AI Leads
            </span>
          </div>
        </div>

        {/* Multi-Dimensional Timeline Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          <select
            aria-label="Filter by Evidence Source"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-slate-200"
          >
            <option value="ALL">Evidence Source: All Sources</option>
            <option value="Incident Report">Incident Report</option>
            <option value="Mobile Intelligence">Mobile Intelligence</option>
            <option value="CCTV Observation">CCTV Observation</option>
            <option value="Vehicle Sighting">Vehicle Sighting</option>
            <option value="Witness Statement">Witness Statement</option>
            <option value="Evidence Ingestion">Evidence Ingestion</option>
            <option value="AI Lead Generated">AI Lead Generated</option>
          </select>

          <select
            aria-label="Filter by Event Type Classification"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-slate-200"
          >
            <option value="ALL">Classification: All Types</option>
            <option value="Fact (Verified)">Fact (Verified)</option>
            <option value="Observation (Source Recorded)">Observation (Source Recorded)</option>
            <option value="Contradictory / Exculpatory">Contradictory / Exculpatory</option>
            <option value="Hypothesis / Lead (Unverified)">Hypothesis / Lead (Unverified)</option>
          </select>

          <select
            aria-label="Filter by Entity"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-sky-300 font-mono"
          >
            <option value="ALL">Entity: All Entities</option>
            <option value="DEV-001">DEV-001 (Victim Handset)</option>
            <option value="DEV-004">DEV-004 (Field Handset)</option>
            <option value="DEV-007">DEV-007 (Exculpatory)</option>
            <option value="CAM-001">CAM-001 (Library Gate)</option>
            <option value="CAM-014">CAM-014 (Sony World Signal (Indiranagar–Koramangala))</option>
            <option value="CAM-019">CAM-019 (East Flyover)</option>
            <option value="VEH-001">VEH-001 (White SUV)</option>
            <option value="VEH-002">VEH-002 (Flyover SUV)</option>
            <option value="VEH-003">VEH-003 (Fleet Cab)</option>
          </select>

          <select
            aria-label="Filter by Verification Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-slate-200"
          >
            <option value="ALL">Status: All Verification States</option>
            <option value="Verified">Verified</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Requires Clarification">Requires Clarification</option>
            <option value="Contradicted">Contradicted</option>
            <option value="Unverified AI Lead">Unverified AI Lead</option>
          </select>

          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Filter by location or keyword..."
            className="bg-[#090D16] border border-[#22314E] rounded-lg px-3 py-2 text-white"
          />
        </div>

        {/* Timeline List + Selected Event Provenance Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-2 max-h-[430px] overflow-y-auto pr-1">
            {filteredEvents.map((ev) => {
              const isSelected = ev.id === selectedEvent.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#192841] border-sky-400 shadow-md'
                      : 'bg-[#090D16] border-[#22314E] hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-sky-400">
                        {ev.date} • {ev.timestamp} IST
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {ev.sourceType}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          ev.categoryType === 'Fact (Verified)'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : ev.categoryType === 'Contradictory / Exculpatory'
                            ? 'bg-rose-500/20 text-rose-300'
                            : ev.categoryType === 'Hypothesis / Lead (Unverified)'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-sky-500/20 text-sky-300'
                        }`}
                      >
                        {ev.categoryType}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{ev.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{ev.description}</div>
                  </div>
                  <span className="font-mono text-[11px] text-teal-300 shrink-0">
                    {ev.evidenceRef}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Timeline Event Provenance Panel */}
          <div className="lg:col-span-4 bg-[#090D16] border border-sky-500/40 rounded-xl p-4 space-y-3 h-fit text-xs">
            <div className="border-b border-slate-800 pb-2">
              <div className="text-[10px] font-mono text-sky-400 uppercase">
                TIMELINE EVENT PROVENANCE & SOURCE
              </div>
              <div className="font-mono text-sm font-bold text-white mt-0.5">
                {selectedEvent.timestamp} IST — {selectedEvent.id}
              </div>
            </div>

            <div className="font-bold text-white text-sm">{selectedEvent.title}</div>
            <p className="text-slate-300 leading-relaxed">{selectedEvent.description}</p>

            <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Classification:</span>
                <span className="text-sky-300 font-bold">{selectedEvent.categoryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evidence Ref:</span>
                <span className="text-emerald-300 font-bold">{selectedEvent.evidenceRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provenance:</span>
                <span className="text-slate-200 text-right">{selectedEvent.provenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Authorisation:</span>
                <span className="text-teal-300">{selectedEvent.authorisationRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200 text-right">{selectedEvent.locationName}</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200">
              <b>Methodological Note:</b> {selectedEvent.limitationsNote}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: 15-SECTION STRUCTURED INVESTIGATION REPORT PREVIEW */}
      {showReportPreview && (
        <div className="bg-[#141D2F] border border-[#22314E] rounded-2xl p-6 space-y-6 shadow-2xl print:bg-white print:text-black">
          <div className="border-b border-slate-700 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-amber-300 uppercase">
                DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA ONLY
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                OFFICIAL TRACEABLE INVESTIGATION DOSSIER — {currentCase.id}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generated by Project Chakravyuh • Explicitly Separates Verified Facts, Source Observations, Hypotheses & Unverified AI Leads
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-300">
              <div>Date: {currentCase.incidentDate}</div>
              <div>Investigator: {currentCase.assignedInvestigator}</div>
              <div>Auth Ref: {currentCase.authorisationRef}</div>
            </div>
          </div>

          {/* 15 Structured Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. Case Overview */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">1. Case Overview (Verified Facts)</div>
              <p className="text-slate-200 leading-relaxed">{currentCase.summary}</p>
            </div>

            {/* 2. Incident Chronology */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">2. Incident Chronology</div>
              <p className="text-slate-200 leading-relaxed">
                18:30 IST: Last confirmed visual sighting of Aarav Sharma exiting State Central Library, Indiranagar 100Ft Road (CAM-001). 18:36 IST: Pedestrian passing Apollo Pharmacy (100Ft Road, Indiranagar) (CAM-003). 18:48 IST: Primary handset DEV-001 loses network registration in Sector 04B. 21:15 IST: Formal family complaint registered.
              </p>
            </div>

            {/* 3. Evidence Source Summary */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">3. Evidence Source Summary</div>
              <p className="text-slate-200 leading-relaxed">
                {evidenceItems.length} digital evidence containers ingested and sealed with SHA-256 across 7 authorised streams: Telecom CDR/Tower dumps (EVD-002, EVD-003), CCTV containers (EVD-004 to EVD-008), ANPR/Gate logs (EVD-009, EVD-011), and Witness statements (EVD-010).
              </p>
            </div>

            {/* 4. Mobile Intelligence Analysis */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">4. Mobile Intelligence Analysis</div>
              <p className="text-slate-200 leading-relaxed">
                Examined {devices.length} synthetic device records. 26 routine commuter/resident handsets filtered. Unattributed device DEV-004 registered across Sectors 04A (18:28), 04B (18:44), 02A (19:03), and 09C (19:19). Limitation: Cell sectors represent approximate 450m–800m radii, never exact GPS.
              </p>
            </div>

            {/* 5. CCTV Camera Discovery & Collection Status */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">5. CCTV Discovery & Collection Status</div>
              <p className="text-slate-200 leading-relaxed">
                {cameras.length} cameras mapped across the Kaveri–East Link corridor. {cameras.filter((c) => c.footageStatus === 'Footage received').length} containers received & hashed; {cctvRequests.length} formal preservation requests tracked.
              </p>
            </div>

            {/* 6. Video Observations */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">6. Documented Video Observations</div>
              <p className="text-slate-200 leading-relaxed">
                CAM-001 (18:30): Aarav Sharma exits library. CAM-003 (18:36): Eastbound pedestrian. CAM-014 (19:02): White SUV-like vehicle moving east. CAM-019 (19:18): Visually similar white SUV-like vehicle on East Flyover ramp. CAM-006 (19:25): No relevant observation.
              </p>
            </div>

            {/* 7. Vehicle Observations */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">7. Vehicle Intelligence & Comparison</div>
              <p className="text-slate-200 leading-relaxed">
                {vehicles.length} corridor vehicles analyzed. VEH-001 (CAM-014, KA-01-MX-4??) and VEH-002 (CAM-019, plate obscured) marked as Possibly Related pending intermediate camera checks. Commercial fleet SUV VEH-003 (KA-01-MX-4812) confirmed NOT the same vehicle via CAM-015 southbound ANPR.
              </p>
            </div>

            {/* 8. Geographic Correlation */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">8. Geographic Correlation</div>
              <p className="text-slate-200 leading-relaxed">
                Spatial alignment observed along the West-to-East arterial axis from Kaveri Sector-4 (18:30–18:48) to Sony World Junction (Koramangala–Indiranagar Link) (19:02–19:03) and Domlur–Marathahalli Flyover Ramp (Old Airport Road) (19:18–19:19), without interpolating unverified paths between sightings.
              </p>
            </div>

            {/* 9. AI Investigative Leads */}
            <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-500/30 space-y-1.5">
              <div className="font-mono font-bold text-amber-300 uppercase">9. AI Investigative Leads (Unverified Hypotheses)</div>
              <ul className="space-y-1 text-slate-200">
                {leads.map((l) => (
                  <li key={l.id}>
                    <b>{l.id}</b> ({l.reviewStatus}): {l.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* 10. Supporting & Contradictory Evidence */}
            <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/30 space-y-1.5">
              <div className="font-mono font-bold text-emerald-300 uppercase">10. Supporting & Contradictory Evidence</div>
              <p className="text-slate-200 leading-relaxed">
                Exculpatory & Contradictory Records Preserved: (1) DEV-007 cleared by 18:55 West Domlur RFID gate entry; (2) VEH-003 cleared by 19:08 southbound ANPR; (3) Witness Aditi Rao dark car recollection explained by stationary physician sedan VEH-004; (4) 16-minute transit anomaly between CAM-014 and CAM-019.
              </p>
            </div>

            {/* 11. Alternative Explanations */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-sky-400 uppercase">11. Plausible Alternative Explanations</div>
              <p className="text-slate-200 leading-relaxed">
                DEV-004 sector overlap may reflect an unrelated commuter along a busy arterial road. DEV-001 signal loss at 18:48 may result from battery depletion. VEH-001 and VEH-002 may be two separate white compact SUVs.
              </p>
            </div>

            {/* 12. Evidence Gaps */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-rose-500/30 space-y-1.5">
              <div className="font-mono font-bold text-rose-300 uppercase">12. Documented Evidence Gaps</div>
              <p className="text-slate-200 leading-relaxed">
                (1) CAM-008 (12th Main Service Lane (Indiranagar) Pickup Lay-by) was offline 18:15–19:30 due to pre-scheduled UPS maintenance. (2) CAM-011 24-hour SD card loop expired prior to complaint. (3) 1.1 km stretch between CAM-014 and CAM-019 awaits intermediate camera footage.
              </p>
            </div>

            {/* 13. Pending Verification Actions */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-teal-300 uppercase">13. Pending Verification Actions</div>
              <p className="text-slate-200 leading-relaxed">
                1. Retrieve pending footage from CAM-005, CAM-007, CAM-009, CAM-016, and CAM-017. 2. Verify subscriber provenance for DEV-004 via authorised nodal channel. 3. Conduct follow-up lighting clarification with Witnesses W-01 and W-02.
              </p>
            </div>

            {/* 14. Chain-of-Custody Summary & 15. Audit History */}
            <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
              <div className="font-mono font-bold text-emerald-400 uppercase">14. Chain-of-Custody & 15. Audit History</div>
              <p className="text-slate-200 leading-relaxed">
                All {evidenceItems.length} evidence containers verified with SHA-256 checksums. {auditLogs.length} investigator, forensic, and supervisory actions recorded in the demonstration audit trail.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


