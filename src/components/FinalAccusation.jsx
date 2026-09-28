import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  RotateCcw, 
  Printer,
  ChevronRight
} from "lucide-react";
import { playClick, playVictory, playContradiction } from "../utils/audio";

export default function FinalAccusation({
  caseData,
  investigatedIds,
  interrogatedSuspectIds,
  onBackToInvestigation,
  onSelectNewCase,
}) {
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verdictResult, setVerdictResult] = useState(null);

  const handleSubmit = () => {
    if (!selectedSuspectId) return;
    playClick();

    const suspect = caseData.suspects.find((s) => s.id === selectedSuspectId);
    const isCorrect = suspect?.id === caseData.correctSuspectId;

    setVerdictResult({
      suspect,
      isCorrect,
    });
    setIsSubmitted(true);

    if (isCorrect) {
      playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"],
        });
      } catch {
        // Ignore if confetti unavailable
      }
    } else {
      playContradiction();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalEvidence = caseData.evidence.length;
  const investigatedCount = investigatedIds.size;
  const totalSuspects = caseData.suspects.length;
  const interrogatedCount = interrogatedSuspectIds.size;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Back button */}
      <button
        onClick={() => {
          playClick();
          onBackToInvestigation();
        }}
        className="inline-flex items-center gap-2 text-xs font-mono-code text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO EVIDENCE BOARD</span>
      </button>

      {/* Main Accusation Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono-code mb-4 tracking-widest uppercase font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>JUDICIAL INDICTMENT PROTOCOL</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight mb-3">
          FINAL ACCUSATION
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-mono-code">
          &ldquo;Who do you believe is responsible?&rdquo;
        </p>
      </div>

      {!isSubmitted ? (
        <div>
          {/* Suspect Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {caseData.suspects.map((suspect) => {
              const isSelected = selectedSuspectId === suspect.id;
              const hasInterrogated = interrogatedSuspectIds.has(suspect.id);

              return (
                <div
                  key={suspect.id}
                  onClick={() => {
                    playClick();
                    setSelectedSuspectId(suspect.id);
                  }}
                  className={`p-5 rounded-2xl glass-panel border cursor-pointer transition-all duration-300 relative select-none ${
                    isSelected
                      ? "border-red-500 bg-red-950/40 shadow-[0_0_25px_rgba(239,68,68,0.35)] scale-[1.02]"
                      : "border-white/[0.08] hover:border-slate-500 bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                        👤
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">
                          {suspect.name}
                        </h3>
                        <p className="text-xs font-mono-code text-slate-400">
                          {suspect.role}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-white/20 bg-black/40"
                      }`}
                    >
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] space-y-1.5 text-xs font-mono-code text-slate-300 mb-3">
                    <div>
                      <span className="text-slate-500">ALIBI: </span>
                      <span>{suspect.alibi}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">ACCESS: </span>
                      <span>{suspect.initialAccess}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono-code pt-2 border-t border-white/[0.06]">
                    <span className="text-slate-400">
                      INTERROGATED:{" "}
                      <strong className={hasInterrogated ? "text-emerald-400" : "text-slate-500"}>
                        {hasInterrogated ? "YES" : "NO"}
                      </strong>
                    </span>
                    <span className="text-red-400 font-bold uppercase tracking-wider">
                      SELECT SUSPECT
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Accusation Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedSuspectId}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-40 text-white font-mono-code text-sm font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              SUBMIT ACCUSATION
            </button>
            <p className="text-xs font-mono-code text-slate-500 mt-3">
              Indictment will run through the AI Review Panel before formal filing.
            </p>
          </div>
        </div>
      ) : (
        /* AI Review & Verdict Display */
        <div className="glass-panel-glow border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl animate-fade-in">
          {/* Header Badge */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/70 border border-red-500/40 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <span className="text-xs font-mono-code text-red-400 font-bold tracking-widest uppercase">
                  CLASSIFIED REPORT
                </span>
                <h2 className="font-display font-bold text-2xl text-white">
                  AI REVIEW & VERDICT
                </h2>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono-code text-slate-300 flex items-center gap-1.5 transition-colors print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT REPORT</span>
            </button>
          </div>

          {/* Evidence Summary Checklist (Directly from spec 16) */}
          <div className="mb-8">
            <h3 className="text-xs font-mono-code text-slate-400 uppercase tracking-widest mb-3">
              Evidence Summary
            </h3>
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.07] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-code">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Evidence investigated ({investigatedCount}/{totalEvidence})</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Suspects interrogated ({interrogatedCount}/{totalSuspects})</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Access credential telemetry verified</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Physical & digital location timeline checked</span>
              </div>
            </div>
          </div>

          {/* Official Conclusion Box */}
          <div className="mb-8">
            <h3 className="text-xs font-mono-code text-slate-400 uppercase tracking-widest mb-3">
              CONCLUSION
            </h3>

            {verdictResult.isCorrect ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-400 font-display font-bold text-lg sm:text-xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>CASE SOLVED: ACCUSATION CONFIRMED</span>
                </div>

                <p className="text-sm font-sans text-slate-200 leading-relaxed">
                  &ldquo;<strong className="text-white font-bold">{verdictResult.suspect.name}</strong> is strongly connected to the available evidence.&rdquo;
                </p>

                <p className="text-xs font-mono-code text-emerald-300 leading-relaxed">
                  {caseData.verdictDetails}
                </p>

                <p className="text-xs font-mono-code text-slate-400 italic pt-2 border-t border-emerald-500/20">
                  &ldquo;However, the system cannot establish guilt with absolute judicial finality without formal physical trial verification.&rdquo;
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-4">
                <div className="flex items-center gap-2.5 text-red-400 font-display font-bold text-lg sm:text-xl">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <span>INCORRECT ACCUSATION / INSUFFICIENT EVIDENCE</span>
                </div>

                <p className="text-sm font-sans text-slate-200 leading-relaxed">
                  The evidence does not support charges against <strong className="text-white">{verdictResult.suspect.name}</strong>. Their alibi and lack of physical/digital credentials clear them of direct culpability.
                </p>

                <p className="text-xs font-mono-code text-red-300 leading-relaxed">
                  Re-examine the evidence graph (BFS / DFS search) and run the AI Rule Engine to identify the true perpetrator.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.08] print:hidden">
            <button
              onClick={() => {
                playClick();
                setIsSubmitted(false);
                onBackToInvestigation();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 font-mono-code text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RETURN TO INVESTIGATION</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onSelectNewCase();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
            >
              <span>NEW CASE DOSSIER</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
