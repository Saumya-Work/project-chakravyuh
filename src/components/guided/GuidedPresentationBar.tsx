"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  FastForward,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Radio,
  Volume2,
  VolumeX,
  Eye,
  Languages,
  ShieldAlert,
  Crosshair,
} from 'lucide-react';
import { useChakravyuh, NarrationLanguage, GeminiVoiceName } from '@/context/ChakravyuhContext';
import { GUIDED_STAGES } from '@/data/syntheticData';

export const GuidedPresentationBar: React.FC = () => {
  const {
    isGuidedActive,
    isPresentationMode,
    guidedStageIndex,
    isGuidedPlaying,
    guidedProgress,
    pauseGuided,
    resumeGuided,
    nextGuidedStage,
    prevGuidedStage,
    goToGuidedStage,
    restartGuided,
    skipGuidedAnimation,
    stopGuidedInvestigation,
    togglePresentationMode,
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
    isExecutiveFocusMode,
    setIsExecutiveFocusMode,
  } = useChakravyuh();

  const [showScriptDrawer, setShowScriptDrawer] = useState(false);

  if (!isGuidedActive && !isPresentationMode) return null;

  const currentStage = GUIDED_STAGES[guidedStageIndex] || GUIDED_STAGES[0];
  const isHi = narrationLanguage === 'hi';
  const isBilingual = narrationLanguage === 'bilingual';

  const handleLanguageChange = (lang: NarrationLanguage) => {
    setNarrationLanguage(lang);
    if (isAudioEnabled) {
      speakStageCommentary(guidedStageIndex, lang);
    }
  };

  const handleFullScreen = () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
    togglePresentationMode();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-[#0B1528] via-[#112240] to-[#0B1528] border-b-2 border-sky-500/60 shadow-2xl px-4 py-3 relative z-30"
      >
        <div className="max-w-[1800px] mx-auto flex flex-col gap-3">
          {/* Top Row: Stage Indicator + Language Switcher + Audio Voice Controls + Playback Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/20 border border-sky-400/50 text-sky-300 text-xs font-mono font-bold tracking-wider uppercase">
                <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                {isHi
                  ? `चरण ${currentStage.stageNumber} / ${GUIDED_STAGES.length}`
                  : `Step ${currentStage.stageNumber} of ${GUIDED_STAGES.length}`}
              </span>
              <h2 className="text-sm md:text-base font-extrabold text-white tracking-tight">
                {isHi
                  ? currentStage.titleHi
                  : isBilingual
                  ? `${currentStage.title} • ${currentStage.titleHi}`
                  : currentStage.title}
              </h2>
              <span className="hidden xl:inline-block text-xs text-teal-300 font-medium border-l border-slate-700 pl-3">
                {isHi ? currentStage.subtitleHi : currentStage.subtitle}
              </span>
            </div>

            {/* Playback + Language + Voice Audio Commentary Controls */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#090D16]/95 border border-slate-700/90 rounded-xl p-1.5">
              {/* LANGUAGE SWITCHER: ENGLISH | हिंदी | BILINGUAL */}
              <div className="flex items-center bg-slate-900 border border-sky-500/40 rounded-lg p-0.5 gap-0.5">
                <Languages className="w-3.5 h-3.5 text-sky-400 ml-1.5 mr-0.5 shrink-0" />
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                    narrationLanguage === 'en'
                      ? 'bg-sky-500 text-slate-950 shadow'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="English Narration & Voice"
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                    narrationLanguage === 'hi'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-amber-300 hover:text-white'
                  }`}
                  title="सरल हिंदी आवाज़ और विवरण (Simple Hindi Voice & Text)"
                >
                  🇮🇳 हिंदी (Hindi)
                </button>
                <button
                  onClick={() => handleLanguageChange('bilingual')}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                    narrationLanguage === 'bilingual'
                      ? 'bg-teal-500 text-slate-950 shadow'
                      : 'text-teal-300 hover:text-white'
                  }`}
                  title="Speak & Display Both English and Hindi"
                >
                  🇮🇳+🇬🇧 Both
                </button>
              </div>

              <div className="h-4 w-px bg-slate-700 mx-0.5" />

              {/* VOICE COMMENTARY TOGGLE + ANIMATED WAVEFORM */}
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isAudioEnabled
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Toggle Voice Audio Commentary"
              >
                {isAudioEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{isHi ? 'आवाज़: चालू' : 'Voice: ON'}</span>
                    {isSpeaking && (
                      <span className="flex items-end gap-0.5 h-3 ml-1">
                        <span className="w-0.5 h-3 bg-slate-950 animate-bounce" />
                        <span className="w-0.5 h-2 bg-slate-950 animate-pulse" />
                        <span className="w-0.5 h-3.5 bg-slate-950 animate-bounce" />
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>{isHi ? 'आवाज़ बंद' : 'Voice Muted'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsAudioEnabled(true);
                  speakStageCommentary(guidedStageIndex);
                }}
                title="Replay Voice Commentary for This Stage"
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-sky-300 text-xs font-medium transition"
              >
                {isHi ? '🔊 फिर से सुनें' : '🔊 Replay Voice'}
              </button>

              {/* Indian Gemini Studio Voice Selector + Speed Selector */}
              <select
                aria-label="Gemini Indian Human Voice Persona"
                value={geminiVoiceName}
                onChange={(e) => {
                  const nextVoice = e.target.value as GeminiVoiceName;
                  setGeminiVoiceName(nextVoice);
                }}
                title={
                  ttsEngineStatus === 'gemini-hd'
                    ? 'Paid Gemini 2.5 Studio HD Indian Human Voice Active (en-IN / hi-IN)'
                    : 'Gemini Indian Voice Persona'
                }
                className="bg-slate-900 border border-emerald-500/50 rounded-lg px-2 py-1 text-[11px] font-semibold text-emerald-300 outline-none"
              >
                <option value="Kore">🇮🇳 Indian Female (Kore HD)</option>
                <option value="Puck">🇮🇳 Indian Male (Puck HD)</option>
                <option value="Aoede">🇮🇳 Indian Female Warm (Aoede HD)</option>
                <option value="Charon">🇮🇳 Indian Male Deep (Charon HD)</option>
                <option value="Fenrir">🇮🇳 Indian Tactical (Fenrir HD)</option>
              </select>

              {/* Speed Selector */}
              <select
                aria-label="Voice Commentary Speed"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-300 outline-none"
              >
                <option value={0.9}>0.9x</option>
                <option value={1}>1.0x</option>
                <option value={1.1}>1.1x</option>
              </select>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              {/* Stage Playback Controls */}
              <button
                onClick={prevGuidedStage}
                disabled={guidedStageIndex === 0}
                title="Previous Stage"
                className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white transition"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {isGuidedPlaying ? (
                <button
                  onClick={pauseGuided}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition"
                >
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeGuided}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  {guidedProgress > 0 && guidedProgress < 100 ? 'Resume' : 'Play'}
                </button>
              )}

              <button
                onClick={nextGuidedStage}
                disabled={guidedStageIndex === GUIDED_STAGES.length - 1}
                title="Next Stage"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/20 border border-sky-500/40 hover:bg-sky-500/30 disabled:opacity-40 text-sky-200 text-xs font-bold transition"
              >
                Next Step
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={skipGuidedAnimation}
                title="Skip Stage Animation"
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={restartGuided}
                title="Restart Guided Tour"
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              {/* Executive Focus / Declutter Toggle */}
              <button
                onClick={() => setIsExecutiveFocusMode(!isExecutiveFocusMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  isExecutiveFocusMode
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title="Simplified Mode hides secondary clutter so viewers can focus on the story"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isExecutiveFocusMode ? 'Simplified View: ON' : 'Full Analyst View'}</span>
              </button>

              <button
                onClick={() => setShowScriptDrawer((s) => !s)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  showScriptDrawer
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-sky-300 hover:bg-slate-700'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full Script</span>
              </button>

              <button
                onClick={handleFullScreen}
                title="Toggle Full-Screen Presentation Mode"
                className="p-1.5 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 hover:bg-teal-500/30 text-xs transition"
              >
                {isPresentationMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={stopGuidedInvestigation}
                title="Exit Guided Mode"
                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 8-Stage Interactive Step Progress Bar */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {GUIDED_STAGES.map((stg, idx) => {
              const isCurrent = idx === guidedStageIndex;
              const isCompleted = idx < guidedStageIndex;
              return (
                <button
                  key={stg.id}
                  onClick={() => goToGuidedStage(idx)}
                  className={`group text-left rounded-lg p-2 border transition relative overflow-hidden ${
                    isCurrent
                      ? 'bg-sky-950/90 border-sky-400 text-white shadow-lg'
                      : isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-0.5">
                    <span className="font-bold">
                      {isHi ? `चरण ${stg.stageNumber}` : `STEP ${stg.stageNumber}`}
                    </span>
                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] font-semibold truncate">
                    {isHi
                      ? stg.titleHi.replace(/^चरण \d+ — /, '')
                      : stg.title.replace(/^STAGE \d+ — /, '')}
                  </div>
                  {isCurrent && (
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-teal-400 transition-all duration-200"
                        style={{ width: `${guidedProgress}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* LIVE AUDIO COMMENTARY & SUBTITLE TELEPROMPTER PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#070C15] border-2 border-sky-500/40 rounded-xl p-4 shadow-inner">
            <div className="lg:col-span-8 flex items-start gap-3.5">
              <div
                className={`p-3 rounded-xl border shrink-0 mt-0.5 ${
                  isSpeaking
                    ? 'bg-sky-500/25 border-sky-400 text-sky-300 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                    {isSpeaking
                      ? isHi
                        ? '🔊 लाइव ऑडियो कमेंट्री चल रही है'
                        : '🔊 LIVE AUDIO COMMENTARY PLAYING'
                      : isHi
                      ? 'चरण का सरल विवरण (हिंदी / English)'
                      : 'STAGE COMMENTARY & EXPLANATION'}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {isHi ? currentStage.systemBannerHi : currentStage.systemBanner}
                  </span>
                </div>

                {/* Live Spoken Subtitle Line (when audio is active) */}
                {isSpeaking && currentSpokenSentence && (
                  <div className="px-3 py-2 rounded-lg bg-sky-950/70 border border-sky-400/40 text-sky-100 text-sm md:text-base font-semibold leading-relaxed">
                    🎙️ “{currentSpokenSentence}”
                  </div>
                )}

                {/* Clear Spoken Story Explanation (English, Hindi, or Both) */}
                {isBilingual ? (
                  <div className="space-y-1.5">
                    <p className="text-sm text-white leading-relaxed font-medium">
                      🇬🇧 {currentStage.presenterScript}
                    </p>
                    <p className="text-sm text-amber-200 leading-relaxed font-medium">
                      🇮🇳 {currentStage.presenterScriptHi}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-white leading-relaxed font-medium">
                    {isHi ? currentStage.presenterScriptHi : currentStage.presenterScript}
                  </p>
                )}

                {/* Key Takeaway Quote */}
                <p className="text-xs md:text-sm text-teal-300 font-semibold italic pt-0.5">
                  {isHi
                    ? `मुख्य निष्कर्ष: “${currentStage.narrationHi}”`
                    : `Key Takeaway: “${currentStage.narration}”`}
                </p>

                {/* SMART CRIMINAL MOVE vs. PROJECT CHAKRAVYUH (प्रोजेक्ट चक्रव्यूह) SOVEREIGN TRAP BANNER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-lg bg-rose-950/35 border border-rose-500/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-rose-300 uppercase text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>
                        {isHi
                          ? '🕵️ शातिर अपराधी की चाल (Criminal’s Move)'
                          : '🕵️ Smart Criminal’s Evasion Move'}
                      </span>
                    </div>
                    <p className="text-rose-100/90 leading-snug">
                      {isHi ? currentStage.criminalMoveHi : currentStage.criminalMoveEn}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/35 border border-emerald-500/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-300 uppercase text-[11px]">
                      <Crosshair className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        {isHi
                          ? '🪤 प्रोजेक्ट चक्रव्यूह का सरकारी जाल (Sovereign Trap)'
                          : '🪤 Project Chakravyuh’s Sovereign Trap'}
                      </span>
                    </div>
                    <p className="text-emerald-100/90 leading-snug">
                      {isHi ? currentStage.chakravyuhTrapHi : currentStage.chakravyuhTrapEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-4 flex flex-col justify-center">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isHi
                    ? 'इस स्क्रीन पर क्या ध्यान दें (मुख्य बिंदु):'
                    : 'What to Notice on This Screen:'}
                </span>
              </div>
              <ul className="space-y-1.5">
                {(isHi ? currentStage.highlightsHi : currentStage.highlights).map((h, i) => (
                  <li key={i} className="text-xs text-slate-200 flex items-start gap-1.5 leading-snug">
                    <ChevronRight className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Complete Bilingual Government Presentation Script Drawer */}
      <AnimatePresence>
        {showScriptDrawer && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0B1220] border-b border-sky-500/40 px-6 py-4 shadow-2xl relative z-30 max-h-[70vh] overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    BILINGUAL DEMONSTRATION SCRIPT — ENGLISH & सरल हिंदी (CRIMINAL MOVE vs. SOVEREIGN TRAP)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any stage below to jump directly to that screen and play its voice commentary aloud in English or Hindi.
                  </p>
                </div>
                <button
                  onClick={() => setShowScriptDrawer(false)}
                  className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs"
                >
                  Close Script
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {GUIDED_STAGES.map((stg, idx) => (
                  <div
                    key={stg.id}
                    onClick={() => goToGuidedStage(idx)}
                    className={`p-3 rounded-lg border cursor-pointer transition space-y-1.5 ${
                      idx === guidedStageIndex
                        ? 'bg-sky-950/50 border-sky-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-300">
                        {isHi ? stg.titleHi : stg.title}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">
                        🔊 {isHi ? 'सुनने के लिए क्लिक करें' : 'Click to Speak'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      🇬🇧 {stg.presenterScript}
                    </p>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      🇮🇳 {stg.presenterScriptHi}
                    </p>
                    <div className="text-[11px] text-rose-300 border-l-2 border-rose-500 pl-2">
                      <b>🕵️ Criminal:</b> {isHi ? stg.criminalMoveHi : stg.criminalMoveEn}
                    </div>
                    <div className="text-[11px] text-emerald-300 border-l-2 border-emerald-500 pl-2">
                      <b>🪤 Chakravyuh Trap:</b> {isHi ? stg.chakravyuhTrapHi : stg.chakravyuhTrapEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
