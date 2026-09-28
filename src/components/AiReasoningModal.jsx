import React, { useState } from "react";
import { 
  X, 
  BrainCircuit, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Database,
  GitBranch,
  Terminal
} from "lucide-react";
import { evaluateKnowledgeBase } from "../utils/aiEngine";
import { playScanStep, playClick, playVictory } from "../utils/audio";

export default function AiReasoningModal({
  caseData,
  investigatedIds,
  interrogatedSuspectIds,
  onClose,
  onOpenAccusation,
}) {
  const [analysisStep, setAnalysisStep] = useState("IDLE"); // IDLE | ANALYZING | DONE
  const [currentStepText, setCurrentStepText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const totalEvidenceCount = caseData.evidence.length;
  const investigatedCount = investigatedIds.size;

  const handleRunAnalysis = () => {
    playClick();
    setAnalysisStep("ANALYZING");

    const steps = [
      "● ANALYZING EVIDENCE GRAPH NODES & FORENSIC ARTIFACTS...",
      "● APPLYING FORWARD-CHAINING RULES (MODUS PONENS)...",
      "● CROSS-REFERENCING SUSPECT TESTIMONY & ALIBI TIMELINES...",
      "● GENERATING PROBABILISTIC CULPABILITY RANKINGS...",
    ];

    let i = 0;
    setCurrentStepText(steps[0]);
    playScanStep();

    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setCurrentStepText(steps[i]);
        playScanStep();
      } else {
        clearInterval(interval);
        const result = evaluateKnowledgeBase(
          caseData,
          investigatedIds,
          interrogatedSuspectIds
        );
        setAnalysisResult(result);
        setAnalysisStep("DONE");
        playVictory();
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl glass-panel-glow border border-red-500/30 bg-[#0b101a] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left max-h-[92vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-lg shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-xs font-bold text-red-400 tracking-wider">
                  AI REASONING ENGINE
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono-code text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                Expert System & Inference Engine
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Subsystems Box (Directly from UI/UX Spec 11) */}
        <div className="mb-6 p-4 rounded-xl bg-black/50 border border-white/[0.08] space-y-3 font-mono-code text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-white/[0.05]">
            <span className="text-slate-300 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              KNOWLEDGE BASE
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ACTIVE ({investigatedCount} CLUES STORED)
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-white/[0.05]">
            <span className="text-slate-300 flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              EVIDENCE GRAPH
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ACTIVE ({totalEvidenceCount} NODES CONNECTED)
            </span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-300 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-red-400" />
              RULE ENGINE (FORWARD CHAINING)
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ACTIVE ({caseData.aiRules.length} PRODUCTION RULES READY)
            </span>
          </div>
        </div>

        {/* Dynamic Center Area based on State */}
        <div className="flex-1 overflow-y-auto mb-6 pr-1">
          {analysisStep === "IDLE" && (
            <div className="text-center py-8 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <BrainCircuit className="w-12 h-12 text-red-400/80 mx-auto mb-3 animate-pulse" />
              <h3 className="font-display font-semibold text-white text-base mb-1">
                Ready for Algorithmic Case Deduction
              </h3>
              <p className="text-xs text-slate-400 font-mono-code max-w-md mx-auto mb-6 leading-relaxed">
                The inference engine will match observed evidence against production rules to evaluate suspect alibis, opportunity, and physical traces.
              </p>
              <button
                onClick={handleRunAnalysis}
                className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                RUN AI ANALYSIS
              </button>
            </div>
          )}

          {analysisStep === "ANALYZING" && (
            <div className="text-center py-12 px-4 rounded-xl bg-black/60 border border-cyan-500/30">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto mb-5" />
              <p className="font-mono-code text-cyan-300 text-sm font-bold tracking-wider uppercase animate-pulse">
                {currentStepText}
              </p>
              <p className="text-[11px] font-mono-code text-slate-500 mt-2">
                Processing knowledge base predicates...
              </p>
            </div>
          )}

          {analysisStep === "DONE" && analysisResult && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 border-b border-white/[0.06] pb-2">
                <span>INFERENCE SUMMARY: SUSPECT RANKINGS</span>
                <span className="text-emerald-400 font-bold">ANALYSIS COMPLETE</span>
              </div>

              {/* Suspect Rankings Cards */}
              <div className="space-y-3">
                {analysisResult.suspectAnalysis
                  .sort((a, b) => b.suspicionScore - a.suspicionScore)
                  .map((res, idx) => {
                    const isPrime = res.isCulprit;

                    return (
                      <div
                        key={res.suspectId}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isPrime
                            ? "bg-red-950/40 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                            : "bg-slate-900/60 border-white/[0.07]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded font-mono-code text-[11px] font-bold ${
                                isPrime
                                  ? "bg-red-500 text-white"
                                  : "bg-white/[0.08] text-slate-400"
                              }`}
                            >
                              #{idx + 1}
                            </span>
                            <span className="font-display font-bold text-white text-base">
                              {res.name}
                            </span>
                            <span className="text-xs font-mono-code text-slate-400">
                              ({res.role})
                            </span>
                          </div>

                          <div className="text-right">
                            <span
                              className={`font-mono-code font-extrabold text-sm ${
                                isPrime ? "text-red-400" : "text-slate-400"
                              }`}
                            >
                              {res.suspicionScore}% SUSPICION
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden mb-2.5">
                          <div
                            style={{ width: `${res.suspicionScore}%` }}
                            className={`h-full rounded-full transition-all duration-700 ${
                              isPrime
                                ? "bg-gradient-to-r from-red-600 to-rose-400"
                                : "bg-slate-600"
                            }`}
                          />
                        </div>

                        {/* Deduction Flags */}
                        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono-code">
                          {res.flags.map((flag, fIdx) => (
                            <span
                              key={fIdx}
                              className={`px-2 py-0.5 rounded border ${
                                isPrime
                                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                                  : "bg-white/[0.03] border-white/[0.06] text-slate-400"
                              }`}
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* AI Recommendation Box */}
              <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/30 text-xs font-mono-code text-cyan-200 flex items-start gap-2">
                <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>SYSTEM VERDICT PROJECTION:</strong> Evidence graph and production rules strongly isolate the prime suspect. You may now formulate formal charges on the Final Accusation screen.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-slate-300 font-mono-code text-xs font-medium transition-colors"
          >
            CLOSE
          </button>

          {analysisStep === "DONE" && (
            <button
              onClick={() => {
                playClick();
                onClose();
                onOpenAccusation();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono-code text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
            >
              <span>PROCEED TO FINAL ACCUSATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
