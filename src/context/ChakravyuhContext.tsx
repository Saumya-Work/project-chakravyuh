"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserRole,
  ModuleId,
  CaseRecord,
  DeviceRecord,
  CctvCamera,
  CctvFootageRequest,
  VideoObservation,
  VehicleRecord,
  VehicleVerificationComparison,
  InvestigativeLead,
  TimelineEvent,
  DigitalEvidenceItem,
  GraphNode,
  GraphEdge,
  CollaborationTask,
  AuditLogEntry,
} from '@/types/chakravyuh';
import {
  INITIAL_CASES,
  INITIAL_DEVICES,
  INITIAL_CAMERAS,
  INITIAL_CCTV_REQUESTS,
  INITIAL_VEHICLES,
  INITIAL_LEADS,
  INITIAL_TIMELINE_EVENTS,
  INITIAL_EVIDENCE,
  INITIAL_GRAPH_NODES,
  INITIAL_GRAPH_EDGES,
  INITIAL_COLLABORATION_TASKS,
  INITIAL_AUDIT_LOGS,
  GUIDED_STAGES,
  getGuidedStagesForCase,
} from '@/data/syntheticData';

export type NarrationLanguage = 'en' | 'hi' | 'bilingual';
export type GeminiVoiceName = 'Kore' | 'Puck' | 'Charon' | 'Aoede' | 'Fenrir';
export type TtsEngineStatus = 'gemini-hd' | 'browser-fallback' | 'checking';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface ChakravyuhContextType {
  activeModule: ModuleId;
  setActiveModule: (m: ModuleId) => void;
  currentRole: UserRole;
  setCurrentRole: (r: UserRole) => void;
  // Executive Focus / Simplified Mode to prevent clutter
  isExecutiveFocusMode: boolean;
  setIsExecutiveFocusMode: (v: boolean) => void;
  // Audio Commentary Engine & Language (English / Hindi / Bilingual)
  narrationLanguage: NarrationLanguage;
  setNarrationLanguage: (lang: NarrationLanguage) => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (v: boolean) => void;
  isSpeaking: boolean;
  speechRate: number;
  setSpeechRate: (r: number) => void;
  ttsEngineStatus: TtsEngineStatus;
  geminiVoiceName: GeminiVoiceName;
  setGeminiVoiceName: (v: GeminiVoiceName) => void;
  currentSpokenSentence: string;
  speakStageCommentary: (
    stageIdx?: number,
    langOverride?: NarrationLanguage,
    caseIdOverride?: string
  ) => void;
  speakCustomText: (
    textEn: string,
    textHi: string,
    textHinglish?: string,
    langOverride?: NarrationLanguage
  ) => void;
  stopSpeaking: () => void;
  // Data & Actions
  cases: CaseRecord[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  registerCase: (newCase: Omit<CaseRecord, 'evidenceCount' | 'leadsCount' | 'pendingRequestsCount'>) => void;
  devices: DeviceRecord[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  cameras: CctvCamera[];
  selectedCameraId: string;
  setSelectedCameraId: (id: string) => void;
  cctvRequests: CctvFootageRequest[];
  generateCctvRequests: (cameraIds: string[], date: string, timeRange: string, priority: 'Critical Preservation' | 'High' | 'Standard') => void;
  updateCctvRequestStatus: (requestId: string, status: 'Submitted' | 'Pending' | 'Received' | 'Unavailable') => void;
  addVideoObservation: (obs: Omit<VideoObservation, 'id'>) => void;
  updateVideoObservationStatus: (cameraId: string, obsId: string, status: VideoObservation['reviewClassification'], note?: string, linkedVehicleId?: string) => void;
  vehicles: VehicleRecord[];
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  updateVehicleVerification: (vehicleId: string, status: VehicleVerificationComparison, note?: string) => void;
  leads: InvestigativeLead[];
  selectedLeadId: string;
  setSelectedLeadId: (id: string) => void;
  updateLeadStatus: (leadId: string, status: InvestigativeLead['reviewStatus'], rejectionReason?: string) => void;
  addLeadNote: (leadId: string, note: string) => void;
  timelineEvents: TimelineEvent[];
  addTimelineEvent: (ev: Omit<TimelineEvent, 'id'>) => void;
  evidenceItems: DigitalEvidenceItem[];
  uploadDigitalEvidence: (item: {
    title: string;
    evidenceType: DigitalEvidenceItem['evidenceType'];
    source: string;
    originalFilename: string;
    fileSize: string;
    sha256Hash: string;
    notes: string;
  }) => void;
  verifyEvidenceHash: (evidenceId: string) => void;
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  collaborationTasks: CollaborationTask[];
  updateCollaborationTaskStatus: (taskId: string, status: CollaborationTask['status'], notes?: string) => void;
  createCollaborationTask: (task: Omit<CollaborationTask, 'id' | 'createdAt'>) => void;
  auditLogs: AuditLogEntry[];
  logAudit: (module: string, action: string, targetRef: string, details: string) => void;
  // Guided Investigation & Presentation Mode
  isGuidedActive: boolean;
  isPresentationMode: boolean;
  guidedStageIndex: number;
  isGuidedPlaying: boolean;
  guidedProgress: number;
  startGuidedInvestigation: (
    withPresentationMode?: boolean,
    withAudio?: boolean,
    lang?: NarrationLanguage,
    initialStageIdx?: number,
    caseIdOverride?: string
  ) => void;
  pauseGuided: () => void;
  resumeGuided: () => void;
  nextGuidedStage: () => void;
  prevGuidedStage: () => void;
  goToGuidedStage: (idx: number) => void;
  restartGuided: () => void;
  skipGuidedAnimation: () => void;
  stopGuidedInvestigation: () => void;
  togglePresentationMode: () => void;
  // Reset & Toast
  resetDemoData: () => void;
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  triggerToast: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
}

const ChakravyuhContext = createContext<ChakravyuhContextType | undefined>(undefined);

const ROLE_ACTORS: Record<UserRole, string> = {
  Investigator: 'Inspector Vikram Rao',
  'Senior Officer': 'ACP Meera Nair',
  'Forensic Officer': 'Dr. Priya Krishnan',
  'System Administrator': 'Arjun Hegde (SysAdmin)',
};

export const ChakravyuhProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleState] = useState<ModuleId>('command-centre');
  const [currentRole, setCurrentRoleState] = useState<UserRole>('Investigator');
  const [isExecutiveFocusMode, setIsExecutiveFocusMode] = useState<boolean>(true);

  // Audio Commentary State & Language ('en' | 'hi' | 'bilingual')
  const [narrationLanguage, setNarrationLanguageState] = useState<NarrationLanguage>('en');
  const [isAudioEnabled, setIsAudioEnabledState] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [ttsEngineStatus, setTtsEngineStatus] = useState<TtsEngineStatus>('checking');
  const [geminiVoiceName, setGeminiVoiceName] = useState<GeminiVoiceName>('Kore');
  const [currentSpokenSentence, setCurrentSpokenSentence] = useState<string>('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const ttsBlobCacheRef = useRef<Map<string, Promise<string | null>>>(new Map());
  const speechSessionIdRef = useRef<number>(0);
  const isSpeakingRef = useRef<boolean>(false);
  const speechCompletedForStageRef = useRef<boolean>(false);

  // Check Gemini API TTS configuration on mount and periodically when waiting for .env update
  useEffect(() => {
    let active = true;
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/tts?status=1', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        if (data.configured) {
          setTtsEngineStatus('gemini-hd');
          if (data.defaultVoice) {
            setGeminiVoiceName(data.defaultVoice as GeminiVoiceName);
          }
        } else {
          setTtsEngineStatus('browser-fallback');
        }
      } catch {
        if (active) setTtsEngineStatus('browser-fallback');
      }
    };
    checkStatus();
    const poll = setInterval(checkStatus, 6000);
    return () => {
      active = false;
      clearInterval(poll);
    };
  }, []);

  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-CKV-2026-0042');
  const [devices, setDevices] = useState<DeviceRecord[]>(INITIAL_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('DEV-001');
  const [cameras, setCameras] = useState<CctvCamera[]>(INITIAL_CAMERAS);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM-014');
  const [cctvRequests, setCctvRequests] = useState<CctvFootageRequest[]>(INITIAL_CCTV_REQUESTS);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(INITIAL_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('VEH-001');
  const [leads, setLeads] = useState<InvestigativeLead[]>(INITIAL_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('LEAD-001');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [evidenceItems, setEvidenceItems] = useState<DigitalEvidenceItem[]>(INITIAL_EVIDENCE);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>(INITIAL_GRAPH_NODES);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>(INITIAL_GRAPH_EDGES);
  const [collaborationTasks, setCollaborationTasks] = useState<CollaborationTask[]>(INITIAL_COLLABORATION_TASKS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Guided tour state
  const [isGuidedActive, setIsGuidedActive] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [guidedStageIndex, setGuidedStageIndex] = useState<number>(0);
  const [isGuidedPlaying, setIsGuidedPlaying] = useState<boolean>(false);
  const [guidedProgress, setGuidedProgress] = useState<number>(0);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const stopSpeaking = useCallback(() => {
    speechSessionIdRef.current += 1;
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = '';
      } catch {
        // Ignore audio reset errors
      }
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    isSpeakingRef.current = false;
    setIsSpeaking(false);
  }, []);

  // Fetches WAV audio blob URL from our Paid Gemini TTS API route (/api/tts) with in-memory & disk caching
  const fetchGeminiTtsObjectUrl = useCallback(
    (text: string, lang: 'en' | 'hi', voice: GeminiVoiceName): Promise<string | null> => {
      const cacheKey = `${voice}|${lang}|${text}`;
      const existing = ttsBlobCacheRef.current.get(cacheKey);
      if (existing) return existing;

      const promise = (async () => {
        try {
          const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang, voice }),
          });
          if (!res.ok) {
            ttsBlobCacheRef.current.delete(cacheKey);
            if (res.status === 503) {
              setTtsEngineStatus('browser-fallback');
            }
            return null;
          }
          setTtsEngineStatus('gemini-hd');
          const blob = await res.blob();
          if (!blob || blob.size < 100) {
            ttsBlobCacheRef.current.delete(cacheKey);
            return null;
          }
          return URL.createObjectURL(blob);
        } catch {
          ttsBlobCacheRef.current.delete(cacheKey);
          return null;
        }
      })();

      ttsBlobCacheRef.current.set(cacheKey, promise);
      return promise;
    },
    []
  );

  const speakStageCommentary = useCallback(
    (stageIdx?: number, langOverride?: NarrationLanguage, caseIdOverride?: string) => {
      const idx = stageIdx !== undefined ? stageIdx : guidedStageIndex;
      const activeLang = langOverride || narrationLanguage;
      const activeStages = getGuidedStagesForCase(caseIdOverride || selectedCaseId);
      const stage = activeStages[idx] || activeStages[0];

      const enSentences =
        stage.voiceScript && stage.voiceScript.length > 0
          ? stage.voiceScript
          : [stage.presenterScript, stage.narration];
      const hiDevanagariSentences =
        stage.voiceScriptHi && stage.voiceScriptHi.length > 0
          ? stage.voiceScriptHi
          : [stage.presenterScriptHi, stage.narrationHi];
      const hiPhoneticSentences =
        stage.voiceScriptHinglish && stage.voiceScriptHinglish.length > 0
          ? stage.voiceScriptHinglish
          : hiDevanagariSentences;

      if (typeof window === 'undefined') {
        setCurrentSpokenSentence(
          activeLang === 'hi' ? hiDevanagariSentences[0] : enSentences[0]
        );
        speechCompletedForStageRef.current = true;
        return;
      }

      const voices = 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
      // Prefer local OS voices (v.localService) for browser fallback so Chrome never hangs on unauthenticated cloud voices
      const hindiNativeVoice =
        voices.find(
          (v) =>
            v.localService &&
            (v.lang.toLowerCase().startsWith('hi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.name.toLowerCase().includes('hemant') ||
              v.name.toLowerCase().includes('kalpana') ||
              v.name.toLowerCase().includes('swara') ||
              v.name.toLowerCase().includes('madhur'))
        ) ||
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('swara') ||
            v.name.toLowerCase().includes('madhur')
        );

      const englishIndianVoice =
        voices.find((v) => v.localService && (v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Heera') || v.name.includes('Ravi'))) ||
        voices.find((v) => v.localService && v.lang.startsWith('en')) ||
        voices.find((v) => v.lang.includes('en-IN') || v.name.includes('India')) ||
        voices.find((v) => v.lang.startsWith('en'));

      // Build queue of { geminiText, browserFallbackText, displaySubtitle, isHindi }
      type UtteranceItem = {
        geminiText: string;
        browserFallbackText: string;
        displaySubtitle: string;
        isHindi: boolean;
      };

      const queue: UtteranceItem[] = [];
      if (activeLang === 'en') {
        enSentences.forEach((s) => {
          queue.push({
            geminiText: s,
            browserFallbackText: s,
            displaySubtitle: s,
            isHindi: false,
          });
        });
      } else if (activeLang === 'hi') {
        hiDevanagariSentences.forEach((hiSub, i) => {
          const fallbackSpoken = hindiNativeVoice
            ? hiSub
            : hiPhoneticSentences[i] || hiSub;
          queue.push({
            geminiText: hiSub,
            browserFallbackText: fallbackSpoken,
            displaySubtitle: hiSub,
            isHindi: true,
          });
        });
      } else {
        const maxLen = Math.max(enSentences.length, hiDevanagariSentences.length);
        for (let i = 0; i < maxLen; i++) {
          if (enSentences[i]) {
            queue.push({
              geminiText: enSentences[i],
              browserFallbackText: enSentences[i],
              displaySubtitle: `🇬🇧 ${enSentences[i]}`,
              isHindi: false,
            });
          }
          if (hiDevanagariSentences[i]) {
            const fallbackHi = hindiNativeVoice
              ? hiDevanagariSentences[i]
              : hiPhoneticSentences[i] || hiDevanagariSentences[i];
            queue.push({
              geminiText: hiDevanagariSentences[i],
              browserFallbackText: fallbackHi,
              displaySubtitle: `🇮🇳 ${hiDevanagariSentences[i]}`,
              isHindi: true,
            });
          }
        }
      }

      setCurrentSpokenSentence(
        queue[0]?.displaySubtitle ||
          (activeLang === 'hi' ? stage.presenterScriptHi : stage.presenterScript)
      );

      // Increment session ID so any previous cancelled utterance/audio callbacks are ignored
      speechSessionIdRef.current += 1;
      const currentSessionId = speechSessionIdRef.current;
      speechCompletedForStageRef.current = false;

      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.src = '';
        } catch {
          // Ignore
        }
        audioPlayerRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }

      const speakSentenceAt = async (sIndex: number) => {
        if (speechSessionIdRef.current !== currentSessionId) return;

        if (sIndex >= queue.length) {
          isSpeakingRef.current = false;
          speechCompletedForStageRef.current = true;
          setIsSpeaking(false);
          return;
        }

        const item = queue[sIndex];
        setCurrentSpokenSentence(item.displaySubtitle);

        // Prefetch next sentence in parallel for zero-latency human narration transitions
        if (sIndex + 1 < queue.length) {
          const nextItem = queue[sIndex + 1];
          fetchGeminiTtsObjectUrl(
            nextItem.geminiText,
            nextItem.isHindi ? 'hi' : 'en',
            geminiVoiceName
          );
        }

        let advanced = false;
        const advanceNext = () => {
          if (advanced) return;
          advanced = true;
          if (speechSessionIdRef.current !== currentSessionId) return;
          const completedPct = Math.round(((sIndex + 1) / queue.length) * 90);
          setGuidedProgress((prev) => Math.max(prev, completedPct));
          speakSentenceAt(sIndex + 1);
        };

        // 1. Try Paid Gemini Studio HD Human Voice first
        const geminiAudioUrl = await fetchGeminiTtsObjectUrl(
          item.geminiText,
          item.isHindi ? 'hi' : 'en',
          geminiVoiceName
        );

        if (speechSessionIdRef.current !== currentSessionId) return;

        if (geminiAudioUrl) {
          try {
            const audio = new Audio(geminiAudioUrl);
            audio.playbackRate = speechRate;
            audioPlayerRef.current = audio;

            const watchdog = setTimeout(() => {
              advanceNext();
            }, 22000);

            audio.onplay = () => {
              if (speechSessionIdRef.current !== currentSessionId) return;
              isSpeakingRef.current = true;
              setIsSpeaking(true);
              const basePct = Math.round((sIndex / queue.length) * 85);
              setGuidedProgress((prev) => Math.max(prev, basePct));
            };

            audio.onended = () => {
              clearTimeout(watchdog);
              advanceNext();
            };

            audio.onerror = () => {
              clearTimeout(watchdog);
              advanceNext();
            };

            await audio.play();
            return;
          } catch {
            // Fall through to browser speechSynthesis if autoplay or audio element fails
          }
        }

        // 2. Fallback to Browser speechSynthesis (when GEMINI_API_KEY is not yet added to .env)
        if (!('speechSynthesis' in window)) {
          advanceNext();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(item.browserFallbackText);
        utterance.rate = speechRate;
        utterance.pitch = 1.0;

        if (item.isHindi && hindiNativeVoice) {
          utterance.voice = hindiNativeVoice;
        } else if (englishIndianVoice) {
          utterance.voice = englishIndianVoice;
        }

        const watchdog = setTimeout(() => {
          advanceNext();
        }, 12000);

        utterance.onstart = () => {
          if (speechSessionIdRef.current !== currentSessionId) return;
          isSpeakingRef.current = true;
          setIsSpeaking(true);
          const basePct = Math.round((sIndex / queue.length) * 85);
          setGuidedProgress((prev) => Math.max(prev, basePct));
        };

        utterance.onend = () => {
          clearTimeout(watchdog);
          advanceNext();
        };

        utterance.onerror = () => {
          clearTimeout(watchdog);
          advanceNext();
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };

      setTimeout(() => {
        if (speechSessionIdRef.current === currentSessionId) {
          speakSentenceAt(0);
        }
      }, 40);
    },
    [fetchGeminiTtsObjectUrl, geminiVoiceName, guidedStageIndex, narrationLanguage, selectedCaseId, speechRate]
  );

  const speakCustomText = useCallback(
    async (
      textEn: string,
      textHi: string,
      textHinglish?: string,
      langOverride?: NarrationLanguage
    ) => {
      if (typeof window === 'undefined') return;
      const useHindi = (langOverride || narrationLanguage) === 'hi';
      stopSpeaking();
      speechSessionIdRef.current += 1;
      const currentSessionId = speechSessionIdRef.current;

      const geminiText = useHindi ? textHi : textEn;
      const audioUrl = await fetchGeminiTtsObjectUrl(
        geminiText,
        useHindi ? 'hi' : 'en',
        geminiVoiceName
      );

      if (speechSessionIdRef.current !== currentSessionId) return;

      if (audioUrl) {
        try {
          const audio = new Audio(audioUrl);
          audio.playbackRate = speechRate;
          audioPlayerRef.current = audio;
          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => setIsSpeaking(false);
          await audio.play();
          return;
        } catch {
          // Fall back to browser speech
        }
      }

      if (!('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice =
        voices.find(
          (v) =>
            v.localService &&
            (v.lang.toLowerCase().startsWith('hi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.name.toLowerCase().includes('hemant') ||
              v.name.toLowerCase().includes('kalpana') ||
              v.name.toLowerCase().includes('swara') ||
              v.name.toLowerCase().includes('madhur'))
        ) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
      const englishVoice =
        voices.find((v) => v.localService && (v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Heera') || v.name.includes('Ravi'))) ||
        voices.find((v) => v.localService && v.lang.startsWith('en')) ||
        voices.find((v) => v.lang.startsWith('en'));

      const fallbackText = useHindi
        ? hindiVoice
          ? textHi
          : textHinglish || textHi
        : textEn;

      const u = new SpeechSynthesisUtterance(fallbackText);
      u.rate = speechRate;
      if (useHindi && hindiVoice) u.voice = hindiVoice;
      else if (englishVoice) u.voice = englishVoice;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [fetchGeminiTtsObjectUrl, geminiVoiceName, narrationLanguage, speechRate, stopSpeaking]
  );

  const setNarrationLanguage = useCallback((lang: NarrationLanguage) => {
    setNarrationLanguageState(lang);
  }, []);

  // Keep-alive for Chromium speechSynthesis so it never pauses mid-sentence
  useEffect(() => {
    if (!isSpeaking) return;
    const keepAlive = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 2500);
    return () => clearInterval(keepAlive);
  }, [isSpeaking]);

  const setIsAudioEnabled = useCallback(
    (enabled: boolean) => {
      setIsAudioEnabledState(enabled);
      if (!enabled) {
        stopSpeaking();
        speechCompletedForStageRef.current = true;
      } else if (isGuidedActive) {
        speakStageCommentary(guidedStageIndex);
      }
    },
    [guidedStageIndex, isGuidedActive, speakStageCommentary, stopSpeaking]
  );

  // Single source of truth: automatically speak stage commentary when Guided Stage or Play state changes
  useEffect(() => {
    if (isGuidedActive && isAudioEnabled && isGuidedPlaying) {
      speakStageCommentary(guidedStageIndex);
    } else if (isGuidedActive && !isGuidedPlaying) {
      stopSpeaking();
    }
  }, [isGuidedActive, guidedStageIndex, isAudioEnabled, isGuidedPlaying, speakStageCommentary, stopSpeaking]);

  const triggerToast = useCallback(
    (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const logAudit = useCallback(
    (module: string, action: string, targetRef: string, details: string) => {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      const entry: AuditLogEntry = {
        id: `AUD-${1000 + auditLogs.length + Math.floor(Math.random() * 900)}`,
        timestamp: `02 Nov 2026, ${timeStr} IST`,
        actor: ROLE_ACTORS[currentRole],
        role: currentRole,
        module,
        action,
        targetRef,
        details,
        ipSimulated: '10.24.18.104 (Demo Intranet)',
      };
      setAuditLogs((prev) => [entry, ...prev]);
    },
    [currentRole, auditLogs.length]
  );

  const setActiveModule = useCallback((m: ModuleId) => {
    setActiveModuleState(m);
  }, []);

  const setCurrentRole = useCallback(
    (r: UserRole) => {
      setCurrentRoleState(r);
      triggerToast('Role Switched (Demo Simulation)', `Now viewing Project Chakravyuh as ${r} (${ROLE_ACTORS[r]})`, 'info');
      const now = new Date().toTimeString().slice(0, 8);
      setAuditLogs((prev) => [
        {
          id: `AUD-${1000 + prev.length + 1}`,
          timestamp: `02 Nov 2026, ${now} IST`,
          actor: ROLE_ACTORS[r],
          role: r,
          module: 'Role Management',
          action: 'ROLE_SWITCHED',
          targetRef: r,
          details: `Switched active demonstration role to ${r}.`,
          ipSimulated: '10.24.18.104 (Demo Intranet)',
        },
        ...prev,
      ]);
    },
    [triggerToast]
  );

  // Synchronize default camera, vehicle & lead when selectedCaseId changes
  useEffect(() => {
    if (selectedCaseId === 'CASE-CKV-2026-0043') {
      setSelectedCameraId('CAM-021');
      setSelectedVehicleId('VEH-007');
      setSelectedLeadId('LEAD-007');
    } else if (selectedCaseId === 'CASE-CKV-2026-0044') {
      setSelectedCameraId('CAM-025');
      setSelectedVehicleId('VEH-008');
      setSelectedLeadId('LEAD-008');
    } else if (selectedCaseId === 'CASE-CKV-2026-0042') {
      setSelectedCameraId('CAM-014');
      setSelectedVehicleId('VEH-001');
      setSelectedLeadId('LEAD-001');
    }
  }, [selectedCaseId]);

  // Synchronize active module when guided stage changes
  useEffect(() => {
    if (isGuidedActive) {
      const activeStages = getGuidedStagesForCase(selectedCaseId);
      const stage = activeStages[guidedStageIndex];
      if (stage && stage.targetModule) {
        setActiveModuleState(stage.targetModule as ModuleId);
      }
    }
  }, [isGuidedActive, guidedStageIndex, selectedCaseId]);

  // Timer for Guided Investigation Playback — waits for voice completion when Audio is ON
  useEffect(() => {
    if (!isGuidedActive || !isGuidedPlaying) return;
    const activeStages = getGuidedStagesForCase(selectedCaseId);
    const stage = activeStages[guidedStageIndex];
    const stepMs = 250;
    const baseIncrement = (100 / ((stage?.durationSeconds || 40) * 1000)) * stepMs;

    const timer = setInterval(() => {
      setGuidedProgress((prev) => {
        // When voice audio is enabled and still speaking, never cut off speech to switch steps
        if (isAudioEnabled && !speechCompletedForStageRef.current) {
          return Math.min(92, prev + baseIncrement * 0.65);
        }

        // Once speech has completed (or when muted), advance smoothly to 100% and switch steps
        const finishIncrement = isAudioEnabled ? 2.0 : baseIncrement;
        if (prev + finishIncrement >= 100) {
          if (guidedStageIndex < activeStages.length - 1) {
            speechCompletedForStageRef.current = false;
            setGuidedStageIndex((s) => s + 1);
            return 0;
          } else {
            setIsGuidedPlaying(false);
            return 100;
          }
        }
        return prev + finishIncrement;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [isGuidedActive, isGuidedPlaying, guidedStageIndex, isAudioEnabled, selectedCaseId]);

  const startGuidedInvestigation = useCallback(
    (
      withPresentationMode = false,
      withAudio = true,
      lang?: NarrationLanguage,
      initialStageIdx = 0,
      caseIdOverride?: string
    ) => {
      const targetCaseId = caseIdOverride || selectedCaseId || 'CASE-CKV-2026-0042';
      if (caseIdOverride && caseIdOverride !== selectedCaseId) {
        setSelectedCaseId(caseIdOverride);
      }
      const activeStages = getGuidedStagesForCase(targetCaseId);
      const targetStageIdx = Math.max(0, Math.min(activeStages.length - 1, initialStageIdx));
      speechCompletedForStageRef.current = false;
      if (lang) {
        setNarrationLanguageState(lang);
      }
      setGuidedStageIndex(targetStageIdx);
      setGuidedProgress(0);
      setIsGuidedActive(true);
      setIsGuidedPlaying(true);
      setIsAudioEnabledState(withAudio);
      setIsExecutiveFocusMode(true);
      if (withPresentationMode) {
        setIsPresentationMode(true);
      }
      setActiveModuleState(activeStages[targetStageIdx].targetModule as ModuleId);
      const activeLang = lang || narrationLanguage;
      logAudit(
        'Guided Presentation',
        'GUIDED_DEMO_STARTED',
        targetCaseId,
        `Launched Stage ${targetStageIdx + 1} of Voice-Guided Investigation Walkthrough for ${targetCaseId} (${activeLang === 'hi' ? 'Hindi' : activeLang === 'bilingual' ? 'Bilingual' : 'English'}).`
      );
      triggerToast(
        activeLang === 'hi'
          ? `हिंदी वॉइस-गाइडेड डेमो शुरू (${targetCaseId})`
          : `Voice-Guided Investigation Active (${targetCaseId})`,
        activeLang === 'hi'
          ? 'सरल हिंदी और इंग्लिश ऑडियो कमेंट्री चालू है।'
          : 'Continuous 8-stage audio commentary and Executive Focus Mode enabled.',
        'info'
      );
    },
    [logAudit, narrationLanguage, selectedCaseId, triggerToast]
  );

  const pauseGuided = useCallback(() => {
    setIsGuidedPlaying(false);
    stopSpeaking();
  }, [stopSpeaking]);

  const resumeGuided = useCallback(() => {
    setIsGuidedPlaying(true);
  }, []);

  const nextGuidedStage = useCallback(() => {
    speechCompletedForStageRef.current = false;
    setGuidedProgress(0);
    setGuidedStageIndex((prev) => Math.min(GUIDED_STAGES.length - 1, prev + 1));
  }, []);

  const prevGuidedStage = useCallback(() => {
    speechCompletedForStageRef.current = false;
    setGuidedProgress(0);
    setGuidedStageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToGuidedStage = useCallback((idx: number) => {
    const target = Math.max(0, Math.min(GUIDED_STAGES.length - 1, idx));
    speechCompletedForStageRef.current = false;
    setGuidedProgress(0);
    setGuidedStageIndex(target);
  }, []);

  const restartGuided = useCallback(() => {
    speechCompletedForStageRef.current = false;
    setGuidedStageIndex(0);
    setGuidedProgress(0);
    setIsGuidedPlaying(true);
  }, []);

  const skipGuidedAnimation = useCallback(() => {
    stopSpeaking();
    speechCompletedForStageRef.current = true;
    setGuidedProgress(100);
    setIsGuidedPlaying(false);
  }, [stopSpeaking]);

  const stopGuidedInvestigation = useCallback(() => {
    stopSpeaking();
    setIsGuidedPlaying(false);
    setIsGuidedActive(false);
    setIsPresentationMode(false);
  }, [stopSpeaking]);

  const togglePresentationMode = useCallback(() => {
    setIsPresentationMode((prev) => {
      const next = !prev;
      if (next && !isGuidedActive) {
        speechCompletedForStageRef.current = false;
        setIsGuidedActive(true);
        setIsGuidedPlaying(true);
        setGuidedStageIndex(0);
        setGuidedProgress(0);
        setActiveModuleState(GUIDED_STAGES[0].targetModule as ModuleId);
      }
      return next;
    });
  }, [isGuidedActive]);

  // Case Registration
  const registerCase = useCallback(
    (newCaseData: Omit<CaseRecord, 'evidenceCount' | 'leadsCount' | 'pendingRequestsCount'>) => {
      const fullCase: CaseRecord = {
        ...newCaseData,
        evidenceCount: 1,
        leadsCount: 0,
        pendingRequestsCount: 0,
      };
      setCases((prev) => [fullCase, ...prev.filter((c) => c.id !== fullCase.id)]);
      setSelectedCaseId(fullCase.id);
      logAudit('Case Management', 'CASE_REGISTERED', fullCase.id, `Registered case: ${fullCase.title}`);
      triggerToast('Incident Registered', `Case ${fullCase.id} created and added to Investigation Workspace.`, 'success');
    },
    [logAudit, triggerToast]
  );

  // CCTV Requests
  const generateCctvRequests = useCallback(
    (
      cameraIds: string[],
      date: string,
      timeRange: string,
      priority: 'Critical Preservation' | 'High' | 'Standard'
    ) => {
      if (cameraIds.length === 0) return;
      const newRequests: CctvFootageRequest[] = cameraIds.map((camId, idx) => {
        const cam = cameras.find((c) => c.id === camId);
        return {
          requestId: `REQ-CCTV-2026-${106 + cctvRequests.length + idx}`,
          cameraId: camId,
          cameraName: cam?.name || camId,
          ownerEstablishment: cam?.ownerEstablishment || 'Registered Custodian',
          requestedDate: date,
          requestedTimeRange: timeRange,
          priority,
          status: 'Submitted',
          preservationDeadline: '04 Nov 2026, 12:00 IST',
          requestedBy: ROLE_ACTORS[currentRole],
          createdAt: '02 Nov 2026, 22:30 IST',
          authorisationRef: 'AUTH-BLR-SYN-2026-8841',
        };
      });

      setCctvRequests((prev) => [...newRequests, ...prev]);
      setCameras((prev) =>
        prev.map((cam) =>
          cameraIds.includes(cam.id) && cam.footageStatus !== 'Footage received'
            ? { ...cam, requestStatus: 'Request Submitted' }
            : cam
        )
      );

      logAudit(
        'CCTV Intelligence',
        'CCTV_REQUESTS_GENERATED',
        cameraIds.join(', '),
        `Generated ${cameraIds.length} CCTV preservation request(s) for window ${timeRange}.`
      );
      triggerToast(
        'CCTV Preservation Requests Generated',
        `Dispatched ${cameraIds.length} request(s) with preservation deadlines.`,
        'success'
      );
    },
    [cameras, cctvRequests.length, currentRole, logAudit, triggerToast]
  );

  const updateCctvRequestStatus = useCallback(
    (requestId: string, status: 'Submitted' | 'Pending' | 'Received' | 'Unavailable') => {
      let targetCameraId = '';
      setCctvRequests((prev) =>
        prev.map((r) => {
          if (r.requestId === requestId) {
            targetCameraId = r.cameraId;
            return { ...r, status };
          }
          return r;
        })
      );

      if (targetCameraId) {
        setCameras((prev) =>
          prev.map((c) => {
            if (c.id !== targetCameraId) return c;
            if (status === 'Received') {
              return { ...c, footageStatus: 'Footage received', requestStatus: 'Received & Hashed' };
            }
            if (status === 'Pending') {
              return { ...c, footageStatus: 'Request pending', requestStatus: 'Pending Custodian Action' };
            }
            return c;
          })
        );
      }

      logAudit('CCTV Intelligence', 'CCTV_REQUEST_STATUS_UPDATED', requestId, `Updated request status to ${status}.`);
      triggerToast('Request Status Updated', `${requestId} marked as ${status}.`, 'info');
    },
    [logAudit, triggerToast]
  );

  // Video Observations
  const addVideoObservation = useCallback(
    (obs: Omit<VideoObservation, 'id'>) => {
      const newObs: VideoObservation = {
        ...obs,
        id: `VOBS-${Date.now().toString().slice(-4)}`,
      };
      setCameras((prev) =>
        prev.map((c) =>
          c.id === obs.cameraId
            ? {
                ...c,
                videoReviewStatus: 'Reviewed — Observation Logged',
                extractedObservations: [...c.extractedObservations, newObs],
              }
            : c
        )
      );

      const cam = cameras.find((c) => c.id === obs.cameraId);
      const [hh, mm] = (obs.timestamp || '19:10').split(':').map(Number);
      const timeMinutes = (hh || 19) * 60 + (mm || 10);

      const newTlEvent: TimelineEvent = {
        id: `TLE-OBS-${Date.now().toString().slice(-4)}`,
        timestamp: obs.timestamp,
        timeMinutes,
        date: '02 Nov 2026',
        title: `${obs.cameraId} Video Observation: ${obs.objectType}`,
        description: obs.description,
        sourceType: 'CCTV Observation',
        categoryType: 'Observation (Source Recorded)',
        entityIds: [obs.cameraId, ...(obs.linkedVehicleId ? [obs.linkedVehicleId] : [])],
        locationName: cam?.locationName || 'Corridor Camera Location',
        coordinates: cam?.coordinates,
        evidenceRef: obs.evidenceRef,
        provenance: `Investigator Video Review (${obs.cameraId})`,
        authorisationRef: 'AUTH-BLR-SYN-2026-8841',
        verificationStatus:
          obs.reviewClassification === 'Relevant — Requires Verification'
            ? 'Pending Verification'
            : 'Inconclusive',
        limitationsNote: obs.notes || 'Manual video observation logged by investigator; requires corroboration.',
      };

      setTimelineEvents((prev) => [...prev, newTlEvent].sort((a, b) => a.timeMinutes - b.timeMinutes));
      logAudit('CCTV Footage Review', 'VIDEO_OBSERVATION_LOGGED', obs.cameraId, `Added observation at ${obs.timestamp}: ${obs.description}`);
      triggerToast('Observation Added to Timeline', `Logged ${obs.cameraId} observation at ${obs.timestamp} and synced to Unified Timeline.`, 'success');
    },
    [cameras, logAudit, triggerToast]
  );

  const updateVideoObservationStatus = useCallback(
    (
      cameraId: string,
      obsId: string,
      status: VideoObservation['reviewClassification'],
      note?: string,
      linkedVehicleId?: string
    ) => {
      setCameras((prev) =>
        prev.map((cam) => {
          if (cam.id !== cameraId) return cam;
          return {
            ...cam,
            extractedObservations: cam.extractedObservations.map((o) =>
              o.id === obsId
                ? {
                    ...o,
                    reviewClassification: status,
                    notes: note !== undefined ? note : o.notes,
                    linkedVehicleId: linkedVehicleId !== undefined ? linkedVehicleId : o.linkedVehicleId,
                  }
                : o
            ),
          };
        })
      );
      logAudit('CCTV Footage Review', 'VIDEO_OBS_UPDATED', `${cameraId}/${obsId}`, `Marked observation as "${status}".`);
      triggerToast('Video Observation Updated', `Observation ${obsId} classification updated to "${status}".`, 'info');
    },
    [logAudit, triggerToast]
  );

  // Vehicle Verification
  const updateVehicleVerification = useCallback(
    (vehicleId: string, status: VehicleVerificationComparison, note?: string) => {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId
            ? {
                ...v,
                verificationStatus: status,
                summaryNotes: note ? `${v.summaryNotes} [Investigator Note: ${note}]` : v.summaryNotes,
              }
            : v
        )
      );
      logAudit('Vehicle Intelligence', 'VEHICLE_COMPARISON_UPDATED', vehicleId, `Marked ${vehicleId} verification status as "${status}".`);
      triggerToast('Vehicle Status Updated', `${vehicleId} marked as "${status}".`, 'success');
    },
    [logAudit, triggerToast]
  );

  // AI Leads Review
  const updateLeadStatus = useCallback(
    (leadId: string, status: InvestigativeLead['reviewStatus'], rejectionReason?: string) => {
      const now = new Date().toTimeString().slice(0, 5);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? {
                ...l,
                reviewStatus: status,
                rejectionReason: status === 'Rejected by Investigator' ? rejectionReason : l.rejectionReason,
                reviewedBy: ROLE_ACTORS[currentRole],
                reviewedAt: `02 Nov 2026, ${now} IST`,
              }
            : l
        )
      );
      logAudit(
        'AI Investigation Engine',
        status === 'Rejected by Investigator' ? 'LEAD_REJECTED' : 'LEAD_REVIEW_UPDATED',
        leadId,
        `Updated ${leadId} to "${status}"${rejectionReason ? ` (Reason: ${rejectionReason})` : ''}.`
      );
      triggerToast('Lead Review Recorded', `${leadId} status set to "${status}".`, status === 'Rejected by Investigator' ? 'warning' : 'success');
    },
    [currentRole, logAudit, triggerToast]
  );

  const addLeadNote = useCallback(
    (leadId: string, note: string) => {
      if (!note.trim()) return;
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? {
                ...l,
                investigatorNotes: [...l.investigatorNotes, `[${ROLE_ACTORS[currentRole]}]: ${note.trim()}`],
              }
            : l
        )
      );
      logAudit('AI Investigation Engine', 'LEAD_NOTE_ADDED', leadId, `Added investigator note to ${leadId}.`);
      triggerToast('Note Added', `Investigator note appended to ${leadId}.`, 'info');
    },
    [currentRole, logAudit, triggerToast]
  );

  const addTimelineEvent = useCallback(
    (ev: Omit<TimelineEvent, 'id'>) => {
      const newEv: TimelineEvent = {
        ...ev,
        id: `TLE-${Date.now().toString().slice(-4)}`,
      };
      setTimelineEvents((prev) => [...prev, newEv].sort((a, b) => a.timeMinutes - b.timeMinutes));
      logAudit('Unified Timeline', 'TIMELINE_EVENT_ADDED', newEv.id, `Added timeline entry: ${newEv.title}`);
      triggerToast('Timeline Updated', `Added "${newEv.title}" to Unified Investigation Timeline.`, 'success');
    },
    [logAudit, triggerToast]
  );

  // Digital Evidence Upload & SHA-256
  const uploadDigitalEvidence = useCallback(
    (item: {
      title: string;
      evidenceType: DigitalEvidenceItem['evidenceType'];
      source: string;
      originalFilename: string;
      fileSize: string;
      sha256Hash: string;
      notes: string;
    }) => {
      const newId = `EVD-${String(evidenceItems.length + 1).padStart(3, '0')}`;
      const nowStr = `02 Nov 2026, ${new Date().toTimeString().slice(0, 5)} IST`;
      const newEvd: DigitalEvidenceItem = {
        id: newId,
        caseId: selectedCaseId,
        title: item.title,
        evidenceType: item.evidenceType,
        source: item.source,
        originalFilename: item.originalFilename,
        fileSize: item.fileSize,
        collectionDateTime: nowStr,
        uploadDateTime: nowStr,
        collector: ROLE_ACTORS[currentRole],
        sha256Hash: item.sha256Hash,
        originalFileRef: `vault://immutable/2026/0042/${newId}-${item.originalFilename}`,
        workingCopyRef: `vault://working/2026/0042/${newId}-working-copy`,
        artifactClassification: 'Original Evidence (Immutable)',
        reviewStatus: 'Integrity Verified',
        authorisationRef: 'AUTH-BLR-SYN-2026-8841',
        notes: item.notes,
        chainOfCustody: [
          {
            id: `COC-${newId}-1`,
            timestamp: nowStr,
            action: 'File Uploaded & Cryptographic SHA-256 Computed in Browser',
            actor: ROLE_ACTORS[currentRole],
            role: currentRole,
            hashVerified: true,
            notes: `Original sealed (${item.sha256Hash.slice(0, 16)}...); working copy created.`,
          },
        ],
        accessHistory: [
          {
            id: `ACC-${newId}-1`,
            timestamp: nowStr,
            user: ROLE_ACTORS[currentRole],
            role: currentRole,
            operation: 'Verified SHA-256',
          },
        ],
      };

      setEvidenceItems((prev) => [newEvd, ...prev]);
      logAudit('Digital Evidence', 'EVIDENCE_UPLOADED_HASHED', newId, `Uploaded ${item.originalFilename} with SHA-256: ${item.sha256Hash}`);
      triggerToast('Evidence Sealed with SHA-256', `${newId} (${item.originalFilename}) preserved in immutable vault.`, 'success');
    },
    [currentRole, evidenceItems.length, logAudit, selectedCaseId, triggerToast]
  );

  const verifyEvidenceHash = useCallback(
    (evidenceId: string) => {
      const nowStr = `02 Nov 2026, ${new Date().toTimeString().slice(0, 5)} IST`;
      setEvidenceItems((prev) =>
        prev.map((e) =>
          e.id === evidenceId
            ? {
                ...e,
                reviewStatus: 'Integrity Verified',
                chainOfCustody: [
                  ...e.chainOfCustody,
                  {
                    id: `COC-${evidenceId}-${e.chainOfCustody.length + 1}`,
                    timestamp: nowStr,
                    action: 'On-Demand SHA-256 Checksum Re-Verification Passed',
                    actor: ROLE_ACTORS[currentRole],
                    role: currentRole,
                    hashVerified: true,
                    notes: 'Bit-for-bit match against immutable intake hash.',
                  },
                ],
                accessHistory: [
                  ...e.accessHistory,
                  {
                    id: `ACC-${evidenceId}-${e.accessHistory.length + 1}`,
                    timestamp: nowStr,
                    user: ROLE_ACTORS[currentRole],
                    role: currentRole,
                    operation: 'Verified SHA-256',
                  },
                ],
              }
            : e
        )
      );
      logAudit('Digital Evidence', 'HASH_REVERIFIED', evidenceId, `Re-verified SHA-256 integrity of ${evidenceId}.`);
      triggerToast('SHA-256 Integrity Verified', `${evidenceId} matches original intake hash bit-for-bit.`, 'success');
    },
    [currentRole, logAudit, triggerToast]
  );

  // Collaboration Tasks
  const updateCollaborationTaskStatus = useCallback(
    (taskId: string, status: CollaborationTask['status'], notes?: string) => {
      setCollaborationTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status, notes: notes ? `${t.notes} | [${ROLE_ACTORS[currentRole]}]: ${notes}` : t.notes }
            : t
        )
      );
      logAudit('Agency Collaboration', 'WORKFLOW_TASK_UPDATED', taskId, `Task ${taskId} marked as "${status}".`);
      triggerToast('Collaboration Workflow Updated', `${taskId} updated to "${status}".`, 'success');
    },
    [currentRole, logAudit, triggerToast]
  );

  const createCollaborationTask = useCallback(
    (task: Omit<CollaborationTask, 'id' | 'createdAt'>) => {
      const newTask: CollaborationTask = {
        ...task,
        id: `TASK-2026-0${collaborationTasks.length + 1}`,
        createdAt: `02 Nov 2026, ${new Date().toTimeString().slice(0, 5)} IST`,
      };
      setCollaborationTasks((prev) => [newTask, ...prev]);
      logAudit('Agency Collaboration', 'WORKFLOW_TASK_CREATED', newTask.id, `Created approval request: ${newTask.title}`);
      triggerToast('Inter-Unit Request Submitted', `${newTask.id} routed to ${newTask.assignedRole}.`, 'success');
    },
    [collaborationTasks.length, logAudit, triggerToast]
  );

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    stopSpeaking();
    setCases(INITIAL_CASES);
    setSelectedCaseId('CASE-CKV-2026-0042');
    setDevices(INITIAL_DEVICES);
    setSelectedDeviceId('DEV-001');
    setCameras(INITIAL_CAMERAS);
    setSelectedCameraId('CAM-014');
    setCctvRequests(INITIAL_CCTV_REQUESTS);
    setVehicles(INITIAL_VEHICLES);
    setSelectedVehicleId('VEH-001');
    setLeads(INITIAL_LEADS);
    setSelectedLeadId('LEAD-001');
    setTimelineEvents(INITIAL_TIMELINE_EVENTS);
    setEvidenceItems(INITIAL_EVIDENCE);
    setGraphNodes(INITIAL_GRAPH_NODES);
    setGraphEdges(INITIAL_GRAPH_EDGES);
    setCollaborationTasks(INITIAL_COLLABORATION_TASKS);
    setIsGuidedActive(false);
    setIsPresentationMode(false);
    setIsGuidedPlaying(false);
    setGuidedStageIndex(0);
    setGuidedProgress(0);
    setAuditLogs([
      {
        id: `AUD-RESET-${Date.now().toString().slice(-4)}`,
        timestamp: `02 Nov 2026, ${new Date().toTimeString().slice(0, 8)} IST`,
        actor: ROLE_ACTORS[currentRole],
        role: currentRole,
        module: 'System Administration',
        action: 'DEMO_DATA_RESET',
        targetRef: 'ALL_SYNTHETIC_DATASETS',
        details: 'Restored Project Chakravyuh demonstration state to baseline CASE-CKV-2026-0042 scenario.',
        ipSimulated: '10.24.18.104 (Demo Intranet)',
      },
      ...INITIAL_AUDIT_LOGS,
    ]);
    triggerToast('Demonstration Environment Reset', 'All synthetic records, leads, and timelines restored to baseline.', 'info');
  }, [currentRole, stopSpeaking, triggerToast]);

  return (
    <ChakravyuhContext.Provider
      value={{
        activeModule,
        setActiveModule,
        currentRole,
        setCurrentRole,
        isExecutiveFocusMode,
        setIsExecutiveFocusMode,
        narrationLanguage,
        setNarrationLanguage,
        isAudioEnabled,
        setIsAudioEnabled,
        isSpeaking,
        speechRate,
        setSpeechRate,
        ttsEngineStatus,
        geminiVoiceName,
        setGeminiVoiceName,
        currentSpokenSentence,
        speakStageCommentary,
        speakCustomText,
        stopSpeaking,
        cases,
        selectedCaseId,
        setSelectedCaseId,
        registerCase,
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
        cameras,
        selectedCameraId,
        setSelectedCameraId,
        cctvRequests,
        generateCctvRequests,
        updateCctvRequestStatus,
        addVideoObservation,
        updateVideoObservationStatus,
        vehicles,
        selectedVehicleId,
        setSelectedVehicleId,
        updateVehicleVerification,
        leads,
        selectedLeadId,
        setSelectedLeadId,
        updateLeadStatus,
        addLeadNote,
        timelineEvents,
        addTimelineEvent,
        evidenceItems,
        uploadDigitalEvidence,
        verifyEvidenceHash,
        graphNodes,
        graphEdges,
        collaborationTasks,
        updateCollaborationTaskStatus,
        createCollaborationTask,
        auditLogs,
        logAudit,
        isGuidedActive,
        isPresentationMode,
        guidedStageIndex,
        isGuidedPlaying,
        guidedProgress,
        startGuidedInvestigation,
        pauseGuided,
        resumeGuided,
        nextGuidedStage,
        prevGuidedStage,
        goToGuidedStage,
        restartGuided,
        skipGuidedAnimation,
        stopGuidedInvestigation,
        togglePresentationMode,
        resetDemoData,
        toasts,
        dismissToast,
        triggerToast,
      }}
    >
      {children}
    </ChakravyuhContext.Provider>
  );
};

export const useChakravyuh = () => {
  const ctx = useContext(ChakravyuhContext);
  if (!ctx) throw new Error('useChakravyuh must be used within ChakravyuhProvider');
  return ctx;
};
