import React, { useState, useEffect } from "react";
import { 
  X, 
  Bot, 
  CheckCircle2
} from "lucide-react";
import { INTERROGATION_QUESTIONS } from "../data/cases";
import { getAiObservation } from "../utils/aiEngine";
import { playClick, playTypewriter } from "../utils/audio";

export default function InterrogationModal({
  suspectName,
  suspectData,
  onClose,
  onRecordInterrogation,
  answeredQuestionsSet, // Set of question IDs answered for this suspect
}) {
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [displayedAiText, setDisplayedAiText] = useState("");
  const [isTypingAi, setIsTypingAi] = useState(false);

  // Typewriter effect for AI Observation
  useEffect(() => {
    if (!selectedQuestionId || !suspectData) {
      const t = setTimeout(() => {
        setDisplayedAiText("");
        setIsTypingAi(false);
      }, 0);
      return () => clearTimeout(t);
    }

    const observationText = getAiObservation(selectedQuestionId, suspectData);
    const t = setTimeout(() => {
      setDisplayedAiText("");
      setIsTypingAi(true);
    }, 0);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < observationText.length) {
        setDisplayedAiText((prev) => prev + observationText[currentIndex]);
        if (currentIndex % 3 === 0) {
          playTypewriter();
        }
        currentIndex++;
      } else {
        setIsTypingAi(false);
        clearInterval(interval);
      }
    }, 20);

    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, [selectedQuestionId, suspectData]);

  if (!suspectData) return null;

  const handleSelectQuestion = (qId) => {
    playClick();
    setSelectedQuestionId(qId);
    onRecordInterrogation(suspectName, qId);
  };

  const answeredAnswer = selectedQuestionId ? suspectData.answers[selectedQuestionId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-2xl glass-panel-glow border border-white/10 bg-[#0d121d] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              👤
            </div>
            <div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-semibold block mb-1">
                SUSPECT INTERROGATION
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                {suspectName}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suspect Info Banner */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] mb-5 grid grid-cols-2 gap-3 text-xs font-mono-code">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">LOCATION</span>
            <span className="text-slate-200">{suspectData.location}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">CLAIMED ALIBI</span>
            <span className="text-slate-300 line-clamp-1">{suspectData.alibi}</span>
          </div>
        </div>

        {/* Question Selector List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4">
          <div>
            <span className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
              Choose question (1-4):
            </span>
            <div className="grid grid-cols-1 gap-2">
              {INTERROGATION_QUESTIONS.map((q) => {
                const isAnswered = answeredQuestionsSet?.has(q.id);
                const isCurrent = selectedQuestionId === q.id;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q.id)}
                    className={`w-full p-3 rounded-xl text-left text-xs font-mono-code transition-all duration-200 flex items-center justify-between border ${
                      isCurrent
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-md"
                        : isAnswered
                        ? "bg-white/[0.03] border-white/[0.06] text-slate-300 hover:bg-white/[0.06]"
                        : "bg-black/30 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 font-bold text-[10px]">
                        {q.id}
                      </span>
                      <span className="leading-snug">{q.text}</span>
                    </div>

                    {isAnswered && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer Output and AI Observation */}
          {selectedQuestionId ? (
            <div className="space-y-3 pt-2">
              {/* Suspect's exact answer */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-white/[0.08] relative">
                <span className="text-[10px] font-mono-code text-amber-400 uppercase tracking-widest block mb-1 font-bold">
                  {suspectName}:
                </span>
                <p className="text-sm text-slate-200 italic font-sans leading-relaxed">
                  &ldquo;{answeredAnswer}&rdquo;
                </p>
              </div>

              {/* AI Observation box from Python logic */}
              <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/30 relative">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono-code font-bold">
                    <Bot className="w-4 h-4" />
                    <span>AI OBSERVATION</span>
                  </div>
                  {isTypingAi && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>

                <p className="text-xs font-mono-code text-cyan-200 leading-relaxed min-h-[30px]">
                  → AI observation: {displayedAiText}
                  {isTypingAi && <span className="inline-block animate-pulse">_</span>}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-xs font-mono-code text-slate-500">
              Select one of the 4 interrogation questions above to question {suspectName}.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-code">
          <span className="text-slate-400">
            {answeredQuestionsSet?.size || 0} / 4 questions asked
          </span>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 font-medium transition-colors"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}
